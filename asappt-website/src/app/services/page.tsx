'use client'

import { CheckCircle, Home } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

const SERVICES = [
  {
    category: 'Spine & Back',
    conditions: ['Herniated / Bulging Discs', 'Spinal Stenosis', 'Sciatica', 'Degenerative Disc Disease', 'Arthritis of the Spine', 'Postural Dysfunction', 'Whiplash'],
    description: 'Our lead therapist Dr. Rita Amin is a Certified McKenzie Spine Practitioner with over 22 years specializing in spinal conditions.',
    color: 'warm',
  },
  {
    category: 'Shoulder',
    conditions: ['Rotator Cuff Tears', 'Impingement Syndrome', 'Frozen Shoulder', 'Labral Tears', 'Post-surgical Shoulder Rehab', 'Bursitis'],
    description: 'Hands-on manual therapy combined with targeted strengthening exercises to restore full shoulder function.',
    color: 'sage',
  },
  {
    category: 'Knee & Hip',
    conditions: ['Torn Meniscus', 'ACL / MCL Injuries', 'Knee Replacement Rehab', 'Hip Replacement Rehab', 'IT Band Syndrome', 'Patellofemoral Pain'],
    description: 'Pre- and post-surgical rehab programs customized to get you back to your daily activities and sports.',
    color: 'warm',
  },
  {
    category: 'Hand Therapy',
    conditions: ['Carpal Tunnel Syndrome', 'Trigger Finger', 'Ganglion Cyst Removal', 'Fractures & Sprains', 'Tendon Injuries', 'Wrist Pain'],
    description: 'Certified Hand Therapy services to restore fine motor function and relieve hand and wrist pain.',
    color: 'sage',
  },
  {
    category: 'Neurological & Balance',
    conditions: ['Vertigo (BPPV)', 'Balance Disorders', 'Falls Prevention', 'TMJ / Jaw Problems', 'Neuropathy', 'Post-stroke Rehab'],
    description: 'Specialized vestibular and neurological rehabilitation to restore balance and functional independence.',
    color: 'warm',
  },
  {
    category: 'Sports Medicine',
    conditions: ['ACL Tears', 'Sports-related Fractures', 'Ankle Sprains', 'Tennis / Golfer\'s Elbow', 'Running Injuries', 'Return-to-Sport Programs'],
    description: 'Sport-specific rehabilitation programs for athletes of all levels — from high school to weekend warriors.',
    color: 'sage',
  },
  {
    category: 'Personal Injury',
    conditions: ['Auto Accident (PIP)', 'Slip & Fall', 'Worker\'s Compensation', 'Chronic Pain', 'Fibromyalgia', 'Repetitive Stress'],
    description: 'We work directly with auto insurance and worker\'s comp carriers. Spanish-speaking staff available.',
    color: 'warm',
  },
  {
    category: 'General Orthopedics',
    conditions: ['Arthritis & Joint Pain', 'Fractures & Sprains', 'Muscle Weakness', 'Post-hospitalization', 'Geriatric PT', 'Pediatric Conditions'],
    description: 'Comprehensive outpatient orthopedic care for all ages — from pediatric to geriatric patients.',
    color: 'sage',
  },
]

export default function ServicesPage() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-100 to-warm-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 mb-4">
            {t.services.title}
          </h1>
          <p className="text-brown-500 text-lg max-w-2xl mx-auto">{t.services.subtitle}</p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service, i) => (
              <ScrollReveal key={service.category} delay={i * 60}>
                <div className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all ${
                  service.color === 'warm' ? 'border-warm-100 hover:border-warm-300' : 'border-sage-100 hover:border-sage-300'
                }`}>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                    service.color === 'warm' ? 'bg-warm-100 text-warm-700' : 'bg-sage-100 text-sage-700'
                  }`}>
                    {service.category}
                  </div>
                  <p className="text-sm text-brown-500 mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.conditions.map(c => (
                      <li key={c} className="flex items-center gap-2 text-sm text-brown-700">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${service.color === 'warm' ? 'text-warm-500' : 'text-sage-500'}`} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Home PT CTA */}
      <section className="py-14 bg-warm-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Home className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="font-serif text-3xl font-bold text-white mb-3">Can't Come to Us?</h2>
          <p className="text-warm-100 mb-6">We bring physical therapy to your home. Available by appointment for patients with mobility limitations.</p>
          <Link
            href="/home-pt"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-warm-600 font-bold rounded-xl hover:bg-warm-50 transition-colors shadow-md"
          >
            Learn About Home PT
          </Link>
        </div>
      </section>
    </div>
  )
}
