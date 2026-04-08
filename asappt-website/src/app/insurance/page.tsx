'use client'

import { CheckCircle, Phone, MessageCircle, ShieldCheck } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

const CONFIRMED_PLANS = [
  { name: 'Aetna', notes: 'Most Aetna PPO and HMO plans accepted' },
  { name: 'Horizon Blue Cross Blue Shield', notes: 'NJ\'s largest insurer — most plans covered' },
  { name: 'NJ Direct', notes: 'State employee health benefits plan' },
  { name: 'NJ Health / NJ FamilyCare', notes: 'State-sponsored health plans' },
  { name: 'Medicare', notes: 'Traditional Medicare Part B accepted' },
  { name: 'Medicaid HMOs', notes: 'Most NJ Medicaid managed care plans' },
]

const OTHER_PLANS = [
  'Auto Insurance (PIP)', 'Worker\'s Compensation', 'United Healthcare',
  'Cigna', 'Humana', 'Fidelis Care', 'Oscar Health', 'Most major private insurers',
]

const TIPS = [
  { step: '1', title: 'Call your insurer', desc: 'Contact your insurance company and ask if Advance Spine and Pain Physical Therapy is in-network. Ask about your PT benefit, deductible, and co-pay.' },
  { step: '2', title: 'Get a referral (if required)', desc: 'Some plans require a physician referral or prescription before starting PT. Ask your doctor to write an order for outpatient physical therapy.' },
  { step: '3', title: 'Bring your card on day one', desc: 'Bring your insurance card (front and back) to your first appointment. Our staff will verify your benefits and explain your cost-sharing.' },
  { step: '4', title: 'Complete intake online', desc: 'Save time on your first visit by completing your patient intake form online, including uploading your insurance card for instant OCR processing.' },
]

export default function InsurancePage() {
  const { lang } = useLanguage()

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-100 to-warm-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 mb-4">
            Insurance & Coverage
          </h1>
          <p className="text-brown-500 text-lg max-w-2xl mx-auto">
            We accept most major insurance plans, Medicare, Medicaid, auto insurance (PIP), and worker's compensation. Competitive rates for uninsured patients.
          </p>
        </div>
      </section>

      {/* Confirmed plans */}
      <section className="py-16 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 mb-8 text-center">
              Confirmed In-Network Plans
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {CONFIRMED_PLANS.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 60}>
                <div className="bg-white rounded-2xl p-5 border border-warm-100 shadow-sm flex items-start gap-3 hover:border-sage-300 hover:shadow-md transition-all">
                  <CheckCircle className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-brown-900">{plan.name}</p>
                    <p className="text-sm text-brown-400 mt-0.5">{plan.notes}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Other plans */}
          <ScrollReveal>
            <div className="bg-white rounded-2xl border border-warm-100 p-6 mb-8">
              <h3 className="font-semibold text-brown-900 mb-4">Also Accepted / Call to Confirm</h3>
              <div className="flex flex-wrap gap-2">
                {OTHER_PLANS.map(plan => (
                  <span key={plan} className="px-3 py-1.5 bg-warm-50 border border-warm-200 text-brown-600 text-sm rounded-full">
                    {plan}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Uninsured note */}
          <ScrollReveal>
            <div className="bg-sage-50 border border-sage-200 rounded-2xl p-5 flex gap-3 mb-12">
              <ShieldCheck className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sage-800 mb-1">No Insurance? We Can Help.</p>
                <p className="text-sm text-sage-700">
                  We offer competitive self-pay rates for uninsured patients. Call us at{' '}
                  <a href="tel:+16096958100" className="font-semibold underline">(609) 695-8100</a>{' '}
                  to discuss your options.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* How to use insurance */}
          <h2 className="font-serif text-2xl font-bold text-brown-900 mb-8 text-center">How to Use Your Insurance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIPS.map((tip, i) => (
              <ScrollReveal key={tip.step} delay={i * 80}>
                <div className="bg-white rounded-2xl p-5 border border-warm-100 shadow-sm">
                  <div className="w-9 h-9 bg-warm-500 text-white rounded-xl flex items-center justify-center font-bold text-sm mb-3">
                    {tip.step}
                  </div>
                  <h3 className="font-semibold text-brown-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-brown-500 leading-relaxed">{tip.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Chatbot CTA */}
          <ScrollReveal>
            <div className="mt-12 bg-warm-500 rounded-3xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Ask Our AI Assistant</h3>
              <p className="text-warm-100 mb-6 max-w-md mx-auto">
                Not sure if your plan is covered? Click the chat icon in the bottom right to instantly ask our AI assistant about your insurance plan, deductibles, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:+16096958100"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-warm-600 font-bold rounded-xl hover:bg-warm-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call (609) 695-8100
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
