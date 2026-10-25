import {defineArrayMember, defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nome', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Cargo / credenciais',
      description: 'Ex.: "Jornalista", "Engenheiro de software". Ajuda a demonstrar autoridade.',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Texto alternativo', type: 'string'})],
    }),
    defineField({name: 'bio', title: 'Biografia', type: 'text', rows: 5}),
    defineField({
      name: 'sameAs',
      title: 'Perfis públicos',
      description: 'Links para LinkedIn, GitHub, site pessoal etc.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'url',
          validation: (rule) => rule.uri({scheme: ['https']}),
        }),
      ],
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'jobTitle', media: 'image'}},
})
