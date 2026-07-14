'use client'

import { ShieldCheck, Clock, FileText } from 'lucide-react'
import { IntakeWizard } from '@/components/intake/IntakeWizard'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

export default function PatientIntakePage() {
  const { lang } = useLanguage()
  const t = translations[lang].intake

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-100 to-warm-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 mb-4">{t.title}</h1>
          <p className="text-brown-500 text-lg max-w-2xl mx-auto">{t.subtitle}</p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: ShieldCheck, label: 'HIPAA Compliant', color: 'text-sage-600 bg-sage-100' },
              { icon: Clock, label: 'Takes ~10 Minutes', color: 'text-warm-600 bg-warm-100' },
              { icon: FileText, label: 'Auto-fills from ID scan', color: 'text-warm-600 bg-warm-100' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${color}`}>
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-warm-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <IntakeWizard />
        </div>
      </section>
    </div>
  )
}
