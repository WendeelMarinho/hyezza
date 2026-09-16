'use client'

import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect } from 'react'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { Starfield } from './Starfield'

/** Camadas fixas de fundo: nebulosas, estrelas, brilho do cursor e grao. */
export function Backdrop() {
  const fine = useFinePointer()
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 60, damping: 20 })
  const sy = useSpring(y, { stiffness: 60, damping: 20 })

  useEffect(() => {
    if (!fine) return
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine, x, y])

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#0c1330_0%,#060a18_45%,#03050c_100%)]" />
        <div className="absolute -top-[20%] left-[10%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgb(90_100_210/0.16),transparent)] blur-3xl" />
        <div className="absolute top-[40%] -right-[15%] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(closest-side,rgb(140_110_230/0.1),transparent)] blur-3xl" />
      </div>
      <Starfield />
      {fine && (
        <motion.div
          aria-hidden
          style={{ x: sx, y: sy }}
          className="pointer-events-none fixed top-0 left-0 z-[1] -mt-[180px] -ml-[180px] size-[360px] rounded-full bg-[radial-gradient(closest-side,rgb(150_170_255/0.09),transparent)]"
        />
      )}
      <div aria-hidden className="grain" />
    </>
  )
}
