import type { FocalPoint } from '@/data/types'

export type LayoutMode = 'desktop' | 'mobile'
export type Point = { x: number; y: number }
export type Edge = readonly [string, string]
export type Camera = { x: number; y: number; scale: number }
export type DustStar = { x: number; y: number; r: number; twinkle: number }

type Node = { id: string; position: FocalPoint }

/** Dimensoes do viewBox do SVG da constelacao em cada modo. */
export const VIEWBOX: Record<LayoutMode, { width: number; height: number }> = {
  desktop: { width: 1000, height: 520 },
  mobile: { width: 360, height: 1000 },
}

const MOBILE_PAD = { x: 30, y: 40 }
const DEFAULT_SHORTCUT_DISTANCE = 18
const DEFAULT_ZOOM = 1.6

/**
 * Converte uma posicao em % para coordenadas do viewBox.
 * No celular os eixos sao trocados: a constelacao corre de cima para baixo.
 */
export function toPoint(position: FocalPoint, mode: LayoutMode): Point {
  const box = VIEWBOX[mode]
  if (mode === 'desktop') {
    return { x: (position.x / 100) * box.width, y: (position.y / 100) * box.height }
  }
  const usableWidth = box.width - MOBILE_PAD.x * 2
  const usableHeight = box.height - MOBILE_PAD.y * 2
  return {
    x: MOBILE_PAD.x + (position.y / 100) * usableWidth,
    y: MOBILE_PAD.y + (position.x / 100) * usableHeight,
  }
}

function distance(a: FocalPoint, b: FocalPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/** Liga as memorias na ordem da historia e cria atalhos entre estrelas proximas. */
export function buildEdges(nodes: readonly Node[], shortcutDistance = DEFAULT_SHORTCUT_DISTANCE): Edge[] {
  const sequential: Edge[] = nodes.slice(1).map((node, i) => [nodes[i].id, node.id])
  const shortcuts: Edge[] = nodes.flatMap((a, i) =>
    nodes
      .slice(i + 2)
      .filter((b) => distance(a.position, b.position) < shortcutDistance)
      .map((b): Edge => [a.id, b.id]),
  )
  return [...sequential, ...shortcuts]
}

export function neighborsOf(id: string, edges: readonly Edge[]): string[] {
  return edges.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []))
}

/** PRNG pequeno e deterministico (mulberry32) para a poeira estelar. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateDust(seed: number, count: number): DustStar[] {
  const random = seededRandom(seed)
  return Array.from({ length: count }, () => ({
    x: random() * 100,
    y: random() * 100,
    r: 0.4 + random() * 1.1,
    twinkle: random(),
  }))
}

export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0
  return ((index % length) + length) % length
}

/** Translacao + escala para centralizar uma estrela (modo historia). */
export function cameraFor(position: FocalPoint | null, mode: LayoutMode, scale = DEFAULT_ZOOM): Camera {
  if (!position) return { x: 0, y: 0, scale: 1 }
  const box = VIEWBOX[mode]
  const point = toPoint(position, mode)
  return {
    x: (box.width / 2 - point.x) * scale,
    y: (box.height / 2 - point.y) * scale,
    scale,
  }
}
