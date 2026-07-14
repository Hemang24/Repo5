export interface DemographicsData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  emergencyContactName: string
  emergencyContactPhone: string
  language: 'english' | 'spanish'
}

export interface InsuranceData {
  providerName: string
  memberId: string
  groupNumber: string
  subscriberName: string
  subscriberRelationship: string
}

export interface MedicalHistoryData {
  chiefComplaint: string
  referringPhysician: string
  conditions: string[]
  medications: string
  previousPT: 'yes' | 'no' | ''
  surgicalHistory: string
}

export interface ConsentData {
  hipaaAcknowledged: boolean
  patientConsent: boolean
  signature: string
}

export interface IntakeFormData {
  demographics: DemographicsData
  insurance: InsuranceData
  medicalHistory: MedicalHistoryData
  consent: ConsentData
}

export interface OcrResult {
  rawText: string
  parsedFields: Record<string, string>
}

export interface UploadedFile {
  name: string
  dataUrl: string
  type: string
}

export const CONDITIONS_LIST = [
  'Back/Spine pain',
  'Neck pain',
  'Shoulder injury',
  'Knee injury',
  'Hip pain',
  'Ankle/Foot pain',
  'Wrist/Hand pain',
  'Arthritis',
  'Fibromyalgia',
  'Vertigo/Balance issues',
  'Post-surgical rehab',
  'Sports injury',
  'Auto accident injury',
  'Work injury',
  'Neurological condition',
]
