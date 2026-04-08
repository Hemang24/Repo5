'use client'

import { Award, Languages, GraduationCap, Phone } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

const STAFF = [
  {
    name: 'Rita Amin, DPT, OCS, Cert. MDT',
    role: 'Lead Physical Therapist',
    initials: 'RA',
    color: 'warm',
    bio: 'Dr. Rita Amin brings over 22 years of clinical excellence in orthopedics, spine care, sports medicine, and neurology. Her distinguished career spans premier institutions including the University Medical Center at Princeton, Kessler Institute for Rehabilitation, and NYU Medical Center. She has authored articles in peer-reviewed medical journals and taught at both Boston University and Columbia University physical therapy programs.',
    credentials: [
      'Doctorate in Physical Therapy — Boston University',
      'Masters & Bachelors in Physical Therapy — Northeastern University',
      'Certified Orthopedic Specialist (OCS) — ABPTS',
      'Certified McKenzie Spine Practitioner',
      'Certified Hand Therapist',
      'Certified Pilates Instructor',
      'Licensed in NJ, NY, and PA',
      'Member, American Physical Therapy Association',
    ],
    languages: ['English', 'Spanish', 'Hindi'],
    specialty: 'Spine & orthopedic care, disc derangements, hand therapy',
  },
  {
    name: 'Hemang A.',
    role: 'Director & Co-Owner',
    initials: 'HA',
    color: 'sage',
    bio: 'Hemang co-founded Advance Spine and Pain PT in Fall 2006 and has led the practice\'s growth into Trenton\'s premier orthopedic PT destination. With a Computer Science background from Thomas Edison University and experience at Fortune 100 companies, he brings data-driven, patient-centered operational excellence to every aspect of the clinic — from technology and marketing to staff development and patient experience.',
    credentials: [
      'B.S. Computer Science — Thomas Edison University',
      'Co-owner since Fall 2006',
      'Fortune 100 corporate background',
      'Expertise in practice management & operations',
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    specialty: 'Operations, strategy, patient experience',
  },
  {
    name: 'Addi R.',
    role: 'Front Desk Receptionist',
    initials: 'AR',
    color: 'warm',
    bio: 'Addi is the welcoming face of ASAP PT, ensuring every patient\'s experience starts with warmth and efficiency. She manages scheduling, insurance verification, and patient communications — making the administrative side of your care seamless from day one.',
    credentials: [
      'Patient scheduling & coordination',
      'Insurance verification specialist',
      'Bilingual patient communications',
    ],
    languages: ['English'],
    specialty: 'Patient coordination, scheduling, administrative support',
  },
  {
    name: 'Kiana G.',
    role: 'Physical Therapy Aide',
    initials: 'KG',
    color: 'sage',
    bio: 'Kiana assists our clinical team in delivering hands-on therapeutic care, helping patients through exercises and modalities under the supervision of Dr. Amin. Her passion for patient recovery and attention to detail make her a valued member of our care team.',
    credentials: [
      'Physical Therapy Aide certification',
      'Therapeutic exercise assistance',
      'Modality application training',
    ],
    languages: ['English'],
    specialty: 'Therapeutic exercise support, patient assistance',
  },
]

export default function OurTeamPage() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-100 to-warm-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 mb-4">
            {t.nav.team}
          </h1>
          <p className="text-brown-500 text-lg max-w-2xl mx-auto">
            A dedicated, bilingual team committed to your recovery and wellbeing.
          </p>
        </div>
      </section>

      {/* Team cards */}
      <section className="py-16 bg-warm-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {STAFF.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 80}>
              <div className="bg-white rounded-3xl border border-warm-100 shadow-sm overflow-hidden">
                <div className={`h-1.5 ${member.color === 'warm' ? 'bg-warm-500' : 'bg-sage-500'}`} />
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white ${
                        member.color === 'warm' ? 'bg-warm-500' : 'bg-sage-500'
                      }`}>
                        {member.initials}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h2 className="font-serif text-2xl font-bold text-brown-900">{member.name}</h2>
                      <p className={`font-semibold text-sm mb-3 ${member.color === 'warm' ? 'text-warm-600' : 'text-sage-600'}`}>
                        {member.role}
                      </p>
                      <p className="text-brown-500 leading-relaxed mb-5">{member.bio}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Credentials */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="w-4 h-4 text-warm-500" />
                            <span className="text-xs font-semibold text-brown-600 uppercase tracking-wide">Credentials</span>
                          </div>
                          <ul className="space-y-1">
                            {member.credentials.map(c => (
                              <li key={c} className="flex items-start gap-1.5 text-xs text-brown-500">
                                <Award className="w-3 h-3 mt-0.5 flex-shrink-0 text-warm-400" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Languages + specialty */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Languages className="w-4 h-4 text-sage-500" />
                              <span className="text-xs font-semibold text-brown-600 uppercase tracking-wide">Languages</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {member.languages.map(l => (
                                <span key={l} className="px-2 py-0.5 bg-sage-100 text-sage-700 text-xs rounded-full">
                                  {l}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-brown-600 uppercase tracking-wide mb-1">Specialty</p>
                            <p className="text-xs text-brown-500">{member.specialty}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-14 bg-white border-t border-warm-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl font-bold text-brown-900 mb-3">Ready to Start Your Recovery?</h2>
          <p className="text-brown-500 mb-6">Our team is ready to build your personalized recovery plan.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/patient-intake" className="inline-flex items-center justify-center px-6 py-3 bg-warm-500 text-white font-semibold rounded-xl hover:bg-warm-600 transition-colors">
              Complete Patient Intake
            </Link>
            <a href="tel:+16096958100" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-warm-200 text-brown-700 font-semibold rounded-xl hover:bg-warm-50 transition-colors">
              <Phone className="w-4 h-4" /> Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
