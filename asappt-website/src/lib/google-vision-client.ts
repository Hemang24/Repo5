// Client-side field parsing helpers (no API calls — just text parsing)

export function parseIdFields(rawText: string): Record<string, string> {
  const fields: Record<string, string> = {}
  const upperText = rawText.toUpperCase()

  const dobMatch = rawText.match(/(?:DOB|DATE OF BIRTH|BIRTH DATE)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i)
  if (dobMatch) fields.dateOfBirth = formatDateToISO(dobMatch[1])

  const lastMatch = rawText.match(/(?:LN|LAST NAME|SURNAME)[:\s]+([A-Z][a-z]+)/i)
  if (lastMatch) fields.lastName = titleCase(lastMatch[1])

  const firstMatch = rawText.match(/(?:FN|FIRST NAME|GIVEN NAME)[:\s]+([A-Z][a-z]+)/i)
  if (firstMatch) fields.firstName = titleCase(firstMatch[1])

  const addressMatch = rawText.match(/(\d+\s+[A-Za-z\s]+(?:ST|AVE|BLVD|DR|RD|LN|WAY|CT|PL)[A-Za-z.]*)/i)
  if (addressMatch) fields.address = addressMatch[1].trim()

  const zipMatch = rawText.match(/\b(\d{5}(?:-\d{4})?)\b/)
  if (zipMatch) fields.zip = zipMatch[1]

  const stateMatch = upperText.match(/,\s+([A-Z]{2})\s+\d{5}/)
  if (stateMatch) fields.state = stateMatch[1]

  return fields
}

function formatDateToISO(raw: string): string {
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
