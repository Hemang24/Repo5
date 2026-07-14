// Mock googleapis so the module can load without that package being installed
jest.mock('googleapis', () => ({ google: { auth: { GoogleAuth: jest.fn() }, drive: jest.fn() } }), { virtual: true })

import { buildSummaryText } from '../../../asappt-website/src/lib/google-drive'
import type { IntakeFormData } from '../../../asappt-website/src/types/intake'

// ── buildSummaryText ──────────────────────────────────────────────────────────

const baseFormData: IntakeFormData = {
  demographics: {
    firstName: 'Jane',
    lastName: 'Doe',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    address: '123 Main St',
    city: 'Princeton',
    state: 'NJ',
    zip: '08540',
    phone: '609-555-1234',
    email: 'jane.doe@example.com',
    emergencyContactName: 'John Doe',
    emergencyContactPhone: '609-555-5678',
    language: 'english',
  },
  insurance: {
    providerName: 'BlueCross',
    memberId: 'BC123456',
    groupNumber: 'GRP789',
    subscriberName: 'Jane Doe',
    subscriberRelationship: 'Self',
  },
  medicalHistory: {
    chiefComplaint: 'Lower back pain',
    referringPhysician: 'Dr. Smith',
    conditions: ['hypertension', 'diabetes'],
    medications: 'Metformin 500mg',
    previousPT: 'No',
    surgicalHistory: 'Appendectomy 2015',
  },
  consent: {
    hipaaAcknowledged: true,
    patientConsent: true,
    signature: 'Jane Doe',
  },
}

describe('buildSummaryText', () => {
  it('includes the patient full name', () => {
    const text = buildSummaryText(baseFormData, {})
    expect(text).toContain('Jane')
    expect(text).toContain('Doe')
  })

  it('includes insurance provider information', () => {
    const text = buildSummaryText(baseFormData, {})
    expect(text).toContain('BlueCross')
    expect(text).toContain('BC123456')
  })

  it('includes medical history fields', () => {
    const text = buildSummaryText(baseFormData, {})
    expect(text).toContain('Lower back pain')
    expect(text).toContain('Dr. Smith')
    expect(text).toContain('hypertension')
    expect(text).toContain('Metformin 500mg')
  })

  it('includes consent signature', () => {
    const text = buildSummaryText(baseFormData, {})
    expect(text).toContain('Jane Doe')
    expect(text).toContain('HIPAA Acknowledged: Yes')
    expect(text).toContain('Patient Consent: Yes')
  })

  it('includes OCR text for government ID when provided', () => {
    const text = buildSummaryText(baseFormData, { id: 'ID OCR text here' })
    expect(text).toContain('Government ID:')
    expect(text).toContain('ID OCR text here')
  })

  it('includes OCR text for insurance front when provided', () => {
    const text = buildSummaryText(baseFormData, { insuranceFront: 'FRONT OCR' })
    expect(text).toContain('Insurance Card (Front):')
    expect(text).toContain('FRONT OCR')
  })

  it('includes OCR text for insurance back when provided', () => {
    const text = buildSummaryText(baseFormData, { insuranceBack: 'BACK OCR' })
    expect(text).toContain('Insurance Card (Back):')
    expect(text).toContain('BACK OCR')
  })

  it('omits OCR sections when not provided', () => {
    const text = buildSummaryText(baseFormData, {})
    expect(text).not.toContain('Government ID:')
    expect(text).not.toContain('Insurance Card (Front):')
    expect(text).not.toContain('Insurance Card (Back):')
  })

  it('includes clinic header', () => {
    const text = buildSummaryText(baseFormData, {})
    expect(text).toContain('ADVANCE SPINE AND PAIN PHYSICAL THERAPY')
  })

  it('handles empty conditions array', () => {
    const data: IntakeFormData = {
      ...baseFormData,
      medicalHistory: { ...baseFormData.medicalHistory, conditions: [] },
    }
    const text = buildSummaryText(data, {})
    expect(text).toContain('None specified')
  })

  it('shows None when medications field is empty', () => {
    const data: IntakeFormData = {
      ...baseFormData,
      medicalHistory: { ...baseFormData.medicalHistory, medications: '' },
    }
    const text = buildSummaryText(data, {})
    expect(text).toContain('Current Medications: ')
  })

  it('includes address fields', () => {
    const text = buildSummaryText(baseFormData, {})
    expect(text).toContain('Princeton')
    expect(text).toContain('NJ')
    expect(text).toContain('08540')
  })
})
