/**
 * Script de test pour vérifier la connexion à Sanity
 * et voir l'état actuel des données
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'jyf2mfzr',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  // Pas besoin de token pour la lecture
})

async function testConnection() {
  console.log('🔍 Test de connexion à Sanity...\n')

  try {
    // Récupère le document Instagram Followers Page
    const doc = await client.fetch(
      `*[_type == "instagramFollowersPage" && !(_id in path("drafts.**"))][0]`
    )

    if (!doc) {
      console.log('❌ Aucun document Instagram Followers Page trouvé')
      return
    }

    console.log(`✅ Document trouvé: ${doc._id}\n`)
    console.log('📊 État actuel des champs description:\n')

    // Hero description
    console.log('1. Hero Description:')
    if (doc.hero?.description) {
      if (typeof doc.hero.description === 'string') {
        console.log('   ❌ Type: STRING (doit être ARRAY)')
        console.log(`   Contenu: "${doc.hero.description.substring(0, 80)}..."`)
      } else if (Array.isArray(doc.hero.description)) {
        console.log('   ✅ Type: ARRAY (correct)')
        console.log(`   Nombre de blocks: ${doc.hero.description.length}`)
      } else {
        console.log(`   ⚠️  Type: ${typeof doc.hero.description}`)
      }
    } else {
      console.log('   ⚠️  Vide')
    }

    console.log('')

    // Credibilite description
    console.log('2. Section "Améliorer votre crédibilité" Description:')
    if (doc.whyBuySection?.credibilite?.description) {
      if (typeof doc.whyBuySection.credibilite.description === 'string') {
        console.log('   ❌ Type: STRING (doit être ARRAY)')
        console.log(`   Contenu: "${doc.whyBuySection.credibilite.description.substring(0, 80)}..."`)
      } else if (Array.isArray(doc.whyBuySection.credibilite.description)) {
        console.log('   ✅ Type: ARRAY (correct)')
        console.log(`   Nombre de blocks: ${doc.whyBuySection.credibilite.description.length}`)
      } else {
        console.log(`   ⚠️  Type: ${typeof doc.whyBuySection.credibilite.description}`)
      }
    } else {
      console.log('   ⚠️  Vide')
    }

    console.log('\n' + '='.repeat(60))
    console.log('💡 Pour corriger, exécutez:')
    console.log('   SANITY_API_TOKEN="votre-token" npm run migrate:followers')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    if (error.message.includes('CORS')) {
      console.log('\n💡 Problème CORS. Essayez avec un token API.')
    }
  }
}

testConnection().catch(console.error)

