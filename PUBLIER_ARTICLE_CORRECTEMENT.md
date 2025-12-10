# ✅ Comment Publier Correctement un Article dans Sanity

## ⚠️ Important : Deux Actions Nécessaires

Dans Sanity, il faut faire **DEUX choses** pour qu'un article soit visible :

1. **Cocher la case "Publié"** (champ boolean)
2. **Cliquer sur le bouton "Publish"** (publie le document)

## 📋 Procédure Complète

### Étape 1 : Ouvrir votre article

1. Dans Sanity Studio (`localhost:3333`)
2. Menu "Articles de Blog"
3. Cliquez sur votre article

### Étape 2 : Cocher "Publié"

1. **Descendez dans le formulaire** jusqu'à la section "Statut et métadonnées"
2. Trouvez le champ **"Publié"**
3. **Cochez la case** ✅
   - ⚠️ **IMPORTANT** : Ne cliquez pas encore sur "Publish" !

### Étape 3 : Cliquer sur "Publish"

1. **En haut à droite** de l'écran, trouvez le bouton **"Publish"** ou **"Publier"**
2. Cliquez sur **"Publish"**
3. Attendez la confirmation (un message devrait apparaître)

### Étape 4 : Vérifier

1. Après avoir cliqué sur "Publish", **vérifiez que la case "Publié" est toujours cochée**
2. Si elle s'est décochée, recochez-la et cliquez à nouveau sur "Publish"

### Étape 5 : Rafraîchir votre application

1. Retournez sur votre application (`localhost:5174`)
2. Rafraîchissez la page (F5)
3. L'article devrait maintenant apparaître !

## 🔍 Vérification dans la Console

Après avoir rafraîchi, dans la console vous devriez voir :
- `✅ Articles publiés récupérés: [{…}]` (au lieu de `[]`)
- `📄 Détails du premier article: {published: true, ...}` (au lieu de `published: false`)

## ❓ Si ça ne fonctionne toujours pas

### Vérifiez dans Sanity Studio

1. Ouvrez votre article
2. Regardez en bas de la liste des champs
3. Le champ "Publié" doit être **coché** ✅
4. Si ce n'est pas le cas :
   - Cochez-le
   - Cliquez sur "Publish" en haut à droite
   - Attendez la confirmation

### Vérifiez le cache

1. Videz le cache du navigateur (Ctrl+Shift+Delete)
2. Ou ouvrez en navigation privée
3. Rafraîchissez

### Test : Créer un nouvel article minimal

Si le problème persiste, créez un article de test minimal :

1. **Titre** : "Test"
2. **Slug** : "test" (généré automatiquement)
3. **Extrait** : "Test"
4. **Image** : Ajoutez une image
5. **Auteur** : Sélectionnez un auteur
6. **Catégorie** : Sélectionnez une catégorie
7. **Contenu** : "Test"
8. **Publié** : ✅ Cochez
9. **Publish** : Cliquez sur le bouton

Si cet article de test apparaît, le problème vient de votre article original.

---

**L'essentiel : La case "Publié" doit être cochée ET vous devez cliquer sur "Publish" !**

