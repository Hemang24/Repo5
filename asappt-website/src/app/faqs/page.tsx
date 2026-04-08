'use client'

import { useState } from 'react'
import { ChevronDown, Phone } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

const FAQS = [
  {
    q: 'What should I expect on my first visit?',
    a: 'Expect 45–60 minutes. Please bring: your PT prescription (if required by your insurance), a photo ID, and your insurance card(s). Complete any registration forms in advance if possible. Wear comfortable gym clothing. The therapist will perform a thorough evaluation, educate you about your injury or condition, provide a home exercise program, and begin treatment based on remaining session time.',
  },
  {
    q: 'What is involved in a physical therapy session?',
    a: 'Sessions last 30–45 minutes and typically include: therapeutic modalities to manage symptoms (heat, ice, electrical stimulation, ultrasound), manual hands-on techniques such as joint mobilization or soft tissue massage, and therapeutic exercises tailored to your specific needs. You will also receive a home exercise program to practice between sessions.',
  },
  {
    q: 'How long will my course of PT treatment take?',
    a: 'Duration varies based on the severity of your condition, your response to treatment, your compliance with the home program, and whether you can modify aggravating activities. Typically patients are in PT from 1–3 months. Discharge occurs when your functional goals are met, you can safely resume your activities, and your physician approves.',
  },
  {
    q: 'Do I need a prescription or referral to see a physical therapist?',
    a: 'A prescription is required for auto accident (PIP) cases, worker\'s compensation cases, and Clover insurance. For most other private insurance plans and Medicare, you may be able to begin PT without a referral. We recommend calling us at (609) 695-8100 to verify what your specific plan requires.',
  },
  {
    q: 'How do I schedule my first appointment?',
    a: 'Call us at (609) 695-8100 to speak with our receptionist and schedule your first visit. You can also complete your patient intake form online in advance to save time at your appointment.',
  },
  {
    q: 'What is the difference between physical therapy and chiropractic care?',
    a: 'Physical therapists follow traditional medical views on health and disease. We use less forceful joint mobilizations, emphasize therapeutic exercise and patient education, and focus on restoring long-term function. Chiropractors tend to use high-velocity spinal manipulations and focus more on spinal alignment as their primary intervention.',
  },
  {
    q: 'Where can I park near your office?',
    a: 'Metered street parking is available nearby (60–120 minute limits). Additional parking is available at the City Hall lot and the DMV lot. Parking is significantly easier after 5 PM and on weekends. Our office is also accessible by bus and NJ Transit train.',
  },
  {
    q: 'Do you offer home physical therapy?',
    a: 'Yes! We offer home physical therapy visits by appointment for patients who have difficulty traveling to our office due to mobility limitations or recent surgery. Call us at (609) 695-8100 for details and to schedule.',
  },
  {
    q: 'What insurance do you accept?',
    a: 'We accept most private health insurance plans along with Medicare, Medicaid HMOs, Auto PIP (personal injury protection), and Worker\'s Compensation. Confirmed in-network plans include Aetna, NJ Direct, NJ Health, and Horizon Blue Cross Blue Shield. Competitive rates are available for uninsured patients. Contact us to confirm your specific plan.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border rounded-2xl transition-all overflow-hidden ${open ? 'border-warm-300 shadow-sm' : 'border-warm-100'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-warm-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-brown-900 leading-snug pr-2">{q}</span>
        <ChevronDown className={`w-5 h-5 text-warm-500 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-brown-600 leading-relaxed text-sm border-t border-warm-100 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQsPage() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-100 to-warm-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 mb-4">
            {t.nav.faqs}
          </h1>
          <p className="text-brown-500 text-lg max-w-2xl mx-auto">
            Everything you need to know before your first appointment. Still have questions? Our chatbot or team is happy to help.
          </p>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="py-16 bg-warm-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {FAQS.map((faq, i) => (
            <ScrollReveal key={faq.q} delay={i * 40}>
              <FAQItem q={faq.q} a={faq.a} />
            </ScrollReveal>
          ))}
        </div>

        {/* Still have questions */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <ScrollReveal>
            <div className="bg-warm-500 rounded-2xl p-6 text-center">
              <h3 className="font-serif text-xl font-bold text-white mb-2">Still Have Questions?</h3>
              <p className="text-warm-100 mb-4 text-sm">Try our AI chatbot (bottom right) or give us a call.</p>
              <a
                href="tel:+16096958100"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-warm-600 font-bold rounded-xl hover:bg-warm-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (609) 695-8100
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
