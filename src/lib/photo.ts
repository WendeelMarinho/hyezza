import type { FocalPoint, PhotoVariant } from '@/data/types'

export function buildSrcSet(variants: readonly PhotoVariant[]): string {
  return variants.map((v) => `${v.src} ${v.width}w`).join(', ')
}

export function largestVariant(variants: readonly PhotoVariant[]): PhotoVariant {
  return variants.reduce((best, v) => (v.width > best.width ? v : best))
}

export function objectPosition(focus: FocalPoint): string {
  return `${focus.x}% ${focus.y}%`
}
