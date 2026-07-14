import { google } from 'googleapis'
import type { IntakeFormData } from '@/types/intake'

function getAuthClient() {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!serviceAccountJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set')
  }

  const credentials = JSON.parse(serviceAccountJson)
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })
}

export async function createPatientFolder(patientName: string): Promise<string> {
  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })
  const parentFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!parentFolderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is not set')
  }

  const timestamp = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '') + '_' + new Date().toTimeString().slice(0, 5).replace(':', '')

  const folderName = `${patientName}_${timestamp}`

  const response = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    },
    fields: 'id',
  })

  return response.data.id!
}

export async function uploadTextFile(
  folderId: string,
  fileName: string,
  content: string
): Promise<void> {
  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })

  const { Readable } = await import('stream')
  const stream = Readable.from([content])

  await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: 'text/plain',
      body: stream,
    },
  })
}

export async function uploadJsonFile(
  folderId: string,
  fileName: string,
  data: object
): Promise<void> {
  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })

  const { Readable } = await import('stream')
  const stream = Readable.from([JSON.stringify(data, null, 2)])

  await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: 'application/json',
      body: stream,
    },
  })
}

export async function uploadImageFile(
  folderId: string,
  fileName: string,
  base64Data: string,
  mimeType: string
): Promise<void> {
  const auth = getAuthClient()
  const drive = google.drive({ version: 'v3', auth })

  const { Readable } = await import('stream')
  const buffer = Buffer.from(base64Data, 'base64')
  const stream = Readable.from([buffer])

  await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: stream,
    },
  })
}

export function buildSummaryText(
  formData: IntakeFormData,
  ocrTexts: { id?: string; insuranceFront?: string; insuranceBack?: string }
): string {
  const d = formData.demographics
  const ins = formData.insurance
  const med = formData.medicalHistory
  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

  return `=== ADVANCE SPINE AND PAIN PHYSICAL THERAPY ===
Patient Intake Submission — ${submittedAt} ET

--- PERSONAL DEMOGRAPHICS ---
Name: ${d.firstName} ${d.lastName}
Date of Birth: ${d.dateOfBirth}
Gender: ${d.gender}
Address: ${d.address}, ${d.city}, ${d.state} ${d.zip}
Phone: ${d.phone}
Email: ${d.email}
Emergency Contact: ${d.emergencyContactName} — ${d.emergencyContactPhone}
Language Preference: ${d.language}

--- INSURANCE INFORMATION ---
Provider: ${ins.providerName}
Member ID: ${ins.memberId}
Group Number: ${ins.groupNumber}
Subscriber Name: ${ins.subscriberName}
Relationship: ${ins.subscriberRelationship}

--- MEDICAL HISTORY ---
Chief Complaint: ${med.chiefComplaint}
Referring Physician: ${med.referringPhysician}
Conditions: ${med.conditions.join(', ') || 'None specified'}
Current Medications: ${med.medications || 'None'}
Previous PT: ${med.previousPT}
Surgical History: ${med.surgicalHistory || 'None'}

--- CONSENT ---
HIPAA Acknowledged: Yes
Patient Consent: Yes
Electronic Signature: ${formData.consent.signature}

--- OCR EXTRACTED TEXT ---
${ocrTexts.id ? `Government ID:\n${ocrTexts.id}\n` : ''}
${ocrTexts.insuranceFront ? `Insurance Card (Front):\n${ocrTexts.insuranceFront}\n` : ''}
${ocrTexts.insuranceBack ? `Insurance Card (Back):\n${ocrTexts.insuranceBack}\n` : ''}
`
}
