'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { letter, site } from '@/data/content'
import { Photo } from '@/components/ui/Photo'
import { cinematicEase } from '@/components/ui/primitives'
import { useExperience } from '@/components/experience/ExperienceContext'

const PORTAL_S = 1.6
const FIRST_LINE_DELAY_S = 1.8
const LINE_GAP_S = 1.7

type Props = { origin: { x: number; y: number } | null; onClose: () => void }

/** Portal de luz que se abre a partir do botao e revela a carta final. */
export function LetterOverlay({ origin, onClose }: Props) {
  const reduce = useReducedMotion()
  const { markLetterRead } = useExperience()
  const [showAll, setShowAll] = useState(false)
  const [showSymbol, setShowSymbol] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const open = origin !== null

  const lines = [letter.greeting, ...letter.paragraphs]
  const signatureDelay = FIRST_LINE_DELAY_S + lines.length * LINE_GAP_S
  const delayFor = (i: number) => (showAll || reduce ? 0 : FIRST_LINE_DELAY_S + i * LINE_GAP_S)

  useEffect(() => {
    if (!open) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const wait = showAll || reduce ? 1200 : signatureDelay * 1000 + letter.symbolDelayMs
    const timer = window.setTimeout(() => {
      setShowSymbol(true)
      markLetterRead()
    }, wait)
    return () => window.clearTimeout(timer)
  }, [open, showAll, reduce, signatureDelay, markLetterRead])

  useEffect(() => {
    if (showSymbol) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [showSymbol])

  const at = origin ? `${origin.x}px ${origin.y}px` : '50% 50%'

  return (
    <AnimatePresence>
      {origin && (
        <motion.div
          key="letter"
          role="dialog"
          aria-modal="true"
          aria-label="Carta"
          className="fixed inset-0 z-[70]"
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1.2, ease: cinematicEase }}
        >
          {/* Luz do portal */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_var(--at),#ffffff_0%,#c9d4ff_12%,#5e6fd6_35%,#0a0f22_70%)]"
            style={{ '--at': at } as React.CSSProperties}
            initial={{ clipPath: `circle(0% at ${at})`, opacity: 1 }}
            animate={{ clipPath: `circle(150% at ${at})`, opacity: [1, 1, 0] }}
            transition={{ clipPath: { duration: reduce ? 0 : PORTAL_S, ease: [0.7, 0, 0.3, 1] }, opacity: { duration: PORTAL_S + 1.4, times: [0, 0.55, 1] } }}
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_30%,#0d1430,#03050c_75%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: reduce ? 0 : PORTAL_S * 0.7 }}
          />

          <div ref={scrollRef} className="relative h-full overflow-y-auto overscroll-contain" onClick={() => setShowAll(true)}>
            <div className="section-pad mx-auto grid min-h-full max-w-6xl items-center 2xl:max-w-7xl gap-10 py-16 lg:grid-cols-[0.85fr_1fr] lg:gap-20 lg:py-20">
              <motion.div
                initial={{ opacity: 0, scale: 1.08, filter: 'blur(24px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2.4, delay: reduce ? 0 : PORTAL_S * 0.8, ease: cinematicEase }}
                className="glass mx-auto w-full max-w-[20rem] rounded-[2rem] p-2 lg:max-w-none"
              >
                <Photo
                  slug={letter.photo}
                  sizes="(min-width: 1024px) 40vw, 80vw"
                  className="aspect-[4/5] rounded-[1.6rem] max-lg:aspect-[5/4] max-lg:[mask-image:linear-gradient(180deg,#000_70%,transparent)]"
                />
              </motion.div>

              <article className="font-display text-[1.35rem] leading-relaxed text-mist sm:text-2xl 2xl:text-[1.75rem]">
                {lines.map((line, i) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.6, delay: delayFor(i), ease: cinematicEase }}
                    className={i === 0 ? 'mb-6 text-4xl text-frost italic sm:text-5xl' : 'mb-5'}
                  >
                    {line}
                  </motion.p>
                ))}
                <motion.p
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 2, delay: showAll || reduce ? 0 : signatureDelay, ease: cinematicEase }}
                  className="mt-8 font-hand text-3xl text-frost"
                >
                  {letter.signature}
                </motion.p>

                <AnimatePresence>
                  {showSymbol && (
                    <motion.div
                      initial={{ opacity: 0, filter: 'blur(12px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ duration: 3, ease: cinematicEase }}
                      className="mt-16 flex flex-col items-start gap-8"
                    >
                      <p className="luminous font-display text-3xl tracking-[0.25em] text-frost/85">{site.symbol}</p>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onClose()
                        }}
                        className="caps text-[0.6rem] text-mist/60 underline-offset-8 transition-colors hover:text-frost hover:underline"
                      >
                        {letter.closeLabel}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
