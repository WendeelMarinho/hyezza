'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { qualities, type Quality } from '@/data/content'
import { useTilt } from '@/hooks/useTilt'
import { Photo } from '@/components/ui/Photo'
import { HandNote, Reveal, SectionHeading } from '@/components/ui/primitives'

const ICONS: Record<Quality['icon'], React.ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <circle cx="16.5" cy="9.5" r="2.4" />
      <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M14.5 14.3c.6-.2 1.3-.3 2-.3 2.2 0 3.8 1.5 4.3 4" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />,
  mountain: (
    <>
      <path d="M3 19h18L14.5 7.5 11 13.5l-2-3z" />
      <path d="M12.4 11.2 14.5 7.5l1.6 2.8" />
    </>
  ),
}

function QualityCard({ quality, index }: { quality: Quality; index: number }) {
  const tilt = useTilt(4)
  return (
    <Reveal delay={0.1 * index} className="h-full">
      <motion.article
        style={tilt.style}
        {...tilt.handlers}
        className="glass group relative flex h-full gap-5 overflow-hidden rounded-[1.6rem] p-5 sm:p-6 lg:min-h-[13.5rem] lg:flex-col lg:gap-0 lg:p-7"
      >
        {quality.photo && (
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 w-2/3 opacity-25 transition-opacity duration-1000 ease-cinema [mask-image:linear-gradient(90deg,transparent,#000_70%)] group-hover:opacity-50 lg:inset-x-0 lg:top-auto lg:h-3/5 lg:w-full lg:opacity-0 lg:[mask-image:linear-gradient(0deg,#000_10%,transparent)]"
          >
            <Photo slug={quality.photo} sizes="320px" decorative className="size-full" imgClassName="saturate-[0.8]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(8_11_26/0.85),rgb(8_11_26/0.3))]" />
          </div>
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(260px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgb(160_180_255/0.12),transparent_70%)]"
        />
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="relative size-8 shrink-0 fill-none stroke-ice stroke-[1.1] drop-shadow-[0_0_8px_rgb(169_188_255/0.7)] lg:size-9"
        >
          {ICONS[quality.icon]}
        </svg>
        <div className="relative lg:mt-auto">
          <h3 className="font-display text-2xl text-frost lg:text-[1.65rem]">{quality.title}</h3>
          <p className="mt-1.5 text-[0.9rem] leading-relaxed text-mist/90 lg:mt-2 lg:text-[0.88rem]">{quality.text}</p>
        </div>
      </motion.article>
    </Reveal>
  )
}

function InfiniteCard() {
  const { infinite } = qualities
  return (
    <Reveal delay={0.45}>
      <article className="glass relative overflow-hidden rounded-[1.6rem] px-6 py-8 text-center sm:px-10">
        <span aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_90%_at_50%_0%,rgb(128_147_255/0.16),transparent)]" />
        <p aria-hidden className="luminous relative animate-breathe font-display text-6xl leading-none font-extralight text-frost">
          {infinite.symbol}
        </p>
        <p className="relative mt-4 font-display text-xl text-mist">{infinite.label}</p>
        <p className="title-gradient relative font-display text-3xl">{infinite.value}</p>
        <div aria-hidden className="relative mx-auto mt-6 h-px max-w-xs overflow-hidden bg-white/10">
          <span className="absolute inset-y-0 left-0 w-1/2 animate-sweep bg-gradient-to-r from-transparent via-ice to-transparent shadow-[0_0_10px_rgb(169_188_255)] [animation-duration:4.5s]" />
        </div>
      </article>
    </Reveal>
  )
}

export function Qualities() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const portraitY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  return (
    <section id="voce" ref={ref} aria-labelledby="voce-title" className="section-pad relative scroll-mt-20 py-20 lg:py-32">
      <div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <Reveal>
            <div id="voce-title">
              <SectionHeading lines={qualities.title} />
            </div>
            <p className="mt-4 max-w-xs font-display text-lg leading-snug text-mist">{qualities.description}</p>
            <span className="mt-5 block h-px w-10 bg-mist/40" />
          </Reveal>

          <Reveal delay={0.2} blur={20} className="relative mt-10">
            <motion.figure style={{ y: portraitY }} className="glass relative overflow-hidden rounded-[2rem] p-2">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.6rem]">
                <Photo slug={qualities.portrait} sizes="(min-width: 1024px) 38vw, 100vw" className="absolute inset-0" imgClassName="animate-kenburns" />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(3_5_12/0.75),transparent_45%),radial-gradient(120%_80%_at_50%_40%,transparent_55%,rgb(3_5_12/0.55))]" />
              </div>
              <figcaption className="absolute right-8 bottom-6 max-w-[60%] text-right">
                <HandNote className="text-lg text-frost/85">{qualities.portraitNote}</HandNote>
              </figcaption>
            </motion.figure>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 lg:justify-end">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {qualities.cards.map((quality, i) => (
              <QualityCard key={quality.id} quality={quality} index={i} />
            ))}
          </div>
          <InfiniteCard />
        </div>
      </div>
    </section>
  )
}
