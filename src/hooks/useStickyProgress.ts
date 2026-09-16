'use client'

import { useMotionValue, type MotionValue } from 'motion/react'
import { useEffect, type RefObject } from 'react'
import { stickyProgress } from '@/lib/scroll'

/** Progresso de rolagem de uma secao sticky, medido a cada quadro com rolagem. */
export function useStickyProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const progress = useMotionValue(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      progress.set(stickyProgress(rect.top, rect.height, window.innerHeight))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ref, progress])

  return progress
}
