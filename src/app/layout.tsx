import type { Metadata } from 'next'
import { Fraunces, Inter, Source_Serif_4 } from 'next/font/google'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { JsonLd } from '@/lib/jsonld'
import { urlFor } from '@/sanity/image'
import { getSettings } from '@/sanity/fetch'
import { siteUrl } from '@/sanity/env'
import './globals.css'

const sans = Inter({ variable: '--font-sans', subsets: ['latin'] })
const serif = Source_Serif_4({ variable: '--font-serif', subsets: ['latin'], style: ['normal', 'italic'] })
const display = Fraunces({ variable: '--font-display', subsets: ['latin'], axes: ['opsz', 'SOFT'] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.title, template: `%s · ${settings.title}` },
    description: settings.description,
    alternates: {
      canonical: '/',
      types: { 'application/rss+xml': [{ url: '/feed.xml', title: settings.title }] },
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: settings.title,
      ...(settings.ogImage?.asset && {
        images: [{ url: urlFor(settings.ogImage).width(1200).height(630).url(), width: 1200, height: 630 }],
      }),
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  }
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const settings = await getSettings()

  return (
    <html lang="pt-BR" className={`${sans.variable} ${serif.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: settings.title,
            description: settings.description,
            url: siteUrl,
            inLanguage: 'pt-BR',
            publisher: { '@type': 'Organization', name: settings.title, url: siteUrl, sameAs: settings.sameAs },
          }}
        />
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-paper focus:px-3 focus:py-2">
          Pular para o conteúdo
        </a>
        <header>
          <div className="relative mx-auto flex max-w-5xl items-center justify-between px-5 pb-6 pt-10 sm:px-8">
            <span className="ribbon left-5 sm:left-8" aria-hidden />
            <Link href="/" className="pl-7 font-display text-[1.6rem] font-semibold tracking-tight sm:text-3xl">
              {settings.title}
            </Link>
            <nav aria-label="Principal" className="flex items-center gap-6 text-sm text-muted">
              <Link href="/" className="transition-colors hover:text-accent">
                Início
              </Link>
              <a href="/feed.xml" className="transition-colors hover:text-accent">
                RSS
              </a>
            </nav>
          </div>
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="border-b border-line" />
          </div>
        </header>
        <main id="conteudo" className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
          {children}
        </main>
        <footer className="mt-12 bg-paper-deep">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div className="max-w-sm">
              <p className="font-display text-xl font-semibold">{settings.title}</p>
              <p className="mt-2 font-serif italic leading-relaxed text-muted">{settings.description}</p>
            </div>
            <nav aria-label="Rodapé" className="flex gap-6 text-sm text-muted">
              <a href="/feed.xml" className="hover:text-accent">
                Feed RSS
              </a>
              <a href="/sitemap.xml" className="hover:text-accent">
                Mapa do site
              </a>
            </nav>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
