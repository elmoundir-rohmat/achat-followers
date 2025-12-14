/**
 * Script de migration spécifique pour Instagram Followers Page
 * Convertit les champs description (string) en contenu riche (array)
 * 
 * Usage:
 *   SANITY_API_TOKEN="votre-token" node scripts/migrate-instagram-followers-descriptions.js
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'jyf2mfzr',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
})

/**
 * Convertit un string en format blockContent (array)
 */
function stringToBlockContent(text) {
  if (!text || typeof text !== 'string') {
    return []
  }

  // Nettoie le texte
  const cleanText = text.trim()
  if (cleanText.length === 0) {
    return []
  }

  // Divise le texte en paragraphes (par \n)
  const paragraphs = cleanText.split('\n').filter(p => p.trim().length > 0)

  if (paragraphs.length === 0) {
    // Si pas de paragraphes, crée un seul block avec tout le texte
    return [
      {
        _type: 'block',
        _key: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `span-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: cleanText,
            marks: [],
          },
        ],
      },
    ]
  }

  // Convertit chaque paragraphe en block
  return paragraphs.map((paragraph, index) => ({
    _type: 'block',
    _key: `block-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `span-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        text: paragraph.trim(),
        marks: [],
      },
    ],
  }))
}

/**
 * Migre un document Instagram Followers Page
 */
async function migrateInstagramFollowersPage() {
  console.log('🔍 Recherche du document Instagram Followers Page...\n')

  try {
    // Récupère le document
    const documents = await client.fetch(
      `*[_type == "instagramFollowersPage" && !(_id in path("drafts.**"))]`
    )

    if (documents.length === 0) {
      console.log('⚠️  Aucun document Instagram Followers Page trouvé')
      return
    }

    const doc = documents[0]
    console.log(`📄 Document trouvé: ${doc._id}\n`)

    const patches = {}
    let hasChanges = false

    // 1. Migre hero.description
    if (doc.hero?.description && typeof doc.hero.description === 'string') {
      const blockContent = stringToBlockContent(doc.hero.description)
      if (blockContent.length > 0) {
        patches['hero.description'] = blockContent
        hasChanges = true
        console.log('✅ Hero description à migrer')
        console.log(`   Texte: "${doc.hero.description.substring(0, 50)}..."`)
      }
    }

    // 2. Migre whyBuySection.credibilite.description
    if (
      doc.whyBuySection?.credibilite?.description &&
      typeof doc.whyBuySection.credibilite.description === 'string'
    ) {
      const blockContent = stringToBlockContent(doc.whyBuySection.credibilite.description)
      if (blockContent.length > 0) {
        patches['whyBuySection.credibilite.description'] = blockContent
        hasChanges = true
        console.log('✅ Section "Améliorer votre crédibilité" description à migrer')
        console.log(`   Texte: "${doc.whyBuySection.credibilite.description.substring(0, 50)}..."`)
      }
    }

    // 3. Migre securitySection descriptions
    if (
      doc.securitySection?.serviceClient?.description &&
      typeof doc.securitySection.serviceClient.description === 'string'
    ) {
      const blockContent = stringToBlockContent(doc.securitySection.serviceClient.description)
      if (blockContent.length > 0) {
        patches['securitySection.serviceClient.description'] = blockContent
        hasChanges = true
        console.log('✅ Security Section - Service Client description à migrer')
      }
    }

    if (
      doc.securitySection?.remboursement?.description &&
      typeof doc.securitySection.remboursement.description === 'string'
    ) {
      const blockContent = stringToBlockContent(doc.securitySection.remboursement.description)
      if (blockContent.length > 0) {
        patches['securitySection.remboursement.description'] = blockContent
        hasChanges = true
        console.log('✅ Security Section - Remboursement description à migrer')
      }
    }

    if (
      doc.securitySection?.paiements?.description &&
      typeof doc.securitySection.paiements.description === 'string'
    ) {
      const blockContent = stringToBlockContent(doc.securitySection.paiements.description)
      if (blockContent.length > 0) {
        patches['securitySection.paiements.description'] = blockContent
        hasChanges = true
        console.log('✅ Security Section - Paiements description à migrer')
      }
    }

    // 4. Migre whyBuySection.explorer.description
    if (
      doc.whyBuySection?.explorer?.description &&
      typeof doc.whyBuySection.explorer.description === 'string'
    ) {
      const blockContent = stringToBlockContent(doc.whyBuySection.explorer.description)
      if (blockContent.length > 0) {
        patches['whyBuySection.explorer.description'] = blockContent
        hasChanges = true
        console.log('✅ Section "Explorer" description à migrer')
      }
    }

    // 5. Migre whyBuySection.communaute.description
    if (
      doc.whyBuySection?.communaute?.description &&
      typeof doc.whyBuySection.communaute.description === 'string'
    ) {
      const blockContent = stringToBlockContent(doc.whyBuySection.communaute.description)
      if (blockContent.length > 0) {
        patches['whyBuySection.communaute.description'] = blockContent
        hasChanges = true
        console.log('✅ Section "Communauté" description à migrer')
      }
    }

    if (!hasChanges) {
      console.log('\n✨ Aucune migration nécessaire - tous les champs sont déjà au bon format')
      return
    }

    console.log(`\n📝 ${Object.keys(patches).length} champ(s) à migrer\n`)

    // Applique les patches
    let patch = client.patch(doc._id)
    for (const [path, value] of Object.entries(patches)) {
      patch = patch.set({ [path]: value })
    }

    const result = await patch.commit()
    console.log('✅ Migration réussie!')
    console.log(`   Document mis à jour: ${result._id}`)
    console.log(`   Révision: ${result._rev}\n`)

    console.log('🎉 Tous les champs ont été convertis en contenu riche (blockContent)')
    console.log('   Vous pouvez maintenant utiliser le formatage (gras, italique, liens) dans Sanity Studio')
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    if (error.message) {
      console.error(`   Message: ${error.message}`)
    }
    process.exit(1)
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Migration des descriptions Instagram Followers Page\n')
  console.log('='.repeat(60))

  if (!process.env.SANITY_API_TOKEN) {
    console.error('\n❌ Erreur: SANITY_API_TOKEN n\'est pas défini\n')
    console.log('Pour exécuter ce script:')
    console.log('1. Allez sur https://sanity.io/manage')
    console.log('2. Sélectionnez votre projet')
    console.log('3. API → Tokens → Créez un token avec permissions Editor')
    console.log('4. Exécutez:')
    console.log('   SANITY_API_TOKEN="votre-token" node scripts/migrate-instagram-followers-descriptions.js\n')
    process.exit(1)
  }

  await migrateInstagramFollowersPage()

  console.log('='.repeat(60))
  console.log('✨ Migration terminée!\n')
}

// Exécute le script
main().catch(console.error)

