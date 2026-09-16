'use client'

import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { useMemo, useRef, type MouseEvent } from 'react'
import { site, yearTwo } from '@/data/content'
import { generateDust } from '@/lib/constellation'
import { useExperience } from '@/components/experience/ExperienceContext'
import { ArrowButton, HandNote, Reveal, cinematicEase } from '@/components/ui/primitives'

const CITY_SEED = 365
const CITY_LIGHTS = 260

/** Curvatura da Terra vista da orbita, com luzes de cidades e atmosfera. */
function EarthHorizon() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const rise = useTransform(scrollYProgress, [0, 1], ['18%', '0%'])
  const lights = useMemo(
    () => generateDust(CITY_SEED, CITY_LIGHTS).filter((d) => Math.hypot(d.x - 50, (d.y - 50) * 1.2) < 48),
    [],
  )

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] overflow-hidden">
      <motion.div style={{ y: rise }} className="absolute top-[18%] left-1/2 aspect-square w-[300vw] -translate-x-1/2 sm:w-[200vw] lg:w-[150vw]">
        <div className="absolute -inset-[3%] rounded-full bg-[radial-gradient(closest-side,transparent_93%,rgb(110_140_255/0.35)_96.5%,transparent)] blur-md" />
        <div
          className="absolute inset-0 overflow-hidden rounded-full shadow-[0_-2px_0_0_rgb(190_205_255/0.55),0_-18px_60px_6px_rgb(110_140_255/0.45),0_-60px_180px_40px_rgb(80_100_255/0.2)]"
          style={{ background: 'radial-gradient(circle at 50% 0%, #1b2c62 0%, #0c1638 12%, #060b1d 28%, #03050c 45%)' }}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full [mask-image:radial-gradient(60%_22%_at_50%_2%,#000,transparent)]">
            {lights.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y * 0.3}
                r={d.r * 0.06}
                fill={i % 5 ? '#f3c58e' : '#dfe6ff'}
                opacity={0.35 + d.twinkle * 0.6}
              />
            ))}
          </svg>
          <div className="absolute inset-x-[20%] top-0 h-[6%] bg-[radial-gradient(50%_60%_at_50%_0%,rgb(200_215_255/0.35),transparent)]" />
        </div>
        <div className="absolute top-0 left-[38%] h-3 w-[14%] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.95),rgb(169_188_255/0.4)_40%,transparent)] blur-[3px]" />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void to-transparent" />
    </div>
  )
}

type YearTwoProps = { onContinue: (origin: { x: number; y: number }) => void }

export function YearTwo({ onContinue }: YearTwoProps) {
  const { letterRead } = useExperience()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    onContinue({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  return (
    <section id="year-two" aria-labelledby="year-two-title" className="relative isolate min-h-[115svh] overflow-hidden">
      <EarthHorizon />

      <div className="section-pad relative flex min-h-[115svh] flex-col items-center pt-[22svh] text-center lg:pt-[20svh]">
        <Reveal>
          <h2 id="year-two-title" className="caps luminous font-display text-frost text-5xl font-light tracking-[0.3em] sm:text-6xl lg:text-7xl">
            {yearTwo.title}
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="caps mt-6 text-[0.62rem] leading-loose text-mist/75 lg:hidden">
            {yearTwo.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </Reveal>
        <Reveal delay={0.5} className="mt-10">
          <ArrowButton onClick={handleClick}>{yearTwo.cta}</ArrowButton>
        </Reveal>

        <AnimatePresence>
          {letterRead && (
            <motion.p
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2.4, ease: cinematicEase }}
              className="luminous mt-auto mb-[max(2.5rem,env(safe-area-inset-bottom))] font-display text-2xl tracking-[0.2em] text-frost/80"
            >
              {site.symbol}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="caps absolute bottom-16 left-[var(--gutter)] hidden text-[0.62rem] leading-loose text-mist/70 lg:block">
        {yearTwo.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      <HandNote className="absolute right-[calc(var(--gutter)+2rem)] bottom-24 hidden max-w-[11rem] text-lg leading-snug lg:block">
        {yearTwo.note}
      </HandNote>
    </section>
  )
}
