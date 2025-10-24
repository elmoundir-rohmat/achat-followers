# 📝 Guide de Publication - Système de Blog Doctor Followers

## 🚀 Workflow Simplifié

### **Création d'un nouvel article**

```bash
# Créer un nouvel article (interactif)
npm run create-article

# Ou avec les raccourcis
npm run blog:create
```

Le script vous guidera étape par étape :
- 📝 Titre de l'article
- 📄 Description courte
- 📂 Catégorie (Instagram, TikTok, YouTube, Facebook, Conseils, Tutoriel)
- 👤 Auteur
- 🏷️ Tags
- 🖼️ Image (optionnel)
- ⏱️ Temps de lecture estimé
- ⭐ Article en vedette

### **Validation des articles**

```bash
# Valider tous les articles
npm run validate-articles

# Ou avec le raccourci
npm run blog:validate
```

Vérifie :
- ✅ Structure des métadonnées
- ✅ Format des fichiers markdown
- ✅ Cohérence entre fichiers et métadonnées
- ✅ Longueur des titres et descriptions
- ✅ Format des dates et slugs

### **Publication des articles**

```bash
# Publier un article
npm run publish-article publish "slug-de-l-article"

# Dépublier un article
npm run publish-article unpublish "slug-de-l-article"

# Lister tous les articles
npm run publish-article list

# Ou avec les raccourcis
npm run blog:publish publish "slug-de-l-article"
npm run blog:list
```

## 📁 Structure des Fichiers

```
src/content/blog/articles/
├── 2025/01/                    # Articles de janvier 2025
│   ├── article-1.md
│   └── article-2.md
├── 2024/10/                    # Articles d'octobre 2024
└── template-simple.md          # Template simplifié

src/data/blog/
└── metadata.json               # Métadonnées centralisées

public/
└── blog-metadata.json          # Métadonnées publiques (générées automatiquement)
```

## 📋 Template Simplifié

Le nouveau template ne contient que les champs essentiels :

```yaml
---
title: "Titre de l'article"
excerpt: "Description courte de l'article"
image: "https://images.unsplash.com/photo-XXXXX?w=800&h=400&fit=crop"
date: "2025-01-15"
author: "moundir-rohmat"
category: "Instagram"
slug: "slug-de-l-article"
tags: ["Tag1", "Tag2", "Tag3"]
readTime: 5
featured: true
published: true
---

# Titre de l'article

Description courte de l'article

## Introduction

[Votre introduction ici...]

## Section 1

[Contenu de la première section...]

## Section 2

[Contenu de la deuxième section...]

## Conclusion

[Votre conclusion ici...]
```

## 🎯 Catégories Disponibles

- `instagram` - Articles sur Instagram
- `tiktok` - Articles sur TikTok
- `youtube` - Articles sur YouTube
- `facebook` - Articles sur Facebook
- `conseils` - Conseils généraux
- `tutoriel` - Tutoriels et guides

## 👤 Auteurs Disponibles

- `moundir-rohmat` - Moundir Rohmat
- `equipe-ia-innovation` - Équipe IA & Innovation

## 🔧 Fonctionnalités Automatiques

### **Génération automatique :**
- ✅ Slug à partir du titre
- ✅ ID unique séquentiel
- ✅ Métadonnées SEO de base
- ✅ Dossier organisé par année/mois
- ✅ Mise à jour des statistiques

### **Validation automatique :**
- ✅ Champs requis présents
- ✅ Format des dates
- ✅ Longueur des titres/descriptions
- ✅ Cohérence des métadonnées
- ✅ Structure des fichiers

### **Publication automatique :**
- ✅ Mise à jour du statut
- ✅ Génération des métadonnées publiques
- ✅ Vérification de cohérence
- ✅ Statistiques mises à jour

## 📊 Bonnes Pratiques

### **Titres :**
- 30-60 caractères pour le SEO
- Inclure le mot-clé principal
- Être descriptif et accrocheur

### **Descriptions :**
- 120-160 caractères
- Résumer l'article en 2-3 phrases
- Inclure un appel à l'action

### **Tags :**
- Maximum 5 tags par article
- Utiliser des mots-clés pertinents
- Éviter les doublons

### **Images :**
- Format : JPG ou WebP
- Dimensions : 800x400px minimum
- Ratio : 16:9 recommandé
- Sources : Unsplash, Pexels

## 🚨 Résolution de Problèmes

### **Erreur "Article non trouvé"**
```bash
# Vérifier que l'article existe
npm run blog:list

# Valider les métadonnées
npm run blog:validate
```

### **Erreur "Format frontmatter invalide"**
- Vérifier que le frontmatter commence et finit par `---`
- S'assurer que tous les champs requis sont présents
- Vérifier la syntaxe YAML

### **Erreur "Slug invalide"**
- Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets
- Maximum 100 caractères
- Pas d'espaces ni de caractères spéciaux

## 🔄 Workflow Complet

1. **Créer l'article** : `npm run create-article`
2. **Rédiger le contenu** : Éditer le fichier `.md` généré
3. **Valider** : `npm run validate-articles`
4. **Publier** : `npm run publish-article publish "slug"`
5. **Vérifier** : Visiter l'URL générée

## 📈 Statistiques

Le système génère automatiquement :
- Nombre total d'articles
- Articles publiés vs brouillons
- Vues et likes totaux
- Nombre d'auteurs et catégories
- Temps de lecture moyen

## 🆘 Support

En cas de problème :
1. Exécuter `npm run validate-articles` pour diagnostiquer
2. Vérifier les logs d'erreur
3. Consulter ce guide
4. Contacter l'équipe technique

---

*Ce système automatisé simplifie considérablement la publication d'articles tout en maintenant la qualité et la cohérence du contenu.*
