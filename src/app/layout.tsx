import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope, Nothing_You_Could_Do } from 'next/font/google'
import { site } from '@/data/content'
import './globals.css'

const display = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const sans = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

const hand = Nothing_You_Could_Do({
  variable: '--font-handwriting',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

// Na Vercel o Next usa a URL do projeto automaticamente; em outros hosts, defina NEXT_PUBLIC_SITE_URL.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: site.title,
  description: site.description,
  applicationName: site.brand,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: site.title,
    description: site.description,
    type: 'website',
    locale: 'pt_BR',
    siteName: site.brand,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  referrer: 'no-referrer',
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#04060d',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  )
}
