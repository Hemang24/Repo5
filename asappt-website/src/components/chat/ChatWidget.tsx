'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuickQ, setShowQuickQ] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { lang } = useLanguage()
  const chat = translations[lang].chat

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    setShowQuickQ(false)
    const userMessage: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language: lang,
        }),
      })

      if (!response.ok) throw new Error('Chat error')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'en'
          ? 'Sorry, I had trouble responding. Please call us at (609) 695-8100.'
          : 'Lo siento, hubo un problema. Por favor llámenos al (609) 695-8100.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions = [chat.quickQ1, chat.quickQ2, chat.quickQ3, chat.quickQ4]

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? chat.close : chat.open}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-warm-500 text-white shadow-lg hover:bg-warm-600 transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
      >
        {open ? <ChevronDown className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-warm-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-warm-500 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">{chat.title}</p>
              <p className="text-warm-100 text-xs">Advance Spine & Pain PT</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={chat.close}
              className="text-warm-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-scroll min-h-[200px]">
            {messages.length === 0 && (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-warm-500" />
                </div>
                <p className="text-brown-500 text-sm">
                  {lang === 'en'
                    ? 'Hi! Ask me about insurance, services, or how to schedule.'
                    : '¡Hola! Pregúntame sobre seguros, servicios o cómo agendar una cita.'}
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-warm-500 text-white rounded-br-sm'
                      : 'bg-warm-100 text-brown-900 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-warm-100 rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex gap-1 items-center h-5">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-brown-300 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {showQuickQ && messages.length === 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 bg-warm-100 text-warm-600 rounded-full border border-warm-200 hover:bg-warm-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(input) }}
            className="p-3 border-t border-warm-100 flex gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={chat.placeholder}
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent placeholder:text-brown-300 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label={chat.send}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-warm-500 text-white hover:bg-warm-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
