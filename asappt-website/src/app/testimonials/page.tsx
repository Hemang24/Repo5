'use client'

import { Star } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

const TESTIMONIALS = [
  { name: 'Lisa M.', quote: 'Thank you for helping me feel like me again! You are terrific and truly a wonderful person.', featured: true },
  { name: 'Kathleen A.', quote: 'You made my physical therapy a joy. I can\'t thank you enough for making PT a happy and fun time even when it hurt.', featured: true },
  { name: 'Allison S.', quote: 'She helped me overcome the hardest part of my life through and through. She didn\'t make therapy feel like a chore.', featured: true },
  { name: 'Alyssa A.', quote: 'Thank you so much for helping me with my knee. I\'m so grateful I can be back playing the game I love with no pain.', featured: true },
  { name: 'Troy', quote: 'I am hopeful that this treatment will alleviate at least some of the nerve symptoms so that I can finally conduct my normal daily activities without as much pain.' },
  { name: 'Isaac A.', quote: 'Time and kindness is a precious commodity. Thanks again for caring enough to share yours.' },
  { name: 'Enrique R.', quote: 'With deep gratitude to you and the wonderful people of your staff.' },
  { name: 'Sadie R.', quote: 'I enjoyed coming even though it hurt. All the people were as nice as they could be.' },
  { name: 'Kathi S.', quote: 'You are a great therapist and lots of fun. I\'m really going to miss the laughs.' },
  { name: 'Kent A.', quote: 'Thanks for letting me play.' },
]

const ALSO_TREATED = [
  'Loraine M.', 'Nicole C.', 'Dot J.', 'Teddy T.', 'Chicquita L.',
  'Neema H.', 'Vivian G.', 'Michele M.', 'Kim H.', 'Julia I.',
  'Aron M.', 'Yohan B.', 'Norma W.', 'Amber S.', 'Glendora H.',
  'Wanda C.', 'Laurin S.', 'Monica L.', 'Ali D.', 'Robin D.',
  'Lynnai P.', 'Adama K.', 'Robert R.', 'Nancy B.', 'Jeff C.',
  'Andrea R.', 'Brian S.',
]

function Stars() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export default function TestimonialsPage() {
  const { lang } = useLanguage()
  const t = translations[lang]

  const featured = TESTIMONIALS.filter(t => t.featured)
  const regular = TESTIMONIALS.filter(t => !t.featured)

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-100 to-warm-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 mb-4">
            {t.testimonials.title}
          </h1>
          <p className="text-brown-500 text-lg">{t.testimonials.subtitle}</p>
        </div>
      </section>

      {/* Featured testimonials */}
      <section className="py-16 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-brown-800 mb-8 text-center">Featured Patients</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {featured.map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 80}>
                <div className="relative bg-white rounded-3xl p-7 border-l-4 border-l-sage-500 border border-warm-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <span className="absolute top-3 right-5 text-8xl text-warm-100 font-serif leading-none select-none pointer-events-none">"</span>
                  <Stars />
                  <p className="text-brown-700 leading-relaxed italic mb-5 text-base relative z-10">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-warm-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {item.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-warm-600">— {item.name}</p>
                      <p className="text-xs text-brown-400">Verified Patient</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Regular testimonials masonry */}
          <h2 className="font-serif text-2xl font-bold text-brown-800 mb-8 text-center">More Patient Voices</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {regular.map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 60}>
                <div className="break-inside-avoid bg-warm-100 rounded-2xl p-5 border border-warm-200 hover:bg-warm-50 hover:border-warm-300 transition-all">
                  <Stars />
                  <p className="text-brown-700 leading-relaxed italic text-sm mb-4">"{item.quote}"</p>
                  <p className="text-warm-600 font-semibold text-sm">— {item.name}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Also treated */}
          <ScrollReveal>
            <div className="mt-16 bg-white rounded-3xl border border-warm-100 p-8 text-center">
              <h3 className="font-serif text-xl font-bold text-brown-900 mb-2">Also Treated</h3>
              <p className="text-brown-400 text-sm mb-6">Additional patients who have experienced recovery with our team.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {ALSO_TREATED.map(name => (
                  <span
                    key={name}
                    className="px-3 py-1 bg-warm-50 border border-warm-100 text-brown-600 text-sm rounded-full"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-warm-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-3">Your Story Could Be Next</h2>
          <p className="text-warm-100 mb-6">Start your recovery journey with our expert, caring team today.</p>
          <Link
            href="/patient-intake"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-warm-600 font-bold rounded-xl hover:bg-warm-50 transition-colors shadow-md"
          >
            Begin Patient Intake
          </Link>
        </div>
      </section>
    </div>
  )
}
