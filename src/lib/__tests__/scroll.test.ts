import { describe, expect, it } from 'vitest'
import { stickyProgress } from '../scroll'

describe('stickyProgress', () => {
  it('is 0 before the section reaches the top', () => {
    expect(stickyProgress(200, 3000, 800)).toBe(0)
  })

  it('grows linearly while the section is pinned', () => {
    expect(stickyProgress(-1100, 3000, 800)).toBeCloseTo(0.5)
  })

  it('is 1 once the section has scrolled past', () => {
    expect(stickyProgress(-5000, 3000, 800)).toBe(1)
  })

  it('returns 0 when the section is not taller than the viewport', () => {
    expect(stickyProgress(-100, 600, 800)).toBe(0)
  })
})
