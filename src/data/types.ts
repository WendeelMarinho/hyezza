export type PhotoVariant = { readonly width: number; readonly src: string }

/** Gerado automaticamente por scripts/process-images.mjs */
export type PhotoAsset = {
  readonly width: number
  readonly height: number
  readonly variants: readonly PhotoVariant[]
  readonly placeholder: string
}

export type PhotoKind = 'original' | 'stylized'
export type PhotoRole = 'hero' | 'memory' | 'portrait' | 'ambient' | 'future' | 'intimate'
export type PhotoMood = 'cosmic' | 'neon' | 'warm' | 'dreamy' | 'intimate' | 'golden' | 'urban'
export type SectionId = 'inicio' | 'historia' | 'memorias' | 'voce' | 'pausa' | 'futuro' | 'year-two'

/** Ponto focal em % (0–100). Usado como object-position para nao cortar rostos. */
export type FocalPoint = { readonly x: number; readonly y: number }

export type PhotoMeta = {
  readonly kind: PhotoKind
  readonly roles: readonly PhotoRole[]
  readonly sections: readonly SectionId[]
  readonly title: string
  readonly alt: string
  readonly mood: readonly PhotoMood[]
  readonly featured: boolean
  readonly focus: FocalPoint
  /** Ponto focal alternativo para telas estreitas (celular). */
  readonly focusMobile?: FocalPoint
}

export type MemoryCategory = 'nossas' | 'em-voce' | 'futuro'

export type Memory = {
  readonly id: string
  readonly title: string
  /** Texto livre exibido no cartao, ex.: "12 MAR 2026". null = sem data. */
  readonly date: string | null
  readonly caption: string
  readonly category: MemoryCategory
  /** Slug de uma foto em photos.ts (opcional). */
  readonly photo?: string
  /** Posicao na constelacao (desktop), em % da largura/altura. */
  readonly position: FocalPoint
  /** Mostrar a miniatura da foto diretamente no mapa (desktop). */
  readonly pinned?: boolean
  /** Lado da miniatura no celular (padrao: automatico). */
  readonly pinSideMobile?: 'left' | 'right'
}

export type ConstellationWord = { readonly text: string; readonly position: FocalPoint }
