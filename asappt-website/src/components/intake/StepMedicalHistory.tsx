'use client'

import { useFormContext } from 'react-hook-form'
import type { IntakeFormData } from '@/types/intake'
import { CONDITIONS_LIST } from '@/types/intake'

export function StepMedicalHistory() {
  const { register, watch, formState: { errors } } = useFormContext<IntakeFormData>()
  const selectedConditions = watch('medicalHistory.conditions') ?? []

  const fieldClass = 'w-full px-3 py-2.5 text-sm bg-white border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent placeholder:text-brown-200'
  const labelClass = 'block text-sm font-medium text-brown-700 mb-1'

  return (
    <div className="space-y-5">
      {/* Chief complaint */}
      <div>
        <label className={labelClass}>Chief Complaint / Reason for PT *</label>
        <textarea
          {...register('medicalHistory.chiefComplaint', { required: 'Required' })}
          rows={3}
          className={`${fieldClass} resize-none`}
          placeholder="Describe your main pain or injury..."
        />
        {errors.medicalHistory?.chiefComplaint && (
          <p className="text-red-500 text-xs mt-1">{errors.medicalHistory.chiefComplaint.message}</p>
        )}
      </div>

      {/* Referring physician */}
      <div>
        <label className={labelClass}>Referring Physician</label>
        <input
          {...register('medicalHistory.referringPhysician')}
          className={fieldClass}
          placeholder="Dr. John Doe"
        />
      </div>

      {/* Conditions checkboxes */}
      <div>
        <label className={labelClass}>Relevant Conditions (check all that apply)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {CONDITIONS_LIST.map(condition => (
            <label
              key={condition}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                selectedConditions.includes(condition)
                  ? 'border-warm-400 bg-warm-50 text-warm-700'
                  : 'border-warm-100 bg-white hover:bg-warm-50 text-brown-700'
              }`}
            >
              <input
                type="checkbox"
                value={condition}
                {...register('medicalHistory.conditions')}
                className="accent-warm-500 w-4 h-4"
              />
              <span className="text-sm">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div>
        <label className={labelClass}>Current Medications</label>
        <textarea
          {...register('medicalHistory.medications')}
          rows={2}
          className={`${fieldClass} resize-none`}
          placeholder="List any current medications (or write 'None')"
        />
      </div>

      {/* Previous PT */}
      <div>
        <label className={labelClass}>Have you had physical therapy before?</label>
        <div className="flex gap-4 mt-2">
          {(['yes', 'no'] as const).map(val => (
            <label key={val} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={val}
                {...register('medicalHistory.previousPT')}
                className="accent-warm-500"
              />
              <span className="text-sm text-brown-700 capitalize">{val}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Surgical history */}
      <div>
        <label className={labelClass}>Surgical History</label>
        <textarea
          {...register('medicalHistory.surgicalHistory')}
          rows={2}
          className={`${fieldClass} resize-none`}
          placeholder="List any relevant surgeries (or write 'None')"
        />
      </div>
    </div>
  )
}
