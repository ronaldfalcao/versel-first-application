import {defineArrayMember, defineField, defineType} from 'sanity'

// Corpo do post. Só aceita links http(s)/mailto, evitando "javascript:" e similares.
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Conteúdo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Parágrafo', value: 'normal'},
        {title: 'Título 2', value: 'h2'},
        {title: 'Título 3', value: 'h3'},
        {title: 'Título 4', value: 'h4'},
        {title: 'Citação', value: 'blockquote'},
      ],
      lists: [
        {title: 'Marcadores', value: 'bullet'},
        {title: 'Numerada', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Negrito', value: 'strong'},
          {title: 'Itálico', value: 'em'},
          {title: 'Código', value: 'code'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Abrir em nova aba',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          description: 'Descreva a imagem (acessibilidade e SEO).',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({name: 'caption', title: 'Legenda', type: 'string'}),
      ],
    }),
  ],
})
