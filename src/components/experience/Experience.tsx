'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Backdrop } from '@/components/scene/Backdrop'
import { TopBar } from '@/components/nav/TopBar'
import { SoundToggle } from '@/components/nav/SoundToggle'
import { Hero } from '@/components/sections/Hero'
import { DaysTogether } from '@/components/sections/DaysTogether'
import { VoiceMoment } from '@/components/sections/VoiceMoment'
import { MemoryConstellation } from '@/components/constellation/MemoryConstellation'
import { Qualities } from '@/components/sections/Qualities'
import { PauseMoment } from '@/components/sections/PauseMoment'
import { FutureTimeline } from '@/components/sections/FutureTimeline'
import { YearTwo } from '@/components/sections/YearTwo'
import { LetterOverlay } from '@/components/sections/LetterOverlay'
import { ExperienceProvider, useExperience } from './ExperienceContext'

const WARP_SPEED = 26
const WARP_PORTAL_SPEED = 14
/** Linha do tempo da entrada (ms): acelera, cobre com luz, salta e revela. */
const ENTER_JUMP_MS = 1150
const ENTER_SETTLE_MS = 1900

function Stage() {
  const reduce = useReducedMotion()
  const { setWarp, startMusic } = useExperience()
  const [leaving, setLeaving] = useState(false)
  const [veil, setVeil] = useState(false)
  const [portal, setPortal] = useState<{ x: number; y: number } | null>(null)
  const [letterKey, setLetterKey] = useState(0)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const enter = () => {
    startMusic()
    const target = document.getElementById('historia')
    if (reduce) {
      target?.scrollIntoView({ block: 'start' })
      return
    }
    setLeaving(true)
    setVeil(true)
    setWarp(WARP_SPEED)
    later(() => {
      target?.scrollIntoView({ behavior: 'instant', block: 'center' })
      setWarp(1)
      setVeil(false)
    }, ENTER_JUMP_MS)
    later(() => setLeaving(false), ENTER_SETTLE_MS)
  }

  const openLetter = (origin: { x: number; y: number }) => {
    setWarp(WARP_PORTAL_SPEED)
    later(() => setWarp(1), 1600)
    setLetterKey((k) => k + 1)
    setPortal(origin)
  }

  const closeLetter = useCallback(() => setPortal(null), [])

  return (
    <>
      <Backdrop />
      <TopBar />
      <main className="relative z-10">
        <Hero onEnter={enter} leaving={leaving} />
        <DaysTogether />
        <VoiceMoment />
        <MemoryConstellation />
        <Qualities />
        <PauseMoment />
        <FutureTimeline />
        <YearTwo onContinue={openLetter} />
      </main>
      <SoundToggle />

      <AnimatePresence>
        {veil && (
          <motion.div
            key="veil"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(60%_50%_at_50%_50%,rgb(200_212_255/0.55),rgb(40_52_120/0.6)_45%,#03050c_85%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          />
        )}
      </AnimatePresence>

      <LetterOverlay key={letterKey} origin={portal} onClose={closeLetter} />
    </>
  )
}

export function Experience() {
  return (
    <ExperienceProvider>
      <Stage />
    </ExperienceProvider>
  )
}
