import 'server-only'

import { createClient } from 'next-sanity'
import { apiVersion, dataset, isSanityConfigured, projectId } from './env'

// Cliente somente leitura, usado apenas no servidor. O token (opcional, papel "Viewer")
// permite manter o dataset privado; ele nunca é enviado ao navegador.
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published',
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : null
