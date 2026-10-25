import {defineConfig, type DocumentActionComponent} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes, SINGLETON_TYPES} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error('Defina SANITY_STUDIO_PROJECT_ID no arquivo studio/.env')
}

// Ações que só administradores enxergam no Studio. A permissão real é aplicada
// pelos papéis (roles) do projeto no Sanity; isto apenas evita cliques acidentais.
const ADMIN_ONLY_ACTIONS = new Set(['delete', 'unpublish', 'discardChanges'])
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Diário Perdido',
  projectId,
  dataset,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Impede criar novas instâncias de documentos únicos (ex.: configurações do site)
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },

  // Ferramenta de consultas (Vision) apenas para administradores
  tools: (tools, {currentUser}) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')
    return isAdmin ? tools : tools.filter((tool) => tool.name !== 'vision')
  },

  document: {
    actions: (actions, {schemaType, currentUser}) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return actions.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
      }
      const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')
      if (isAdmin) return actions
      return actions.filter(
        (a: DocumentActionComponent) => !(a.action && ADMIN_ONLY_ACTIONS.has(a.action)),
      )
    },
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global'
        ? prev.filter((item) => !SINGLETON_TYPES.has(item.templateId))
        : prev,
  },
})
