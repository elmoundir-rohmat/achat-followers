/**
 * Script pour convertir du Markdown en blockContent (rich content) pour Sanity
 * 
 * Usage:
 *   node scripts/markdown-to-blockcontent.js
 */

/**
 * Convertit du Markdown en format blockContent (array) pour Sanity
 */
function markdownToBlockContent(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return []
  }

  const lines = markdown.split('\n').filter(line => line.trim().length > 0)
  const blocks = []
  let blockIndex = 0

  for (const line of lines) {
    const trimmed = line.trim()
    
    // Titre H1 (# Titre)
    if (trimmed.startsWith('# ')) {
      const text = trimmed.substring(2).trim()
      blocks.push({
        _type: 'block',
        _key: `block-${blockIndex++}`,
        style: 'h1',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `span-${blockIndex}`,
            text: text,
            marks: [],
          },
        ],
      })
    }
    // Titre H2 (## Titre)
    else if (trimmed.startsWith('## ')) {
      const text = trimmed.substring(3).trim()
      blocks.push({
        _type: 'block',
        _key: `block-${blockIndex++}`,
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `span-${blockIndex}`,
            text: text,
            marks: [],
          },
        ],
      })
    }
    // Titre H3 (### Titre)
    else if (trimmed.startsWith('### ')) {
      const text = trimmed.substring(4).trim()
      blocks.push({
        _type: 'block',
        _key: `block-${blockIndex++}`,
        style: 'h3',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `span-${blockIndex}`,
            text: text,
            marks: [],
          },
        ],
      })
    }
    // Titre H4 (#### Titre)
    else if (trimmed.startsWith('#### ')) {
      const text = trimmed.substring(5).trim()
      blocks.push({
        _type: 'block',
        _key: `block-${blockIndex++}`,
        style: 'h4',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `span-${blockIndex}`,
            text: text,
            marks: [],
          },
        ],
      })
    }
    // Paragraphe normal
    else {
      blocks.push({
        _type: 'block',
        _key: `block-${blockIndex++}`,
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `span-${blockIndex}`,
            text: trimmed,
            marks: [],
          },
        ],
      })
    }
  }

  return blocks
}

// Contenu Markdown à convertir
const markdownContent = `# 6 conseils pratiques pour augmenter le nombre d'abonnés Instagram

Instagram est une plateforme de réseau social très populaire, utilisée par des millions de personnes dans le monde entier. Si vous souhaitez augmenter votre nombre d'abonnés sur Instagram, voici quelques conseils qui pourraient vous aider :

## 1. Créez du contenu de qualité

Pour attirer de nouveaux abonnés, il est essentiel de publier du contenu de qualité qui intéresse votre audience cible. Prenez le temps de réfléchir à ce que vous voulez partager et à comment le présenter de manière attrayante. Utilisez des hashtags pertinents et des légendes qui incitent à l'engagement.

## 2. Soyez actif

Pour être visible sur Instagram, il est important de publier du contenu régulièrement. Essayez de publier au moins une fois par jour pour maintenir votre visibilité et montrer à votre audience que vous êtes actif. N'oubliez pas de varier votre contenu pour ne pas lasser vos abonnés.

## 3. Utilisez les bons hashtags

Les hashtags sont un moyen efficace de faire découvrir votre contenu à de nouvelles personnes. Utilisez des hashtags pertinents qui ciblent votre audience et qui sont populaires sur Instagram. N'hésitez pas à varier les hashtags pour toucher un public différent chaque jour.

## 4. Interagissez avec d'autres utilisateurs

Instagram est avant tout une plateforme de partage et d'interaction. Pour augmenter votre nombre d'abonnés, il est important de participer à la communauté en commentant et en likant les publications d'autres utilisateurs. Cela vous permettra de créer des liens et d'attirer l'attention sur votre compte.

## 5. Utilisez les fonctionnalités d'Instagram à votre avantage

Instagram met à disposition de nombreuses fonctionnalités pour aider les utilisateurs à se faire connaître. Par exemple, vous pouvez utiliser les stories pour partager du contenu supplémentaire et vous connecter avec votre audience. Vous pouvez également utiliser les différents filtres et outils de montage pour donner plus de dynamisme à vos publications.

## 6. Faites la promotion de votre compte

Pour attirer de nouveaux abonnés, il est important de faire la promotion de votre compte. Vous pouvez utiliser vos autres réseaux sociaux pour partager vos publications Instagram et inviter vos amis à vous suivre. Vous pouvez également participer à des collaborations avec d'autres utilisateurs et participer à des défis populaires sur Instagram.

## Conclusion

En suivant ces conseils, vous devriez être en mesure d'augmenter le nombre d'abonnés Instagram de votre compte. N'oubliez pas que vous pouvez vous faire accompagner par nos consultants pour développer votre compte au niveau supérieur !`

// Convertir en blockContent
const blockContent = markdownToBlockContent(markdownContent)

// Afficher le résultat
console.log(JSON.stringify(blockContent, null, 2))





