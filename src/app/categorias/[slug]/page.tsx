import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PostGrid } from '@/components/PostCard'
import { getCategory, getCategorySlugs } from '@/sanity/fetch'

export async function generateStaticParams() {
  const slugs = await getCategorySlugs()
  return slugs.length ? slugs : [{ slug: '__sem-categorias__' }]
}

export async function generateMetadata({ params }: PageProps<'/categorias/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/categorias/${category.slug}` },
  }
}

async function CategoryContent({ params }: Pick<PageProps<'/categorias/[slug]'>, 'params'>) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  return (
    <>
      <header className="mb-10">
        <p className="text-sm uppercase tracking-wide text-[var(--accent)]">Categoria</p>
        <h1 className="font-serif text-4xl font-bold">{category.title}</h1>
        {category.description && <p className="mt-3 text-lg text-[var(--muted)]">{category.description}</p>}
      </header>
      <PostGrid posts={category.posts} />
    </>
  )
}

export default function CategoryPage({ params }: PageProps<'/categorias/[slug]'>) {
  return (
    <Suspense fallback={<p className="text-[var(--muted)]">Carregando…</p>}>
      <CategoryContent params={params} />
    </Suspense>
  )
}
