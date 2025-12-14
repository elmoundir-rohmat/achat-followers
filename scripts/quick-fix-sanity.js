/**
 * Script de correction rapide - Version simplifiée
 * Convertit UNIQUEMENT hero.description et credibilite.description
 */

import { createClient } from '@sanity/client'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function stringToBlockContent(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return []
  }

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
          text: text.trim(),
          marks: [],
        },
      ],
    },
  ]
}

async function main() {
  console.log('🔧 Correction Rapide - Instagram Followers Page\n')
  console.log('='.repeat(60))

  // Demande le token
  const token = await question('Entrez votre token API Sanity (commence par sk): ')
  
  if (!token || !token.startsWith('sk')) {
    console.log('\n❌ Token invalide. Le token doit commencer par "sk"')
    rl.close()
    process.exit(1)
  }

  const client = createClient({
    projectId: 'jyf2mfzr',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: token,
  })

  console.log('\n🔍 Récupération du document...\n')

  try {
    const doc = await client.fetch(
      `*[_type == "instagramFollowersPage" && !(_id in path("drafts.**"))][0]`
    )

    if (!doc) {
      console.log('❌ Document non trouvé')
      rl.close()
      process.exit(1)
    }

    console.log(`✅ Document trouvé: ${doc._id}\n`)

    const patches = {}
    let hasChanges = false

    // Hero description
    if (doc.hero?.description && typeof doc.hero.description === 'string') {
      patches['hero.description'] = stringToBlockContent(doc.hero.description)
      hasChanges = true
      console.log('✅ Hero description à migrer')
    }

    // Credibilite description
    if (
      doc.whyBuySection?.credibilite?.description &&
      typeof doc.whyBuySection.credibilite.description === 'string'
    ) {
      patches['whyBuySection.credibilite.description'] = stringToBlockContent(
        doc.whyBuySection.credibilite.description
      )
      hasChanges = true
      console.log('✅ Section "Améliorer votre crédibilité" description à migrer')
    }

    if (!hasChanges) {
      console.log('\n✨ Aucune migration nécessaire')
      rl.close()
      return
    }

    console.log(`\n📝 ${Object.keys(patches).length} champ(s) à migrer\n`)

    // Confirmation
    const confirm = await question('Voulez-vous continuer ? (oui/non): ')
    if (confirm.toLowerCase() !== 'oui' && confirm.toLowerCase() !== 'o') {
      console.log('\n❌ Migration annulée')
      rl.close()
      return
    }

    // Applique les patches
    let patch = client.patch(doc._id)
    for (const [path, value] of Object.entries(patches)) {
      patch = patch.set({ [path]: value })
    }

    const result = await patch.commit()
    console.log('\n✅ Migration réussie!')
    console.log(`   Document: ${result._id}`)
    console.log(`   Révision: ${result._rev}\n`)
    console.log('🎉 Les erreurs devraient maintenant être corrigées dans Sanity Studio!')

  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
    if (error.statusCode === 401) {
      console.log('\n💡 Token invalide ou sans permissions. Vérifiez que le token a les permissions "Editor"')
    }
  } finally {
    rl.close()
  }
}

main().catch(console.error)

