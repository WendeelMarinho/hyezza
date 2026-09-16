'use client'

import { motion, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { future } from '@/data/content'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { useStickyProgress } from '@/hooks/useStickyProgress'
import { futureYears } from '@/lib/format'
import { Photo } from '@/components/ui/Photo'

const YEAR_SPACING_VW = { desktop: 30, mobile: 58 }
const TRACK_END = 0.56
const PHRASE_START = 0.04
const PHRASE_SPAN = 0.13
const TIMELINE_OUT = [0.56, 0.61] as const
const FINALE = [
  [0.63, 0.68],
  [0.72, 0.77],
  [0.81, 0.86],
] as const
const PHOTO_REVEAL = [0.88, 0.99] as const

function useFade(p: MotionValue<number>, input: number[], output: number[]) {
  const opacity = useTransform(p, input, output)
  const filter = useTransform(opacity, (o) => `blur(${(1 - o) * 10}px)`)
  const y = useTransform(opacity, (o) => (1 - o) * 12)
  return { opacity, filter, y }
}

function Phrase({ p, index, text }: { p: MotionValue<number>; index: number; text: string }) {
  const start = PHRASE_START + index * PHRASE_SPAN
  const style = useFade(p, [start, start + 0.03, start + PHRASE_SPAN - 0.03, start + PHRASE_SPAN], [0, 1, 1, 0])
  return (
    <motion.p
      style={style}
      className="title-gradient col-start-1 row-start-1 max-w-[19rem] font-display text-[2.1rem] leading-tight font-light sm:max-w-2xl sm:text-5xl"
    >
      {text}
    </motion.p>
  )
}

function FinaleLine({ p, index, text }: { p: MotionValue<number>; index: number; text: string }) {
  const [start, end] = FINALE[index]
  const style = useFade(p, [start, end], [0, 1])
  const last = index === FINALE.length - 1
  return (
    <motion.p
      style={style}
      className={`font-display leading-snug font-light ${
        last ? 'luminous mt-6 text-[2.1rem] text-frost sm:text-5xl' : 'text-[1.6rem] text-mist italic sm:text-4xl'
      }`}
    >
      {text}
    </motion.p>
  )
}

export function FutureTimeline() {
  const ref = useRef<HTMLElement>(null)
  const isDesktop = useIsDesktop()
  const p = useStickyProgress(ref)
  const years = futureYears(future.startYear, future.years)
  const spacing = isDesktop ? YEAR_SPACING_VW.desktop : YEAR_SPACING_VW.mobile

  const trackX = useTransform(p, [0, TRACK_END], ['0vw', `-${(years.length - 0.4) * spacing}vw`])
  const timelineOpacity = useTransform(p, [...TIMELINE_OUT], [1, 0])
  const lineBreak = useTransform(p, [...TIMELINE_OUT], [1, 0.2])
  const clip = useTransform(p, [...PHOTO_REVEAL], ['circle(0% at 50% 50%)', 'circle(50% at 50% 50%)'])
  const photoScale = useTransform(p, [PHOTO_REVEAL[0], 1], [1.25, 1])
  const ringOpacity = useTransform(p, [...PHOTO_REVEAL], [0, 1])

  return (
    <section id="futuro" ref={ref} aria-label={future.eyebrow} className="relative h-[680svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ opacity: timelineOpacity }} className="absolute inset-0">
          <p className="caps absolute top-[16%] left-1/2 -translate-x-1/2 text-[0.6rem] whitespace-nowrap text-ice/70">{future.eyebrow}</p>

          {/* Linha do tempo: o presente fica no centro, o futuro vem da direita. */}
          <div aria-hidden className="absolute inset-x-0 top-[64%] lg:top-[66%]">
            <motion.div style={{ scaleX: lineBreak }} className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-mist/40 to-transparent" />
            <span className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_4px_rgb(169_188_255/0.8),0_0_40px_10px_rgb(128_147_255/0.3)]" />
            <motion.div style={{ x: trackX }} className="absolute left-1/2">
              {[...years, null].map((year, i) => (
                <div key={year ?? 'more'} className="absolute top-0" style={{ left: `${i * spacing}vw` }}>
                  <span className="absolute top-0 left-0 h-3 w-px -translate-y-1/2 bg-mist/50" />
                  <span className="absolute top-6 left-0 -translate-x-1/2 font-display text-3xl font-light text-mist/80 tabular-nums lg:text-4xl">
                    {year ?? '…'}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="section-pad absolute inset-x-0 top-[30%] grid place-items-center text-center lg:top-[32%]">
            {future.phrases.map((text, i) => (
              <Phrase key={text} p={p} index={i} text={text} />
            ))}
          </div>
        </motion.div>

        <div className="section-pad relative flex h-full flex-col items-center justify-center text-center">
          {future.finale.map((text, i) => (
            <FinaleLine key={text} p={p} index={i} text={text} />
          ))}

          {/* Uma janela para o que vem: a foto se abre em um circulo de luz. */}
          <div aria-hidden className="relative mt-10 aspect-square w-[52vw] max-w-[15rem] lg:mt-12 lg:w-[16rem] lg:max-w-none">
            <motion.div
              style={{ opacity: ringOpacity }}
              className="absolute -inset-3 rounded-full border border-ice/25 shadow-[0_0_60px_-6px_rgb(128_147_255/0.6),inset_0_0_30px_rgb(128_147_255/0.25)]"
            />
            <motion.div style={{ clipPath: clip }} className="absolute inset-0 overflow-hidden rounded-full">
              <motion.div style={{ scale: photoScale }} className="size-full">
                <Photo slug={future.photo} sizes="260px" decorative reveal={false} className="size-full" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
