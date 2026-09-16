import { sideIndex } from '@/data/content'

/** Indice vertical decorativo do hero (desktop largo), como um painel de instrumentos. */
export function SideIndex() {
  return (
    <ul aria-hidden className="absolute top-[14%] right-[var(--gutter)] hidden space-y-4 xl:block">
      {sideIndex.map((item, i) => (
        <li key={item.label} className="flex items-center gap-3">
          <span className={`h-px ${i === 0 ? 'w-6 bg-ice shadow-[0_0_8px_rgb(169_188_255)]' : 'w-3 bg-mist/40'}`} />
          <span className={`caps text-[0.56rem] ${i === 0 ? 'text-frost/90' : 'text-mist/55'}`}>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
