# 🧪 Test End-to-End : Vérifier que Sanity fonctionne

## 📋 Checklist Complète

Utilisez cette checklist pour vérifier que tout fonctionne correctement après avoir créé vos articles de test.

---

## ✅ Étape 1 : Créer les Articles dans Sanity Studio

### Article 1 : Followers Instagram
- [ ] Ouvrir `ARTICLE_TEST_SANITY.md`
- [ ] Créer l'article dans Sanity Studio
- [ ] Cocher "Publié"
- [ ] Cliquer sur "Publish"

### Article 2 : Followers TikTok
- [ ] Ouvrir `ARTICLE_TEST_2_SANITY.md`
- [ ] Créer l'article dans Sanity Studio
- [ ] Cocher "Publié"
- [ ] Cliquer sur "Publish"

---

## ✅ Étape 2 : Vérifier dans Sanity Studio

1. **Liste des articles**
   - [ ] Les 2 articles apparaissent dans la liste
   - [ ] Le statut "Publié" est visible
   - [ ] Les images s'affichent correctement

2. **Détails d'un article**
   - [ ] Ouvrir un article
   - [ ] Vérifier que tous les champs sont remplis
   - [ ] Vérifier que le contenu Markdown est bien formaté

---

## ✅ Étape 3 : Vérifier sur le Site de Production

### 3.1 Page Blog (Liste des articles)

1. **Aller sur** : `https://votre-domaine.com/blogs`
2. **Vérifier** :
   - [ ] Les 2 articles de test apparaissent dans la liste
   - [ ] Les images s'affichent correctement
   - [ ] Les titres sont corrects
   - [ ] Les extraits (excerpts) sont visibles
   - [ ] Les dates de publication sont correctes
   - [ ] Les catégories s'affichent
   - [ ] Les tags sont visibles

3. **Tester la recherche** :
   - [ ] Rechercher "Instagram" → L'article Instagram apparaît
   - [ ] Rechercher "TikTok" → L'article TikTok apparaît
   - [ ] Rechercher "followers" → Les 2 articles apparaissent

4. **Tester les filtres** :
   - [ ] Filtrer par catégorie → Les articles correspondants apparaissent
   - [ ] Filtrer par tag → Les articles correspondants apparaissent

### 3.2 Page Article Individuel

1. **Cliquer sur un article** (ex: Followers Instagram)
2. **Vérifier** :
   - [ ] Le titre complet s'affiche
   - [ ] L'image principale s'affiche en grand
   - [ ] Le contenu Markdown est bien formaté (titres, paragraphes, listes)
   - [ ] L'auteur est affiché
   - [ ] La date de publication est correcte
   - [ ] Le temps de lecture est affiché
   - [ ] Les tags sont visibles
   - [ ] Le bouton "Retour au blog" fonctionne

3. **Tester la navigation** :
   - [ ] Cliquer sur "Retour au blog" → Retour à la liste
   - [ ] Ouvrir l'autre article → Le contenu change correctement

---

## ✅ Étape 4 : Vérifier le SEO

### 4.1 Métadonnées HTML

1. **Ouvrir un article** sur votre site
2. **Clic droit** → **"Afficher le code source"** (ou Ctrl+U)
3. **Vérifier dans le `<head>`** :
   - [ ] `<title>` contient le meta title SEO
   - [ ] `<meta name="description">` contient la meta description
   - [ ] `<meta name="keywords">` contient les keywords
   - [ ] `<link rel="canonical">` pointe vers la bonne URL

### 4.2 Open Graph (Facebook, LinkedIn)

1. **Dans le code source**, vérifier :
   - [ ] `<meta property="og:title">` est présent
   - [ ] `<meta property="og:description">` est présent
   - [ ] `<meta property="og:image">` pointe vers l'image
   - [ ] `<meta property="og:url">` pointe vers l'URL de l'article
   - [ ] `<meta property="og:type">` est "article"

2. **Tester le partage** :
   - [ ] Partager l'article sur Facebook → L'aperçu s'affiche correctement
   - [ ] Partager sur LinkedIn → L'aperçu s'affiche correctement

### 4.3 Twitter Card

1. **Dans le code source**, vérifier :
   - [ ] `<meta name="twitter:card">` est "summary_large_image"
   - [ ] `<meta name="twitter:title">` est présent
   - [ ] `<meta name="twitter:description">` est présent
   - [ ] `<meta name="twitter:image">` pointe vers l'image

2. **Tester le partage** :
   - [ ] Utiliser le validateur Twitter : https://cards-dev.twitter.com/validator
   - [ ] Entrer l'URL de l'article → L'aperçu s'affiche correctement

---

## ✅ Étape 5 : Vérifier les Erreurs

### 5.1 Console du Navigateur

1. **Ouvrir les DevTools** (F12)
2. **Onglet Console**
3. **Vérifier** :
   - [ ] Aucune erreur rouge
   - [ ] Les logs Sanity apparaissent (🔍 Exécution de getBlogPosts...)
   - [ ] Pas d'erreurs CORS
   - [ ] Pas d'erreurs 404 pour les images

### 5.2 Réseau (Network)

1. **Onglet Network** dans les DevTools
2. **Recharger la page Blog**
3. **Vérifier** :
   - [ ] Des requêtes vers `sanity.io` ou `apicdn.sanity.io` apparaissent
   - [ ] Les requêtes retournent un statut 200 (succès)
   - [ ] Les images se chargent correctement

---

## ✅ Étape 6 : Test de Performance

1. **Temps de chargement** :
   - [ ] La page Blog se charge en moins de 3 secondes
   - [ ] Les images se chargent progressivement
   - [ ] Pas de blocage visible

2. **Responsive** :
   - [ ] Tester sur mobile (F12 → Toggle device toolbar)
   - [ ] Les articles s'affichent correctement sur mobile
   - [ ] La navigation fonctionne sur mobile

---

## ✅ Étape 7 : Test de Modification

1. **Modifier un article dans Sanity Studio** :
   - [ ] Changer le titre
   - [ ] Modifier le contenu
   - [ ] Cliquer sur "Publish"

2. **Vérifier sur le site** :
   - [ ] Attendre 10-30 secondes (cache)
   - [ ] Recharger la page (Ctrl+Shift+R pour vider le cache)
   - [ ] Les modifications apparaissent ✅

---

## 🎯 Résultat Attendu

Si tous les tests passent :
- ✅ **Sanity fonctionne correctement**
- ✅ **Les articles s'affichent sur le site**
- ✅ **Le SEO est configuré**
- ✅ **Les partages sociaux fonctionnent**
- ✅ **Votre consultant SEO peut maintenant gérer le contenu !**

---

## 🐛 Si quelque chose ne fonctionne pas

### Articles ne s'affichent pas
- [ ] Vérifier que "Publié" est coché dans Sanity
- [ ] Vérifier que vous avez cliqué sur "Publish"
- [ ] Vérifier CORS dans Sanity (domaine autorisé)
- [ ] Vérifier la console pour les erreurs

### Images ne s'affichent pas
- [ ] Vérifier que les images sont bien uploadées dans Sanity
- [ ] Vérifier que les URLs d'images sont correctes
- [ ] Vérifier CORS pour les images Sanity

### SEO ne fonctionne pas
- [ ] Vérifier que tous les champs SEO sont remplis dans Sanity
- [ ] Vérifier le code source de la page
- [ ] Vider le cache du navigateur

---

**Testez maintenant et dites-moi si tout fonctionne !** 🚀

