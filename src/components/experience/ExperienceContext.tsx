'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { music } from '@/data/content'

type ExperienceState = {
  /** Multiplicador de velocidade das estrelas (1 = repouso). Lido pelo canvas a cada quadro. */
  warpRef: React.RefObject<number>
  setWarp: (value: number) => void
  hasMusic: boolean
  musicOn: boolean
  startMusic: () => void
  toggleMusic: () => void
  letterRead: boolean
  markLetterRead: () => void
}

const ExperienceContext = createContext<ExperienceState | null>(null)

const FADE_STEP_MS = 60
const FADE_STEPS = 20

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const warpRef = useRef(1)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [musicOn, setMusicOn] = useState(false)
  const [letterRead, setLetterRead] = useState(false)
  const hasMusic = music.src !== null

  const setWarp = useCallback((value: number) => {
    warpRef.current = value
  }, [])

  const fadeTo = useCallback((audio: HTMLAudioElement, target: number) => {
    const start = audio.volume
    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      audio.volume = start + ((target - start) * step) / FADE_STEPS
      if (step >= FADE_STEPS) {
        window.clearInterval(timer)
        if (target === 0) audio.pause()
      }
    }, FADE_STEP_MS)
  }, [])

  const play = useCallback(() => {
    if (!music.src) return
    const audio = audioRef.current ?? new Audio(music.src)
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio
    audio
      .play()
      .then(() => {
        setMusicOn(true)
        fadeTo(audio, music.volume)
      })
      .catch((error: unknown) => {
        // Navegador bloqueou ou arquivo ausente: a experiencia segue sem som.
        console.warn('Música ambiente indisponível', error)
        setMusicOn(false)
      })
  }, [fadeTo])

  const startMusic = useCallback(() => {
    if (!musicOn) play()
  }, [musicOn, play])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (musicOn && audio) {
      fadeTo(audio, 0)
      setMusicOn(false)
      return
    }
    play()
  }, [fadeTo, musicOn, play])

  useEffect(() => () => audioRef.current?.pause(), [])

  const value = useMemo(
    () => ({
      warpRef,
      setWarp,
      hasMusic,
      musicOn,
      startMusic,
      toggleMusic,
      letterRead,
      markLetterRead: () => setLetterRead(true),
    }),
    [setWarp, hasMusic, musicOn, startMusic, toggleMusic, letterRead],
  )

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
}

export function useExperience(): ExperienceState {
  const context = useContext(ExperienceContext)
  if (!context) throw new Error('useExperience precisa estar dentro de <ExperienceProvider>')
  return context
}
