'use client'

import { music } from '@/data/content'
import { useExperience } from '@/components/experience/ExperienceContext'

const BARS = [0.5, 1, 0.7, 0.9]

/** Controle de som quase invisivel. So aparece quando existe uma trilha configurada. */
export function SoundToggle() {
  const { hasMusic, musicOn, toggleMusic } = useExperience()
  if (!hasMusic) return null

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-pressed={musicOn}
      aria-label={musicOn ? music.onLabel : music.offLabel}
      className="glass fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-10 items-center gap-2.5 rounded-full px-4 text-mist/80 transition-colors hover:text-frost lg:right-[var(--gutter)] lg:bottom-8"
    >
      <span aria-hidden className="flex h-3.5 items-end gap-[3px]">
        {BARS.map((height, i) => (
          <span
            key={i}
            style={{ height: `${height * 100}%`, animationDelay: `${i * 0.18}s`, ['--twinkle-min' as string]: 0.35 }}
            className={`w-px origin-bottom bg-current ${musicOn ? 'animate-twinkle' : 'scale-y-[0.3]'} transition-transform duration-700`}
          />
        ))}
      </span>
      <span className="caps text-[0.55rem]">{musicOn ? 'Som' : 'Mudo'}</span>
    </button>
  )
}
