import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/desk/structure'

export default defineConfig({
  name: 'default',
  title: 'Doctor Followers CMS',
  
  projectId: 'jyf2mfzr',
  dataset: process.env.SANITY_DATASET || 'production',
  
  basePath: '/studio', // L'URL pour accéder au studio sera /studio
  
  plugins: [
    structureTool({
      structure,
    }),
    visionTool(), // Permet de tester les requêtes GROQ
  ],
  
  schema: {
    types: schemaTypes,
  },
})

