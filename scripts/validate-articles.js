#!/usr/bin/env node

/**
 * Script de validation des articles de blog
 * Usage: npm run validate-articles
 */

const fs = require('fs');
const path = require('path');

class ArticleValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.articlesDir = path.join(__dirname, '../src/content/blog/articles');
    this.metadataFile = path.join(__dirname, '../src/data/blog/metadata.json');
  }

  async validateAll() {
    console.log('🔍 Validation des articles de blog...\n');
    
    try {
      // Valider les métadonnées
      await this.validateMetadata();
      
      // Valider les fichiers markdown
      await this.validateMarkdownFiles();
      
      // Valider la cohérence
      await this.validateConsistency();
      
      // Afficher les résultats
      this.displayResults();
      
    } catch (error) {
      console.error('❌ Erreur lors de la validation:', error.message);
    }
  }

  async validateMetadata() {
    console.log('📊 Validation des métadonnées...');
    
    if (!fs.existsSync(this.metadataFile)) {
      this.errors.push('Fichier metadata.json introuvable');
      return;
    }
    
    const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
    
    // Vérifier la structure
    if (!metadata.articles || !Array.isArray(metadata.articles)) {
      this.errors.push('Structure metadata.json invalide');
      return;
    }
    
    // Valider chaque article
    metadata.articles.forEach((article, index) => {
      this.validateArticleMetadata(article, index);
    });
    
    console.log(`✅ ${metadata.articles.length} articles validés`);
  }

  validateArticleMetadata(article, index) {
    const requiredFields = ['id', 'title', 'excerpt', 'author', 'category', 'date'];
    
    requiredFields.forEach(field => {
      if (!article[field]) {
        this.errors.push(`Article ${index + 1}: Champ requis manquant '${field}'`);
      }
    });
    
    // Valider le format de date
    if (article.date && !this.isValidDate(article.date)) {
      this.errors.push(`Article ${index + 1}: Format de date invalide '${article.date}'`);
    }
    
    // Valider les tags
    if (article.tags && !Array.isArray(article.tags)) {
      this.errors.push(`Article ${index + 1}: Les tags doivent être un tableau`);
    }
    
    // Valider le slug
    if (article.slug && !this.isValidSlug(article.slug)) {
      this.errors.push(`Article ${index + 1}: Slug invalide '${article.slug}'`);
    }
    
    // Vérifier la longueur du titre
    if (article.title && article.title.length > 60) {
      this.warnings.push(`Article ${index + 1}: Titre trop long (${article.title.length} caractères)`);
    }
    
    // Vérifier la longueur de la description
    if (article.excerpt && article.excerpt.length > 160) {
      this.warnings.push(`Article ${index + 1}: Description trop longue (${article.excerpt.length} caractères)`);
    }
  }

  async validateMarkdownFiles() {
    console.log('📄 Validation des fichiers markdown...');
    
    const files = this.getAllMarkdownFiles();
    let validFiles = 0;
    
    files.forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        this.validateMarkdownFile(content, filePath);
        validFiles++;
      } catch (error) {
        this.errors.push(`Erreur lecture fichier ${filePath}: ${error.message}`);
      }
    });
    
    console.log(`✅ ${validFiles}/${files.length} fichiers markdown validés`);
  }

  validateMarkdownFile(content, filePath) {
    // Vérifier la présence du frontmatter
    if (!content.includes('---')) {
      this.errors.push(`${filePath}: Frontmatter manquant`);
      return;
    }
    
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      this.errors.push(`${filePath}: Format frontmatter invalide`);
      return;
    }
    
    const frontmatter = frontmatterMatch[1];
    const markdown = frontmatterMatch[2];
    
    // Vérifier les champs requis dans le frontmatter
    const requiredFields = ['title', 'excerpt', 'date', 'author', 'category'];
    requiredFields.forEach(field => {
      if (!frontmatter.includes(`${field}:`)) {
        this.errors.push(`${filePath}: Champ requis manquant '${field}'`);
      }
    });
    
    // Vérifier que le contenu n'est pas vide
    if (markdown.trim().length < 100) {
      this.warnings.push(`${filePath}: Contenu très court (${markdown.trim().length} caractères)`);
    }
  }

  async validateConsistency() {
    console.log('🔗 Validation de la cohérence...');
    
    const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
    const markdownFiles = this.getAllMarkdownFiles();
    
    // Vérifier que tous les articles dans metadata.json ont un fichier correspondant
    metadata.articles.forEach(article => {
      const expectedFile = path.join(this.articlesDir, '2025', '01', `${article.slug}.md`);
      if (!fs.existsSync(expectedFile)) {
        this.warnings.push(`Article '${article.slug}' dans metadata.json mais fichier manquant`);
      }
    });
    
    // Vérifier que tous les fichiers markdown sont dans metadata.json
    markdownFiles.forEach(filePath => {
      const slug = path.basename(filePath, '.md');
      const existsInMetadata = metadata.articles.some(article => article.slug === slug);
      if (!existsInMetadata) {
        this.warnings.push(`Fichier '${slug}.md' existe mais pas dans metadata.json`);
      }
    });
    
    console.log('✅ Cohérence validée');
  }

  getAllMarkdownFiles() {
    const files = [];
    
    const scanDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanDir(itemPath);
        } else if (item.endsWith('.md') && item !== 'template-simple.md') {
          files.push(itemPath);
        }
      });
    };
    
    scanDir(this.articlesDir);
    return files;
  }

  isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  isValidSlug(slug) {
    return /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100;
  }

  displayResults() {
    console.log('\n📋 Résultats de la validation:\n');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('🎉 Tous les articles sont valides !');
      return;
    }
    
    if (this.errors.length > 0) {
      console.log('❌ Erreurs critiques:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️ Avertissements:');
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    console.log(`\n📊 Résumé: ${this.errors.length} erreurs, ${this.warnings.length} avertissements`);
    
    if (this.errors.length > 0) {
      process.exit(1);
    }
  }
}

// Exécution
if (require.main === module) {
  const validator = new ArticleValidator();
  validator.validateAll();
}

module.exports = ArticleValidator;
