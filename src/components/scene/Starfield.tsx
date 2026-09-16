'use client'

import { useEffect, useRef } from 'react'
import { useExperience } from '@/components/experience/ExperienceContext'

type Star = { x: number; y: number; z: number; size: number; phase: number; hue: number }

const MAX_STARS = 320
const PIXELS_PER_STAR = 5200
const MAX_DPR = 1.5
const BASE_SPEED = 0.00005
const POINTER_PARALLAX = 14
const SCROLL_PARALLAX = 0.04
const WARP_EASE = 0.05
/** Variacao de area abaixo disso (ex.: barra do navegador no celular) nao recria as estrelas. */
const RESEED_AREA_CHANGE = 0.25

function createStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random(),
    size: Math.random() ** 3 * 1.4 + 0.35,
    phase: Math.random() * Math.PI * 2,
    hue: Math.random() < 0.18 ? 255 : 225,
  }))
}

/**
 * Ceu em canvas 2D: estrelas em profundidade que cintilam, reagem ao cursor e
 * se esticam em "dobra espacial" quando warpRef aumenta.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { warpRef } = useExperience()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let seededArea = 1
    let width = 0
    let height = 0
    let frame = 0
    let speed = 1
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const area = width * height
      if (stars.length === 0 || Math.abs(area - seededArea) / seededArea > RESEED_AREA_CHANGE) {
        seededArea = area
        stars = createStars(Math.min(MAX_STARS, Math.round(area / PIXELS_PER_STAR)))
      }
    }

    const draw = (time: number) => {
      speed += (warpRef.current - speed) * WARP_EASE
      pointer.x += (pointer.tx - pointer.x) * 0.04
      pointer.y += (pointer.ty - pointer.y) * 0.04
      const scrollShift = window.scrollY * SCROLL_PARALLAX
      const cx = width / 2
      const cy = height / 2
      const scale = Math.max(width, height) * 0.6
      const streak = Math.min((speed - 1) * 3, 60)

      ctx.clearRect(0, 0, width, height)
      for (const star of stars) {
        if (!reduceMotion) {
          star.z -= BASE_SPEED * speed * 16
          if (star.z <= 0.02) {
            star.z = 1
            star.x = Math.random() * 2 - 1
            star.y = Math.random() * 2 - 1
          }
        }
        const depth = 1 - star.z
        const px = cx + (star.x / (star.z + 0.35)) * scale * 0.35 + pointer.x * POINTER_PARALLAX * depth
        const py =
          cy + (star.y / (star.z + 0.35)) * scale * 0.35 + pointer.y * POINTER_PARALLAX * depth - ((scrollShift * depth) % height)
        const y = ((py % height) + height) % height
        if (px < -20 || px > width + 20) continue

        const twinkle = reduceMotion ? 0.8 : 0.55 + Math.sin(time * 0.0012 + star.phase) * 0.45
        const alpha = Math.min(1, (0.25 + depth * 0.9) * twinkle)
        const radius = star.size * (0.6 + depth * 1.1)
        ctx.fillStyle = `hsla(${star.hue}, 80%, 92%, ${alpha})`

        if (streak > 1) {
          const dx = px - cx
          const dy = y - cy
          const len = Math.hypot(dx, dy) || 1
          ctx.strokeStyle = ctx.fillStyle
          ctx.lineWidth = radius
          ctx.beginPath()
          ctx.moveTo(px, y)
          ctx.lineTo(px - (dx / len) * streak * depth, y - (dy / len) * streak * depth)
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(px, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      frame = requestAnimationFrame(draw)
    }

    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / width - 0.5) * 2
      pointer.ty = (event.clientY / height - 0.5) * 2
    }
    const onVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden) frame = requestAnimationFrame(draw)
    }

    resize()
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [warpRef])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 size-full" />
}
