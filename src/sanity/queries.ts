import { defineQuery } from 'next-sanity'

// Só documentos publicados (sem rascunhos) e com data de publicação no passado
const visiblePost = `_type == "post" && defined(slug.current) && publishedAt <= now()`

const imageFields = `asset, alt, hotspot, crop, "dimensions": asset->metadata.dimensions{width, height}`

const postSummaryFields = `
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  "readingMinutes": round(length(pt::text(body)) / 5 / 200),
  mainImage{${imageFields}},
  author->{name, "slug": slug.current, jobTitle, image{${imageFields}}},
  categories[]->{title, "slug": slug.current}
`

export const postsQuery = defineQuery(
  `*[${visiblePost}] | order(publishedAt desc) [0...$limit] {${postSummaryFields}}`,
)

export const postQuery = defineQuery(
  `*[${visiblePost} && slug.current == $slug][0]{
    ${postSummaryFields},
    body[]{..., _type == "image" => {${imageFields}, caption}},
    seo
  }`,
)

export const postSlugsQuery = defineQuery(
  `*[${visiblePost}] | order(publishedAt desc) {"slug": slug.current, publishedAt, updatedAt}`,
)

export const categoryQuery = defineQuery(
  `*[_type == "category" && slug.current == $slug][0]{
    title, "slug": slug.current, description,
    "posts": *[${visiblePost} && references(^._id)] | order(publishedAt desc) {${postSummaryFields}}
  }`,
)

export const categorySlugsQuery = defineQuery(
  `*[_type == "category" && defined(slug.current)]{"slug": slug.current}`,
)

export const authorQuery = defineQuery(
  `*[_type == "author" && slug.current == $slug][0]{
    name, "slug": slug.current, jobTitle, bio, sameAs, image{${imageFields}},
    "posts": *[${visiblePost} && references(^._id)] | order(publishedAt desc) {${postSummaryFields}}
  }`,
)

export const authorSlugsQuery = defineQuery(
  `*[_type == "author" && defined(slug.current)]{"slug": slug.current}`,
)

export const settingsQuery = defineQuery(
  `*[_type == "siteSettings" && _id == "siteSettings"][0]{title, description, sameAs, about[]{..., _type == "image" => {${imageFields}, caption}}}`,
)

export const archiveQuery = defineQuery(
  `*[${visiblePost}] | order(publishedAt desc) {
    title, "slug": slug.current, publishedAt,
    "readingMinutes": round(length(pt::text(body)) / 5 / 200)
  }`,
)

export const authorsQuery = defineQuery(
  `*[_type == "author" && defined(slug.current)] | order(name asc) {
    name, "slug": slug.current, jobTitle, bio, sameAs, image{${imageFields}}
  }`,
)
