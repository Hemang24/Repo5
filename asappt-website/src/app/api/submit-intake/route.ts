import { NextRequest, NextResponse } from 'next/server'
import {
  createPatientFolder,
  uploadTextFile,
  uploadJsonFile,
  uploadImageFile,
  buildSummaryText,
} from '@/lib/google-drive'
import type { IntakeFormData, UploadedFile } from '@/types/intake'

export async function POST(req: NextRequest) {
  try {
    const {
      formData,
      files,
      ocrTexts,
    }: {
      formData: IntakeFormData
      files: Record<string, UploadedFile>
      ocrTexts: Record<string, string>
    } = await req.json()

    if (!formData?.demographics?.firstName) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    // Check Drive config
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
      return NextResponse.json(
        { error: 'Storage service not configured. Please contact the clinic directly at (609) 695-8100.' },
        { status: 503 }
      )
    }

    const { firstName, lastName } = formData.demographics
    const patientName = `${lastName}_${firstName}`.replace(/[^a-zA-Z0-9_]/g, '')

    // Create patient folder in Drive
    const folderId = await createPatientFolder(patientName)

    // Upload structured JSON data
    await uploadJsonFile(folderId, 'intake_data.json', formData)

    // Upload plain text summary (OCR + form data)
    const summaryText = buildSummaryText(formData, {
      id: ocrTexts?.idPhoto,
      insuranceFront: ocrTexts?.insuranceFront,
      insuranceBack: ocrTexts?.insuranceBack,
    })
    await uploadTextFile(folderId, 'intake_summary.txt', summaryText)

    // Upload any images
    const imageUploads: Promise<void>[] = []

    if (files?.idPhoto?.dataUrl) {
      imageUploads.push(
        uploadImageFile(folderId, 'id_photo.jpg', files.idPhoto.dataUrl, files.idPhoto.type || 'image/jpeg')
      )
    }
    if (files?.insuranceFront?.dataUrl) {
      imageUploads.push(
        uploadImageFile(folderId, 'insurance_front.jpg', files.insuranceFront.dataUrl, files.insuranceFront.type || 'image/jpeg')
      )
    }
    if (files?.insuranceBack?.dataUrl) {
      imageUploads.push(
        uploadImageFile(folderId, 'insurance_back.jpg', files.insuranceBack.dataUrl, files.insuranceBack.type || 'image/jpeg')
      )
    }

    await Promise.all(imageUploads)

    return NextResponse.json({ success: true, folderId })
  } catch (err) {
    console.error('Intake submission error:', err)
    const message = err instanceof Error ? err.message : 'Submission failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
