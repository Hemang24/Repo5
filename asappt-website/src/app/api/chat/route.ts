import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { CLINIC_SYSTEM_PROMPT } from '@/lib/chat-knowledge'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 503 }
      )
    }

    // Add language instruction to system prompt
    const languageInstruction = language === 'es'
      ? '\n\nIMPORTANT: The user has selected Spanish as their language. Respond ENTIRELY in Spanish.'
      : ''

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: CLINIC_SYSTEM_PROMPT + languageInstruction,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const message = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ message })
  } catch (err) {
    console.error('Chat error:', err)
    return NextResponse.json(
      { error: 'Chat service temporarily unavailable' },
      { status: 500 }
    )
  }
}
