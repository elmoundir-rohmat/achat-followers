# 🔧 Corriger les Erreurs Sanity - Guide Rapide

## ✅ État Actuel

Le test confirme que ces champs sont encore des **strings** alors qu'ils doivent être des **arrays** :
- ❌ Hero Description (string)
- ❌ Section "Améliorer votre crédibilité" Description (string)

## 🚀 Solution : Migration Automatique

### Étape 1 : Obtenir un Token API (2 minutes)

1. **Allez sur** : https://sanity.io/manage
2. **Connectez-vous** avec votre compte
3. **Sélectionnez votre projet** (Doctor Followers)
4. **Cliquez sur "API"** dans le menu de gauche
5. **Cliquez sur "Tokens"**
6. **Cliquez sur "+ Add API token"** ou **"Create token"**
7. **Configurez** :
   - **Name** : "Migration Script" (ou n'importe quel nom)
   - **Permissions** : Sélectionnez **"Editor"** (important : pas Viewer, mais Editor)
8. **Cliquez sur "Save"** ou **"Create"**
9. **COPIEZ LE TOKEN** immédiatement (vous ne pourrez plus le voir après !)

### Étape 2 : Exécuter la Migration

Ouvrez un terminal dans votre projet et exécutez :

```bash
SANITY_API_TOKEN="collez-votre-token-ici" npm run migrate:followers
```

**Exemple** :
```bash
SANITY_API_TOKEN="sk1234567890abcdef" npm run migrate:followers
```

### Étape 3 : Vérifier

1. **Ouvrez Sanity Studio** (`npm run studio`)
2. **Allez dans "Page Instagram Followers"**
3. **Vérifiez que les erreurs ont disparu** ✅

## 🔄 Alternative : Correction Manuelle (si pas de token)

Si vous ne pouvez pas obtenir un token, vous pouvez corriger manuellement :

### Dans Sanity Studio :

1. **Ouvrez "Page Instagram Followers"**
2. **Pour chaque champ avec erreur** :
   - Cliquez sur **"Reset value"** (bouton orange)
   - **Réentrez le texte** dans l'éditeur riche qui apparaît
   - **Utilisez les boutons de formatage** (B, I, U, 🔗) si besoin
   - **Sauvegardez**

### Champs à corriger :

1. **Hero** → **Description**
   - Cliquez sur "Reset value"
   - Réentrez : "Acheter des followers Instagram réels et actifs pour faire grandir votre communauté"

2. **Section "Pourquoi acheter"** → **"Améliorer votre crédibilité"** → **Description**
   - Cliquez sur "Reset value"
   - Réentrez : "Sur Instagram, la crédibilité d'un compte repose sur deux éléments : le nombre d'abonnés et l'engagement..."

## 🐛 Si le Script Échoue

### Erreur : "SANITY_API_TOKEN n'est pas défini"
- Vérifiez que vous avez bien collé le token entre les guillemets
- Le token doit commencer par `sk`

### Erreur : "Unauthorized" ou "403"
- Vérifiez que le token a les permissions **Editor** (pas Viewer)
- Créez un nouveau token avec les bonnes permissions

### Erreur : "Document not found"
- Vérifiez que vous êtes dans le dataset **production**
- Vérifiez que le document existe dans Sanity Studio

## ✅ Après la Migration

Une fois corrigé :
- ✅ Les erreurs disparaissent dans Sanity Studio
- ✅ Vous pouvez utiliser le formatage (gras, italique, liens)
- ✅ Le contenu s'affiche correctement sur votre site

## 📞 Besoin d'Aide ?

Si vous avez des problèmes :
1. Vérifiez que le token est correct
2. Vérifiez que vous êtes connecté à Sanity
3. Essayez la correction manuelle si le script ne fonctionne pas

