// Converte as fotos brutas de imgs/ em WebP responsivo + placeholder borrado.
// Uso: npm run images
import { readFile, mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const manifest = JSON.parse(await readFile(path.join(ROOT, 'scripts/photo-sources.json'), 'utf8'))
const OUT_DIR = path.join(ROOT, manifest.outDir)
const GENERATED = path.join(ROOT, 'src/data/photo-assets.generated.ts')
const WEBP_QUALITY = 78
const PLACEHOLDER_WIDTH = 16

async function processPhoto({ slug, file, rotate }) {
  const input = path.join(ROOT, manifest.sourceDir, file)
  await access(input)
  const upright = await sharp(input).rotate(rotate).toBuffer()
  const { width, height } = await sharp(upright).metadata()

  const widths = manifest.widths.filter((w) => w < width).concat(width)
  const variants = []
  for (const w of [...new Set(widths)]) {
    const name = `${slug}-${w}.webp`
    await sharp(upright).resize({ width: w }).webp({ quality: WEBP_QUALITY }).toFile(path.join(OUT_DIR, name))
    variants.push({ width: w, src: `/images/stylized/${name}` })
  }

  const tiny = await sharp(upright).resize({ width: PLACEHOLDER_WIDTH }).webp({ quality: 40 }).toBuffer()
  return { slug, width, height, variants, placeholder: `data:image/webp;base64,${tiny.toString('base64')}` }
}

await mkdir(OUT_DIR, { recursive: true })
const assets = []
for (const photo of manifest.photos) {
  const asset = await processPhoto(photo)
  assets.push(asset)
  console.log(`✓ ${asset.slug} (${asset.width}x${asset.height}) → ${asset.variants.length} variantes`)
}

const body = Object.fromEntries(assets.map(({ slug, ...rest }) => [slug, rest]))
await writeFile(
  GENERATED,
  `// Arquivo gerado por scripts/process-images.mjs — nao edite a mao.\n` +
    `import type { PhotoAsset } from './types'\n\n` +
    `export const photoAssets = ${JSON.stringify(body, null, 2)} as const satisfies Record<string, PhotoAsset>\n\n` +
    `export type PhotoSlug = keyof typeof photoAssets\n`,
)
console.log(`\n${assets.length} fotos processadas → ${path.relative(ROOT, GENERATED)}`)
