'use client'

import { useFormContext } from 'react-hook-form'
import { ShieldCheck } from 'lucide-react'
import type { IntakeFormData } from '@/types/intake'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

export function StepConsent() {
  const { register, formState: { errors } } = useFormContext<IntakeFormData>()
  const { lang } = useLanguage()
  const intake = translations[lang].intake

  const fieldClass = 'w-full px-3 py-2.5 text-sm bg-white border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent placeholder:text-brown-200'
  const labelClass = 'block text-sm font-medium text-brown-700 mb-1'

  return (
    <div className="space-y-5">
      {/* HIPAA notice */}
      <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-sage-800 mb-1">HIPAA Privacy Notice</p>
          <p className="text-xs text-sage-700 leading-relaxed">
            Advance Spine and Pain Physical Therapy is committed to protecting your health information in compliance with HIPAA regulations. Your data is encrypted and stored in a HIPAA-compliant Google Drive with a signed Business Associate Agreement (BAA). We will never sell or share your information without your consent.
          </p>
        </div>
      </div>

      {/* HIPAA acknowledgment */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          {...register('consent.hipaaAcknowledged', { required: 'You must acknowledge the HIPAA notice' })}
          className="accent-warm-500 w-4 h-4 mt-1 flex-shrink-0"
        />
        <span className="text-sm text-brown-700 leading-relaxed group-hover:text-brown-900 transition-colors">
          I acknowledge that I have received and reviewed the HIPAA Notice of Privacy Practices for Advance Spine and Pain Physical Therapy. *
        </span>
      </label>
      {errors.consent?.hipaaAcknowledged && (
        <p className="text-red-500 text-xs -mt-3">{errors.consent.hipaaAcknowledged.message}</p>
      )}

      {/* Patient consent */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          {...register('consent.patientConsent', { required: 'You must provide consent to proceed' })}
          className="accent-warm-500 w-4 h-4 mt-1 flex-shrink-0"
        />
        <span className="text-sm text-brown-700 leading-relaxed group-hover:text-brown-900 transition-colors">
          I consent to receive physical therapy treatment at Advance Spine and Pain Physical Therapy. I understand that I am responsible for any co-pays, deductibles, or non-covered services per my insurance plan. *
        </span>
      </label>
      {errors.consent?.patientConsent && (
        <p className="text-red-500 text-xs -mt-3">{errors.consent.patientConsent.message}</p>
      )}

      {/* Electronic signature */}
      <div>
        <label className={labelClass}>Electronic Signature (type your full name) *</label>
        <input
          {...register('consent.signature', { required: 'Signature required' })}
          className={fieldClass}
          placeholder="Jane Smith"
        />
        {errors.consent?.signature && (
          <p className="text-red-500 text-xs mt-1">{errors.consent.signature.message}</p>
        )}
        <p className="text-xs text-brown-400 mt-1">
          By typing your name above, you agree that this constitutes your legal electronic signature.
        </p>
      </div>

      {/* Storage notice */}
      <div className="bg-warm-50 border border-warm-100 rounded-xl p-4">
        <p className="text-xs text-brown-500 leading-relaxed">{intake.hipaaNote}</p>
      </div>
    </div>
  )
}
