import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromImage, parseIdFields, parseInsuranceFields } from '@/lib/google-vision'

export async function POST(req: NextRequest) {
  try {
    const { base64, mimeType, mode } = await req.json()

    if (!base64 || !mimeType) {
      return NextResponse.json({ error: 'base64 and mimeType are required' }, { status: 400 })
    }

    // Check env
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      return NextResponse.json(
        { error: 'OCR service not configured. Please set GOOGLE_SERVICE_ACCOUNT_JSON.' },
        { status: 503 }
      )
    }

    const rawText = await extractTextFromImage(base64, mimeType)

    // Parse fields based on mode (id or insurance)
    const parsedFields = mode === 'insurance'
      ? parseInsuranceFields(rawText)
      : parseIdFields(rawText)

    return NextResponse.json({ rawText, parsedFields })
  } catch (err) {
    console.error('OCR error:', err)
    const message = err instanceof Error ? err.message : 'OCR processing failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
