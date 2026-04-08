'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Button } from '@/components/ui/Button'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    // Simulate send (can be replaced with a real email API like Resend)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
  }

  const fieldClass = 'w-full px-3 py-2.5 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent placeholder:text-brown-200'
  const labelClass = 'block text-sm font-medium text-brown-700 mb-1'

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-100 to-warm-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 mb-4">Contact Us</h1>
          <p className="text-brown-500 text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to schedule an appointment, ask about insurance, or just say hello.
          </p>
        </div>
      </section>

      <section className="py-16 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact form */}
            <ScrollReveal>
              <div className="bg-white rounded-3xl border border-warm-100 shadow-sm p-7">
                <h2 className="font-serif text-2xl font-bold text-brown-900 mb-6">Send a Message</h2>

                {sent ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-sage-500" />
                    </div>
                    <h3 className="font-semibold text-brown-900 text-lg mb-2">Message Received!</h3>
                    <p className="text-brown-500 text-sm">We'll follow up within one business day. Or call us directly at (609) 695-8100.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={labelClass}>Your Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={fieldClass}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          className={fieldClass}
                          placeholder="(609) 555-0000"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className={fieldClass}
                          placeholder="jane@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className={`${fieldClass} resize-none`}
                        placeholder="How can we help you?"
                      />
                    </div>
                    <Button type="submit" size="lg" loading={sending} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      {sending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Contact info */}
            <div className="space-y-4">
              <ScrollReveal delay={80}>
                <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
                  <h3 className="font-semibold text-brown-900 mb-4 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-warm-500" /> Phone & Fax
                  </h3>
                  <div className="space-y-2">
                    <a href="tel:+16096958100" className="block text-brown-600 hover:text-warm-500 transition-colors">
                      <span className="font-semibold">(609) 695-8100</span> — Main Line
                    </a>
                    <p className="text-brown-500 text-sm">(609) 695-8110 — Fax</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
                  <h3 className="font-semibold text-brown-900 mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-warm-500" /> Email
                  </h3>
                  <a href="mailto:contact@asappt.com" className="text-brown-600 hover:text-warm-500 transition-colors">
                    contact@asappt.com
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <div className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6">
                  <h3 className="font-semibold text-brown-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-warm-500" /> Address
                  </h3>
                  <p className="text-brown-600 leading-relaxed">
                    225 East State Street, Suite 12<br />
                    Trenton, NJ 08608
                  </p>
                  <a
                    href="https://maps.google.com/?q=225+East+State+St+Suite+12+Trenton+NJ+08608"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-warm-500 text-sm font-semibold hover:text-warm-700 transition-colors mt-2 inline-block"
                  >
                    Get Directions →
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="bg-warm-500 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Hours
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-warm-100">Mon, Wed, Fri</span>
                      <span className="font-semibold">8:30 AM – 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-100">Tue, Thu</span>
                      <span className="font-semibold">8:30 AM – 1:30 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-100">Sat, Sun</span>
                      <span className="text-warm-200">Closed</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
