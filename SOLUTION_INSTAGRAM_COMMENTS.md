# Solution - Page Instagram Comments ne s'affiche pas

## ✅ Solutions rapides

### 1. Vérifier que le document existe dans Sanity Studio

1. Lancez Sanity Studio : `npm run studio`
2. Allez dans "Page Instagram Commentaires"
3. **Vérifiez que le document existe** (ID: `instagramCommentsPage`)
4. Si le document n'existe pas, **créez-le** en cliquant sur "Page Instagram Commentaires"

### 2. Remplir le document avec le contenu

1. Ouvrez le document "Page Instagram Commentaires"
2. **Section Hero - SEO** :
   - Titre Principal (H1) : `Commentaires Instagram`
   - Description : `Des commentaires authentiques et personnalisés pour booster l'engagement de vos posts`

3. **Titres des Sections (H2)** :
   - Titre "Avis des clients" : `Avis des clients`
   - Titre "Sécurité" : `Acheter des commentaires Instagram en toute sécurité avec Doctor Followers`
   - Titre "Pourquoi acheter" : `Pourquoi acheter des commentaires Instagram en 2025?`

4. **Section "Pourquoi acheter"** : Ajoutez 3 sous-sections (voir `VALEURS_INSTAGRAM_COMMENTS_SANITY.md`)

5. **FAQ** : Ajoutez les 12 questions/réponses (voir `VALEURS_INSTAGRAM_COMMENTS_SANITY.md`)

6. **Réglages SEO** : Remplissez les champs SEO

### 3. Publier le document

1. **Cochez "Publié"** (checkbox en haut à droite)
2. **Cliquez sur "Publish"** (bouton en haut à droite)
3. ⚠️ **Les deux sont nécessaires** : checkbox + bouton Publish

### 4. Vérifier le dataset

Assurez-vous que vous modifiez le document dans le **bon dataset** :
- Dataset local : `development` (si vous utilisez `npm run studio` en local)
- Dataset production : `production` (si vous utilisez Sanity Studio déployé)

### 5. Redémarrer le serveur de dev

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez
npm run dev
```

### 6. Vider le cache du navigateur

- Chrome/Edge : `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
- Ou ouvrez en navigation privée

## 🔍 Vérification rapide

Dans la console du navigateur (F12), vous devriez voir :
- `✅ Données Instagram Comments reçues:` avec un objet contenant `hero`, `sectionTitles`, etc.

Si vous voyez `null` ou un objet vide, le document n'existe pas ou n'est pas publié.

## 📝 Checklist

- [ ] Document créé dans Sanity Studio
- [ ] Champs remplis (hero, sectionTitles, FAQ, etc.)
- [ ] Checkbox "Publié" cochée
- [ ] Bouton "Publish" cliqué
- [ ] Serveur de dev redémarré
- [ ] Cache du navigateur vidé

## 🚨 Si ça ne marche toujours pas

1. Vérifiez que le schéma est bien déployé :
   ```bash
   npm run studio:deploy
   ```

2. Vérifiez les CORS dans Sanity :
   - Allez sur https://www.sanity.io/manage
   - Projet → API → CORS origins
   - Ajoutez `http://localhost:5173` si absent

3. Vérifiez le dataset dans `sanity/lib/client.ts` :
   - Doit correspondre au dataset où vous avez créé le document

