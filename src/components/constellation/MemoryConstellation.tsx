'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { constellation } from '@/data/content'
import { memories, memoryCategories } from '@/data/memories'
import { isPhotoSlug } from '@/data/photos'
import type { Memory, MemoryCategory } from '@/data/types'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { wrapIndex } from '@/lib/constellation'
import { Photo } from '@/components/ui/Photo'
import { ArrowButton, ArrowIcon, Reveal, SectionHeading, cinematicEase } from '@/components/ui/primitives'
import { ConstellationMap } from './ConstellationMap'
import { MemoryCapsule } from './MemoryCapsule'

const STORY_STEP_MS = 6500
const CATEGORIES = Object.keys(memoryCategories) as MemoryCategory[]

export function MemoryConstellation() {
  const isDesktop = useIsDesktop()
  const mapRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [story, setStory] = useState<number | null>(null)
  const [filter, setFilter] = useState<MemoryCategory | null>(null)

  const storyMemory = story !== null ? memories[story] : null
  const selectedMemory = selected !== null ? memories[selected] : null

  const stepStory = useCallback((direction: 1 | -1) => {
    setStory((current) => (current === null ? null : wrapIndex(current + direction, memories.length)))
  }, [])

  const stepSelected = useCallback((direction: 1 | -1) => {
    setSelected((current) => (current === null ? null : wrapIndex(current + direction, memories.length)))
  }, [])

  // Escolher uma estrela manualmente encerra o modo historia.
  const select = useCallback((memory: Memory) => {
    setStory(null)
    setSelected(memories.indexOf(memory))
  }, [])
  const close = useCallback(() => setSelected(null), [])

  const startStory = () => {
    setFilter(null)
    setStory(0)
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Avanca sozinho; pausa com a capsula aberta. Encerra ao sair da secao.
  useEffect(() => {
    if (story === null || selected !== null) return
    const timer = window.setTimeout(() => stepStory(1), STORY_STEP_MS)
    return () => window.clearTimeout(timer)
  }, [story, selected, stepStory])

  return (
    <motion.section
      id="memorias"
      aria-labelledby="memorias-title"
      className="relative scroll-mt-20 py-20 lg:py-28"
      viewport={{ margin: '-20% 0px -20% 0px' }}
      onViewportLeave={() => setStory(null)}
    >
      <div className="section-pad mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[22rem_1fr_11rem] lg:items-center lg:gap-6">
        <Reveal className="lg:self-center">
          <div id="memorias-title">
            <SectionHeading lines={constellation.title} />
          </div>
          <p className="mt-5 max-w-[16rem] font-display text-lg leading-snug text-mist">{constellation.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {story === null ? (
              <ArrowButton size="sm" onClick={startStory}>
                {constellation.storyLabel}
              </ArrowButton>
            ) : (
              <button
                type="button"
                onClick={() => setStory(null)}
                className="glass rounded-full px-5 py-2.5 text-sm text-mist hover:text-frost"
              >
                {constellation.stopStoryLabel}
              </button>
            )}
          </div>

          <ul aria-label="Tipos de estrela" className="mt-10 space-y-1">
            {CATEGORIES.map((category) => {
              const on = filter === category
              return (
                <li key={category}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(on ? null : category)}
                    className={`flex items-center gap-3 rounded-full py-1.5 pr-3 text-left text-[0.8rem] transition-colors ${
                      on ? 'text-frost' : filter ? 'text-mist/40' : 'text-mist/75 hover:text-frost'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`size-2 rounded-full ${
                        category === 'nossas'
                          ? 'bg-white shadow-[0_0_8px_rgb(190_205_255)]'
                          : category === 'em-voce'
                            ? 'bg-[#f1e9ff] shadow-[0_0_8px_rgb(165_139_255)]'
                            : 'ring-1 ring-ice'
                      }`}
                    />
                    {memoryCategories[category].label}
                  </button>
                </li>
              )
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.2} blur={16} className="relative -mx-[var(--gutter)] lg:mx-0">
          <div ref={mapRef} className="relative mx-auto max-w-[26rem] lg:max-w-none">
            <ConstellationMap
              mode={isDesktop ? 'desktop' : 'mobile'}
              hovered={hovered}
              focused={storyMemory?.id ?? null}
              categoryFilter={filter}
              onHover={setHovered}
              onSelect={select}
            />
            <p className="caps pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 text-[0.55rem] text-mist/40 lg:hidden">
              {constellation.hint}
            </p>
            <StoryCaption
              memory={storyMemory}
              index={story}
              paused={selected !== null}
              onStep={stepStory}
              onOpen={() => story !== null && setSelected(story)}
            />
          </div>
        </Reveal>

        <Reveal delay={0.4} className="hidden lg:block">
          <p className="font-display text-[1.02rem] leading-relaxed text-mist/80">
            {constellation.aside.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <span className="mt-5 block h-px w-10 bg-mist/40" />
        </Reveal>
      </div>

      <MemoryCapsule memory={selectedMemory} onClose={close} onStep={stepSelected} />
    </motion.section>
  )
}

type StoryCaptionProps = {
  memory: Memory | null
  index: number | null
  paused: boolean
  onStep: (d: 1 | -1) => void
  onOpen: () => void
}

function StoryCaption({ memory, index, paused, onStep, onOpen }: StoryCaptionProps) {
  const photo = memory?.photo && isPhotoSlug(memory.photo) ? memory.photo : null
  return (
    <AnimatePresence mode="wait">
      {memory && index !== null && (
        <motion.div
          key={memory.id}
          initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
          transition={{ duration: 0.9, ease: cinematicEase }}
          className="glass glass-strong absolute inset-x-3 bottom-3 z-20 flex items-center gap-4 rounded-2xl p-3 lg:inset-x-auto lg:right-4 lg:bottom-4 lg:w-[26rem]"
          aria-live="polite"
        >
          {photo && <Photo slug={photo} sizes="96px" decorative className="size-16 shrink-0 rounded-xl lg:size-20" />}
          <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
            <span className="caps block text-[0.5rem] text-ice/70">
              {String(index + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}
            </span>
            <span className="mt-1 block font-display text-lg leading-tight text-frost">{memory.title}</span>
            <span className="mt-1 line-clamp-2 block font-display text-[0.9rem] leading-snug text-mist">{memory.caption}</span>
          </button>
          <div className="flex shrink-0 flex-col gap-1">
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label={constellation.nextLabel}
              className="grid size-9 place-items-center rounded-full border border-white/10 text-mist hover:text-frost"
            >
              <ArrowIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label={constellation.previousLabel}
              className="grid size-9 place-items-center rounded-full border border-white/10 text-mist hover:text-frost"
            >
              <ArrowIcon className="size-4 rotate-180" />
            </button>
          </div>
          {/* A barra reinicia junto com o temporizador quando a pausa termina. */}
          {!paused && (
            <motion.span
              key={`bar-${memory.id}`}
              aria-hidden
              className="absolute bottom-0 left-4 h-px origin-left bg-ice/70"
              style={{ right: '1rem' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: STORY_STEP_MS / 1000, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
