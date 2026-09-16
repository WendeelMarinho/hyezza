'use client'

import { motion, useReducedMotion } from 'motion/react'
import { memo, useMemo, type CSSProperties } from 'react'
import { constellationWords, memories } from '@/data/memories'
import type { Memory, MemoryCategory } from '@/data/types'
import { isPhotoSlug } from '@/data/photos'
import { Photo } from '@/components/ui/Photo'
import { VIEWBOX, buildEdges, cameraFor, generateDust, neighborsOf, toPoint, type LayoutMode } from '@/lib/constellation'

const DUST_SEED = 2025
const DUST_COUNT = { desktop: 150, mobile: 110 }
const CAMERA_TRANSITION = { duration: 2.2, ease: [0.65, 0, 0.35, 1] as const }

type Props = {
  mode: LayoutMode
  hovered: string | null
  focused: string | null
  categoryFilter: MemoryCategory | null
  onHover: (id: string | null) => void
  onSelect: (memory: Memory) => void
}

const pct = (value: number, total: number) => `${(value / total) * 100}%`

const Dust = memo(function Dust({ mode }: { mode: LayoutMode }) {
  const box = VIEWBOX[mode]
  const stars = useMemo(() => generateDust(DUST_SEED, DUST_COUNT[mode]), [mode])
  return (
    <g>
      {stars.map((s, i) => {
        const p = toPoint(s, mode)
        return (
          <circle
            key={i}
            cx={Math.min(p.x, box.width)}
            cy={Math.min(p.y, box.height)}
            r={s.r}
            fill="#dfe6ff"
            className="animate-twinkle"
            style={{ '--twinkle-duration': `${3 + s.twinkle * 6}s`, '--twinkle-min': 0.15, animationDelay: `${-s.twinkle * 8}s` } as CSSProperties}
          />
        )
      })}
    </g>
  )
})

export function ConstellationMap({ mode, hovered, focused, categoryFilter, onHover, onSelect }: Props) {
  const reduce = useReducedMotion()
  const box = VIEWBOX[mode]
  const edges = useMemo(() => buildEdges(memories), [])
  const active = focused ?? hovered
  const lit = useMemo(() => new Set(active ? [active, ...neighborsOf(active, edges)] : []), [active, edges])
  const focusedMemory = memories.find((m) => m.id === focused) ?? null
  const camera = cameraFor(focusedMemory?.position ?? null, mode, mode === 'mobile' ? 1.35 : 1.7)
  const byId = useMemo(() => new Map(memories.map((m) => [m.id, m])), [])

  const dimmed = (memory: Memory) => (categoryFilter !== null && memory.category !== categoryFilter) || (active !== null && !lit.has(memory.id))

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${box.width} / ${box.height}` }}>
      <motion.div
        className="absolute inset-0 will-change-transform"
        animate={{ x: pct(camera.x, box.width), y: pct(camera.y, box.height), scale: camera.scale }}
        transition={reduce ? { duration: 0 } : CAMERA_TRANSITION}
      >
        <svg viewBox={`0 0 ${box.width} ${box.height}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="edge" x1="0" x2="1">
              <stop offset="0" stopColor="#a9bcff" stopOpacity="0.15" />
              <stop offset="0.5" stopColor="#dfe6ff" stopOpacity="0.8" />
              <stop offset="1" stopColor="#a9bcff" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <Dust mode={mode} />
          {edges.map(([a, b]) => {
            const from = toPoint(byId.get(a)!.position, mode)
            const to = toPoint(byId.get(b)!.position, mode)
            const on = active !== null && (a === active || b === active)
            return (
              <line
                key={`${a}-${b}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={on ? '#dfe6ff' : 'url(#edge)'}
                strokeWidth={on ? 1.1 : 0.7}
                strokeOpacity={on ? 0.9 : active ? 0.12 : 0.4}
                className="transition-[stroke-opacity,stroke-width] duration-700"
                vectorEffect="non-scaling-stroke"
                style={on ? { filter: 'drop-shadow(0 0 4px rgb(169 188 255 / 0.9))' } : undefined}
              />
            )
          })}
        </svg>

        {constellationWords.map((word) => {
          const p = toPoint(word.position, mode)
          return (
            <span
              key={word.text}
              aria-hidden
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-display text-[0.8rem] whitespace-nowrap text-mist/45 italic lg:text-[0.95rem]"
              style={{ left: pct(p.x, box.width), top: pct(p.y, box.height) }}
            >
              {word.text}
            </span>
          )
        })}

        {memories.map((memory, i) => (
          <StarNode
            key={memory.id}
            memory={memory}
            index={i}
            mode={mode}
            isActive={active === memory.id}
            isDimmed={dimmed(memory)}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </motion.div>
    </div>
  )
}

type StarNodeProps = {
  memory: Memory
  index: number
  mode: LayoutMode
  isActive: boolean
  isDimmed: boolean
  onHover: (id: string | null) => void
  onSelect: (memory: Memory) => void
}

const CATEGORY_CORE: Record<MemoryCategory, string> = {
  nossas: 'bg-white shadow-[0_0_10px_3px_rgb(190_205_255/0.95),0_0_28px_8px_rgb(128_147_255/0.45)]',
  'em-voce': 'bg-[#f1e9ff] shadow-[0_0_10px_3px_rgb(210_190_255/0.95),0_0_28px_8px_rgb(165_139_255/0.5)]',
  futuro: 'bg-transparent ring-1 ring-ice/80 shadow-[0_0_14px_2px_rgb(169_188_255/0.45)]',
}

function StarNode({ memory, index, mode, isActive, isDimmed, onHover, onSelect }: StarNodeProps) {
  const box = VIEWBOX[mode]
  const p = toPoint(memory.position, mode)
  const showPin = memory.pinned && memory.photo && isPhotoSlug(memory.photo)
  // Miniaturas ficam do lado com mais espaco livre.
  const pinBelow = mode === 'desktop' ? memory.position.y >= 50 : false
  const pinLeft = mode === 'mobile' ? (memory.pinSideMobile ?? (memory.position.y > 50 ? 'left' : 'right')) === 'left' : memory.position.x > 60
  const drift = { '--drift-x': `${(index % 3) - 1}px`, '--drift-y': `${index % 2 ? 2.5 : -2.5}px`, '--drift-duration': `${8 + (index % 5)}s` }

  return (
    <div
      className={`absolute z-10 transition-opacity duration-700 ${isDimmed ? 'opacity-35' : 'opacity-100'}`}
      style={{ left: pct(p.x, box.width), top: pct(p.y, box.height), ...drift } as CSSProperties}
    >
      <div>
        <button
          type="button"
          onClick={() => onSelect(memory)}
          onPointerEnter={() => onHover(memory.id)}
          onPointerLeave={() => onHover(null)}
          onFocus={() => onHover(memory.id)}
          onBlur={() => onHover(null)}
          aria-label={memory.title}
          className="group absolute top-0 left-0 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        >
          <span aria-hidden className="grid animate-drift place-items-center">
            <span
              className={`absolute rounded-full bg-[radial-gradient(circle,rgb(169_188_255/0.45),transparent_70%)] transition-all duration-700 ease-cinema ${
                isActive ? 'size-14 opacity-100' : 'size-7 opacity-60 group-hover:size-12'
              }`}
            />
            <span
              className={`relative rounded-full transition-transform duration-700 ease-cinema ${CATEGORY_CORE[memory.category]} ${
                isActive ? 'size-2.5 scale-150' : 'size-2 lg:size-2.5'
              }`}
            />
          </span>
        </button>

        {showPin && memory.photo && isPhotoSlug(memory.photo) && (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={() => onSelect(memory)}
            onPointerEnter={() => onHover(memory.id)}
            onPointerLeave={() => onHover(null)}
            className={`glass absolute w-[5.4rem] rounded-xl p-1 text-left transition-transform duration-700 ease-cinema hover:scale-105 lg:w-[7.6rem] lg:rounded-2xl lg:p-1.5 ${
              pinLeft ? 'right-5 lg:right-6' : 'left-5 lg:left-6'
            } ${mode === 'mobile' ? 'top-0 -translate-y-1/2' : pinBelow ? 'top-4' : '-top-4 -translate-y-full'} ${pinLeft ? 'rotate-[-4deg]' : 'rotate-[4deg]'} ${
              isActive ? 'scale-105 border-ice/40' : ''
            }`}
          >
            <Photo slug={memory.photo} sizes="160px" decorative className="aspect-[4/3] rounded-lg lg:rounded-xl" />
            <span className="mt-1 block truncate px-0.5 font-display text-[0.62rem] text-frost lg:mt-1.5 lg:text-[0.78rem]">{memory.title}</span>
            {memory.date && <span className="caps block px-0.5 text-[0.45rem] text-mist/70">{memory.date}</span>}
          </button>
        )}

        <span
          aria-hidden
          className={`pointer-events-none absolute left-0 whitespace-nowrap transition-all duration-700 ease-cinema ${
            mode === 'mobile' && memory.position.y > 50 ? 'right-4 left-auto text-right' : 'left-4'
          } top-2 font-display text-sm text-frost ${isActive && !showPin ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-1 opacity-0 blur-sm'}`}
        >
          {memory.title}
        </span>
      </div>
    </div>
  )
}
