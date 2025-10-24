#!/usr/bin/env node

/**
 * Script automatisé pour créer de nouveaux articles de blog
 * Usage: npm run create-article "Titre de l'article" "Instagram"
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const ARTICLES_DIR = path.join(__dirname, '../src/content/blog/articles');
const METADATA_FILE = path.join(__dirname, '../src/data/blog/metadata.json');
const TEMPLATE_FILE = path.join(__dirname, '../src/content/blog/articles/template-simple.md');

// Catégories disponibles
const CATEGORIES = {
  'instagram': 'Instagram',
  'tiktok': 'TikTok', 
  'youtube': 'YouTube',
  'facebook': 'Facebook',
  'conseils': 'Conseils',
  'tutoriel': 'Tutoriel'
};

// Auteurs disponibles
const AUTHORS = {
  'moundir-rohmat': 'Moundir Rohmat',
  'equipe-ia-innovation': 'Équipe IA & Innovation'
};

class ArticleCreator {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async createArticle() {
    try {
      console.log('🚀 Création d\'un nouvel article de blog\n');
      
      // Collecter les informations
      const articleData = await this.collectArticleData();
      
      // Générer le slug
      articleData.slug = this.generateSlug(articleData.title);
      
      // Générer l'ID unique
      articleData.id = await this.generateUniqueId();
      
      // Créer le fichier markdown
      await this.createMarkdownFile(articleData);
      
      // Mettre à jour les métadonnées
      await this.updateMetadata(articleData);
      
      console.log('\n✅ Article créé avec succès !');
      console.log(`📁 Fichier: ${articleData.slug}.md`);
      console.log(`🔗 URL: /blogs/${articleData.slug}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error.message);
    } finally {
      this.rl.close();
    }
  }

  async collectArticleData() {
    const data = {};
    
    // Titre
    data.title = await this.question('📝 Titre de l\'article: ');
    if (!data.title.trim()) {
      throw new Error('Le titre est obligatoire');
    }
    
    // Description
    data.excerpt = await this.question('📄 Description courte (2-3 phrases): ');
    if (!data.excerpt.trim()) {
      throw new Error('La description est obligatoire');
    }
    
    // Catégorie
    console.log('\n📂 Catégories disponibles:');
    Object.entries(CATEGORIES).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`);
    });
    data.category = await this.question('📂 Catégorie: ');
    if (!CATEGORIES[data.category]) {
      throw new Error('Catégorie invalide');
    }
    
    // Auteur
    console.log('\n👤 Auteurs disponibles:');
    Object.entries(AUTHORS).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`);
    });
    data.author = await this.question('👤 Auteur: ');
    if (!AUTHORS[data.author]) {
      throw new Error('Auteur invalide');
    }
    
    // Tags
    data.tags = await this.question('🏷️ Tags (séparés par des virgules): ');
    data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // Image
    data.image = await this.question('🖼️ URL de l\'image (optionnel): ');
    if (!data.image) {
      data.image = 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=400&fit=crop';
    }
    
    // Temps de lecture estimé
    data.readTime = await this.question('⏱️ Temps de lecture estimé (minutes): ');
    data.readTime = parseInt(data.readTime) || 5;
    
    // Article en vedette
    data.featured = await this.question('⭐ Article en vedette ? (y/n): ');
    data.featured = data.featured.toLowerCase() === 'y';
    
    return data;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async generateUniqueId() {
    const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    const maxId = Math.max(...metadata.articles.map(article => 
      parseInt(article.id.split('-').pop()) || 0
    ));
    return maxId + 1;
  }

  async createMarkdownFile(data) {
    const today = new Date().toISOString().split('T')[0];
    const year = today.split('-')[0];
    const month = today.split('-')[1];
    
    // Créer le dossier s'il n'existe pas
    const articleDir = path.join(ARTICLES_DIR, year, month);
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }
    
    const filePath = path.join(articleDir, `${data.slug}.md`);
    
    // Template simplifié
    const template = `---
title: "${data.title}"
excerpt: "${data.excerpt}"
image: "${data.image}"
date: "${today}"
author: "${data.author}"
category: "${CATEGORIES[data.category]}"
slug: "${data.slug}"
tags: [${data.tags.map(tag => `"${tag}"`).join(', ')}]
readTime: ${data.readTime}
featured: ${data.featured}
published: true
---

# ${data.title}

${data.excerpt}

## Introduction

[Votre introduction ici...]

## Contenu principal

[Votre contenu ici...]

## Conclusion

[Votre conclusion ici...]
`;

    fs.writeFileSync(filePath, template);
    console.log(`📄 Fichier créé: ${filePath}`);
  }

  async updateMetadata(data) {
    const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    
    const newArticle = {
      id: data.slug,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      author: data.author,
      category: CATEGORIES[data.category],
      tags: data.tags,
      date: new Date().toISOString().split('T')[0],
      readTime: data.readTime,
      featured: data.featured,
      published: true,
      image: data.image,
      views: 0,
      likes: 0,
      // SEO automatique
      seoTitle: `${data.title} | Doctor Followers`,
      seoDescription: data.excerpt,
      focusKeyword: data.tags[0] || data.title.split(' ')[0].toLowerCase()
    };
    
    // Ajouter au début de la liste
    metadata.articles.unshift(newArticle);
    
    // Mettre à jour les statistiques
    metadata.stats.totalArticles = metadata.articles.length;
    metadata.stats.publishedArticles = metadata.articles.filter(a => a.published).length;
    metadata.lastUpdated = new Date().toISOString().split('T')[0];
    
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
    console.log('📊 Métadonnées mises à jour');
  }

  question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }
}

// Exécution
if (require.main === module) {
  const creator = new ArticleCreator();
  creator.createArticle();
}

module.exports = ArticleCreator;
