import { describe, expect, it } from 'vitest'
import { futureYears, measuresFor, formatNumber } from '../format'
import { buildSrcSet, objectPosition, largestVariant } from '../photo'

describe('measuresFor', () => {
  it('converts days into hours and minutes', () => {
    expect(measuresFor(365)).toEqual({ days: 365, hours: 8760, minutes: 525600 })
  })
})

describe('formatNumber', () => {
  it('uses Brazilian thousand separators', () => {
    expect(formatNumber(525600)).toBe('525.600')
    expect(formatNumber(365)).toBe('365')
  })
})

describe('futureYears', () => {
  it('lists consecutive years from the start', () => {
    expect(futureYears(2026, 4)).toEqual([2026, 2027, 2028, 2029])
  })

  it('returns an empty list for non-positive counts', () => {
    expect(futureYears(2026, 0)).toEqual([])
  })
})

const variants = [
  { width: 480, src: '/a-480.webp' },
  { width: 1200, src: '/a-1200.webp' },
  { width: 828, src: '/a-828.webp' },
]

describe('buildSrcSet', () => {
  it('lists every variant with its width descriptor', () => {
    expect(buildSrcSet(variants)).toBe('/a-480.webp 480w, /a-1200.webp 1200w, /a-828.webp 828w')
  })
})

describe('largestVariant', () => {
  it('returns the widest file', () => {
    expect(largestVariant(variants).src).toBe('/a-1200.webp')
  })
})

describe('objectPosition', () => {
  it('turns a focal point into a CSS position', () => {
    expect(objectPosition({ x: 56, y: 40 })).toBe('56% 40%')
  })
})
