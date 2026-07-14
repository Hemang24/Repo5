import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { LanguageProvider } from '@/lib/language-context'

export const metadata: Metadata = {
  title: 'Advance Spine & Pain Physical Therapy | Trenton, NJ',
  description: 'Advance Spine and Pain Physical Therapy, LLC — 18+ years of expert outpatient orthopedic physical therapy in Trenton, NJ. Hands-on, bilingual care for all ages and conditions.',
  keywords: 'physical therapy, Trenton NJ, spine, pain, orthopedic, rehabilitation, ASAP PT, physical therapist',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#C4622D',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-warm-50 text-brown-900 min-h-screen flex flex-col">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  )
}
