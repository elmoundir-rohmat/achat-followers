# 🔄 Migration Instagram Followers Page

## 🎯 Objectif

Convertir les champs `description` (string) en contenu riche (array) pour :
- ✅ Hero description
- ✅ Section "Améliorer votre crédibilité" description

## 🚀 Comment Utiliser

### 1. Obtenir un Token API Sanity

1. Allez sur [sanity.io/manage](https://sanity.io/manage)
2. Sélectionnez votre projet **Doctor Followers**
3. Allez dans **API** → **Tokens**
4. Cliquez sur **Add API token**
5. Donnez-lui un nom (ex: "Migration Script")
6. Sélectionnez les permissions **Editor** (lecture + écriture)
7. Copiez le token généré

### 2. Exécuter la Migration

```bash
SANITY_API_TOKEN="votre-token-ici" npm run migrate:followers
```

Ou directement :
```bash
SANITY_API_TOKEN="votre-token-ici" node scripts/migrate-instagram-followers-descriptions.js
```

## 📋 Ce que fait le Script

Le script :
1. ✅ Récupère le document **Instagram Followers Page**
2. ✅ Détecte les champs `description` qui sont encore des strings
3. ✅ Les convertit en format blockContent (array)
4. ✅ Sauvegarde les modifications dans Sanity

### Champs migrés :
- `hero.description`
- `whyBuySection.credibilite.description` (Améliorer votre crédibilité)
- `whyBuySection.explorer.description`
- `whyBuySection.communaute.description`
- `securitySection.serviceClient.description`
- `securitySection.remboursement.description`
- `securitySection.paiements.description`

## ✅ Après la Migration

1. **Ouvrez Sanity Studio**
2. **Allez dans "Page Instagram Followers"**
3. **Vérifiez que les erreurs ont disparu**
4. **Les champs "Description" sont maintenant des éditeurs riches**
5. **Vous pouvez utiliser le formatage** (gras, italique, liens)

## 🔍 Exemple de Conversion

**Avant (string) :**
```
"Sur Instagram, la crédibilité d'un compte repose sur deux éléments..."
```

**Après (array/blockContent) :**
```json
[
  {
    "_type": "block",
    "style": "normal",
    "children": [
      {
        "_type": "span",
        "text": "Sur Instagram, la crédibilité d'un compte repose sur deux éléments...",
        "marks": []
      }
    ]
  }
]
```

## ⚠️ Important

- Le script **ne supprime pas** les données, il les convertit
- Si un champ est déjà au bon format (array), il est ignoré
- Si un champ est vide, il est ignoré
- **Faites une sauvegarde** si vous avez des doutes (optionnel)

## 🐛 En Cas d'Erreur

Si le script échoue :

1. **Vérifiez le token** : Assurez-vous qu'il a les permissions Editor
2. **Vérifiez la connexion** : Votre internet doit être actif
3. **Relancez le script** : Parfois un simple retry fonctionne

Si les erreurs persistent dans Sanity Studio :

1. **Cliquez sur "Reset value"** dans l'interface
2. **Réentrez le contenu** manuellement dans l'éditeur riche
3. **Utilisez les boutons de formatage** (B, I, U, 🔗)

## 📝 Notes

- Le script convertit uniquement les strings en arrays
- Le formatage (gras, italique, liens) peut être ajouté après dans Sanity Studio
- Les paragraphes (séparés par `\n`) sont automatiquement convertis en blocks séparés

