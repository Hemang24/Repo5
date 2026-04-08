'use client'

import { useFormContext } from 'react-hook-form'
import { ImageUploadOCR } from './ImageUploadOCR'
import { parseIdFields } from '@/lib/google-vision-client'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'
import type { IntakeFormData, UploadedFile } from '@/types/intake'

interface Props {
  onFileUploaded: (key: string, file: UploadedFile) => void
}

const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

export function StepDemographics({ onFileUploaded }: Props) {
  const { register, setValue, formState: { errors } } = useFormContext<IntakeFormData>()
  const { lang } = useLanguage()
  const intake = translations[lang].intake

  function handleExtracted(parsedFields: Record<string, string>) {
    if (parsedFields.firstName) setValue('demographics.firstName', parsedFields.firstName)
    if (parsedFields.lastName) setValue('demographics.lastName', parsedFields.lastName)
    if (parsedFields.dateOfBirth) setValue('demographics.dateOfBirth', parsedFields.dateOfBirth)
    if (parsedFields.address) setValue('demographics.address', parsedFields.address)
    if (parsedFields.zip) setValue('demographics.zip', parsedFields.zip)
    if (parsedFields.state) setValue('demographics.state', parsedFields.state)
  }

  const fieldClass = 'w-full px-3 py-2.5 text-sm bg-white border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent placeholder:text-brown-200'
  const labelClass = 'block text-sm font-medium text-brown-700 mb-1'
  const errorClass = 'text-red-500 text-xs mt-1'

  return (
    <div className="space-y-5">
      {/* ID Upload */}
      <div className="bg-warm-50 border border-warm-200 rounded-xl p-4">
        <ImageUploadOCR
          label={intake.uploadID}
          hint={intake.uploadIDHint}
          onExtracted={handleExtracted}
          onFileSelected={(base64, mimeType) => onFileUploaded('idPhoto', { name: 'id_photo', dataUrl: base64, type: mimeType })}
        />
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First Name *</label>
          <input
            {...register('demographics.firstName', { required: 'Required' })}
            className={fieldClass}
            placeholder="Jane"
          />
          {errors.demographics?.firstName && <p className={errorClass}>{errors.demographics.firstName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Last Name *</label>
          <input
            {...register('demographics.lastName', { required: 'Required' })}
            className={fieldClass}
            placeholder="Smith"
          />
          {errors.demographics?.lastName && <p className={errorClass}>{errors.demographics.lastName.message}</p>}
        </div>
      </div>

      {/* DOB + Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date of Birth *</label>
          <input
            type="date"
            {...register('demographics.dateOfBirth', { required: 'Required' })}
            className={fieldClass}
          />
          {errors.demographics?.dateOfBirth && <p className={errorClass}>{errors.demographics.dateOfBirth.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Gender</label>
          <select {...register('demographics.gender')} className={fieldClass}>
            <option value="">Select...</option>
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className={labelClass}>Street Address *</label>
        <input
          {...register('demographics.address', { required: 'Required' })}
          className={fieldClass}
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-2">
          <label className={labelClass}>City *</label>
          <input {...register('demographics.city', { required: 'Required' })} className={fieldClass} placeholder="Trenton" />
        </div>
        <div>
          <label className={labelClass}>State *</label>
          <select {...register('demographics.state', { required: 'Required' })} className={fieldClass}>
            <option value="">—</option>
            {states.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>ZIP *</label>
          <input {...register('demographics.zip', { required: 'Required', pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP' } })} className={fieldClass} placeholder="08608" />
          {errors.demographics?.zip && <p className={errorClass}>{errors.demographics.zip.message}</p>}
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Phone *</label>
          <input
            type="tel"
            {...register('demographics.phone', { required: 'Required' })}
            className={fieldClass}
            placeholder="(609) 555-0000"
          />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            {...register('demographics.email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
            className={fieldClass}
            placeholder="jane@email.com"
          />
          {errors.demographics?.email && <p className={errorClass}>{errors.demographics.email.message}</p>}
        </div>
      </div>

      {/* Emergency contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Emergency Contact Name</label>
          <input {...register('demographics.emergencyContactName')} className={fieldClass} placeholder="John Smith" />
        </div>
        <div>
          <label className={labelClass}>Emergency Contact Phone</label>
          <input type="tel" {...register('demographics.emergencyContactPhone')} className={fieldClass} placeholder="(609) 555-0001" />
        </div>
      </div>

      {/* Language */}
      <div>
        <label className={labelClass}>Preferred Language</label>
        <select {...register('demographics.language')} className={fieldClass}>
          <option value="english">English</option>
          <option value="spanish">Spanish / Español</option>
        </select>
      </div>
    </div>
  )
}
