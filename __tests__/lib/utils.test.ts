import { calculateWeightedScores, getScoreColor, getScoreBg } from '../../lib/utils'
import type { Criterion, DecisionOption } from '../../lib/types'

// ── calculateWeightedScores ──────────────────────────────────────────────────

describe('calculateWeightedScores', () => {
  const criteria: Criterion[] = [
    { id: 'c1', name: 'Cost', description: '', emoji: '💰', weight: 6, suggestedWeight: 6 },
    { id: 'c2', name: 'Speed', description: '', emoji: '⚡', weight: 4, suggestedWeight: 4 },
  ]

  const options: DecisionOption[] = [
    { id: 'o1', name: 'Option A', description: '', scores: { c1: 8, c2: 6 } },
    { id: 'o2', name: 'Option B', description: '', scores: { c1: 4, c2: 9 } },
  ]

  it('returns one result per option', () => {
    const results = calculateWeightedScores(criteria, options)
    expect(results).toHaveLength(2)
  })

  it('calculates weighted total correctly', () => {
    // totalWeight = 10; Option A: (8*6 + 6*4) / 10 = (48+24)/10 = 7.2
    const results = calculateWeightedScores(criteria, options)
    const optionA = results.find(r => r.optionId === 'o1')!
    expect(optionA.totalScore).toBe(7.2)
  })

  it('sorts results descending by totalScore', () => {
    const results = calculateWeightedScores(criteria, options)
    expect(results[0].totalScore).toBeGreaterThanOrEqual(results[1].totalScore)
  })

  it('computes percentage as (totalScore / 10) * 100', () => {
    const results = calculateWeightedScores(criteria, options)
    const optionA = results.find(r => r.optionId === 'o1')!
    expect(optionA.percentage).toBe(Math.round((optionA.totalScore / 10) * 100))
  })

  it('includes per-criterion breakdown', () => {
    const results = calculateWeightedScores(criteria, options)
    const optionA = results.find(r => r.optionId === 'o1')!
    expect(optionA.breakdown).toHaveLength(2)
    const costBreakdown = optionA.breakdown.find(b => b.criterionId === 'c1')!
    expect(costBreakdown.raw).toBe(8)
  })

  it('treats missing criterion scores as 0', () => {
    const sparseOptions: DecisionOption[] = [
      { id: 'o1', name: 'Sparse', description: '', scores: {} },
    ]
    const results = calculateWeightedScores(criteria, sparseOptions)
    expect(results[0].totalScore).toBe(0)
  })

  it('handles zero total weight without dividing by zero', () => {
    const zeroCriteria: Criterion[] = [
      { id: 'c1', name: 'X', description: '', emoji: '❓', weight: 0, suggestedWeight: 0 },
    ]
    const results = calculateWeightedScores(zeroCriteria, options)
    results.forEach(r => expect(r.totalScore).toBe(0))
  })

  it('returns empty array when no options provided', () => {
    expect(calculateWeightedScores(criteria, [])).toEqual([])
  })

  it('handles single criterion and single option', () => {
    const singleCrit: Criterion[] = [
      { id: 'c1', name: 'X', description: '', emoji: '⭐', weight: 10, suggestedWeight: 10 },
    ]
    const singleOpt: DecisionOption[] = [
      { id: 'o1', name: 'Only', description: '', scores: { c1: 7 } },
    ]
    const results = calculateWeightedScores(singleCrit, singleOpt)
    expect(results[0].totalScore).toBe(7)
    expect(results[0].percentage).toBe(70)
  })

  it('rounds totalScore to 2 decimal places', () => {
    const crits: Criterion[] = [
      { id: 'c1', name: 'A', description: '', emoji: '🔹', weight: 3, suggestedWeight: 3 },
      { id: 'c2', name: 'B', description: '', emoji: '🔸', weight: 7, suggestedWeight: 7 },
    ]
    const opts: DecisionOption[] = [
      { id: 'o1', name: 'X', description: '', scores: { c1: 5, c2: 5 } },
    ]
    const results = calculateWeightedScores(crits, opts)
    const decimals = results[0].totalScore.toString().split('.')[1]
    expect(!decimals || decimals.length <= 2).toBe(true)
  })
})

// ── getScoreColor ────────────────────────────────────────────────────────────

describe('getScoreColor', () => {
  it('returns emerald for score >= 7.5', () => {
    expect(getScoreColor(7.5)).toBe('text-emerald-400')
    expect(getScoreColor(10)).toBe('text-emerald-400')
  })

  it('returns amber for score >= 5 and < 7.5', () => {
    expect(getScoreColor(5)).toBe('text-amber-400')
    expect(getScoreColor(7.4)).toBe('text-amber-400')
  })

  it('returns rose for score < 5', () => {
    expect(getScoreColor(0)).toBe('text-rose-400')
    expect(getScoreColor(4.9)).toBe('text-rose-400')
  })
})

// ── getScoreBg ───────────────────────────────────────────────────────────────

describe('getScoreBg', () => {
  it('returns emerald background for score >= 7.5', () => {
    expect(getScoreBg(8)).toBe('bg-emerald-500/20 border-emerald-500/30')
  })

  it('returns amber background for score in [5, 7.5)', () => {
    expect(getScoreBg(6)).toBe('bg-amber-500/20 border-amber-500/30')
  })

  it('returns rose background for score < 5', () => {
    expect(getScoreBg(3)).toBe('bg-rose-500/20 border-rose-500/30')
  })
})
