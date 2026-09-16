'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { hero } from '@/data/content'
import { Photo } from '@/components/ui/Photo'
import { ArrowButton, HandNote, cinematicEase } from '@/components/ui/primitives'
import { SideIndex } from '@/components/nav/SideIndex'

const intro = (delay: number) => ({
  initial: { opacity: 0, y: 18, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  transition: { duration: 1.8, delay, ease: cinematicEase },
})

type HeroProps = { onEnter: () => void; leaving: boolean }

export function Hero({ onEnter, leaving }: HeroProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%'])
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-18%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const leave = {
    scale: leaving ? 1.12 : 1,
    opacity: leaving ? 0 : 1,
    filter: leaving ? 'blur(14px)' : 'blur(0px)',
  }

  return (
    <section id="inicio" ref={ref} aria-labelledby="hero-title" className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Atmosfera: a mesma foto, ampliada e desfocada, tinge o ceu inteiro. */}
      <motion.div style={{ y: photoY }} aria-hidden className="absolute inset-0 -z-20 hidden opacity-[0.16] lg:block">
        <Photo slug={hero.photo} sizes="30vw" decorative reveal={false} className="size-full scale-125 blur-3xl hue-rotate-[200deg]" />
      </motion.div>

      {/* Janela: a foto real em uma moldura curva, como vista de dentro da nave. */}
      <motion.div
        animate={leave}
        transition={{ duration: 1.2, ease: cinematicEase }}
        style={{ y: photoY, scale: photoScale }}
        className="absolute inset-x-0 top-0 bottom-[14%] -z-10 origin-[30%_40%] lg:right-auto lg:bottom-0 lg:w-[46vw]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.08, filter: 'blur(18px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 2.6, ease: cinematicEase }}
          className="relative size-full lg:[mask-image:linear-gradient(90deg,#000_55%,transparent_98%)]"
        >
          <Photo
            slug={hero.photo}
            priority
            reveal={false}
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="size-full lg:rounded-r-[7rem]"
          />
          <div className="absolute inset-0 hidden rounded-r-[7rem] shadow-[inset_-2px_0_0_rgb(190_200_255/0.25),inset_-30px_0_60px_-30px_rgb(128_147_255/0.35)] lg:block" />
        </motion.div>
      </motion.div>

      {/* Veus para leitura: escuro embaixo no celular, a direita no desktop. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(3_5_12/0.7)_0%,rgb(3_5_12/0.05)_22%,rgb(3_5_12/0.1)_42%,rgb(3_5_12/0.88)_66%,#03050c_100%)] lg:bg-[radial-gradient(90%_70%_at_62%_42%,rgb(3_5_12/0.55),transparent_70%),linear-gradient(180deg,rgb(3_5_12/0.55),transparent_25%,transparent_70%,#03050c)]"
      />

      <SideIndex />

      <HandNote className="absolute top-[18%] left-[var(--gutter)] hidden max-w-[9rem] text-[1.05rem] leading-snug lg:block">
        {hero.notes.left}
      </HandNote>
      <HandNote className="absolute right-[calc(var(--gutter)+2rem)] bottom-[20%] hidden max-w-[8rem] text-[1.05rem] leading-snug xl:block">
        {hero.notes.right}
      </HandNote>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        animate={leave}
        transition={{ duration: 1.1, ease: cinematicEase }}
        className="section-pad flex min-h-[100svh] flex-col items-center justify-end pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+2.5rem))] text-center lg:justify-center lg:pt-16 lg:pb-40 lg:pl-[30vw] xl:pl-[24vw]"
      >
        <motion.p {...intro(0.4)} className="max-w-[20rem] font-display text-[1.05rem] leading-snug text-balance text-mist italic sm:max-w-none lg:text-[1.35rem] lg:tracking-wide lg:not-italic 2xl:text-[clamp(1.35rem,1.2vw,2rem)]">
          {hero.kicker}
        </motion.p>

        <motion.h1
          id="hero-title"
          {...intro(0.8)}
          className="luminous mt-4 font-display text-[3.1rem] leading-[0.95] font-light xs:text-[3.5rem] sm:text-7xl lg:mt-6 lg:text-[6.4rem] 2xl:text-[clamp(6.4rem,5.6vw,10rem)]"
        >
          <span className="title-gradient">{hero.names[0]}</span>
          <span className="mx-[0.18em] font-extralight text-ice/80">+</span>
          <span className="title-gradient max-sm:block">{hero.names[1]}</span>
        </motion.h1>

        <motion.div {...intro(1.3)} className="mt-5 flex w-full max-w-md items-center gap-4 lg:mt-7">
          <span className="hairline flex-1" />
          <span className="caps font-display text-lg text-frost/90 lg:text-2xl">{hero.chapter}</span>
          <span className="hairline flex-1" />
        </motion.div>

        <motion.p {...intro(1.6)} className="caps mt-4 text-[0.6rem] text-mist/70 lg:text-[0.66rem]">
          {hero.tagline}
        </motion.p>

        <motion.div {...intro(2)} className="mt-9 lg:mt-10">
          <ArrowButton onClick={onEnter} disabled={leaving} aria-describedby="hero-title">
            {hero.cta}
          </ArrowButton>
        </motion.div>
      </motion.div>
    </section>
  )
}
