# Guide Sanity CMS pour Consultant SEO

## 🎯 Introduction

Ce guide vous explique comment utiliser Sanity CMS pour gérer le contenu du site Doctor Followers. Sanity est un CMS (Content Management System) qui vous permet d'ajouter, modifier et supprimer du contenu sans avoir besoin de connaissances techniques.

## 📋 Table des matières

1. [Accéder à Sanity Studio](#accéder-à-sanity-studio)
2. [Créer un article de blog](#créer-un-article-de-blog)
3. [Modifier un article existant](#modifier-un-article-existant)
4. [Gérer les catégories et tags](#gérer-les-catégories-et-tags)
5. [Optimisation SEO](#optimisation-seo)
6. [Publier un article](#publier-un-article)
7. [FAQ](#faq)

---

## 🚀 Accéder à Sanity Studio

### Option 1 : Accès local (développement)
1. Ouvrez un terminal dans le dossier du projet
2. Exécutez la commande : `npm run studio`
3. Ouvrez votre navigateur à l'adresse : `http://localhost:3333`

### Option 2 : Accès en ligne (production)
Une fois déployé, vous pourrez accéder à Sanity Studio via :
- URL : `https://votre-domaine.com/studio`
- Ou directement via : `https://votre-projet.sanity.studio`

---

## ✍️ Créer un article de blog

### Étape 1 : Accéder à la section Articles
1. Dans le menu de gauche, cliquez sur **"Articles de Blog"**
2. Cliquez sur le bouton **"Create"** ou **"Créer"**

### Étape 2 : Remplir les informations de base

#### Informations obligatoires :
- **Titre** : Le titre de votre article (max 100 caractères)
- **Slug (URL)** : Cliquez sur "Generate" pour créer automatiquement l'URL à partir du titre
  - Exemple : "Comment augmenter ses followers" → `/comment-augmenter-ses-followers`
- **Extrait / Description courte** : Une description courte de l'article (max 200 caractères)
- **Image principale** : 
  - Cliquez sur "Select" pour choisir une image
  - Ajoutez un **Texte alternatif (SEO)** : description de l'image pour le référencement
- **Contenu (Markdown)** : Le contenu principal de l'article
  - Vous pouvez utiliser Markdown pour formater le texte
  - Exemples :
    - `# Titre` pour un titre principal
    - `## Sous-titre` pour un sous-titre
    - `**gras**` pour du texte en gras
    - `*italique*` pour du texte en italique
    - `- Liste` pour créer une liste

#### Informations optionnelles mais recommandées :
- **Auteur** : Sélectionnez un auteur existant ou créez-en un nouveau
- **Catégorie** : Choisissez la catégorie de l'article
- **Tags** : Ajoutez des tags pertinents (vous pouvez en sélectionner plusieurs)
- **Date de publication** : La date sera automatiquement définie, mais vous pouvez la modifier
- **Temps de lecture (minutes)** : Estimation du temps de lecture

### Étape 3 : Optimisation SEO

#### Section "Réglages SEO" :

1. **Titre SEO (meta title)**
   - Doit être unique et descriptif
   - **50-60 caractères maximum** (Sanity vous avertira si c'est trop long)
   - Incluez le mot-clé principal
   - Exemple : "Comment Acheter des Followers Instagram en 2025"

2. **Description SEO (meta description)**
   - **150-160 caractères maximum**
   - Doit être accrocheur et inciter au clic
   - Incluez le mot-clé principal
   - Exemple : "Découvrez comment acheter des followers Instagram de qualité. Guide complet avec conseils et astuces pour développer votre compte."

3. **Mot-clé principal**
   - Le mot-clé sur lequel vous voulez vous positionner
   - Exemple : "acheter followers instagram"

4. **Mots-clés secondaires**
   - Ajoutez plusieurs mots-clés pertinents
   - Exemple : ["followers instagram", "acheter abonnés instagram", "croissance instagram"]

5. **URL canonique**
   - L'URL complète de l'article
   - Format : `https://doctorfollowers.com/blogs/votre-slug`
   - Exemple : `https://doctorfollowers.com/blogs/comment-augmenter-ses-followers`

6. **Ne pas indexer (noindex)**
   - ✅ Cochez cette case **SEULEMENT** si vous ne voulez pas que l'article soit indexé par Google
   - ⚠️ **Laissez décoché** pour la plupart des articles

### Étape 4 : Open Graph (Réseaux sociaux)

Cette section contrôle l'apparence de l'article quand il est partagé sur Facebook, LinkedIn, etc.

- **Titre OG** : Titre pour les réseaux sociaux (peut être différent du titre SEO)
- **Description OG** : Description pour les réseaux sociaux
- **Image OG** : Image qui apparaîtra lors du partage (1200x630px recommandé)
- **Type** : Laissez "Article" par défaut

### Étape 5 : Twitter Card

- **Type de carte** : "Résumé avec grande image" (recommandé)
- **Titre Twitter** : Titre optimisé pour Twitter
- **Description Twitter** : Description pour Twitter
- **Image Twitter** : Image pour Twitter (1200x630px)
- **Créateur Twitter** : Votre compte Twitter (ex: @doctorfollowers)

### Étape 6 : Options supplémentaires

- **Article mis en avant** : Cochez si vous voulez mettre l'article en avant sur la page d'accueil
- **Articles liés** : Sélectionnez d'autres articles pertinents à afficher en bas de page

---

## ✏️ Modifier un article existant

1. Dans le menu de gauche, cliquez sur **"Articles de Blog"**
2. Trouvez l'article que vous voulez modifier dans la liste
3. Cliquez sur l'article pour l'ouvrir
4. Modifiez les champs nécessaires
5. **Important** : Mettez à jour la **"Date de mise à jour"** si vous modifiez le contenu
6. Cliquez sur **"Publish"** pour sauvegarder les modifications

---

## 🏷️ Gérer les catégories et tags

### Créer une catégorie

1. Cliquez sur **"Catégories"** dans le menu
2. Cliquez sur **"Create"**
3. Remplissez :
   - **Nom de la catégorie** : Ex: "Instagram", "TikTok", "Conseils"
   - **Slug** : Cliquez sur "Generate" pour créer automatiquement
   - **Description** : Description de la catégorie
   - **Couleur** : Choisissez une couleur pour l'affichage
   - **Titre SEO** et **Description SEO** : Pour optimiser la page catégorie

### Créer un tag

1. Cliquez sur **"Tags"** dans le menu
2. Cliquez sur **"Create"**
3. Remplissez :
   - **Nom du tag** : Ex: "followers", "likes", "croissance"
   - **Slug** : Cliquez sur "Generate"
   - **Description** : Description du tag

---

## 📊 Optimisation SEO

### Checklist avant de publier un article :

- [ ] **Titre SEO** : 50-60 caractères, inclut le mot-clé principal
- [ ] **Description SEO** : 150-160 caractères, accrocheur
- [ ] **Mot-clé principal** : Défini et utilisé naturellement dans le contenu
- [ ] **Mots-clés secondaires** : Au moins 3-5 mots-clés pertinents
- [ ] **Image principale** : Texte alternatif (alt) rempli
- [ ] **URL canonique** : Format correct (`https://doctorfollowers.com/blogs/slug`)
- [ ] **Open Graph** : Titre, description et image remplis
- [ ] **Twitter Card** : Tous les champs remplis
- [ ] **Contenu** : Au moins 800-1000 mots (idéalement 1500+)
- [ ] **Structure** : Utilisez des titres (H2, H3) pour structurer le contenu
- [ ] **Liens internes** : Ajoutez des liens vers d'autres articles du site
- [ ] **Articles liés** : Sélectionnez 2-3 articles pertinents

### Conseils SEO :

1. **Densité de mots-clés** : Utilisez le mot-clé principal 1-2% du temps dans le contenu
2. **Longueur du contenu** : Les articles longs (1500+ mots) se classent généralement mieux
3. **Images** : Ajoutez des images avec des textes alternatifs descriptifs
4. **Liens** : Ajoutez des liens vers des sources fiables et vers d'autres articles du site
5. **Lisibilité** : Utilisez des paragraphes courts, des listes à puces, et des sous-titres

---

## 🚀 Publier un article

### Important : L'article ne sera visible sur le site QUE si vous cochez "Publié"

1. Une fois que vous avez rempli tous les champs nécessaires
2. **Cochez la case "Publié"** en haut à droite
3. Cliquez sur **"Publish"** ou **"Publier"**
4. L'article sera immédiatement visible sur le site (après quelques secondes de délai CDN)

### Brouillon vs Publié

- **Brouillon** : L'article est sauvegardé mais n'est pas visible sur le site
- **Publié** : L'article est visible sur le site et indexable par Google

Vous pouvez toujours décocher "Publié" pour retirer un article du site sans le supprimer.

---

## ❓ FAQ

### Q: Comment supprimer un article ?
**R:** Ouvrez l'article, cliquez sur les trois points (⋯) en haut à droite, puis sélectionnez "Delete".

### Q: Mon article n'apparaît pas sur le site après publication
**R:** Vérifiez que :
- La case "Publié" est bien cochée
- Vous avez cliqué sur "Publish"
- Attendez quelques secondes (le CDN peut prendre du temps)

### Q: Comment modifier l'URL d'un article ?
**R:** Modifiez le champ "Slug (URL)". Attention : changer l'URL peut casser les liens existants.

### Q: Puis-je utiliser du HTML dans le contenu ?
**R:** Non, utilisez Markdown. Voici les principales syntaxes :
- `# Titre` → Titre principal
- `## Sous-titre` → Sous-titre
- `**gras**` → **gras**
- `*italique*` → *italique*
- `- Item` → Liste à puces
- `[Lien](https://url.com)` → Lien

### Q: Comment ajouter une image dans le contenu ?
**R:** Pour l'instant, utilisez des URLs d'images. Format Markdown : `![Description](https://url-image.com/image.jpg)`

### Q: Que faire si je fais une erreur ?
**R:** Vous pouvez toujours modifier un article publié. Les modifications seront visibles après avoir cliqué sur "Publish".

### Q: Comment voir un aperçu de l'article avant publication ?
**R:** Malheureusement, Sanity Studio ne permet pas de prévisualiser directement. Vous devrez publier l'article et vérifier sur le site.

---

## 📞 Support

Si vous avez des questions ou rencontrez des problèmes :
1. Consultez la documentation Sanity : https://www.sanity.io/docs
2. Contactez le développeur du site

---

## 🎓 Ressources supplémentaires

- [Documentation Markdown](https://www.markdownguide.org/)
- [Guide SEO Google](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Documentation Sanity](https://www.sanity.io/docs)

---

**Dernière mise à jour** : Janvier 2025

