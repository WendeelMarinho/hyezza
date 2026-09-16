# ONE — Hyezza & Wendeel · YEAR ONE

Experiência web cinematográfica para comemorar o primeiro ano juntos.
Site 100% estático (Next.js `output: 'export'`), sem rastreadores, sem cookies e fora dos buscadores (`noindex, nofollow`).

## Rodar

Requer Node 20+ (testado com Node 24).

```bash
npm install
npm run dev          # desenvolvimento em http://localhost:3000
npm run build        # gera a pasta out/ (site final)
npm run serve        # serve out/ em http://localhost:4173
```

Qualidade:

```bash
npm run lint
npm run typecheck
npm test                         # testes unitários (vitest)
npm run test:coverage            # cobertura (mínimo 80%)
PW_CHANNEL=chrome npm run test:e2e   # fluxos no navegador (usa o Chrome instalado)
```

## Deploy na Vercel

1. Importe o repositório na Vercel (framework detectado: Next.js).
2. Não é preciso configurar nada: build `next build`, saída estática.
3. `vercel.json` já define cabeçalhos de segurança e `X-Robots-Tag: noindex`.

Em outro host (nginx, caddy…), publique a pasta `out/` e, se quiser, defina
`NEXT_PUBLIC_SITE_URL=https://seu-dominio` antes do build para as imagens de compartilhamento.

## Estrutura

```
src/
├── app/                    layout, metadados, robots, ícone e imagem de compartilhamento
├── data/                   ← TODO O CONTEÚDO EDITÁVEL
│   ├── content.ts          textos de todas as seções, carta, música e voz
│   ├── memories.ts         memórias da constelação
│   ├── photos.ts           catálogo de fotos (função, clima, ponto focal)
│   └── photo-assets.generated.ts   gerado por `npm run images` (não editar)
├── components/
│   ├── experience/         orquestração (transições, som, carta)
│   ├── scene/              céu estrelado (canvas) e atmosfera
│   ├── nav/                barra superior, índice do hero, botão de som
│   ├── constellation/      Memory Constellation (mapa, cápsulas, modo história)
│   ├── sections/           Hero, 365, Things I See in You, Pausa, Futuro, Year Two, Carta
│   └── ui/                 Foto responsiva, botões, orbital, notas manuscritas
├── hooks/                  mídia, inclinação por cursor, progresso de rolagem
└── lib/                    lógica pura testada (constelação, formatação, fotos)
scripts/
├── photo-sources.json      quais arquivos de imgs/ viram fotos do site
└── process-images.mjs      gera WebP responsivo + placeholder
```

## Como editar

### Textos
Tudo em `src/data/content.ts`, na ordem em que aparece (hero → 365 → constelação → qualidades → pausa → futuro → Year Two → carta).

### Memórias
`src/data/memories.ts`. Cada item:

```ts
{
  id: 'nosso-primeiro-cafe',          // único
  title: 'Nosso primeiro café',
  date: '12 MAR 2026',                // ou null para não mostrar
  caption: 'Texto curto…',
  category: 'nossas',                 // 'nossas' | 'em-voce' | 'futuro'
  photo: 'selfie-neon-futurista',     // opcional (slug de photos.ts)
  position: { x: 23, y: 66 },         // posição no mapa, em %
  pinned: true,                       // opcional: miniatura visível no mapa
  pinSideMobile: 'left',              // opcional: lado da miniatura no celular
}
```

A ordem da lista define as linhas da constelação e o caminho do "Modo história".
No celular o mapa é girado automaticamente para a vertical. `npm test` avisa se algo estiver inconsistente (id repetido, foto inexistente, posição fora do mapa).

### Fotos
1. Coloque o arquivo em `imgs/` (esta pasta não vai para o git; só as versões otimizadas vão).
2. Registre em `scripts/photo-sources.json` com um `slug` e a rotação (`rotate`: 0, 90, 180 ou 270, sentido horário).
3. Rode `npm run images`.
4. Descreva a foto em `src/data/photos.ts` (texto alternativo, clima, `focus` = ponto entre os rostos, em %).
5. Use o slug onde quiser: `hero.photo`, `memories[].photo`, `qualities.cards[].photo`, etc.

Fotos originais sem tratamento podem ficar em `public/images/original/`.

### Música ambiente
1. Coloque o arquivo em `public/audio/` (ex.: `trilha.mp3`).
2. Em `src/data/content.ts`: `music.src = '/audio/trilha.mp3'`.

A música nunca toca sozinha: começa no clique em "Entrar na nossa história", e o botão discreto de som aparece no canto.

### Mensagem de voz
1. Coloque o arquivo em `public/audio/` (ex.: `voz.mp3`).
2. Em `src/data/content.ts`: `voice.src = '/audio/voz.mp3'`.

A seção "Antes de continuar, ouça isso." aparece automaticamente depois do card dos 365 dias.

### Imagem de compartilhamento
`src/app/opengraph-image.jpg` (1200×630), capturada do próprio hero. Substitua pelo arquivo que preferir.
