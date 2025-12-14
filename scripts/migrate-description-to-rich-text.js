/**
 * Script de migration pour convertir les champs description (string) en contenu riche (array)
 * 
 * Ce script convertit automatiquement tous les champs description qui sont encore des strings
 * en format blockContent (array) compatible avec les nouveaux schémas.
 * 
 * Usage:
 *   node scripts/migrate-description-to-rich-text.js
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'jyf2mfzr',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Token avec permissions d'écriture
})

/**
 * Convertit un string en format blockContent (array)
 */
function stringToBlockContent(text) {
  if (!text || typeof text !== 'string') {
    return []
  }

  // Divise le texte en paragraphes
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0)

  if (paragraphs.length === 0) {
    return []
  }

  // Convertit chaque paragraphe en block
  return paragraphs.map(paragraph => ({
    _type: 'block',
    _key: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: paragraph.trim(),
        marks: [],
      },
    ],
  }))
}

/**
 * Migre un document spécifique
 */
async function migrateDocument(document) {
  const patches = []
  let hasChanges = false

  // Fonction helper pour migrer un champ description
  function migrateField(path, value) {
    if (typeof value === 'string' && value.trim().length > 0) {
      const blockContent = stringToBlockContent(value)
      if (blockContent.length > 0) {
        patches.push({
          set: {
            [path]: blockContent,
          },
        })
        hasChanges = true
        console.log(`  ✓ Migré: ${path}`)
      }
    }
  }

  // Migre les différents types de documents
  if (document._type === 'homePage') {
    if (document.hero?.description && typeof document.hero.description === 'string') {
      migrateField('hero.description', document.hero.description)
    }
  }

  if (document._type === 'instagramFollowersPage') {
    // Hero
    if (document.hero?.description && typeof document.hero.description === 'string') {
      migrateField('hero.description', document.hero.description)
    }

    // Security Section
    if (document.securitySection?.serviceClient?.description && typeof document.securitySection.serviceClient.description === 'string') {
      migrateField('securitySection.serviceClient.description', document.securitySection.serviceClient.description)
    }
    if (document.securitySection?.remboursement?.description && typeof document.securitySection.remboursement.description === 'string') {
      migrateField('securitySection.remboursement.description', document.securitySection.remboursement.description)
    }
    if (document.securitySection?.paiements?.description && typeof document.securitySection.paiements.description === 'string') {
      migrateField('securitySection.paiements.description', document.securitySection.paiements.description)
    }

    // Why Buy Section
    if (document.whyBuySection?.credibilite?.description && typeof document.whyBuySection.credibilite.description === 'string') {
      migrateField('whyBuySection.credibilite.description', document.whyBuySection.credibilite.description)
    }
    if (document.whyBuySection?.explorer?.description && typeof document.whyBuySection.explorer.description === 'string') {
      migrateField('whyBuySection.explorer.description', document.whyBuySection.explorer.description)
    }
    if (document.whyBuySection?.communaute?.description && typeof document.whyBuySection.communaute.description === 'string') {
      migrateField('whyBuySection.communaute.description', document.whyBuySection.communaute.description)
    }
  }

  if (document._type === 'instagramLikesPage') {
    if (document.hero?.description && typeof document.hero.description === 'string') {
      migrateField('hero.description', document.hero.description)
    }
    // Ajoutez les autres champs similaires...
  }

  if (document._type === 'instagramViewsPage') {
    if (document.hero?.description && typeof document.hero.description === 'string') {
      migrateField('hero.description', document.hero.description)
    }
    // Ajoutez les autres champs similaires...
  }

  if (document._type === 'instagramCommentsPage') {
    if (document.hero?.description && typeof document.hero.description === 'string') {
      migrateField('hero.description', document.hero.description)
    }
    // Ajoutez les autres champs similaires...
  }

  // Applique les patches si des changements ont été détectés
  if (hasChanges && patches.length > 0) {
    try {
      await client
        .patch(document._id)
        .set(patches.reduce((acc, patch) => ({ ...acc, ...patch.set }), {}))
        .commit()

      console.log(`✅ Document ${document._id} migré avec succès`)
      return true
    } catch (error) {
      console.error(`❌ Erreur lors de la migration du document ${document._id}:`, error)
      return false
    }
  }

  return false
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage de la migration des descriptions...\n')

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Erreur: SANITY_API_TOKEN n\'est pas défini')
    console.log('\nPour exécuter ce script, vous devez définir un token API avec permissions d\'écriture:')
    console.log('export SANITY_API_TOKEN="votre-token-ici"')
    console.log('node scripts/migrate-description-to-rich-text.js')
    process.exit(1)
  }

  const documentTypes = [
    'homePage',
    'instagramFollowersPage',
    'instagramLikesPage',
    'instagramViewsPage',
    'instagramCommentsPage',
  ]

  let totalMigrated = 0
  let totalSkipped = 0
  let totalErrors = 0

  for (const docType of documentTypes) {
    console.log(`\n📄 Traitement des documents de type: ${docType}`)
    console.log('─'.repeat(50))

    try {
      const documents = await client.fetch(`*[_type == "${docType}"]`)

      if (documents.length === 0) {
        console.log(`  ℹ️  Aucun document trouvé pour ${docType}`)
        continue
      }

      console.log(`  Trouvé ${documents.length} document(s)`)

      for (const doc of documents) {
        const migrated = await migrateDocument(doc)
        if (migrated) {
          totalMigrated++
        } else {
          totalSkipped++
        }
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des documents ${docType}:`, error)
      totalErrors++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Résumé de la migration:')
  console.log(`  ✅ Documents migrés: ${totalMigrated}`)
  console.log(`  ⏭️  Documents ignorés (déjà migrés ou vides): ${totalSkipped}`)
  console.log(`  ❌ Erreurs: ${totalErrors}`)
  console.log('='.repeat(50))
  console.log('\n✨ Migration terminée!')
}

// Exécute le script
main().catch(console.error)

