'use client'

import { MapPin, Clock, Phone, Mail, Car, Train } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export default function LocationPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-100 to-warm-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 mb-4">Location & Directions</h1>
          <p className="text-brown-500 text-lg">Conveniently located in downtown Trenton, NJ — accessible by car, bus, and train.</p>
        </div>
      </section>

      <section className="py-16 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map embed */}
            <ScrollReveal>
              <div className="rounded-3xl overflow-hidden border border-warm-200 shadow-sm h-80 lg:h-full min-h-[320px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3044.5!2d-74.7566!3d40.2171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c15b1cbc12345%3A0xabcdef!2s225+E+State+St%2C+Trenton%2C+NJ+08608!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ASAP PT Location"
                />
              </div>
            </ScrollReveal>

            {/* Info cards */}
            <div className="space-y-4">
              <ScrollReveal>
                <div className="bg-white rounded-2xl p-6 border border-warm-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-warm-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-warm-600" />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-brown-900">Address</h2>
                  </div>
                  <p className="text-brown-600 leading-relaxed mb-3">
                    225 East State Street, Suite 12<br />
                    Trenton, NJ 08608
                  </p>
                  <a
                    href="https://maps.google.com/?q=225+East+State+St+Suite+12+Trenton+NJ+08608"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-warm-500 font-semibold hover:text-warm-700 transition-colors"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={80}>
                <div className="bg-white rounded-2xl p-6 border border-warm-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-warm-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-warm-600" />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-brown-900">Hours of Operation</h2>
                  </div>
                  <div className="space-y-2">
                    {[
                      { days: 'Monday', hours: '8:30 AM – 7:00 PM', open: true },
                      { days: 'Tuesday', hours: '8:30 AM – 1:30 PM', open: true },
                      { days: 'Wednesday', hours: '8:30 AM – 7:00 PM', open: true },
                      { days: 'Thursday', hours: '8:30 AM – 1:30 PM', open: true },
                      { days: 'Friday', hours: '8:30 AM – 7:00 PM', open: true },
                      { days: 'Saturday', hours: 'Closed', open: false },
                      { days: 'Sunday', hours: 'Closed', open: false },
                    ].map(({ days, hours, open }) => (
                      <div key={days} className="flex items-center justify-between py-1.5 border-b border-warm-50 last:border-0">
                        <span className="text-sm font-medium text-brown-700">{days}</span>
                        <span className={`text-sm font-semibold ${open ? 'text-sage-600' : 'text-brown-300'}`}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-brown-400 mt-3">Home PT available by appointment.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <div className="bg-white rounded-2xl p-6 border border-warm-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-warm-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-warm-600" />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-brown-900">Contact</h2>
                  </div>
                  <div className="space-y-2">
                    <a href="tel:+16096958100" className="flex items-center gap-2 text-brown-600 hover:text-warm-500 transition-colors">
                      <Phone className="w-4 h-4 text-warm-400" />
                      (609) 695-8100 — Phone
                    </a>
                    <p className="flex items-center gap-2 text-brown-500">
                      <Phone className="w-4 h-4 text-warm-400" />
                      (609) 695-8110 — Fax
                    </p>
                    <a href="mailto:contact@asappt.com" className="flex items-center gap-2 text-brown-600 hover:text-warm-500 transition-colors">
                      <Mail className="w-4 h-4 text-warm-400" />
                      contact@asappt.com
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Parking & transit */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScrollReveal>
              <div className="bg-white rounded-2xl p-6 border border-warm-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Car className="w-5 h-5 text-warm-500" />
                  <h3 className="font-semibold text-brown-900">Parking</h3>
                </div>
                <ul className="space-y-2 text-sm text-brown-600">
                  <li>• Metered street parking nearby (60–120 min)</li>
                  <li>• City Hall parking lot (short walk)</li>
                  <li>• DMV parking lot available</li>
                  <li>• Easier parking after 5 PM and weekends</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="bg-white rounded-2xl p-6 border border-warm-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Train className="w-5 h-5 text-sage-500" />
                  <h3 className="font-semibold text-brown-900">Public Transit</h3>
                </div>
                <ul className="space-y-2 text-sm text-brown-600">
                  <li>• NJ Transit train — Trenton Station</li>
                  <li>• Multiple bus routes along State Street</li>
                  <li>• Short walk from transit stops</li>
                  <li>• SEPTA Regional Rail accessible</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}
