# Guide pour ajouter des articles de blog

## 📝 Comment ajouter un nouvel article

### 1. Ouvrir le fichier de configuration
Ouvrez le fichier `src/config/blogPosts.ts`

### 2. Ajouter un nouvel article
Ajoutez un nouvel objet dans le tableau `blogPosts` :

```typescript
{
  id: 7, // ID unique (incrémenter le dernier ID)
  title: "Votre titre d'article",
  excerpt: "Résumé court de l'article (2-3 phrases maximum)",
  image: "https://images.unsplash.com/photo-XXXXX?w=800&h=400&fit=crop", // URL de l'image
  date: "25 septembre 2025", // Date de publication
  author: "ThinkWell", // Auteur
  category: "Instagram", // Catégorie (Instagram, TikTok, YouTube, Facebook, Conseils)
  slug: "votre-slug-article", // URL-friendly (pas d'espaces, caractères spéciaux)
  tags: ["Tag1", "Tag2", "Tag3"], // Mots-clés (optionnel)
  readTime: 5 // Temps de lecture estimé en minutes (optionnel)
}
```

### 3. Exemple complet

```typescript
{
  id: 7,
  title: "Comment optimiser ses hashtags Instagram en 2025",
  excerpt: "Découvrez les meilleures stratégies pour choisir et utiliser les hashtags Instagram. Augmentez votre portée et votre engagement avec nos conseils d'experts.",
  image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=400&fit=crop",
  date: "25 septembre 2025",
  author: "ThinkWell",
  category: "Instagram",
  slug: "optimiser-hashtags-instagram-2025",
  tags: ["Instagram", "Hashtags", "SEO", "Engagement"],
  readTime: 6
}
```

## 🎨 Personnalisation

### Images
- Utilisez des images de 800x400px minimum
- Sources recommandées : Unsplash, Pexels
- Format : JPG ou WebP pour de meilleures performances

### Catégories disponibles
- `Instagram` - Articles sur Instagram
- `TikTok` - Articles sur TikTok  
- `YouTube` - Articles sur YouTube
- `Facebook` - Articles sur Facebook
- `Conseils` - Conseils généraux

### Tags
- Utilisez des tags pertinents pour le SEO
- Maximum 5 tags par article
- Évitez les doublons

## 🔧 Fonctions utiles

Le fichier `blogPosts.ts` contient plusieurs fonctions utiles :

- `addBlogPost(newPost)` - Ajouter un article programmatiquement
- `getBlogPostBySlug(slug)` - Récupérer un article par son slug
- `getBlogPostsByCategory(category)` - Récupérer les articles d'une catégorie
- `searchBlogPosts(query)` - Rechercher des articles
- `getCategories()` - Obtenir toutes les catégories

## 📱 Affichage

Les articles s'affichent automatiquement sur la page Blog avec :
- ✅ Recherche en temps réel
- ✅ Filtrage par catégorie
- ✅ Tags visibles
- ✅ Temps de lecture estimé
- ✅ Design responsive
- ✅ Animations au survol

## 🚀 Déploiement

Après avoir ajouté un article :
1. Vérifiez que le site se compile : `npm run build`
2. Testez la page Blog
3. Vérifiez que la recherche et les filtres fonctionnent
4. Déployez sur votre serveur

## 💡 Conseils

- **Titres** : Soyez accrocheurs et descriptifs
- **Excerpts** : Résumez l'article en 2-3 phrases maximum
- **Slugs** : Utilisez des tirets, pas d'espaces
- **Images** : Choisissez des images de qualité et pertinentes
- **Tags** : Utilisez des mots-clés que vos lecteurs rechercheraient
