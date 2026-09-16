'use client'

import { useEffect, useRef, useState } from 'react'
import { voice } from '@/data/content'
import { Reveal } from '@/components/ui/primitives'

/**
 * "Antes de continuar, ouca isso." — so aparece quando voice.src existe
 * (src/data/content.ts). Nunca toca sozinho.
 */
export function VoiceMoment() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
    const onEnd = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  if (!voice.src) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }
    audio
      .play()
      .then(() => setPlaying(true))
      .catch((error: unknown) => console.warn('Mensagem de voz indisponível', error))
  }

  return (
    <section aria-label={voice.title} className="section-pad py-20 text-center">
      <Reveal className="mx-auto max-w-md">
        <p className="font-display text-2xl text-frost italic">{voice.title}</p>
        <p className="caps mt-3 text-[0.6rem] text-mist/60">{voice.subtitle}</p>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          className="glass mx-auto mt-8 flex w-full max-w-xs items-center gap-4 rounded-full py-2 pr-6 pl-2 text-left"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ice/40 bg-glow/10">
            <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-frost">
              {playing ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <path d="M8 5.5v13l10-6.5z" />}
            </svg>
          </span>
          <span className="flex-1">
            <span className="caps block text-[0.6rem] text-mist">{playing ? voice.pauseLabel : voice.playLabel}</span>
            <span className="mt-2 block h-px bg-mist/20">
              <span className="block h-px bg-ice shadow-[0_0_6px_rgb(169_188_255)]" style={{ width: `${progress * 100}%` }} />
            </span>
          </span>
        </button>
        <audio ref={audioRef} src={voice.src} preload="none" />
      </Reveal>
    </section>
  )
}
