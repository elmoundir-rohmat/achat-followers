# 📝 Guide : Modifier les Pages du Site dans Sanity

## 🎯 Vue d'Ensemble

Votre consultant SEO peut maintenant modifier le contenu de **toutes les pages du site** directement dans Sanity Studio, sans avoir besoin de vous déranger pour redéployer.

---

## 🏠 Page d'Accueil

### Accéder à la Page d'Accueil

1. Ouvrez **Sanity Studio** : `http://localhost:3333/studio` (ou votre URL de production)
2. Dans le menu de gauche, cliquez sur **"Page d'Accueil"**
3. Vous verrez un seul document (la page d'accueil)

### Sections Modifiables

#### 1. Section Hero (Bannière Principale)

**Ce que vous pouvez modifier :**
- ✅ **Titre Principal** : Le grand titre en haut de la page
- ✅ **Sous-titre** : Le texte descriptif sous le titre
- ✅ **Texte du Bouton CTA** : Le texte du bouton principal
- ✅ **Lien du Bouton CTA** : Vers quelle page rediriger (ex: `instagram-followers`)

**Exemple :**
```
Titre Principal: "Achat followers Instagram & TikTok"
Sous-titre: "Boostez vos réseaux sociaux avec de vrais followers..."
Texte du Bouton: "Acheter des followers"
Lien du Bouton: "instagram-followers"
```

#### 2. Section Services

**Ce que vous pouvez modifier :**
- ✅ **Titre de la Section** : Le titre de la section services
- ✅ **Description** : Une description introductive

#### 3. Section Avantages

**Ce que vous pouvez modifier :**
- ✅ **Titre de la Section** : Le titre de la section avantages
- ✅ **Liste des Avantages** : Ajouter/modifier/supprimer des avantages
  - Titre de l'avantage
  - Description
  - Icône (nom de l'icône, ex: `Shield`, `Clock`, `Zap`)

**Exemple d'avantage :**
```
Titre: "Livraison Rapide"
Description: "Résultats visibles en quelques heures"
Icône: "Zap"
```

#### 4. Section FAQ

**Ce que vous pouvez modifier :**
- ✅ **Titre de la Section** : Le titre de la section FAQ
- ✅ **Questions Fréquentes** : Ajouter/modifier/supprimer des questions
  - Question
  - Réponse

**Exemple :**
```
Question: "Combien de temps pour recevoir mes followers ?"
Réponse: "La livraison se fait généralement entre 24 et 72 heures..."
```

#### 5. Section Témoignages

**Ce que vous pouvez modifier :**
- ✅ **Titre de la Section** : Le titre de la section témoignages
- ✅ **Témoignages** : Ajouter/modifier/supprimer des témoignages
  - Auteur
  - Texte du témoignage
  - Note (sur 5)

#### 6. Section CTA Finale

**Ce que vous pouvez modifier :**
- ✅ **Titre** : Le titre de la section finale
- ✅ **Description** : Le texte descriptif
- ✅ **Texte du Bouton** : Le texte du bouton d'action
- ✅ **Lien du Bouton** : Vers quelle page rediriger

---

## 🔍 SEO de la Page d'Accueil

### Métadonnées SEO

**Ce que vous pouvez modifier :**
- ✅ **Titre SEO** : Le titre qui apparaît dans Google (50-60 caractères)
- ✅ **Description SEO** : La description dans les résultats de recherche (150-160 caractères)
- ✅ **Mots-clés** : Liste de mots-clés pertinents
- ✅ **URL Canonique** : L'URL canonique (généralement `https://doctorfollowers.com`)

### Open Graph (Facebook, LinkedIn)

**Ce que vous pouvez modifier :**
- ✅ **Titre** : Le titre pour les partages sociaux
- ✅ **Description** : La description pour les partages
- ✅ **Image** : L'image qui apparaît lors du partage

### Twitter Card

**Ce que vous pouvez modifier :**
- ✅ **Type de Carte** : `summary` ou `summary_large_image`
- ✅ **Titre** : Le titre pour Twitter
- ✅ **Description** : La description pour Twitter
- ✅ **Image** : L'image pour Twitter

---

## 📄 Autres Pages (About, Contact, etc.)

### Créer une Nouvelle Page

1. Dans Sanity Studio, cliquez sur **"Pages"** dans le menu
2. Cliquez sur **"Create new"**
3. Remplissez les champs :
   - **Titre de la page** : Le titre de la page
   - **Slug (URL)** : L'URL de la page (ex: `about`, `contact`)
   - **Contenu** : Le contenu de la page (format Markdown)
   - **Réglages SEO** : Les métadonnées SEO
   - **Publié** : Cochez pour publier

### Modifier une Page Existante

1. Cliquez sur **"Pages"** dans le menu
2. Sélectionnez la page à modifier
3. Modifiez les champs souhaités
4. Cliquez sur **"Publish"**

---

## ✅ Workflow de Modification

### Pour Modifier la Page d'Accueil

1. **Ouvrir Sanity Studio**
2. **Cliquer sur "Page d'Accueil"**
3. **Modifier les sections souhaitées** :
   - Hero
   - Services
   - Avantages
   - FAQ
   - Témoignages
   - CTA Finale
   - SEO
4. **Vérifier que "Publié" est coché**
5. **Cliquer sur "Publish"** en haut à droite
6. **Attendre 10-30 secondes** (cache CDN)
7. **Recharger le site** pour voir les changements

### Pour Créer/Modifier une Autre Page

1. **Ouvrir Sanity Studio**
2. **Cliquer sur "Pages"**
3. **Créer ou modifier** la page
4. **Remplir tous les champs** (titre, slug, contenu, SEO)
5. **Cocher "Publié"**
6. **Cliquer sur "Publish"**
7. **Vérifier sur le site**

---

## 🎯 Exemples de Modifications Courantes

### Exemple 1 : Changer le Titre Principal

1. Sanity Studio → Page d'Accueil
2. Section **Hero** → **Titre Principal**
3. Modifier le texte
4. Publish

### Exemple 2 : Ajouter une Question FAQ

1. Sanity Studio → Page d'Accueil
2. Section **FAQ** → **Questions Fréquentes**
3. Cliquer sur **"Add item"**
4. Remplir Question et Réponse
5. Publish

### Exemple 3 : Modifier les Mots-clés SEO

1. Sanity Studio → Page d'Accueil
2. Section **Réglages SEO** → **Mots-clés**
3. Ajouter/Supprimer des mots-clés
4. Publish

---

## ⚠️ Important

### Deux Étapes pour Publier

1. ✅ **Cocher "Publié"** dans les champs
2. ✅ **Cliquer sur le bouton "Publish"** en haut à droite

**Les deux sont nécessaires !**

### Délai de Mise à Jour

- Les changements apparaissent en **10-30 secondes** sur le site
- Si vous ne voyez pas les changements :
  - Videz le cache du navigateur (Ctrl+Shift+R)
  - Attendez quelques secondes de plus

---

## 🚀 Avantages

✅ **Modifications instantanées** : Pas besoin de redéployer  
✅ **Interface simple** : Pas besoin de connaître le code  
✅ **SEO complet** : Toutes les métadonnées SEO modifiables  
✅ **Sécurité** : Impossible de casser le code du site  

---

**Votre consultant SEO peut maintenant gérer tout le contenu du site en autonomie !** 🎯

