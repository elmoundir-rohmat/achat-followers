# 🔍 Debug Sanity - Articles ne s'affichent pas

## Problème

Les articles ne s'affichent pas même si CORS est configuré. La requête retourne un tableau vide.

## Causes possibles

### 1. Article non publié ✅ Vérifiez en premier

Dans Sanity Studio :
- Ouvrez votre article
- Vérifiez que la case **"Publié"** est bien **cochée**
- Cliquez sur **"Publish"** pour sauvegarder

### 2. Références manquantes (Author, Category)

L'article doit avoir :
- ✅ Un **Auteur** sélectionné (créé dans "Auteurs")
- ✅ Une **Catégorie** sélectionnée (créée dans "Catégories")

Si ces références n'existent pas, l'article ne sera pas retourné par la requête.

### 3. Vérification dans la console

Ouvrez la console du navigateur (F12) et cherchez :
- `🔍 Tous les articles dans Sanity:` - montre tous les articles (publiés ou non)
- `✅ Articles publiés récupérés:` - montre seulement les articles publiés

## Solution étape par étape

### Étape 1 : Vérifier dans Sanity Studio

1. Ouvrez Sanity Studio : `npm run studio`
2. Allez dans "Articles de Blog"
3. Ouvrez votre article de test
4. Vérifiez :
   - [ ] Case "Publié" est cochée
   - [ ] Un Auteur est sélectionné
   - [ ] Une Catégorie est sélectionnée
   - [ ] Le slug est rempli
   - [ ] Cliquez sur "Publish" si vous avez modifié quelque chose

### Étape 2 : Créer les références si nécessaire

Si l'auteur ou la catégorie n'existent pas :

**Créer un Auteur :**
1. Menu "Auteurs" → "Create"
2. Remplissez :
   - Nom : "Doctor Followers" (ou votre nom)
   - Slug : générez automatiquement
3. Sauvegardez

**Créer une Catégorie :**
1. Menu "Catégories" → "Create"
2. Remplissez :
   - Nom : "Instagram"
   - Slug : générez automatiquement
3. Sauvegardez

### Étape 3 : Lier l'article aux références

1. Ouvrez votre article
2. Dans le champ "Auteur", sélectionnez l'auteur créé
3. Dans le champ "Catégorie", sélectionnez la catégorie créée
4. Cochez "Publié"
5. Cliquez sur "Publish"

### Étape 4 : Vérifier dans la console

1. Rafraîchissez votre application
2. Ouvrez la console (F12)
3. Cherchez les logs :
   - `🔍 Tous les articles dans Sanity:` - doit montrer au moins 1 article
   - `✅ Articles publiés récupérés:` - doit montrer votre article

## Test rapide

Dans Sanity Studio, créez un article minimal pour tester :

1. **Titre** : "Test Article"
2. **Slug** : "test-article" (généré automatiquement)
3. **Extrait** : "Ceci est un test"
4. **Image** : Ajoutez une image
5. **Auteur** : Sélectionnez un auteur existant
6. **Catégorie** : Sélectionnez une catégorie existante
7. **Contenu** : "Test content"
8. **Publié** : ✅ Cochez
9. **Publish**

Ensuite, rafraîchissez votre application et vérifiez la console.

---

**Si le problème persiste**, partagez-moi ce que vous voyez dans la console après avoir rafraîchi la page.

