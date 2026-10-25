import { cacheLife, cacheTag } from 'next/cache'
import { client } from './client'
import {
  authorQuery,
  authorSlugsQuery,
  categoryQuery,
  categorySlugsQuery,
  postQuery,
  postSlugsQuery,
  postsQuery,
  settingsQuery,
} from './queries'
import type { Author, Category, Post, PostSummary, SiteSettings } from './types'

// Todo o conteúdo usa a mesma tag. O webhook do Sanity invalida essa tag ao publicar,
// e as páginas são regeneradas sob demanda (stale-while-revalidate). O perfil 'hours'
// garante que posts agendados (publishedAt no futuro) apareçam sem nova publicação.
export const SANITY_TAG = 'sanity'

const DEFAULT_SETTINGS: SiteSettings = {
  title: 'Diário Perdido',
  description: 'Um blog sobre o que vale a pena guardar.',
}

async function sanityFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  'use cache'
  cacheTag(SANITY_TAG)
  cacheLife('hours')
  if (!client) return fallback
  return (await client.fetch<T | null>(query, params)) ?? fallback
}

export const getSettings = async () => ({
  ...DEFAULT_SETTINGS,
  ...(await sanityFetch<Partial<SiteSettings>>(settingsQuery, {}, {})),
})

export const getPosts = (limit = 100) => sanityFetch<PostSummary[]>(postsQuery, { limit }, [])

export const getPost = (slug: string) => sanityFetch<Post | null>(postQuery, { slug }, null)

export const getPostSlugs = () =>
  sanityFetch<{ slug: string; publishedAt: string; updatedAt?: string }[]>(postSlugsQuery, {}, [])

export const getCategory = (slug: string) =>
  sanityFetch<(Category & { posts: PostSummary[] }) | null>(categoryQuery, { slug }, null)

export const getCategorySlugs = () => sanityFetch<{ slug: string }[]>(categorySlugsQuery, {}, [])

export const getAuthor = (slug: string) =>
  sanityFetch<(Author & { posts: PostSummary[] }) | null>(authorQuery, { slug }, null)

export const getAuthorSlugs = () => sanityFetch<{ slug: string }[]>(authorSlugsQuery, {}, [])
