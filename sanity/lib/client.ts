import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'jyf2mfzr',
  dataset: 'production',
  useCdn: false, // Désactivé temporairement pour éviter les problèmes CORS en développement
  apiVersion: '2024-01-01', // Utilisez une date récente ou '2024-01-01'
  // Token API optionnel - seulement si nécessaire (token Viewer pour lecture seule)
  // Si votre projet est public, vous n'avez pas besoin de token
  // Ne pas définir token si undefined pour éviter l'avertissement
  ...(import.meta.env.VITE_SANITY_API_TOKEN ? { token: import.meta.env.VITE_SANITY_API_TOKEN } : {}),
})

