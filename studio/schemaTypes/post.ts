import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Conteúdo', default: true},
    {name: 'meta', title: 'Metadados'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo',
      description: 'Aparece nas listagens e é usado como descrição padrão.',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagem de capa',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({name: 'body', title: 'Texto', type: 'blockContent', group: 'content'}),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: [{type: 'author'}],
      group: 'meta',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categorias',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      group: 'meta',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicação',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Última atualização relevante',
      description: 'Preencha quando revisar o conteúdo de forma significativa.',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {
      title: 'Publicação (mais recentes)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', author: 'author.name', media: 'mainImage'},
    prepare: ({title, author, media}) => ({title, subtitle: author && `por ${author}`, media}),
  },
})
