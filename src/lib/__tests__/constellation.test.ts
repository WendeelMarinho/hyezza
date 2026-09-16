import { describe, expect, it } from 'vitest'
import {
  buildEdges,
  cameraFor,
  generateDust,
  neighborsOf,
  toPoint,
  wrapIndex,
  type LayoutMode,
} from '../constellation'

const nodes = [
  { id: 'a', position: { x: 0, y: 0 } },
  { id: 'b', position: { x: 10, y: 10 } },
  { id: 'c', position: { x: 20, y: 0 } },
  { id: 'd', position: { x: 90, y: 90 } },
]

describe('toPoint', () => {
  it('maps percentages into the desktop viewBox', () => {
    expect(toPoint({ x: 50, y: 25 }, 'desktop')).toEqual({ x: 500, y: 130 })
  })

  it('transposes axes on mobile so the map flows vertically', () => {
    const mode: LayoutMode = 'mobile'
    expect(toPoint({ x: 100, y: 0 }, mode)).toEqual({ x: 30, y: 960 })
    expect(toPoint({ x: 0, y: 100 }, mode)).toEqual({ x: 330, y: 40 })
  })
})

describe('buildEdges', () => {
  it('links every node to the next one in story order', () => {
    const edges = buildEdges(nodes)
    expect(edges).toContainEqual(['a', 'b'])
    expect(edges).toContainEqual(['b', 'c'])
    expect(edges).toContainEqual(['c', 'd'])
  })

  it('adds a shortcut between close non-adjacent nodes only', () => {
    const edges = buildEdges(nodes, 25)
    expect(edges).toContainEqual(['a', 'c'])
    expect(edges).not.toContainEqual(['a', 'd'])
  })

  it('returns no edges for fewer than two nodes', () => {
    expect(buildEdges([])).toEqual([])
    expect(buildEdges(nodes.slice(0, 1))).toEqual([])
  })
})

describe('neighborsOf', () => {
  it('returns ids connected in either direction', () => {
    const edges = buildEdges(nodes, 25)
    expect(neighborsOf('c', edges).sort()).toEqual(['a', 'b', 'd'])
  })
})

describe('generateDust', () => {
  it('is deterministic for the same seed', () => {
    expect(generateDust(7, 5)).toEqual(generateDust(7, 5))
  })

  it('keeps every star inside 0–100 with a positive radius', () => {
    const dust = generateDust(3, 200)
    expect(dust).toHaveLength(200)
    for (const star of dust) {
      expect(star.x).toBeGreaterThanOrEqual(0)
      expect(star.x).toBeLessThanOrEqual(100)
      expect(star.y).toBeGreaterThanOrEqual(0)
      expect(star.y).toBeLessThanOrEqual(100)
      expect(star.r).toBeGreaterThan(0)
    }
  })
})

describe('wrapIndex', () => {
  it('wraps forwards and backwards', () => {
    expect(wrapIndex(3, 3)).toBe(0)
    expect(wrapIndex(-1, 3)).toBe(2)
    expect(wrapIndex(1, 3)).toBe(1)
  })

  it('returns 0 for an empty list', () => {
    expect(wrapIndex(5, 0)).toBe(0)
  })
})

describe('cameraFor', () => {
  it('returns the identity camera when nothing is focused', () => {
    expect(cameraFor(null, 'desktop')).toEqual({ x: 0, y: 0, scale: 1 })
  })

  it('centers the focused point in the viewBox', () => {
    const cam = cameraFor({ x: 50, y: 50 }, 'desktop', 1.5)
    expect(cam.scale).toBe(1.5)
    expect(cam.x).toBeCloseTo(0)
    expect(cam.y).toBeCloseTo(0)
  })

  it('moves the camera opposite to an off-center point', () => {
    const cam = cameraFor({ x: 90, y: 50 }, 'desktop', 1.5)
    expect(cam.x).toBeLessThan(0)
  })
})
