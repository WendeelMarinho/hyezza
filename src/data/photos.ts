/**
 * Catalogo de fotos com funcao narrativa.
 *
 * Para adicionar uma foto nova:
 *  1. coloque o arquivo em imgs/
 *  2. registre em scripts/photo-sources.json (slug + rotacao)
 *  3. rode `npm run images`
 *  4. descreva a foto aqui (o slug precisa ser o mesmo)
 *
 * `focus` e o ponto (em %) que deve ficar visivel quando a foto e recortada
 * — normalmente entre os rostos.
 */
import { photoAssets, type PhotoSlug } from './photo-assets.generated'
import type { PhotoAsset, PhotoMeta } from './types'

export type { PhotoSlug }

export const photos = {
  'selfie-ceu-cosmico': {
    kind: 'stylized',
    roles: ['hero', 'future'],
    sections: ['inicio'],
    title: 'Nosso universo pela janela',
    alt: 'Hyezza e Wendeel abraçados diante de uma janela com um planeta ao fundo',
    mood: ['cosmic', 'intimate'],
    featured: true,
    focus: { x: 56, y: 40 },
    focusMobile: { x: 58, y: 36 },
  },
  'romance-cosmico-neon': {
    kind: 'stylized',
    roles: ['hero', 'future'],
    sections: ['futuro'],
    title: 'Coração de neon',
    alt: 'Hyezza e Wendeel sentados juntos sob um coração de luz neon',
    mood: ['neon', 'cosmic'],
    featured: true,
    focus: { x: 58, y: 44 },
  },
  'luzes-noturnas': {
    kind: 'stylized',
    roles: ['future', 'intimate'],
    sections: ['year-two'],
    title: 'Sob as luzes da noite',
    alt: 'Wendeel abraçando Hyezza entre velas e luzes noturnas',
    mood: ['intimate', 'cosmic'],
    featured: true,
    focus: { x: 58, y: 30 },
  },
  'selfie-neon-futurista': {
    kind: 'stylized',
    roles: ['memory'],
    sections: ['memorias'],
    title: 'Cidade acesa',
    alt: 'Selfie de Hyezza e Wendeel com uma cidade iluminada e a lua ao fundo',
    mood: ['urban', 'neon'],
    featured: false,
    focus: { x: 55, y: 55 },
  },
  'reflexos-futuristas': {
    kind: 'stylized',
    roles: ['memory'],
    sections: ['memorias'],
    title: 'Reflexos',
    alt: 'Hyezza e Wendeel fazendo uma selfie no espelho em um corredor de luzes',
    mood: ['neon', 'urban'],
    featured: false,
    focus: { x: 45, y: 22 },
  },
  'neon-azul-roxo': {
    kind: 'stylized',
    roles: ['memory'],
    sections: ['memorias'],
    title: 'Azul e roxo',
    alt: 'Hyezza encostada em Wendeel em uma selfie entre luzes azuis e roxas',
    mood: ['neon', 'intimate'],
    featured: false,
    focus: { x: 50, y: 22 },
  },
  'aconchego-entardecer': {
    kind: 'stylized',
    roles: ['memory', 'portrait'],
    sections: ['memorias', 'voce'],
    title: 'Entardecer',
    alt: 'Hyezza enrolada em uma manta, sentada à beira de um córrego ao entardecer',
    mood: ['warm', 'golden'],
    featured: false,
    focus: { x: 42, y: 52 },
  },
  'devaneio-dourado': {
    kind: 'stylized',
    roles: ['memory', 'portrait'],
    sections: ['memorias', 'voce'],
    title: 'Devaneio dourado',
    alt: 'Hyezza sorrindo com uma taça na mão, entre folhas e luz dourada',
    mood: ['golden', 'dreamy'],
    featured: false,
    focus: { x: 45, y: 38 },
  },
  'refugio-luzes-noturnas': {
    kind: 'stylized',
    roles: ['portrait', 'intimate'],
    sections: ['voce'],
    title: 'Refúgio',
    alt: 'Hyezza deitada sobre uma manta azul, apoiando o rosto nas mãos',
    mood: ['intimate', 'dreamy'],
    featured: true,
    focus: { x: 56, y: 40 },
  },
  'luzes-violetas': {
    kind: 'stylized',
    roles: ['intimate', 'ambient'],
    sections: ['pausa', 'voce'],
    title: 'Luzes violetas',
    alt: 'Hyezza olhando para cima, abraçando uma almofada sob luzes violetas',
    mood: ['intimate', 'dreamy'],
    featured: true,
    focus: { x: 46, y: 30 },
  },
} as const satisfies Record<PhotoSlug, PhotoMeta>

export type Photo = PhotoMeta & PhotoAsset & { readonly slug: PhotoSlug }

export function isPhotoSlug(value: string): value is PhotoSlug {
  return Object.hasOwn(photoAssets, value)
}

export function getPhoto(slug: PhotoSlug): Photo {
  return { slug, ...photos[slug], ...photoAssets[slug] }
}
