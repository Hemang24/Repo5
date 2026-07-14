import {
  formatDate,
  formatShortDate,
  getTodayString,
  getGreeting,
  getMoodEmoji,
  getMoodLabel,
} from '../../../src/lib/utils/date'

// ── formatDate ───────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats a known date to long weekday + month + day', () => {
    // 2024-01-15 is a Monday
    const result = formatDate('2024-01-15')
    expect(result).toMatch(/Monday/)
    expect(result).toMatch(/January/)
    expect(result).toMatch(/15/)
  })

  it('handles end of month correctly', () => {
    const result = formatDate('2024-01-31')
    expect(result).toMatch(/31/)
    expect(result).toMatch(/January/)
  })

  it('does not shift dates due to UTC/local timezone mismatch', () => {
    // The implementation appends T00:00:00 to prevent UTC-shift off-by-one
    const result = formatDate('2024-03-01')
    expect(result).toMatch(/March/)
    expect(result).toMatch(/1/)
  })
})

// ── formatShortDate ──────────────────────────────────────────────────────────

describe('formatShortDate', () => {
  it('formats a date to short month + day', () => {
    const result = formatShortDate('2024-06-05')
    expect(result).toMatch(/Jun/)
    expect(result).toMatch(/5/)
  })

  it('does not include the year', () => {
    const result = formatShortDate('2024-06-05')
    expect(result).not.toMatch(/2024/)
  })
})

// ── getTodayString ───────────────────────────────────────────────────────────

describe('getTodayString', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const today = getTodayString()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('matches the current date', () => {
    const today = getTodayString()
    const expected = new Date().toISOString().split('T')[0]
    expect(today).toBe(expected)
  })
})

// ── getGreeting ───────────────────────────────────────────────────────────────

describe('getGreeting', () => {
  const RealDate = Date

  afterEach(() => {
    jest.restoreAllMocks()
  })

  function mockHour(hour: number) {
    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        const d = new RealDate()
        d.getHours = () => hour
        return d
      }
      return new RealDate(...(args as []))
    })
  }

  it('returns Good morning before noon', () => {
    mockHour(8)
    expect(getGreeting('Alex')).toBe('Good morning, Alex')
  })

  it('returns Good afternoon from noon to 5 pm', () => {
    mockHour(13)
    expect(getGreeting('Alex')).toBe('Good afternoon, Alex')
  })

  it('returns Good evening from 5 pm onward', () => {
    mockHour(18)
    expect(getGreeting('Alex')).toBe('Good evening, Alex')
  })

  it('includes the provided name', () => {
    mockHour(9)
    expect(getGreeting('Jordan')).toContain('Jordan')
  })
})

// ── getMoodEmoji ──────────────────────────────────────────────────────────────

describe('getMoodEmoji', () => {
  it('returns 😔 for score <= 2', () => {
    expect(getMoodEmoji(1)).toBe('😔')
    expect(getMoodEmoji(2)).toBe('😔')
  })

  it('returns 😕 for score 3-4', () => {
    expect(getMoodEmoji(3)).toBe('😕')
    expect(getMoodEmoji(4)).toBe('😕')
  })

  it('returns 😐 for score 5-6', () => {
    expect(getMoodEmoji(5)).toBe('😐')
    expect(getMoodEmoji(6)).toBe('😐')
  })

  it('returns 🙂 for score 7-8', () => {
    expect(getMoodEmoji(7)).toBe('🙂')
    expect(getMoodEmoji(8)).toBe('🙂')
  })

  it('returns 😄 for score 9-10', () => {
    expect(getMoodEmoji(9)).toBe('😄')
    expect(getMoodEmoji(10)).toBe('😄')
  })
})

// ── getMoodLabel ──────────────────────────────────────────────────────────────

describe('getMoodLabel', () => {
  it('labels scores 1-2 as Rough', () => {
    expect(getMoodLabel(1)).toBe('Rough')
    expect(getMoodLabel(2)).toBe('Rough')
  })

  it('labels scores 3-4 as Low', () => {
    expect(getMoodLabel(3)).toBe('Low')
    expect(getMoodLabel(4)).toBe('Low')
  })

  it('labels scores 5-6 as Okay', () => {
    expect(getMoodLabel(5)).toBe('Okay')
    expect(getMoodLabel(6)).toBe('Okay')
  })

  it('labels scores 7-8 as Good', () => {
    expect(getMoodLabel(7)).toBe('Good')
    expect(getMoodLabel(8)).toBe('Good')
  })

  it('labels scores 9-10 as Great', () => {
    expect(getMoodLabel(9)).toBe('Great')
    expect(getMoodLabel(10)).toBe('Great')
  })
})
