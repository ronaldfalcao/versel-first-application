import type { PortableTextBlock } from 'next-sanity'

export type SanityImage = {
  asset?: { _ref: string }
  alt?: string
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  dimensions?: { width: number; height: number }
}

export type AuthorRef = {
  name: string
  slug: string
  jobTitle?: string
  image?: SanityImage
}

export type Author = AuthorRef & { bio?: string; sameAs?: string[] }

export type Category = { title: string; slug: string; description?: string }

export type PostSummary = {
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  updatedAt?: string
  readingMinutes?: number
  mainImage?: SanityImage
  author?: AuthorRef
  categories?: Category[]
}

export type Post = PostSummary & {
  body?: PortableTextBlock[]
  seo?: { metaTitle?: string; metaDescription?: string; noIndex?: boolean }
}

export type SiteSettings = {
  title: string
  description: string
  about?: PortableTextBlock[]
  sameAs?: string[]
}
