# Template pour les nouveaux articles de blog

## 📝 Format de date simplifié

**NOUVEAU FORMAT** : `"YYYY-MM-DD"` (ex: `"2024-10-12"`)

**ANCIEN FORMAT** : `"YYYY-MM-DDTHH:mm:ssZ"` (ex: `"2024-10-12T00:00:00Z"`)

## 🎯 Avantages du nouveau format

- ✅ **UX meilleure** : plus lisible pour les utilisateurs
- ✅ **Maintenance facile** : moins de caractères à taper
- ✅ **SEO conservé** : Google comprend très bien ce format
- ✅ **Standard** : utilisé par la plupart des blogs

## 📋 Champs à utiliser

### Frontmatter principal
```yaml
date: "2024-10-12"           # Date de publication
updatedAt: "2024-10-12"      # Date de mise à jour
```

### Schema.org (pour le SEO)
```yaml
schema:
  datePublished: "2024-10-12"
  dateModified: "2024-10-12"
```

### JSON (metadata.json)
```json
"publishedAt": "2024-10-12"
```

### JSON (authors.json)
```json
"joinDate": "2024-10-12"
"lastUpdated": "2024-10-12"
```

## 🚀 Instructions pour les nouveaux articles

1. **Copier le template** : `src/content/blog/articles/template-article.md`
2. **Remplacer les placeholders** : `[TITRE_DE_L_ARTICLE]`, `[YYYY-MM-DD]`, etc.
3. **Utiliser le format simplifié** : `"2024-10-12"` au lieu de `"2024-10-12T00:00:00Z"`
4. **Mettre à jour les fichiers JSON** avec le même format
5. **Ajouter dans blogService.ts** avec le format simplifié

## ⚠️ Important

- **Ne plus utiliser** `T00:00:00Z` dans les nouveaux articles
- **Garder la cohérence** : même format partout
- **Tester l'affichage** : vérifier que les dates s'affichent correctement
