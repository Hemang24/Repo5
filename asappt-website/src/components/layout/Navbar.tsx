'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { lang, setLang } = useLanguage()
  const nav = translations[lang].nav

  const links = [
    { href: '/', label: nav.home },
    { href: '/services', label: nav.services },
    { href: '/our-team', label: nav.team },
    { href: '/insurance', label: nav.insurance },
    { href: '/faqs', label: nav.faqs },
    { href: '/location', label: nav.location },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warm-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            {/* Logo placeholder — swap with <Image> when logo file is provided */}
            <div className="w-10 h-10 rounded-lg bg-warm-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">AS<br/>AP</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-warm-500 font-serif font-bold text-base leading-tight group-hover:text-warm-600 transition-colors">
                Advance Spine & Pain
              </p>
              <p className="text-brown-500 text-xs">Physical Therapy</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-warm-500 bg-warm-100'
                    : 'text-brown-700 hover:text-warm-500 hover:bg-warm-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-warm-200 text-xs font-semibold text-brown-600 hover:border-warm-500 hover:text-warm-500 transition-colors"
              aria-label="Toggle language"
            >
              {lang === 'en' ? '🇪🇸 ES' : '🇺🇸 EN'}
            </button>

            {/* Phone — desktop */}
            <a
              href="tel:+16096958100"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-brown-700 hover:text-warm-500 transition-colors"
            >
              <Phone className="w-4 h-4" />
              (609) 695-8100
            </a>

            {/* Patient Intake CTA */}
            <Link
              href="/patient-intake"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-warm-500 text-white text-sm font-semibold hover:bg-warm-600 transition-colors shadow-sm"
            >
              {nav.patientIntake}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-md text-brown-600 hover:bg-warm-100 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-warm-200 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-warm-500 bg-warm-100'
                    : 'text-brown-700 hover:bg-warm-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/patient-intake"
              onClick={() => setOpen(false)}
              className="block w-full text-center mt-3 px-4 py-2.5 rounded-lg bg-warm-500 text-white text-sm font-semibold hover:bg-warm-600 transition-colors"
            >
              {nav.patientIntake}
            </Link>
            <div className="flex items-center justify-between pt-2 border-t border-warm-100">
              <a href="tel:+16096958100" className="flex items-center gap-1.5 text-sm text-brown-600">
                <Phone className="w-4 h-4" /> (609) 695-8100
              </a>
              <button
                onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
                className="px-3 py-1 rounded-full border border-warm-200 text-xs font-semibold text-brown-600"
              >
                {lang === 'en' ? '🇪🇸 Español' : '🇺🇸 English'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
