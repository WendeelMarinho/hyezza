'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M5 12h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type ArrowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; size?: 'lg' | 'sm' }

/** CTA em pilula de vidro com orbe de seta — o botao-assinatura da experiencia. */
export function ArrowButton({ children, size = 'lg', className = '', ...rest }: ArrowButtonProps) {
  const large = size === 'lg'
  return (
    <button
      type="button"
      {...rest}
      className={`glass group relative inline-flex items-center overflow-hidden rounded-full text-frost transition-[box-shadow,border-color,transform] duration-700 ease-cinema hover:border-ice/40 hover:shadow-[0_0_50px_-8px_rgb(128_147_255/0.55)] active:scale-[0.98] ${
        large ? 'gap-6 py-2.5 pr-2.5 pl-8 text-[1.05rem] sm:gap-10 sm:pl-10 sm:text-lg' : 'gap-5 py-1.5 pr-1.5 pl-5 text-sm'
      } ${className}`}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <span className="relative font-display tracking-wide">{children}</span>
      <span
        className={`relative grid place-items-center rounded-full border border-ice/40 bg-glow/10 shadow-[0_0_24px_-4px_rgb(128_147_255/0.8)] transition-transform duration-700 ease-cinema group-hover:translate-x-0.5 ${
          large ? 'size-11' : 'size-8'
        }`}
      >
        <ArrowIcon className={large ? 'size-5' : 'size-4'} />
      </span>
    </button>
  )
}

/** Pequeno sistema orbital: anel inclinado, satelite e nucleo luminoso. */
export function Orbital({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <div className="absolute inset-[18%] animate-breathe rounded-full bg-[radial-gradient(circle,rgb(169_188_255/0.35),transparent_65%)]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
        <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="rgb(200 210 255 / 0.35)" strokeWidth="0.6" transform="rotate(-28 50 50)" />
        <ellipse cx="50" cy="50" rx="30" ry="44" fill="none" stroke="rgb(200 210 255 / 0.18)" strokeWidth="0.5" transform="rotate(20 50 50)" />
        <circle cx="50" cy="50" r="2.4" fill="white" />
      </svg>
      <div className="absolute inset-0 animate-orbit">
        <span className="absolute top-[6%] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgb(169_188_255/0.9)]" />
      </div>
      <div className="absolute inset-[22%] animate-orbit [animation-direction:reverse] [animation-duration:9s]">
        <span className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-ice shadow-[0_0_8px_2px_rgb(169_188_255/0.7)]" />
      </div>
    </div>
  )
}

export function HandNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p aria-hidden className={`font-hand text-mist/70 [transform:rotate(-8deg)] ${className}`}>
      {children}
      <svg viewBox="0 0 24 24" className="mt-2 ml-2 inline-block size-3.5 align-middle opacity-70">
        <path
          d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    </p>
  )
}

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number; blur?: number }

/** Surge com desfoque e leve subida quando entra na tela. */
export function Reveal({ delay = 0, y = 24, blur = 10, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reduce ? 0.4 : 1.4, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ lines, className = '' }: { lines: readonly string[]; className?: string }) {
  return (
    <h2 className={`font-display text-[1.9rem] leading-[1.08] font-light tracking-[0.12em] uppercase sm:text-[2.2rem] ${className}`}>
      {lines.map((line) => (
        <span key={line} className="title-gradient block">
          {line}
        </span>
      ))}
    </h2>
  )
}

export const cinematicEase = EASE
