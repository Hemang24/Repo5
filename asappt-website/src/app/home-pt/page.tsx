'use client'

import { Home, CheckCircle, Phone, Heart, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const BENEFITS = [
  { icon: Heart, title: 'Personalized Care at Home', desc: 'Receive the same expert PT care from Dr. Rita Amin in the comfort and safety of your own home.' },
  { icon: Shield, title: 'Post-Surgical Ideal', desc: 'Perfect for patients recovering from hip, knee, or shoulder surgery who can\'t safely travel to our office.' },
  { icon: Clock, title: 'Flexible Scheduling', desc: 'Home visits scheduled around your availability. Call us to arrange appointment times.' },
]

const WHO_QUALIFIES = [
  'Recent hip, knee, or shoulder replacement surgery',
  'Limited mobility or inability to drive',
  'High fall risk or balance disorders',
  'Recent hospitalization or discharge',
  'Neurological conditions affecting mobility',
  'Elderly patients with transportation challenges',
]

export default function HomePTPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-100 to-warm-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-warm-500 text-white text-sm font-semibold rounded-full mb-6">
                <Home className="w-4 h-4" />
                Home Physical Therapy
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 mb-4 leading-tight">
                Physical Therapy Delivered to Your Door
              </h1>
              <p className="text-lg text-brown-500 leading-relaxed mb-8">
                Can't make it to our office? We bring expert physical therapy care directly to your home. Available by appointment for patients with mobility limitations or post-surgical needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+16096958100"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-warm-500 text-white font-bold rounded-xl hover:bg-warm-600 transition-all shadow-lg"
                >
                  <Phone className="w-5 h-5" />
                  Call to Schedule: (609) 695-8100
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl p-8 border border-warm-100 shadow-xl">
                <div className="w-16 h-16 bg-warm-100 rounded-2xl flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-warm-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-brown-900 mb-4">Same Expert Care</h3>
                <p className="text-brown-500 leading-relaxed">
                  Dr. Rita Amin and our clinical team provide the exact same high-quality, hands-on orthopedic physical therapy you'd receive in our office — just at your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-serif text-3xl font-bold text-brown-900 text-center mb-10">
              Why Choose Home PT?
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <ScrollReveal key={b.title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 border border-warm-100 shadow-sm text-center">
                  <div className="w-14 h-14 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <b.icon className="w-7 h-7 text-warm-600" />
                  </div>
                  <h3 className="font-semibold text-brown-900 mb-2 text-lg">{b.title}</h3>
                  <p className="text-brown-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who qualifies */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-warm-50 rounded-3xl p-8 border border-warm-100">
              <h2 className="font-serif text-2xl font-bold text-brown-900 mb-6 text-center">
                Who Qualifies for Home PT?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WHO_QUALIFIES.map(item => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-sage-500 flex-shrink-0" />
                    <span className="text-brown-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-brown-500 text-sm mb-4">
                  Not sure if you qualify? Call us — we're happy to discuss your situation.
                </p>
                <a
                  href="tel:+16096958100"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-warm-500 text-white font-bold rounded-xl hover:bg-warm-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (609) 695-8100
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
