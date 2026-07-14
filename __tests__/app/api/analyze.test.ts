/**
 * Tests for the DecideAI /api/analyze route.
 * Anthropic SDK is mocked so no real API calls are made.
 */

// Mock the Anthropic SDK before importing the route
const mockCreate = jest.fn()
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  }))
})

// Mock Next.js server components
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server')
  return {
    ...actual,
    NextRequest: jest.fn(),
    NextResponse: {
      json: (data: unknown, init?: { status?: number }) => ({
        data,
        status: init?.status ?? 200,
      }),
    },
  }
})

import { POST } from '../../../app/api/analyze/route'

function makeRequest(body: unknown): any {
  return { json: async () => body }
}

const validApiResponse = {
  criteria: [
    { id: 'c1', name: 'Cost', description: 'Affordability', emoji: '💰', suggestedWeight: 8 },
    { id: 'c2', name: 'Speed', description: 'Time to ship', emoji: '⚡', suggestedWeight: 6 },
  ],
  options: [
    {
      id: 'o1',
      name: 'Option A',
      description: 'Build in-house',
      initialRatings: { c1: 5, c2: 8 },
    },
  ],
}

describe('POST /api/analyze', () => {
  beforeEach(() => {
    mockCreate.mockReset()
    process.env.ANTHROPIC_API_KEY = 'test-key'
  })

  it('returns 400 when question is missing', async () => {
    const response = await POST(makeRequest({}))
    expect(response.status).toBe(400)
    expect(response.data).toMatchObject({ error: 'Question is required' })
  })

  it('returns 400 when question is empty string', async () => {
    const response = await POST(makeRequest({ question: '   ' }))
    expect(response.status).toBe(400)
    expect(response.data).toMatchObject({ error: 'Question is required' })
  })

  it('calls Claude and returns parsed criteria + options on success', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validApiResponse) }],
    })

    const response = await POST(makeRequest({ question: 'Should I move to a new city?' }))

    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(200)
    expect(response.data).toMatchObject({
      criteria: expect.arrayContaining([
        expect.objectContaining({ id: 'c1', name: 'Cost' }),
      ]),
      options: expect.arrayContaining([
        expect.objectContaining({ name: 'Option A' }),
      ]),
    })
  })

  it('extracts JSON even when Claude wraps it in prose', async () => {
    const wrapped = `Sure! Here's the analysis:\n${JSON.stringify(validApiResponse)}\nLet me know if you want more.`
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: wrapped }],
    })

    const response = await POST(makeRequest({ question: 'Career change?' }))
    expect(response.status).toBe(200)
    expect(response.data.criteria).toHaveLength(2)
  })

  it('returns 500 when Claude response contains no JSON', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'I cannot help with that.' }],
    })

    const response = await POST(makeRequest({ question: 'Career change?' }))
    expect(response.status).toBe(500)
    expect(response.data).toMatchObject({ error: 'Analysis failed' })
  })

  it('returns 500 when Anthropic SDK throws', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Rate limit exceeded'))

    const response = await POST(makeRequest({ question: 'Career change?' }))
    expect(response.status).toBe(500)
    expect(response.data).toMatchObject({ error: 'Analysis failed' })
  })

  it('includes the question in the prompt sent to Claude', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: JSON.stringify(validApiResponse) }],
    })

    const question = 'Should I accept the job offer in Seattle?'
    await POST(makeRequest({ question }))

    const calledWith = mockCreate.mock.calls[0][0]
    const promptText = calledWith.messages[0].content as string
    expect(promptText).toContain(question)
  })
})
