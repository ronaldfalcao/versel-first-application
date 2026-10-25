import type { Metadata } from 'next'
import { Inter, Source_Serif_4 } from 'next/font/google'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { JsonLd } from '@/lib/jsonld'
import { urlFor } from '@/sanity/image'
import { getSettings } from '@/sanity/fetch'
import { siteUrl } from '@/sanity/env'
import './globals.css'

const sans = Inter({ variable: '--font-sans', subsets: ['latin'] })
const serif = Source_Serif_4({ variable: '--font-serif', subsets: ['latin'] })

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
    <html lang="pt-BR" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
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
        <header className="border-b border-[var(--border)]">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
            <Link href="/" className="font-serif text-2xl font-bold">
              {settings.title}
            </Link>
            <a href="/feed.xml" className="text-sm text-[var(--muted)] hover:underline">
              RSS
            </a>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-[var(--border)]">
          <p className="mx-auto max-w-3xl px-4 py-6 text-sm text-[var(--muted)]">
            © {settings.title}
          </p>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
