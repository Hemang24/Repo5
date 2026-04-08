'use client'

import { CheckCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

export function SuccessScreen() {
  const { lang } = useLanguage()
  const intake = translations[lang].intake

  return (
    <div className="text-center py-8 px-4">
      <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-sage-500" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-brown-900 mb-3">{intake.success}</h2>
      <p className="text-brown-500 max-w-md mx-auto leading-relaxed mb-8">{intake.successBody}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="tel:+16096958100"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-warm-500 text-white font-semibold hover:bg-warm-600 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call (609) 695-8100
        </a>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-warm-200 text-brown-700 font-semibold hover:bg-warm-100 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
