'use client'

import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Padrao de dialogo acessivel: move o foco para dentro ao abrir, prende o Tab
 * no conteudo e devolve o foco ao elemento de origem ao fechar.
 */
export function useDialogFocus(containerRef: RefObject<HTMLElement | null>, open: boolean, initialRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null

    const focusables = () => [...(containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
    const frame = requestAnimationFrame(() => {
      const target = initialRef?.current ?? focusables()[0] ?? containerRef.current
      target?.focus({ preventScroll: true })
    })

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const inside = containerRef.current?.contains(document.activeElement) ?? false
      if (event.shiftKey && (document.activeElement === first || !inside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
      previous?.focus({ preventScroll: true })
    }
  }, [containerRef, initialRef, open])
}
