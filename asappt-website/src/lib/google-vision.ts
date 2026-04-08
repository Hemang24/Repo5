interface VisionResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string
      boundingPoly: object
    }>
    fullTextAnnotation?: {
      text: string
    }
    error?: {
      message: string
    }
  }>
}

export async function extractTextFromImage(base64Image: string, mimeType: string): Promise<string> {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not configured')
  }

  const serviceAccount = JSON.parse(serviceAccountJson)
  const accessToken = await getAccessToken(serviceAccount)

  const body = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: 'DOCUMENT_TEXT_DETECTION',
            maxResults: 1,
          },
        ],
        imageContext: {
          languageHints: ['en', 'es'],
        },
      },
    ],
  }

  const response = await fetch(
    'https://vision.googleapis.com/v1/images:annotate',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Vision API error: ${err}`)
  }

  const data: VisionResponse = await response.json()
  const result = data.responses?.[0]

  if (result?.error) {
    throw new Error(`Vision API error: ${result.error.message}`)
  }

  return result?.fullTextAnnotation?.text ?? result?.textAnnotations?.[0]?.description ?? ''
}

export function parseIdFields(rawText: string): Record<string, string> {
  const fields: Record<string, string> = {}
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean)

  // Try to extract common ID fields using patterns
  const fullText = rawText.toUpperCase()

  // Date of birth patterns: DOB, BIRTH DATE, etc.
  const dobMatch = fullText.match(/(?:DOB|DATE OF BIRTH|BIRTH DATE)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i)
  if (dobMatch) fields.dateOfBirth = formatDate(dobMatch[1])

  // Name patterns
  const lastNameMatch = fullText.match(/(?:LN|LAST NAME|SURNAME)[:\s]+([A-Z]+)/i)
  if (lastNameMatch) fields.lastName = titleCase(lastNameMatch[1])

  const firstNameMatch = fullText.match(/(?:FN|FIRST NAME|GIVEN NAME)[:\s]+([A-Z]+)/i)
  if (firstNameMatch) fields.firstName = titleCase(firstNameMatch[1])

  // Address patterns
  const addressMatch = rawText.match(/(\d+\s+[A-Z][A-Za-z\s]+(?:ST|AVE|BLVD|DR|RD|LN|WAY|CT|PL)[A-Za-z.]*)/i)
  if (addressMatch) fields.address = addressMatch[1].trim()

  // Zip code
  const zipMatch = rawText.match(/\b(\d{5}(?:-\d{4})?)\b/)
  if (zipMatch) fields.zip = zipMatch[1]

  // State (NJ, NY, etc.)
  const stateMatch = rawText.match(/\b([A-Z]{2})\s+\d{5}/i)
  if (stateMatch) fields.state = stateMatch[1].toUpperCase()

  // If we got a name from the first lines (common on IDs)
  if (!fields.firstName || !fields.lastName) {
    for (const line of lines.slice(0, 5)) {
      const nameParts = line.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)$/)
      if (nameParts && !fields.firstName) {
        fields.firstName = nameParts[1]
        fields.lastName = nameParts[2]
        break
      }
    }
  }

  return fields
}

export function parseInsuranceFields(rawText: string): Record<string, string> {
  const fields: Record<string, string> = {}
  const upperText = rawText.toUpperCase()

  // Member ID
  const memberIdMatch = upperText.match(/(?:MEMBER\s*ID|ID\s*#|MEMBER\s*#|ID NUMBER)[:\s]+([A-Z0-9]+)/i)
  if (memberIdMatch) fields.memberId = memberIdMatch[1]

  // Group number
  const groupMatch = upperText.match(/(?:GROUP\s*(?:#|NO|NUMBER)?)[:\s]+([A-Z0-9]+)/i)
  if (groupMatch) fields.groupNumber = groupMatch[1]

  // Subscriber/Member name
  const subscriberMatch = rawText.match(/(?:MEMBER|SUBSCRIBER|INSURED)[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i)
  if (subscriberMatch) fields.subscriberName = subscriberMatch[1]

  // Insurance provider from common names
  const providers = ['Aetna', 'Horizon', 'Blue Cross', 'Medicare', 'Medicaid', 'NJ Direct', 'Cigna', 'United', 'Humana', 'Fidelis']
  for (const provider of providers) {
    if (upperText.includes(provider.toUpperCase())) {
      fields.providerName = provider
      break
    }
  }

  return fields
}

// --- Helpers ---

async function getAccessToken(serviceAccount: Record<string, string>): Promise<string> {
  // Create JWT for service account auth
  const header = { alg: 'RS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-vision https://www.googleapis.com/auth/drive',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const jwt = await createJwt(header, payload, serviceAccount.private_key)

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const tokenData = await tokenResponse.json()
  if (!tokenData.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`)
  }
  return tokenData.access_token
}

async function createJwt(header: object, payload: object, privateKeyPem: string): Promise<string> {
  const encoder = new TextEncoder()
  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(payload))
  const signingInput = `${headerB64}.${payloadB64}`

  const pemContents = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\n/g, '')

  const binaryDer = Buffer.from(pemContents, 'base64')
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    encoder.encode(signingInput)
  )

  const signatureB64 = base64UrlEncode(Buffer.from(signature).toString('base64'))
  return `${signingInput}.${signatureB64}`
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function formatDate(raw: string): string {
  const parts = raw.split(/[\/\-]/)
  if (parts.length === 3) {
    const [m, d, y] = parts
    const year = y.length === 2 ? `19${y}` : y
    return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return raw
}

function titleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
