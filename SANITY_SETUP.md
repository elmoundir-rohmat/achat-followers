# 🚀 Guide d'Installation et Configuration Sanity CMS

## ✅ Ce qui a été fait

1. ✅ Installation de Sanity et des dépendances
2. ✅ Configuration du projet Sanity (Project ID: `jyf2mfzr`)
3. ✅ Création des schémas de contenu :
   - Articles de blog (blogPost)
   - Pages (page)
   - Auteurs (author)
   - Catégories (category)
   - Tags (tag)
4. ✅ Création du service Sanity pour récupérer les données
5. ✅ Création d'un nouveau BlogService utilisant Sanity
6. ✅ Configuration de Sanity Studio
7. ✅ Guide d'utilisation pour le consultant SEO

## 📋 Prochaines étapes

### Étape 1 : Tester Sanity Studio localement

1. **Démarrer Sanity Studio** :
   ```bash
   npm run studio
   ```

2. **Ouvrir dans le navigateur** :
   - URL : `http://localhost:3333`
   - Vous devrez vous connecter avec votre compte Sanity

3. **Créer les premières données** :
   - Créez au moins 1 **Auteur**
   - Créez au moins 1 **Catégorie**
   - Créez quelques **Tags** si nécessaire

### Étape 2 : Migrer les articles existants (optionnel)

Les articles existants sont toujours dans `/src/content/blog/articles/`. Vous avez deux options :

**Option A : Garder les deux systèmes** (recommandé pour la transition)
- Les nouveaux articles seront créés dans Sanity
- Les anciens articles restent dans les fichiers Markdown
- Vous pouvez migrer progressivement

**Option B : Migrer tous les articles vers Sanity**
- Utilisez le script de migration (à créer si nécessaire)
- Tous les articles seront dans Sanity

### Étape 3 : Activer Sanity dans l'application

Actuellement, l'application utilise encore `BlogService` (fichiers Markdown). Pour utiliser Sanity :

1. **Option temporaire** : Tester Sanity en parallèle
   - Le nouveau service `BlogServiceSanity` est prêt
   - Vous pouvez l'utiliser pour tester

2. **Option définitive** : Remplacer complètement
   - Modifier `src/components/BlogPage.tsx` pour utiliser `BlogServiceSanity`
   - Modifier `src/components/BlogArticle.tsx` pour utiliser `BlogServiceSanity`

### Étape 4 : Déployer Sanity Studio

Pour que votre consultant SEO puisse accéder à Sanity Studio en ligne :

1. **Déployer Sanity Studio** :
   ```bash
   npm run studio:deploy
   ```

2. **Ou configurer un déploiement automatique** :
   - Sanity peut être déployé sur `sanity.studio`
   - Ou intégré dans votre application Vite

## 🔧 Configuration actuelle

### Fichiers créés/modifiés :

```
sanity/
├── config.ts              # Configuration principale
├── cli.ts                 # Configuration CLI
├── schemas/
│   ├── index.ts           # Export des schémas
│   ├── blogPost.ts        # Schéma article de blog
│   ├── page.ts            # Schéma page
│   ├── author.ts          # Schéma auteur
│   ├── category.ts        # Schéma catégorie
│   └── tag.ts             # Schéma tag
├── desk/
│   └── structure.ts       # Structure du menu Sanity
└── lib/
    ├── client.ts          # Client Sanity
    └── image.ts           # Helper pour les images

src/
└── services/
    └── sanityService.ts   # Service pour récupérer les données

src/lib/blog/
└── blogServiceSanity.ts  # Nouveau BlogService utilisant Sanity
```

### Variables d'environnement :

Ajoutées dans `env.example` :
- `SANITY_DATASET=production` (optionnel, "production" par défaut)

### Scripts npm ajoutés :

- `npm run studio` : Démarrer Sanity Studio en local
- `npm run studio:build` : Build Sanity Studio
- `npm run studio:deploy` : Déployer Sanity Studio

## 📚 Documentation

- **Guide pour consultant SEO** : Voir `GUIDE_SANITY_SEO.md`
- **Documentation Sanity** : https://www.sanity.io/docs

## ⚠️ Notes importantes

1. **Project ID** : `jyf2mfzr` est déjà configuré dans le code
2. **Dataset** : Utilise "production" par défaut
3. **CDN** : Sanity utilise un CDN, les modifications peuvent prendre quelques secondes à apparaître
4. **Sécurité** : Les credentials Sanity sont publics côté client (c'est normal pour un CMS headless)

## 🐛 Dépannage

### Erreur : "Project not found"
- Vérifiez que le Project ID `jyf2mfzr` est correct
- Vérifiez que vous êtes connecté à Sanity : `npx sanity login`

### Erreur : "Dataset not found"
- Le dataset "production" est créé automatiquement
- Vous pouvez créer un dataset de développement : `npx sanity dataset create development`

### Sanity Studio ne démarre pas
- Vérifiez que toutes les dépendances sont installées : `npm install`
- Vérifiez les erreurs dans la console

## 🎯 Checklist de mise en production

- [ ] Tester Sanity Studio localement
- [ ] Créer au moins 1 auteur, 1 catégorie
- [ ] Créer un article de test
- [ ] Vérifier que l'article apparaît sur le site
- [ ] Migrer les articles existants (optionnel)
- [ ] Déployer Sanity Studio
- [ ] Former le consultant SEO
- [ ] Activer Sanity dans l'application (remplacer BlogService)

---

**Dernière mise à jour** : Janvier 2025

