# 🔍 Vérifier pourquoi l'article publié ne s'affiche pas

## Problème

L'article est publié dans Sanity Studio mais n'apparaît pas sur le front.

## Vérifications à faire

### 1. Vérifier dans la console

Après avoir rafraîchi la page, regardez la console et dites-moi ce que vous voyez pour :
- `🔍 Tous les articles dans Sanity:` - Combien d'articles ?
- `✅ Articles publiés récupérés:` - Combien d'articles publiés ?
- `📄 Détails du premier article:` - Qu'est-ce qui s'affiche ?

### 2. Vérifier dans Sanity Studio

Dans Sanity Studio (`localhost:3333`), ouvrez votre article et vérifiez :

#### A. Le champ "Publié"
- [ ] La case "Publié" est bien **cochée** ✅
- [ ] Vous avez cliqué sur **"Publish"** après avoir coché

#### B. Les références obligatoires
- [ ] **Auteur** : Un auteur est sélectionné (pas vide)
- [ ] **Catégorie** : Une catégorie est sélectionnée (pas vide)

#### C. Le Slug
- [ ] Le champ **"Slug (URL)"** est rempli
- [ ] Si vide, cliquez sur "Generate" pour le générer automatiquement

#### D. Les champs obligatoires
- [ ] **Titre** : Rempli
- [ ] **Extrait** : Rempli
- [ ] **Image principale** : Ajoutée
- [ ] **Contenu** : Rempli

### 3. Vérifier le cache

Parfois le cache peut causer des problèmes :

1. **Videz le cache du navigateur** :
   - Chrome/Edge : Ctrl+Shift+Delete (Windows) ou Cmd+Shift+Delete (Mac)
   - Ou ouvrez en navigation privée

2. **Attendez quelques secondes** après avoir publié (le CDN peut prendre du temps)

### 4. Test avec requête directe

Ouvrez la console et testez cette requête :

```javascript
// Dans la console du navigateur (F12)
fetch('https://jyf2mfzr.api.sanity.io/v2024-01-01/data/query/production?query=*%5B_type%20%3D%3D%20%22blogPost%22%20%26%26%20published%20%3D%3D%20true%5D')
  .then(r => r.json())
  .then(data => console.log('Articles publiés:', data))
```

Cela vous montrera directement ce que Sanity retourne.

## Solutions possibles

### Solution 1 : Republier l'article

1. Dans Sanity Studio, ouvrez votre article
2. Décochez "Publié"
3. Cliquez sur "Publish"
4. Recochez "Publié"
5. Cliquez sur "Publish" à nouveau

### Solution 2 : Vérifier les références

Si l'auteur ou la catégorie sont null, l'article peut ne pas être retourné correctement.

1. Créez un auteur si nécessaire (menu "Auteurs")
2. Créez une catégorie si nécessaire (menu "Catégories")
3. Réassignez-les à votre article
4. Republiez

### Solution 3 : Vérifier le dataset

Vérifiez que vous utilisez le bon dataset :
- Dans `sanity/lib/client.ts`, le dataset est `'production'`
- Dans Sanity Studio, vérifiez que vous êtes sur le dataset "production"

---

**Partagez-moi ce que vous voyez dans la console après avoir rafraîchi, et on pourra identifier le problème exact !**

