# 🔄 Migration des Données : String → Contenu Riche

## ⚠️ Problème

Après avoir changé les schémas pour utiliser uniquement des éditeurs riches, les données existantes dans Sanity sont encore des **strings** alors que le schéma attend maintenant des **arrays** (blockContent).

Cela cause des erreurs dans Sanity Studio :
```
Invalid property value
The value of this property must be of type array according to the schema.
```

## ✅ Solution

Un script de migration automatique a été créé pour convertir tous les champs `description` (string) en format blockContent (array).

## 🚀 Comment Utiliser

### 1. Obtenir un Token API Sanity

1. Allez sur [sanity.io/manage](https://sanity.io/manage)
2. Sélectionnez votre projet
3. Allez dans **API** → **Tokens**
4. Créez un nouveau token avec les permissions **Editor** (lecture + écriture)

### 2. Exécuter le Script de Migration

```bash
# Définir le token (remplacez par votre token réel)
export SANITY_API_TOKEN="votre-token-ici"

# Exécuter la migration
npm run migrate:descriptions
```

Ou directement :
```bash
SANITY_API_TOKEN="votre-token-ici" npm run migrate:descriptions
```

## 📋 Ce que fait le Script

Le script :
1. ✅ Récupère tous les documents des types suivants :
   - `homePage`
   - `instagramFollowersPage`
   - `instagramLikesPage`
   - `instagramViewsPage`
   - `instagramCommentsPage`

2. ✅ Pour chaque document, convertit les champs `description` qui sont encore des strings en format blockContent

3. ✅ Sauvegarde les modifications dans Sanity

4. ✅ Affiche un résumé des migrations effectuées

## 🔍 Exemple de Conversion

**Avant (string) :**
```json
{
  "hero": {
    "description": "Sur Instagram, la crédibilité d'un compte repose sur deux éléments..."
  }
}
```

**Après (array/blockContent) :**
```json
{
  "hero": {
    "description": [
      {
        "_type": "block",
        "_key": "block-...",
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
  }
}
```

## ⚠️ Important

- **Faites une sauvegarde** de vos données avant d'exécuter le script (optionnel, mais recommandé)
- Le script **ne supprime pas** les données, il les convertit
- Si un champ est déjà au bon format (array), il est ignoré
- Si un champ est vide, il est ignoré

## 🐛 En Cas d'Erreur

Si vous voyez des erreurs dans Sanity Studio après la migration :

1. **Cliquez sur "Reset value"** dans l'interface Sanity Studio
2. **Réentrez le contenu** manuellement dans l'éditeur riche
3. Ou **relancez le script** de migration

## 📝 Alternative Manuelle

Si vous préférez migrer manuellement :

1. Ouvrez Sanity Studio
2. Pour chaque champ avec erreur :
   - Cliquez sur **"Reset value"**
   - Réentrez le texte dans l'éditeur riche
   - Le formatage (gras, italique, liens) peut être ajouté après

## ✅ Vérification

Après la migration, vérifiez que :
- ✅ Plus d'erreurs dans Sanity Studio
- ✅ Les champs "Description" s'affichent correctement
- ✅ Le formatage fonctionne (gras, italique, liens)

