import { describe, expect, it } from 'vitest'
import { hero, letter, pause, qualities, future, navigation, sideIndex } from '../content'
import { memories, constellationWords } from '../memories'
import { isPhotoSlug, photos, getPhoto } from '../photos'
import { photoAssets } from '../photo-assets.generated'
import { formatNumber, measuresFor } from '@/lib/format'

const inRange = (n: number) => n >= 0 && n <= 100

describe('memories', () => {
  it('have unique ids', () => {
    const ids = memories.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only reference existing photos', () => {
    for (const memory of memories) {
      if (memory.photo) expect(isPhotoSlug(memory.photo), memory.id).toBe(true)
    }
  })

  it('only pin memories that have a photo', () => {
    for (const memory of memories.filter((m) => m.pinned)) {
      expect(memory.photo, memory.id).toBeDefined()
    }
  })

  it('stay inside the map', () => {
    for (const item of [...memories, ...constellationWords]) {
      expect(inRange(item.position.x) && inRange(item.position.y)).toBe(true)
    }
  })
})

describe('photos', () => {
  it('describe every generated asset and nothing else', () => {
    expect(Object.keys(photos).sort()).toEqual(Object.keys(photoAssets).sort())
  })

  it('have alt text and valid focal points', () => {
    for (const slug of Object.keys(photos) as (keyof typeof photos)[]) {
      const photo = getPhoto(slug)
      expect(photo.alt.length).toBeGreaterThan(10)
      expect(inRange(photo.focus.x) && inRange(photo.focus.y)).toBe(true)
      expect(photo.variants.length).toBeGreaterThan(0)
    }
  })

  it('rejects unknown slugs', () => {
    expect(isPhotoSlug('nao-existe')).toBe(false)
  })

  it('are referenced by content only with valid slugs', () => {
    const refs = [hero.photo, letter.photo, pause.photo, future.photo, qualities.portrait]
    const cardRefs = qualities.cards.flatMap((c) => (c.photo ? [c.photo] : []))
    for (const ref of [...refs, ...cardRefs]) expect(isPhotoSlug(ref), ref).toBe(true)
  })
})

describe('content', () => {
  it('keeps the pause measures consistent with one year', () => {
    const { days, hours, minutes } = measuresFor(365)
    expect(pause.measures).toEqual([
      `${formatNumber(days)} dias.`,
      `${formatNumber(hours)} horas.`,
      `${formatNumber(minutes)} minutos.`,
    ])
  })

  it('lists every main section in the navigation exactly once', () => {
    const ids = navigation.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids[0]).toBe('inicio')
    expect(sideIndex.length).toBeGreaterThan(0)
  })
})
