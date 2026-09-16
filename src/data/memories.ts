/**
 * Memorias da constelacao. Cada item vira uma estrela clicavel.
 *
 * - `date`: texto livre ("12 MAR 2026") ou null para nao exibir data.
 * - `photo`: slug de src/data/photos.ts (opcional).
 * - `position`: onde a estrela fica no mapa (desktop), em % (x: 0–100, y: 0–100).
 *   No celular o mapa e girado automaticamente para a vertical.
 * - `pinned`: mostra a miniatura da foto direto no mapa (`pinSideMobile` escolhe o lado no celular).
 * - A ordem da lista define o caminho do "modo historia" e as linhas da constelacao.
 *
 * Os textos abaixo sao pontos de partida — troque pelas lembrancas reais.
 */
import type { ConstellationWord, Memory, MemoryCategory } from './types'

export const memoryCategories: Record<MemoryCategory, { label: string; hint: string }> = {
  nossas: { label: 'Memórias nossas', hint: 'O que já vivemos' },
  'em-voce': { label: 'Coisas que vejo em você', hint: 'O que me encanta' },
  futuro: { label: 'O que ainda quero viver', hint: 'O que vem por aí' },
}

export const memories: readonly Memory[] = [
  {
    id: 'o-comeco',
    title: 'O começo do nosso universo',
    date: null,
    caption: 'Antes de tudo ter nome, já existia aquela sensação de que algo bonito estava começando.',
    category: 'nossas',
    position: { x: 5, y: 56 },
  },
  {
    id: 'primeiro-encontro',
    title: 'Nosso primeiro encontro',
    date: null,
    caption: 'O dia em que duas histórias se cruzaram e decidiram continuar juntas.',
    category: 'nossas',
    position: { x: 14, y: 28 },
  },
  {
    id: 'primeiro-cafe',
    title: 'Nosso primeiro café',
    date: null,
    caption: 'Uma mesa, uma conversa e a vontade de que o tempo andasse mais devagar.',
    category: 'nossas',
    position: { x: 23, y: 66 },
  },
  {
    id: 'cidade-acesa',
    title: 'A cidade acesa',
    date: null,
    caption: 'A cidade inteira brilhando lá fora, e mesmo assim eu só conseguia olhar para você.',
    category: 'nossas',
    photo: 'selfie-neon-futurista',
    position: { x: 32, y: 38 },
    pinned: true,
  },
  {
    id: 'seu-olhar',
    title: 'O jeito que você olha o mundo',
    date: null,
    caption: 'Com curiosidade, com carinho e com uma coragem que eu admiro todos os dias.',
    category: 'em-voce',
    position: { x: 44, y: 16 },
  },
  {
    id: 'um-momento-so-nosso',
    title: 'Um momento só nosso',
    date: null,
    caption: 'Nenhum lugar é pequeno demais quando cabe nós dois dentro dele.',
    category: 'nossas',
    photo: 'reflexos-futuristas',
    position: { x: 49, y: 52 },
  },
  {
    id: 'aquele-por-do-sol',
    title: 'Aquele pôr do sol',
    date: null,
    caption: 'A luz foi embora devagar, e a lembrança ficou para sempre.',
    category: 'nossas',
    photo: 'aconchego-entardecer',
    position: { x: 56, y: 62 },
    pinned: true,
  },
  {
    id: 'uma-pausa-no-tempo',
    title: 'Uma pausa no tempo',
    date: null,
    caption: 'Você, a luz dourada e aquela leveza que só você tem.',
    category: 'em-voce',
    photo: 'devaneio-dourado',
    position: { x: 64, y: 36 },
  },
  {
    id: 'noite-neon',
    title: 'Noite neon',
    date: null,
    caption: 'Azul, roxo e o seu rosto encostado no meu. Eu guardaria essa noite num potinho.',
    category: 'nossas',
    photo: 'neon-azul-roxo',
    position: { x: 76, y: 32 },
    pinned: true,
    pinSideMobile: 'left',
  },
  {
    id: 'dias-simples',
    title: 'Dias simples',
    date: null,
    caption: 'Os dias sem nada de especial que, do seu lado, viraram os meus preferidos.',
    category: 'nossas',
    position: { x: 80, y: 60 },
  },
  {
    id: 'nosso-refugio',
    title: 'Nosso refúgio',
    date: null,
    caption: 'Não é um lugar. É o que eu sinto quando estou com você.',
    category: 'nossas',
    position: { x: 89, y: 38 },
  },
  {
    id: 'lugares-novos',
    title: 'Lugares que ainda vamos conhecer',
    date: null,
    caption: 'Um mapa inteiro esperando por nós dois.',
    category: 'futuro',
    position: { x: 90, y: 80 },
  },
  {
    id: 'nossos-planos',
    title: 'Nossos planos malucos',
    date: null,
    caption: 'Os que a gente fala rindo e, no fundo, sabe que vai fazer.',
    category: 'futuro',
    position: { x: 97, y: 58 },
  },
]

/** Palavras soltas espalhadas entre as estrelas. */
export const constellationWords: readonly ConstellationWord[] = [
  { text: 'Você', position: { x: 9, y: 84 } },
  { text: 'Eu', position: { x: 29, y: 16 } },
  { text: 'Nós', position: { x: 84, y: 84 } },
  { text: 'Conversas', position: { x: 38, y: 88 } },
  { text: 'Planos', position: { x: 96, y: 22 } },
  { text: 'Sempre', position: { x: 70, y: 90 } },
  { text: 'Risadas', position: { x: 54, y: 8 } },
  { text: 'Descobertas', position: { x: 20, y: 46 } },
]
