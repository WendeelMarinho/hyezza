'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { constellation } from '@/data/content'
import { memoryCategories } from '@/data/memories'
import { isPhotoSlug } from '@/data/photos'
import type { Memory } from '@/data/types'
import { Photo } from '@/components/ui/Photo'
import { ArrowIcon, cinematicEase } from '@/components/ui/primitives'
import { useDialogFocus } from '@/hooks/useDialogFocus'

type Props = {
  memory: Memory | null
  onClose: () => void
  onStep: (direction: 1 | -1) => void
}

/** Capsula de memoria: abre sobre a constelacao com a foto se revelando. */
export function MemoryCapsule({ memory, onClose, onStep }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const open = memory !== null
  useDialogFocus(dialogRef, open, closeRef)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onStep(1)
      if (event.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onStep])

  const photo = memory?.photo && isPhotoSlug(memory.photo) ? memory.photo : null

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          key="capsule"
          className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <button type="button" tabIndex={-1} aria-hidden onClick={onClose} className="absolute inset-0 bg-void/70 backdrop-blur-md" />
          <motion.article
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="capsule-title"
            initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(10px)' }}
            transition={{ duration: 0.9, ease: cinematicEase }}
            className={`glass glass-strong relative grid max-h-[88svh] w-full overflow-hidden rounded-[2rem] ${
              photo ? 'max-w-4xl md:grid-cols-[1.05fr_1fr]' : 'max-w-lg'
            }`}
          >
            <AnimatePresence mode="wait">
              {photo && (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: 1.1, filter: 'blur(16px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 1.3, ease: cinematicEase }}
                  className="relative h-[42svh] md:h-auto md:min-h-[32rem]"
                >
                  <Photo slug={photo} sizes="(min-width: 768px) 460px, 100vw" className="absolute inset-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070b1a] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0a0f22]/70" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex flex-col overflow-y-auto p-7 sm:p-10">
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={constellation.closeLabel}
                className="absolute top-5 right-5 grid size-10 place-items-center rounded-full border border-white/10 text-mist transition-colors hover:text-frost"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="size-4">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>

              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: cinematicEase }}
                className="my-auto pr-8"
              >
                <p className="caps flex items-center gap-2 text-[0.58rem] text-ice/80">
                  <span className="size-1.5 rounded-full bg-ice shadow-[0_0_8px_rgb(169_188_255)]" />
                  {memoryCategories[memory.category].label}
                </p>
                <h3 id="capsule-title" className="title-gradient mt-5 font-display text-4xl leading-tight font-light sm:text-5xl">
                  {memory.title}
                </h3>
                {memory.date && <p className="caps mt-3 text-[0.65rem] text-mist/70">{memory.date}</p>}
                <span className="hairline mt-6 block w-24" />
                <p className="mt-6 font-display text-xl leading-relaxed text-mist">{memory.caption}</p>
              </motion.div>

              <div className="mt-10 flex items-center justify-between gap-3">
                <button type="button" onClick={() => onStep(-1)} className="flex items-center gap-2 py-2 text-sm text-mist transition-colors hover:text-frost">
                  <ArrowIcon className="size-4 rotate-180" />
                  {constellation.previousLabel}
                </button>
                <button type="button" onClick={() => onStep(1)} className="flex items-center gap-2 py-2 text-sm text-mist transition-colors hover:text-frost">
                  {constellation.nextLabel}
                  <ArrowIcon className="size-4" />
                </button>
              </div>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
