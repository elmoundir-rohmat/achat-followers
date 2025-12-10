# ✅ Publier votre article dans Sanity

## Le problème

Votre article existe dans Sanity mais n'est **pas publié**. C'est pour ça qu'il n'apparaît pas sur votre site.

## Solution : Publier l'article

### Étape 1 : Ouvrir Sanity Studio

```bash
npm run studio
```

Ou allez sur : `http://localhost:3333`

### Étape 2 : Ouvrir votre article

1. Dans le menu de gauche, cliquez sur **"Articles de Blog"**
2. Cliquez sur votre article de test

### Étape 3 : Publier l'article

1. **Trouvez la case "Publié"** en haut à droite de l'éditeur
2. **Cochez la case "Publié"** ✅
3. Cliquez sur le bouton **"Publish"** ou **"Publier"** en haut à droite

### Étape 4 : Vérifier

1. Retournez sur votre application (`http://localhost:5174`)
2. Rafraîchissez la page (F5)
3. Votre article devrait maintenant apparaître ! 🎉

## Vérification dans la console

Après avoir publié, dans la console vous devriez voir :
- `✅ Articles publiés récupérés: [{…}]` (au lieu de `[]`)
- `✅ Nombre d'articles publiés: 1` (au lieu de `0`)

## Si ça ne fonctionne toujours pas

Vérifiez aussi que :
- ✅ L'**Auteur** est sélectionné
- ✅ La **Catégorie** est sélectionnée
- ✅ Le **Slug** est rempli
- ✅ L'**Image** est ajoutée

---

**Une fois publié, votre article apparaîtra immédiatement sur votre site !** 🚀

