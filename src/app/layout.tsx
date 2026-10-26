import type { Metadata } from 'next'
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { JsonLd } from '@/lib/jsonld'
import { Art, Logo } from '@/components/Art'
import { getSettings } from '@/sanity/fetch'
import { siteUrl } from '@/sanity/env'
import './globals.css'

const sans = Geist({ variable: '--font-sans', subsets: ['latin'] })
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] })
const display = Bricolage_Grotesque({ variable: '--font-display', subsets: ['latin'], axes: ['opsz', 'wdth'] })

const NAV = [
  { href: '/', label: 'Início' },
  { href: '/arquivo', label: 'Arquivo' },
  { href: '/sobre', label: 'Sobre' },
]

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
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  }
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const settings = await getSettings()

  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}>
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
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Pular para o conteúdo
        </a>
        <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-display text-base font-bold tracking-tight sm:text-lg">{settings.title}</span>
            </Link>
            <nav aria-label="Principal" className="flex items-center gap-1 text-sm font-medium sm:gap-2">
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href} className="rounded-full px-2 py-1.5 text-muted sm:px-3 transition-colors hover:bg-surface hover:text-ink">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
          {children}
        </main>
        <footer className="relative overflow-hidden bg-indigo text-on-indigo">
          <Art seed={settings.title} cols={16} rows={1} className="h-12 sm:h-16" />
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-[1.4fr_1fr] sm:px-8">
            <div>
              <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{settings.title}</p>
              <p className="mt-4 max-w-md text-on-indigo-muted">{settings.description}</p>
            </div>
            <nav aria-label="Rodapé" className="grid grid-cols-2 content-start gap-x-8 gap-y-3 text-sm sm:justify-self-end">
              {[...NAV, { href: '/feed.xml', label: 'Feed RSS' }, { href: '/sitemap.xml', label: 'Mapa do site' }].map(({ href, label }) => (
                <a key={href} href={href} className="text-on-indigo-muted transition-colors hover:text-apricot">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
