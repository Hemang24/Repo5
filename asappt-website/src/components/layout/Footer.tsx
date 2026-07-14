'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

export function Footer() {
  const { lang } = useLanguage()
  const nav = translations[lang].nav
  const footer = translations[lang].footer

  return (
    <footer className="bg-brown-900 text-warm-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-warm-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm leading-none">AS<br/>AP</span>
              </div>
              <div>
                <p className="font-serif font-bold text-warm-50 leading-tight">Advance Spine & Pain</p>
                <p className="text-warm-300 text-xs">Physical Therapy</p>
              </div>
            </div>
            <p className="text-warm-300 text-sm leading-relaxed">{footer.tagline}</p>
            <div className="mt-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sage-400 flex-shrink-0" />
              <span className="text-sage-400 text-xs font-medium">{footer.hipaa}</span>
            </div>
            <p className="mt-2 text-warm-400 text-xs">Se Habla Español</p>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-warm-50 font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-warm-400" />
              {footer.hours}
            </h3>
            <ul className="space-y-2 text-sm text-warm-300">
              <li className="flex justify-between gap-4">
                <span>Mon, Wed, Fri</span>
                <span className="text-warm-200">8:30 AM – 7:00 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Tue, Thu</span>
                <span className="text-warm-200">8:30 AM – 1:30 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sat, Sun</span>
                <span className="text-warm-400">Closed</span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-warm-400">Home PT available by appt.</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-warm-50 font-semibold mb-4">{footer.contact}</h3>
            <ul className="space-y-3 text-sm text-warm-300">
              <li>
                <a href="tel:+16096958100" className="flex items-start gap-2 hover:text-warm-200 transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-warm-400" />
                  (609) 695-8100
                </a>
              </li>
              <li>
                <a href="mailto:contact@asappt.com" className="flex items-start gap-2 hover:text-warm-200 transition-colors">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-warm-400" />
                  contact@asappt.com
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=225+East+State+St+Suite+12+Trenton+NJ+08608"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-warm-200 transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-warm-400" />
                  <span>225 East State St, Suite 12<br/>Trenton, NJ 08608</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-warm-50 font-semibold mb-4">{footer.quickLinks}</h3>
            <ul className="space-y-2">
              {[
                { href: '/services', label: nav.services },
                { href: '/our-team', label: nav.team },
                { href: '/testimonials', label: nav.testimonials },
                { href: '/insurance', label: nav.insurance },
                { href: '/faqs', label: nav.faqs },
                { href: '/home-pt', label: nav.homePT },
                { href: '/patient-intake', label: nav.patientIntake },
                { href: '/contact', label: nav.contact },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-300 hover:text-warm-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-brown-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-warm-500 text-xs">
            © {new Date().getFullYear()} Advance Spine and Pain Physical Therapy, LLC. {footer.rights}
          </p>
          <div className="flex gap-4 text-xs text-warm-500">
            <Link href="/patient-intake" className="hover:text-warm-300 transition-colors">Patient Intake</Link>
            <Link href="/location" className="hover:text-warm-300 transition-colors">Location</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
