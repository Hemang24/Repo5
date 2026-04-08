'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { StepDemographics } from './StepDemographics'
import { StepInsurance } from './StepInsurance'
import { StepMedicalHistory } from './StepMedicalHistory'
import { StepConsent } from './StepConsent'
import { SuccessScreen } from './SuccessScreen'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'
import type { IntakeFormData, UploadedFile } from '@/types/intake'

const defaultValues: IntakeFormData = {
  demographics: {
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    address: '', city: '', state: 'NJ', zip: '', phone: '', email: '',
    emergencyContactName: '', emergencyContactPhone: '', language: 'english',
  },
  insurance: {
    providerName: '', memberId: '', groupNumber: '', subscriberName: '', subscriberRelationship: '',
  },
  medicalHistory: {
    chiefComplaint: '', referringPhysician: '', conditions: [],
    medications: '', previousPT: '', surgicalHistory: '',
  },
  consent: {
    hipaaAcknowledged: false, patientConsent: false, signature: '',
  },
}

export function IntakeWizard() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({})
  const [ocrTexts, setOcrTexts] = useState<Record<string, string>>({})
  const { lang } = useLanguage()
  const intake = translations[lang].intake

  const methods = useForm<IntakeFormData>({ defaultValues, mode: 'onBlur' })
  const { trigger, handleSubmit } = methods

  const steps = [intake.step1, intake.step2, intake.step3, intake.step4]

  function handleFileUploaded(key: string, file: UploadedFile) {
    setUploadedFiles(prev => ({ ...prev, [key]: file }))
  }

  function handleOcrText(key: string, rawText: string) {
    setOcrTexts(prev => ({ ...prev, [key]: rawText }))
  }

  async function handleNext() {
    const fieldsToValidate: Record<number, (keyof IntakeFormData)[]> = {
      0: ['demographics'],
      1: ['insurance'],
      2: ['medicalHistory'],
    }
    const valid = await trigger(fieldsToValidate[step])
    if (valid) setStep(s => s + 1)
  }

  async function onSubmit(data: IntakeFormData) {
    setSubmitting(true)
    try {
      const response = await fetch('/api/submit-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: data,
          files: uploadedFiles,
          ocrTexts,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Submission failed')
      }

      setSubmitted(true)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Submission failed. Please call (609) 695-8100.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return <SuccessScreen />

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress steps */}
        <div className="flex items-center gap-1 sm:gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < step
                      ? 'bg-sage-500 text-white'
                      : i === step
                      ? 'bg-warm-500 text-white'
                      : 'bg-warm-100 text-brown-400'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-xs text-brown-400 mt-1 hidden sm:block text-center leading-tight max-w-[70px]">
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 sm:mx-2 transition-colors ${i < step ? 'bg-sage-400' : 'bg-warm-100'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step label (mobile) */}
        <p className="sm:hidden text-sm font-semibold text-warm-600 mb-4">
          Step {step + 1}: {steps[step]}
        </p>

        {/* Step content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl border border-warm-200 shadow-sm p-5 sm:p-7 mb-6">
            {step === 0 && <StepDemographics onFileUploaded={handleFileUploaded} onOcrText={handleOcrText} />}
            {step === 1 && <StepInsurance onFileUploaded={handleFileUploaded} onOcrText={handleOcrText} />}
            {step === 2 && <StepMedicalHistory />}
            {step === 3 && <StepConsent />}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="inline-flex items-center gap-1 px-4 py-2.5 text-sm text-brown-600 hover:text-brown-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {intake.back}
              </button>
            ) : <div />}

            {step < 3 ? (
              <Button type="button" onClick={handleNext} size="lg">
                {intake.next}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" size="lg" loading={submitting}>
                {submitting ? intake.submitting : intake.submit}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
