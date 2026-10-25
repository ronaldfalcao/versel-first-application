import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio publicado em https://<studioHost>.sanity.studio (login obrigatório via Sanity)
  studioHost: process.env.SANITY_STUDIO_HOST,
  deployment: {
    autoUpdates: true,
  },
})
