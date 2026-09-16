/**
 * Todos os textos da experiencia, em ordem de aparicao.
 * Edite aqui — os componentes apenas leem estes valores.
 */
import type { PhotoSlug } from './photos'
import type { SectionId } from './types'

export const site = {
  title: 'ONE — Hyezza & Wendeel',
  description: '365 dias. Um universo nosso.',
  brand: 'ONE',
  couple: 'Hyezza & Wendeel',
  symbol: '365 / ∞',
} as const

export const navigation: readonly { id: SectionId; label: string }[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'historia', label: 'Nossa História' },
  { id: 'memorias', label: 'Memórias' },
  { id: 'voce', label: 'O Que Vejo em Você' },
  { id: 'futuro', label: 'Nosso Futuro' },
]

/** Indice decorativo no canto do hero (desktop). */
export const sideIndex: readonly { label: string }[] = [
  { label: '365 dias' },
  { label: 'Infinitas memórias' },
  { label: 'O mesmo nós' },
  { label: 'Sempre mais' },
]

export const hero = {
  photo: 'selfie-ceu-cosmico' satisfies PhotoSlug,
  corner: ['Mais que um ano.', 'Um universo nosso.'],
  kicker: 'Há 365 dias, duas histórias começaram a se tornar uma só.',
  names: ['Hyezza', 'Wendeel'],
  chapter: 'YEAR ONE',
  tagline: 'Mesmo universo. Sempre nós.',
  cta: 'Entrar na nossa história',
  notes: {
    left: 'Você faz tudo mais bonito.',
    right: 'Aqui também mora o amor.',
  },
} as const

export const days = {
  number: 365,
  label: 'Dias juntos',
  text: 'Sorrisos, conversas, descobertas, desafios e um tanto de amor que torna tudo mais leve.',
  aside: ['Um ano.', 'Infinitas razões', 'para agradecer.'],
} as const

/**
 * Momento de voz. Deixe `src` como null enquanto nao houver gravacao —
 * a secao so aparece quando existir um arquivo (ex.: '/audio/voz.mp3').
 */
export const voice = {
  src: null as string | null,
  title: 'Antes de continuar, ouça isso.',
  subtitle: 'Uma mensagem só para você.',
  playLabel: 'Ouvir',
  pauseLabel: 'Pausar',
} as const

export const constellation = {
  title: ['Memory', 'Constellation'],
  description: 'Cada momento nosso é uma estrela que continua brilhando.',
  aside: ['Pequenos momentos.', 'Grandes significados.', 'Nossa constelação.'],
  exploreLabel: 'Explorar memórias',
  storyLabel: 'Modo história',
  stopStoryLabel: 'Encerrar história',
  hint: 'Toque em uma estrela',
  closeLabel: 'Fechar memória',
  nextLabel: 'Próxima',
  previousLabel: 'Anterior',
} as const

export type Quality = {
  readonly id: string
  readonly icon: 'sun' | 'people' | 'heart' | 'mountain'
  readonly title: string
  readonly text: string
  readonly photo?: PhotoSlug
}

export const qualities = {
  title: ['The things', 'I see in you'],
  description: 'Coisas que fazem de você alguém tão especial.',
  portrait: 'refugio-luzes-noturnas' satisfies PhotoSlug,
  portraitNote: 'Do jeitinho que você é.',
  cards: [
    {
      id: 'alegria',
      icon: 'sun',
      title: 'Alegria',
      text: 'Você ilumina tudo ao redor, mesmo nos dias nublados.',
      photo: 'devaneio-dourado',
    },
    {
      id: 'companheirismo',
      icon: 'people',
      title: 'Companheirismo',
      text: 'Do seu lado, tudo faz mais sentido.',
      photo: 'luzes-noturnas',
    },
    {
      id: 'gentileza',
      icon: 'heart',
      title: 'Gentileza',
      text: 'Você torna o mundo um lugar mais bonito.',
      photo: 'aconchego-entardecer',
    },
    {
      id: 'forca',
      icon: 'mountain',
      title: 'Força',
      text: 'Você enfrenta a vida com uma coragem que me inspira.',
      photo: 'luzes-violetas',
    },
  ] satisfies Quality[],
  infinite: {
    symbol: '∞',
    label: 'Importância na minha vida:',
    value: 'impossível calcular.',
  },
} as const

/** Pausa emocional: as frases surgem uma de cada vez conforme a rolagem. */
export const pause = {
  photo: 'luzes-violetas' satisfies PhotoSlug,
  measures: ['365 dias.', '8.760 horas.', '525.600 minutos.'],
  confession: 'Mas nenhuma dessas medidas consegue explicar o que esse ano significou para mim.',
  closing: 'E eu escolheria viver tudo novamente.',
} as const

export const future = {
  eyebrow: 'Nosso futuro',
  photo: 'romance-cosmico-neon' satisfies PhotoSlug,
  startYear: 2026,
  years: 6,
  phrases: [
    'Lugares que ainda não conhecemos.',
    'Viagens que ainda não fizemos.',
    'Momentos que ainda não fotografamos.',
    'Histórias que ainda não existem.',
  ],
  finale: [
    'O futuro ainda não foi escrito.',
    'E talvez essa seja a melhor parte.',
    'Porque eu quero descobrir ele com você.',
  ],
} as const

export const yearTwo = {
  title: 'YEAR TWO',
  lines: ['Novos dias.', 'Novos sonhos.', 'Mais de nós.'],
  note: 'Que venham mais 365, e todos os outros.',
  cta: 'Continuar nossa história',
} as const

export const letter = {
  photo: 'luzes-noturnas' satisfies PhotoSlug,
  greeting: 'Hyezza,',
  paragraphs: [
    'há um ano eu não sabia exatamente onde tudo isso iria nos levar.',
    'Hoje eu só sei que sou muito feliz por ter vivido esse primeiro capítulo com você.',
    'Obrigado por cada momento, cada conversa, cada risada e até pelos dias difíceis que fizeram a gente crescer.',
    'Se eu pudesse voltar para o início sabendo tudo o que sei hoje, eu escolheria você novamente.',
    'Feliz 1 ano para nós.',
  ],
  signature: 'Wendeel ❤️',
  closeLabel: 'Voltar ao universo',
  /** Tempo (ms) depois da carta ate o simbolo final aparecer. */
  symbolDelayMs: 4000,
} as const

/**
 * Musica ambiente. Coloque o arquivo em public/audio/ e informe o caminho
 * (ex.: '/audio/trilha.mp3'). Com null, o botao de som nao aparece.
 * Nunca toca sozinha: so comeca depois do clique em "Entrar na nossa historia".
 */
export const music = {
  src: null as string | null,
  volume: 0.45,
  onLabel: 'Som ligado',
  offLabel: 'Som desligado',
} as const
