'use client'

import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { days } from '@/data/content'
import { useTilt } from '@/hooks/useTilt'
import { Orbital, Reveal } from '@/components/ui/primitives'

const COUNT_DURATION_S = 2.8

function useCountUp(target: number, start: boolean) {
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start || reduce) return
    const controls = animate(0, target, {
      duration: COUNT_DURATION_S,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [reduce, start, target])
  return reduce && start ? target : value
}

export function DaysTogether() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const count = useCountUp(days.number, inView)
  const tilt = useTilt(2.5)

  return (
    <section id="historia" aria-label={`${days.number} ${days.label}`} className="section-pad relative scroll-mt-24 py-16 lg:-mt-28 lg:py-10">
      <Reveal>
        <motion.div
          ref={ref}
          style={tilt.style}
          {...tilt.handlers}
          className="glass mx-auto grid max-w-[88rem] overflow-hidden rounded-[2rem] px-6 py-9 sm:px-10 lg:grid-cols-[auto_1fr_auto_auto] lg:items-center lg:gap-12 lg:rounded-[2.25rem] lg:px-14 lg:py-10"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_circle_at_var(--spot-x,30%)_var(--spot-y,50%),rgb(150_170_255/0.1),transparent_70%)]"
          />
          <p
            aria-hidden
            className="title-gradient luminous font-display text-[6.5rem] leading-[0.8] font-light tabular-nums sm:text-[8rem] lg:text-[8.5rem]"
          >
            {count}
          </p>
          <div className="mt-6 max-w-sm lg:mt-0">
            <p className="caps font-display text-sm text-frost">{days.label}</p>
            <p className="mt-3 font-display text-lg leading-snug text-mist">{days.text}</p>
          </div>
          <span aria-hidden className="my-8 h-px w-full bg-gradient-to-r from-transparent via-mist/30 to-transparent lg:my-0 lg:h-20 lg:w-px lg:bg-gradient-to-b" />
          <div className="flex items-center justify-between gap-6 lg:gap-10">
            <p className="caps font-display text-[0.95rem] leading-relaxed text-mist lg:text-base">
              {days.aside.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <Orbital className="size-20 shrink-0 lg:size-24" />
          </div>
        </motion.div>
      </Reveal>
    </section>
  )
}
