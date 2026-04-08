'use client'

import { useFormContext } from 'react-hook-form'
import { ImageUploadOCR } from './ImageUploadOCR'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'
import type { IntakeFormData, UploadedFile } from '@/types/intake'

interface Props {
  onFileUploaded: (key: string, file: UploadedFile) => void
}

const INSURANCE_PROVIDERS = [
  'Aetna',
  'Horizon Blue Cross Blue Shield',
  'NJ Direct',
  'NJ Health / NJ FamilyCare',
  'Medicare',
  'Medicaid',
  'United Healthcare',
  'Cigna',
  'Humana',
  'Fidelis Care',
  'Auto Insurance (PIP)',
  "Worker's Compensation",
  'Other',
]

export function StepInsurance({ onFileUploaded }: Props) {
  const { register, setValue, formState: { errors } } = useFormContext<IntakeFormData>()
  const { lang } = useLanguage()
  const intake = translations[lang].intake

  function handleFrontExtracted(fields: Record<string, string>) {
    if (fields.memberId) setValue('insurance.memberId', fields.memberId)
    if (fields.groupNumber) setValue('insurance.groupNumber', fields.groupNumber)
    if (fields.subscriberName) setValue('insurance.subscriberName', fields.subscriberName)
    if (fields.providerName) setValue('insurance.providerName', fields.providerName)
  }

  const fieldClass = 'w-full px-3 py-2.5 text-sm bg-white border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent placeholder:text-brown-200'
  const labelClass = 'block text-sm font-medium text-brown-700 mb-1'

  return (
    <div className="space-y-5">
      {/* Insurance card uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-warm-50 border border-warm-200 rounded-xl p-4">
          <ImageUploadOCR
            label={intake.uploadInsuranceFront}
            onExtracted={handleFrontExtracted}
            onFileSelected={(b64, mime) => onFileUploaded('insuranceFront', { name: 'insurance_front', dataUrl: b64, type: mime })}
          />
        </div>
        <div className="bg-warm-50 border border-warm-200 rounded-xl p-4">
          <ImageUploadOCR
            label={intake.uploadInsuranceBack}
            onExtracted={() => {}}
            onFileSelected={(b64, mime) => onFileUploaded('insuranceBack', { name: 'insurance_back', dataUrl: b64, type: mime })}
          />
        </div>
      </div>

      {/* Insurance provider */}
      <div>
        <label className={labelClass}>Insurance Provider *</label>
        <select {...register('insurance.providerName', { required: 'Required' })} className={fieldClass}>
          <option value="">Select provider...</option>
          {INSURANCE_PROVIDERS.map(p => <option key={p}>{p}</option>)}
        </select>
        {errors.insurance?.providerName && (
          <p className="text-red-500 text-xs mt-1">{errors.insurance.providerName.message}</p>
        )}
      </div>

      {/* Member ID + Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Member ID *</label>
          <input
            {...register('insurance.memberId', { required: 'Required' })}
            className={fieldClass}
            placeholder="W12345678"
          />
          {errors.insurance?.memberId && (
            <p className="text-red-500 text-xs mt-1">{errors.insurance.memberId.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Group Number</label>
          <input {...register('insurance.groupNumber')} className={fieldClass} placeholder="GRP-00000" />
        </div>
      </div>

      {/* Subscriber */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Subscriber Name *</label>
          <input
            {...register('insurance.subscriberName', { required: 'Required' })}
            className={fieldClass}
            placeholder="Jane Smith"
          />
          {errors.insurance?.subscriberName && (
            <p className="text-red-500 text-xs mt-1">{errors.insurance.subscriberName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Relationship to Subscriber</label>
          <select {...register('insurance.subscriberRelationship')} className={fieldClass}>
            <option value="">Select...</option>
            <option>Self</option>
            <option>Spouse</option>
            <option>Child</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-brown-400 bg-warm-100 rounded-lg px-3 py-2">
        Not sure if your plan is accepted? Our chatbot can help, or call us at{' '}
        <a href="tel:+16096958100" className="text-warm-500 font-medium">(609) 695-8100</a>.
      </p>
    </div>
  )
}
