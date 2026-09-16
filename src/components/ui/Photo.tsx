/* eslint-disable @next/next/no-img-element -- as variantes WebP ja sao geradas por scripts/process-images.mjs */
'use client'

import { useState, type CSSProperties } from 'react'
import { getPhoto, type PhotoSlug } from '@/data/photos'
import { buildSrcSet, largestVariant, objectPosition } from '@/lib/photo'

type PhotoProps = {
  slug: PhotoSlug
  /** Atributo sizes do <img>, ex.: "(min-width: 1024px) 40vw, 100vw" */
  sizes: string
  className?: string
  imgClassName?: string
  priority?: boolean
  /** Revelacao ao carregar: desfoque + leve zoom saindo. */
  reveal?: boolean
  decorative?: boolean
  style?: CSSProperties
}

/**
 * Foto responsiva com placeholder borrado e recorte guiado pelo ponto focal.
 * O ponto focal de celular entra via CSS var para evitar diferenca de hidratacao.
 */
export function Photo({
  slug,
  sizes,
  className = '',
  imgClassName = '',
  priority = false,
  reveal = true,
  decorative = false,
  style,
}: PhotoProps) {
  const photo = getPhoto(slug)
  const [loaded, setLoaded] = useState(false)
  const position = {
    '--focus': objectPosition(photo.focus),
    '--focus-mobile': objectPosition(photo.focusMobile ?? photo.focus),
  } as CSSProperties

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        backgroundImage: `url(${photo.placeholder})`,
        backgroundSize: 'cover',
        backgroundPosition: objectPosition(photo.focus),
      }}
    >
      <img
        ref={(node) => {
          if (node?.complete && node.naturalWidth > 0) setLoaded(true)
        }}
        src={largestVariant(photo.variants).src}
        srcSet={buildSrcSet(photo.variants)}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={decorative ? '' : photo.alt}
        aria-hidden={decorative || undefined}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        draggable={false}
        style={position}
        className={`h-full w-full object-cover [object-position:var(--focus-mobile)] lg:[object-position:var(--focus)] ${
          reveal ? 'transition-[opacity,filter,transform] duration-[1600ms] ease-cinema' : ''
        } ${loaded || !reveal ? 'opacity-100 blur-0' : 'scale-[1.06] opacity-0 blur-xl'} ${imgClassName}`}
      />
    </div>
  )
}
