'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { hero, navigation, site } from '@/data/content'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cinematicEase } from '@/components/ui/primitives'

const SECTION_IDS = navigation.map((item) => item.id)
const SOLID_AFTER_PX = 40

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function TopBar() {
  const active = useActiveSection(SECTION_IDS)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > SOLID_AFTER_PX))

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollToSection(id)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${solid ? 'opacity-100' : 'opacity-0'} bg-gradient-to-b from-void/85 via-void/50 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(#000_60%,transparent)]`}
      />
      <div className="section-pad relative flex items-start justify-between pt-[max(1rem,env(safe-area-inset-top))] pb-6 lg:pt-6">
        <button type="button" onClick={() => go('inicio')} className="text-left" aria-label="Voltar ao início">
          <span className="block font-display text-2xl leading-none font-light tracking-[0.42em] text-frost">{site.brand}</span>
          <span className="mt-1 block font-display text-[0.8rem] tracking-[0.12em] text-mist">{site.couple}</span>
        </button>

        <nav aria-label="Seções" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-full px-5 py-2 text-[0.8rem] tracking-wide transition-colors duration-500 ${
                      isActive ? 'text-frost' : 'text-mist/70 hover:text-frost'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ duration: 0.8, ease: cinematicEase }}
                        className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(80%_120%_at_50%_120%,rgb(128_147_255/0.35),transparent_70%)]"
                      >
                        <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-ice to-transparent" />
                      </motion.span>
                    )}
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <p className="text-right text-[0.78rem] leading-snug text-mist/80">
            {hero.corner.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <span
            aria-hidden
            className="size-8 rounded-full bg-[radial-gradient(circle_at_35%_30%,#e9ecff,#8c96c8_45%,#20264a_75%)] shadow-[0_0_24px_rgb(169_188_255/0.45)]"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className="glass relative grid size-11 place-items-center rounded-full lg:hidden"
        >
          <span className={`absolute h-px w-4 bg-frost transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-[3px]'}`} />
          <span className={`absolute h-px w-4 bg-frost transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-[3px]'}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Seções"
            initial={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
            transition={{ duration: 0.6, ease: cinematicEase }}
            className="glass glass-strong absolute inset-x-4 top-[calc(max(1rem,env(safe-area-inset-top))+3.75rem)] rounded-3xl p-3 lg:hidden"
          >
            <ul>
              {navigation.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left font-display text-xl ${
                      active === item.id ? 'bg-white/[0.06] text-frost' : 'text-mist'
                    }`}
                  >
                    {item.label}
                    <span className="font-sans text-[0.65rem] tracking-[0.3em] text-dim">0{i + 1}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
