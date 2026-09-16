/**
 * Progresso (0–1) de uma secao alta com conteudo sticky.
 * @param top posicao do topo da secao em relacao a janela (getBoundingClientRect().top)
 */
export function stickyProgress(top: number, height: number, viewport: number): number {
  const range = height - viewport
  if (range <= 0) return 0
  return Math.min(1, Math.max(0, -top / range))
}
