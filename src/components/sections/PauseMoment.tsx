'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { pause } from '@/data/content'
import { Photo } from '@/components/ui/Photo'
import { useStickyProgress } from '@/hooks/useStickyProgress'

/** Faixas de rolagem (0–1) em que cada frase entra e sai. */
const MEASURE_IN = [
  [0.04, 0.12],
  [0.14, 0.22],
  [0.24, 0.32],
] as const
const MEASURES_OUT = [0.4, 0.47] as const
const CONFESSION = [0.5, 0.57, 0.68, 0.74] as const
const CLOSING = [0.79, 0.87] as const

function useBlurFade(progress: MotionValue<number>, input: readonly number[], output: number[]) {
  const opacity = useTransform(progress, [...input], output)
  const filter = useTransform(opacity, (o) => `blur(${(1 - o) * 12}px)`)
  const y = useTransform(opacity, (o) => (1 - o) * 14)
  return { opacity, filter, y }
}

function Measure({ progress, index, text }: { progress: MotionValue<number>; index: number; text: string }) {
  const [start, end] = MEASURE_IN[index]
  const style = useBlurFade(progress, [start, end, MEASURES_OUT[0], MEASURES_OUT[1]], [0, 1, 1, 0])
  return (
    <motion.p style={style} className="title-gradient font-display text-5xl leading-[1.15] font-light tabular-nums sm:text-6xl lg:text-7xl">
      {text}
    </motion.p>
  )
}

export function PauseMoment() {
  const ref = useRef<HTMLElement>(null)
  const p = useStickyProgress(ref)

  const confession = useBlurFade(p, CONFESSION, [0, 1, 1, 0])
  const closing = useBlurFade(p, CLOSING, [0, 1])
  const photoOpacity = useTransform(p, [0, 0.2, 0.5, 0.78, 0.95], [0, 0.12, 0.08, 0.26, 0.4])
  const photoBlur = useTransform(p, [0, 0.78, 0.95], ['blur(22px)', 'blur(14px)', 'blur(2px)'])
  const photoScale = useTransform(p, [0, 1], [1.22, 1])

  return (
    <section id="pausa" ref={ref} aria-label="Pausa" className="relative h-[560svh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.div aria-hidden style={{ opacity: photoOpacity, filter: photoBlur, scale: photoScale }} className="absolute inset-0">
          <Photo slug={pause.photo} sizes="100vw" decorative reveal={false} className="size-full" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent,#03050c_85%)]" />
          <div className="absolute inset-x-0 top-1/2 h-[46%] -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(3_5_12/0.8),transparent)]" />
        </motion.div>

        <div className="section-pad relative grid w-full place-items-center text-center">
          <div className="col-start-1 row-start-1 space-y-3 sm:space-y-5">
            {pause.measures.map((text, i) => (
              <Measure key={text} progress={p} index={i} text={text} />
            ))}
          </div>

          <motion.p
            style={confession}
            className="col-start-1 row-start-1 max-w-[21rem] font-display text-[2rem] leading-[1.25] font-light text-frost italic sm:max-w-2xl sm:text-5xl"
          >
            {pause.confession}
          </motion.p>

          <motion.p
            style={closing}
            className="luminous col-start-1 row-start-1 max-w-[20rem] font-display text-[2.3rem] leading-[1.2] font-light text-frost sm:max-w-3xl sm:text-6xl"
          >
            {pause.closing}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
