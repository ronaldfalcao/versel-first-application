import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configurações do site',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nome do site', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'description',
      title: 'Descrição do site',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(170),
    }),
    defineField({
      name: 'about',
      title: 'Texto da página Sobre',
      description: 'Aparece em /sobre, acima dos autores. As imagens de compartilhamento são geradas automaticamente.',
      type: 'blockContent',
    }),
    defineField({
      name: 'sameAs',
      title: 'Perfis oficiais do site',
      type: 'array',
      of: [defineArrayMember({type: 'url', validation: (rule) => rule.uri({scheme: ['https']})})],
    }),
  ],
  preview: {prepare: () => ({title: 'Configurações do site'})},
})
