'use client'

import Link from 'next/link'
import { Phone, MapPin, Clock, ChevronRight, Star, Shield, Heart, Activity } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

const SERVICES_PREVIEW = [
  { icon: Activity, title: 'Spine & Back', desc: 'Herniated discs, stenosis, sciatica, and chronic back pain.' },
  { icon: Heart, title: 'Sports Medicine', desc: 'ACL tears, rotator cuff, tennis elbow, and athletic injuries.' },
  { icon: Shield, title: 'Post-Surgical Rehab', desc: 'Hip, knee, and shoulder replacement recovery.' },
  { icon: Activity, title: 'Hand Therapy', desc: 'Carpal tunnel, tendon injuries, and post-fracture rehab.' },
  { icon: Heart, title: 'Vertigo & Balance', desc: 'Fall prevention and vestibular rehabilitation.' },
  { icon: Shield, title: 'Personal Injury', desc: 'Auto accidents, slip & fall, and workers\' comp cases.' },
]

const TESTIMONIALS_PREVIEW = [
  { name: 'Lisa M.', quote: 'Thank you for helping me feel like me again! You are terrific and truly a wonderful person.' },
  { name: 'Kathleen A.', quote: 'You made my physical therapy a joy. I can\'t thank you enough for making PT a happy and fun time even when it hurt.' },
  { name: 'Alyssa A.', quote: 'Thank you so much for helping me with my knee. I\'m so grateful I can be back playing the game I love with no pain.' },
]

export default function HomePage() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-warm-100 via-warm-50 to-sage-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <span className="inline-block px-4 py-1.5 bg-warm-500 text-white text-sm font-semibold rounded-full mb-6">
                {t.hero.badge}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brown-900 leading-tight mb-6">
                {t.hero.headline}
              </h1>
              <p className="text-lg text-brown-500 leading-relaxed mb-8 max-w-lg">
                {t.hero.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/patient-intake"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-warm-500 text-white font-bold rounded-xl hover:bg-warm-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  {t.hero.cta}
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-brown-700 font-semibold rounded-xl border-2 border-warm-200 hover:border-warm-400 transition-all"
                >
                  {t.hero.ctaSecondary}
                </Link>
              </div>

              {/* Quick info pills */}
              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  { icon: Phone, label: '(609) 695-8100', href: 'tel:+16096958100' },
                  { icon: MapPin, label: 'Trenton, NJ 08608', href: '/location' },
                  { icon: Clock, label: 'Mon/Wed/Fri 8:30–7pm', href: '/location' },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-warm-200 rounded-full text-sm text-brown-600 hover:border-warm-400 hover:text-brown-900 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-warm-500" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Hero image placeholder / clinic info card */}
            <div className="hidden lg:flex flex-col gap-4">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-warm-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-warm-50 rounded-2xl p-5">
                    <p className="font-serif text-3xl font-bold text-warm-500">18+</p>
                    <p className="text-xs text-brown-500 mt-1 font-medium">{t.about.stat1Label}</p>
                  </div>
                  <div className="bg-sage-50 rounded-2xl p-5">
                    <p className="font-serif text-3xl font-bold text-sage-600">All</p>
                    <p className="text-xs text-brown-500 mt-1 font-medium">{t.about.stat2Label}</p>
                  </div>
                  <div className="bg-warm-50 rounded-2xl p-5">
                    <p className="font-serif text-3xl font-bold text-warm-500">EN</p>
                    <p className="text-xs text-brown-500 mt-1 font-medium">{t.about.stat3Label}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-xl">
                    <Clock className="w-4 h-4 text-warm-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-brown-700">Mon, Wed, Fri</p>
                      <p className="text-xs text-brown-500">8:30 AM – 7:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-xl">
                    <Clock className="w-4 h-4 text-warm-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-brown-700">Tue, Thu</p>
                      <p className="text-xs text-brown-500">8:30 AM – 1:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-warm-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-warm-500 flex-shrink-0" />
                    <p className="text-xs text-brown-600">225 East State St, Suite 12, Trenton, NJ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About strip */}
      <section className="bg-warm-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                {t.about.title}
              </h2>
              <p className="text-warm-100 leading-relaxed">{t.about.body}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: t.about.stat1, label: t.about.stat1Label },
                { val: t.about.stat2, label: t.about.stat2Label },
                { val: t.about.stat3, label: t.about.stat3Label },
              ].map(s => (
                <div key={s.label} className="text-center bg-white/10 rounded-2xl p-4">
                  <p className="font-serif text-2xl font-bold text-white">{s.val}</p>
                  <p className="text-warm-100 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 sm:py-20 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-900 mb-4">
                {t.services.title}
              </h2>
              <p className="text-brown-500 max-w-2xl mx-auto">{t.services.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES_PREVIEW.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 border border-warm-100 hover:border-warm-300 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 bg-warm-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-warm-200 transition-colors">
                    <service.icon className="w-5 h-5 text-warm-600" />
                  </div>
                  <h3 className="font-semibold text-brown-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-brown-500 leading-relaxed">{service.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-warm-500 text-white font-semibold rounded-xl hover:bg-warm-600 transition-colors"
            >
              {t.services.viewAll} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-900 mb-4">
                {t.testimonials.title}
              </h2>
              <p className="text-brown-500">{t.testimonials.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS_PREVIEW.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <div className="bg-warm-50 rounded-2xl p-6 border border-warm-100 relative">
                  <span className="absolute top-4 right-5 text-6xl text-warm-200 font-serif leading-none select-none">"</span>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-brown-700 leading-relaxed text-sm italic mb-4">"{t.quote}"</p>
                  <p className="text-warm-600 font-semibold text-sm">— {t.name}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-warm-300 text-warm-600 font-semibold rounded-xl hover:bg-warm-50 transition-colors"
            >
              {t.testimonials.viewAll} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-sage-600 to-sage-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
              {translations[lang].cta.title}
            </h2>
            <p className="text-sage-100 text-lg mb-8 max-w-2xl mx-auto">
              {translations[lang].cta.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/patient-intake"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-sage-700 font-bold rounded-xl hover:bg-warm-50 transition-all shadow-lg"
              >
                {translations[lang].cta.button}
              </Link>
              <a
                href="tel:+16096958100"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                <Phone className="w-4 h-4" />
                {translations[lang].cta.call}: (609) 695-8100
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
