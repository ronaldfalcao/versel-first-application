import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Título para buscadores',
      description: 'Se vazio, usa o título do post. Ideal: até 60 caracteres.',
      type: 'string',
      validation: (rule) => rule.max(70).warning('Títulos longos são cortados nos resultados.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Descrição para buscadores',
      description: 'Se vazio, usa o resumo. Ideal: 120–160 caracteres.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(170).warning('Descrições longas são cortadas.'),
    }),
    defineField({
      name: 'noIndex',
      title: 'Ocultar dos buscadores (noindex)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
