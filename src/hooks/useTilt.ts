'use client'

import { useMotionValue, useSpring, useTransform, type MotionStyle } from 'motion/react'
import { useCallback, type PointerEvent } from 'react'
import { useFinePointer } from './useMediaQuery'

const MAX_TILT_DEG = 5
const SPRING = { stiffness: 120, damping: 18, mass: 0.6 }

/**
 * Inclinacao minima que segue o cursor (apenas mouse).
 * Tambem expoe --spot-x/--spot-y para um brilho que acompanha o ponteiro.
 */
export function useTilt(maxDeg = MAX_TILT_DEG) {
  const enabled = useFinePointer()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, SPRING)
  const sy = useSpring(py, SPRING)
  const rotateX = useTransform(sy, [0, 1], [maxDeg, -maxDeg])
  const rotateY = useTransform(sx, [0, 1], [-maxDeg, maxDeg])
  const spotX = useTransform(sx, (v) => `${v * 100}%`)
  const spotY = useTransform(sy, (v) => `${v * 100}%`)

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!enabled) return
      const rect = event.currentTarget.getBoundingClientRect()
      px.set((event.clientX - rect.left) / rect.width)
      py.set((event.clientY - rect.top) / rect.height)
    },
    [enabled, px, py],
  )

  const onPointerLeave = useCallback(() => {
    px.set(0.5)
    py.set(0.5)
  }, [px, py])

  const style: MotionStyle = enabled
    ? { rotateX, rotateY, transformPerspective: 900, '--spot-x': spotX, '--spot-y': spotY } as MotionStyle
    : {}

  return { style, handlers: enabled ? { onPointerMove, onPointerLeave } : {} }
}
