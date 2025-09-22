# Système de Blog - Doctor Followers

## Vue d'ensemble

Ce système de blog a été créé pour permettre l'ajout facile d'articles de blog au fur et à mesure. Il est entièrement intégré dans l'application React et suit le design fourni.

## Structure des fichiers

```
src/
├── components/
│   ├── BlogPage.tsx          # Page principale du blog
│   ├── BlogCard.tsx          # Composant pour afficher une carte d'article
│   ├── BlogSearch.tsx        # Composant de recherche et filtres
│   ├── BlogArticle.tsx       # Page d'article individuel
│   └── BlogPage.css          # Styles spécifiques au blog
├── data/
│   └── blogData.ts           # Données des articles de blog
└── App.tsx                   # Intégration dans l'application principale
```

## Comment ajouter un nouvel article

### 1. Modifier le fichier `src/data/blogData.ts`

Ajoutez un nouvel objet dans le tableau `blogPosts` :

```typescript
{
  id: '13', // ID unique
  title: 'Votre titre d\'article',
  excerpt: 'Résumé court de l\'article qui apparaîtra sur la carte...',
  content: 'Contenu complet de l\'article...',
  image: 'https://images.unsplash.com/photo-xxxxx', // URL de l'image
  author: 'Dr. Followers',
  date: '2025-01-15', // Format YYYY-MM-DD
  categories: ['instagram', 'conseils'], // Catégories existantes
  slug: 'votre-slug-article', // URL-friendly
  readTime: '5 min',
  featured: false // Optionnel : article mis en avant
}
```

### 2. Catégories disponibles

Les catégories suivantes sont configurées :
- `instagram` - Articles sur Instagram
- `tiktok` - Articles sur TikTok
- `youtube` - Articles sur YouTube
- `facebook` - Articles sur Facebook
- `marketing` - Articles sur le marketing
- `conseils` - Articles de conseils généraux

### 3. Images recommandées

- **Format** : JPG ou PNG
- **Dimensions** : 800x400px minimum
- **Ratio** : 16:9 (aspect-video)
- **Sources** : Unsplash, Pexels, ou vos propres images

## Fonctionnalités

### Page principale du blog (`BlogPage.tsx`)
- ✅ Header avec titre et bouton retour
- ✅ Barre de recherche
- ✅ Filtres par catégorie
- ✅ Grille responsive des articles
- ✅ Animation des cartes
- ✅ Message "aucun résultat"

### Cartes d'articles (`BlogCard.tsx`)
- ✅ Image avec effet hover
- ✅ Titre avec limitation de lignes
- ✅ Date et auteur
- ✅ Catégories avec badges colorés
- ✅ Extrait de l'article
- ✅ Bouton "Lire la suite"

### Recherche et filtres (`BlogSearch.tsx`)
- ✅ Recherche par titre, contenu, auteur
- ✅ Filtres par catégorie avec checkboxes
- ✅ Interface intuitive
- ✅ Boutons d'action clairs

### Page d'article (`BlogArticle.tsx`)
- ✅ Affichage complet de l'article
- ✅ Métadonnées (auteur, date, temps de lecture)
- ✅ Catégories
- ✅ Image mise en avant
- ✅ Call-to-action

## Styles CSS

Le fichier `BlogPage.css` contient :
- Animations pour les cartes
- Effets hover
- Responsive design
- Styles pour les catégories
- Animations de chargement

## Intégration dans l'application

Le blog est intégré dans :
- ✅ Navigation principale (`ModernNavigation.tsx`)
- ✅ Application principale (`App.tsx`)
- ✅ Footer avec lien vers le blog

## Utilisation

1. **Accès au blog** : Cliquez sur "Blog" dans la navigation
2. **Recherche** : Utilisez la barre de recherche pour trouver des articles
3. **Filtres** : Cliquez sur l'icône filtre pour filtrer par catégorie
4. **Lecture** : Cliquez sur "Lire la suite" pour voir l'article complet

## Personnalisation

### Modifier les couleurs
Les couleurs principales sont définies dans les classes Tailwind :
- `bg-blue-600` - Couleur principale
- `bg-purple-600` - Couleur secondaire
- `text-gray-800` - Texte principal

### Modifier les catégories
1. Modifiez le tableau `categories` dans `BlogSearch.tsx`
2. Ajoutez les nouvelles catégories dans `blogData.ts`
3. Mettez à jour les couleurs dans `BlogSearch.tsx`

### Modifier le design des cartes
Éditez le composant `BlogCard.tsx` pour :
- Changer la taille des cartes
- Modifier l'ordre des éléments
- Ajouter de nouveaux champs

## Exemple d'ajout d'article

```typescript
// Dans src/data/blogData.ts
{
  id: '14',
  title: 'Comment optimiser ses hashtags Instagram en 2025',
  excerpt: 'Découvrez les meilleures pratiques pour choisir et utiliser les hashtags Instagram efficacement. Guide complet avec exemples pratiques.',
  content: 'Contenu complet de l\'article sur les hashtags...',
  image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=400&fit=crop',
  author: 'Dr. Followers',
  date: '2025-01-20',
  categories: ['instagram', 'conseils'],
  slug: 'optimiser-hashtags-instagram-2025',
  readTime: '6 min',
  featured: true
}
```

## Support

Pour toute question ou modification, consultez la documentation des composants ou contactez l'équipe de développement.
