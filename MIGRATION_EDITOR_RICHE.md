# ✅ Migration vers Éditeurs Riches Uniques

## 🎯 Objectif

Simplifier la gestion du contenu en supprimant la duplication entre champs texte simples et champs formatés. **Tous les champs de description utilisent maintenant uniquement des éditeurs riches.**

## ✅ Changements Effectués

### 1. Schémas Sanity (`sanity/schemas/`)

**Avant :**
```typescript
{
  name: 'description',
  type: 'text',  // Texte simple
  rows: 3,
},
{
  name: 'descriptionRich',
  type: 'array',
  of: [{ type: 'block' }],  // Éditeur riche
}
```

**Après :**
```typescript
{
  name: 'description',
  type: 'array',
  of: [{ type: 'block' }],  // Éditeur riche uniquement
  description: 'Supporte le formatage : gras, italique, liens, etc.',
}
```

### 2. Requêtes GROQ (`src/services/pageService.ts`)

**Avant :**
```groq
hero {
  title,
  description,
  descriptionRich
}
```

**Après :**
```groq
hero {
  title,
  description  // Uniquement description (contenu riche)
}
```

### 3. Composants React

**Avant :**
```tsx
{pageData?.hero?.descriptionRich ? (
  <PortableText content={pageData.hero.descriptionRich} />
) : (
  <p>{pageData?.hero?.description}</p>
)}
```

**Après :**
```tsx
{pageData?.hero?.description ? (
  <PortableText content={pageData.hero.description} />
) : (
  <p>Texte par défaut</p>
)}
```

## 📋 Pages Mises à Jour

- ✅ `homePage.ts` - Hero description
- ✅ `instagramFollowersPage.ts` - Hero, securitySection, whyBuySection
- ✅ `instagramLikesPage.ts` - Hero, securitySection, whyBuySection
- ✅ `instagramViewsPage.ts` - Hero, securitySection, whyBuySection
- ✅ `instagramCommentsPage.ts` - Hero, securitySection, whyBuySection

## 🎨 Comment Utiliser dans Sanity

1. **Ouvrez Sanity Studio**
2. **Sélectionnez un champ "Description"**
3. **Utilisez l'éditeur riche** avec la barre d'outils :
   - **B** pour gras
   - **I** pour italique
   - **U** pour souligné
   - **🔗** pour liens
4. **Tapez votre texte normalement**
5. **Sélectionnez le texte** et cliquez sur les boutons de formatage

## ⚠️ Important

- **Plus de duplication** : Un seul champ à remplir
- **Formatage toujours disponible** : Pas besoin de choisir entre texte simple et formaté
- **Pas de syntaxe Markdown** : Utilisez les boutons de la barre d'outils
- **Si le champ est vide** : Le texte par défaut s'affiche dans le frontend

## 🚀 Prochaines Étapes

1. **Déployer les schémas** :
   ```bash
   npm run studio:deploy
   ```

2. **Migrer les données existantes** :
   - Si vous aviez du contenu dans `descriptionRich`, copiez-le dans `description`
   - Supprimez les anciens champs `descriptionRich` dans Sanity

3. **Tester** :
   - Ouvrez Sanity Studio
   - Vérifiez que tous les champs "Description" sont des éditeurs riches
   - Testez le formatage (gras, italique, liens)

## 📝 Notes Techniques

- Les champs `description` sont maintenant de type `array` avec `of: [{ type: 'block' }]`
- Le composant `PortableText` convertit automatiquement le contenu riche en HTML
- Les fallbacks (texte par défaut) restent dans le code React si le champ est vide

