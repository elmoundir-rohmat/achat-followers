#!/usr/bin/env node

/**
 * Script de publication automatisée
 * Usage: npm run publish-article "slug-de-l-article"
 */

const fs = require('fs');
const path = require('path');
const { GoogleAuth } = require('google-auth-library');

class ArticlePublisher {
  constructor() {
    this.articlesDir = path.join(__dirname, '../src/content/blog/articles');
    this.metadataFile = path.join(__dirname, '../src/data/blog/metadata.json');
    this.publicMetadataFile = path.join(__dirname, '../public/blog-metadata.json');
  }

  async publishArticle(slug) {
    try {
      console.log(`🚀 Publication de l'article: ${slug}\n`);
      
      // Valider l'article
      await this.validateArticle(slug);
      
      // Mettre à jour le statut de publication
      await this.updatePublicationStatus(slug, true);
      
      // Générer les métadonnées publiques
      await this.generatePublicMetadata();
      
      // Vérifier la cohérence
      await this.verifyConsistency();

      // Déclencher l'indexation Google (non bloquant)
      await this.notifyIndexing(`https://doctorfollowers.com/blogs/${slug}`, 'URL_UPDATED');
      
      console.log('\n✅ Article publié avec succès !');
      console.log(`🔗 URL: https://doctorfollowers.com/blogs/${slug}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de la publication:', error.message);
      process.exit(1);
    }
  }

  async unpublishArticle(slug) {
    try {
      console.log(`📝 Dépublier l'article: ${slug}\n`);
      
      await this.updatePublicationStatus(slug, false);
      await this.generatePublicMetadata();

      // Notifier la suppression (non bloquant)
      await this.notifyIndexing(`https://doctorfollowers.com/blogs/${slug}`, 'URL_DELETED');
      
      console.log('✅ Article dépublié avec succès !');
      
    } catch (error) {
      console.error('❌ Erreur lors de la dépublication:', error.message);
      process.exit(1);
    }
  }

  async validateArticle(slug) {
    console.log('🔍 Validation de l\'article...');
    
    // Vérifier que le fichier existe
    const filePath = this.findArticleFile(slug);
    if (!filePath) {
      throw new Error(`Fichier de l'article '${slug}' introuvable`);
    }
    
    // Lire et valider le contenu
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    
    if (!frontmatterMatch) {
      throw new Error('Format frontmatter invalide');
    }
    
    const frontmatter = frontmatterMatch[1];
    const markdown = frontmatterMatch[2];
    
    // Vérifier les champs requis
    const requiredFields = ['title', 'excerpt', 'date', 'author', 'category'];
    const missingFields = requiredFields.filter(field => !frontmatter.includes(`${field}:`));
    
    if (missingFields.length > 0) {
      throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
    }
    
    // Vérifier que le contenu n'est pas vide
    if (markdown.trim().length < 100) {
      throw new Error('Contenu trop court (minimum 100 caractères)');
    }
    
    console.log('✅ Article validé');
  }

  async updatePublicationStatus(slug, published) {
    console.log(`📊 Mise à jour du statut de publication...`);
    
    const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
    const article = metadata.articles.find(a => a.slug === slug);
    
    if (!article) {
      throw new Error(`Article '${slug}' non trouvé dans les métadonnées`);
    }
    
    article.published = published;
    article.updatedAt = new Date().toISOString().split('T')[0];
    
    // Mettre à jour les statistiques
    metadata.stats.publishedArticles = metadata.articles.filter(a => a.published).length;
    metadata.stats.draftArticles = metadata.articles.filter(a => !a.published).length;
    metadata.lastUpdated = new Date().toISOString().split('T')[0];
    
    fs.writeFileSync(this.metadataFile, JSON.stringify(metadata, null, 2));
    console.log(`✅ Statut mis à jour: ${published ? 'publié' : 'brouillon'}`);
  }

  async generatePublicMetadata() {
    console.log('🌐 Génération des métadonnées publiques...');
    
    const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
    
    // Filtrer seulement les articles publiés
    const publicMetadata = {
      ...metadata,
      articles: metadata.articles.filter(article => article.published),
      stats: {
        ...metadata.stats,
        totalArticles: metadata.articles.filter(a => a.published).length
      }
    };
    
    // Créer le dossier public s'il n'existe pas
    const publicDir = path.dirname(this.publicMetadataFile);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(this.publicMetadataFile, JSON.stringify(publicMetadata, null, 2));
    console.log('✅ Métadonnées publiques générées');
  }

  async verifyConsistency() {
    console.log('🔗 Vérification de la cohérence...');
    
    const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
    const publicMetadata = JSON.parse(fs.readFileSync(this.publicMetadataFile, 'utf8'));
    
    const publishedCount = metadata.articles.filter(a => a.published).length;
    const publicCount = publicMetadata.articles.length;
    
    if (publishedCount !== publicCount) {
      throw new Error(`Incohérence détectée: ${publishedCount} articles publiés vs ${publicCount} dans les métadonnées publiques`);
    }
    
    console.log('✅ Cohérence vérifiée');
  }

  findArticleFile(slug) {
    const possiblePaths = [
      path.join(this.articlesDir, '2025', '01', `${slug}.md`),
      path.join(this.articlesDir, '2024', '10', `${slug}.md`),
      path.join(this.articlesDir, '2024', '01', `${slug}.md`),
      path.join(this.articlesDir, `${slug}.md`)
    ];
    
    return possiblePaths.find(filePath => fs.existsSync(filePath));
  }

  async listArticles() {
    console.log('📋 Liste des articles:\n');
    
    const metadata = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
    
    metadata.articles.forEach((article, index) => {
      const status = article.published ? '✅ Publié' : '📝 Brouillon';
      const featured = article.featured ? '⭐' : '  ';
      console.log(`${index + 1}. ${featured} ${status} - ${article.title}`);
      console.log(`   Slug: ${article.slug} | Catégorie: ${article.category}`);
      console.log(`   Date: ${article.date} | Auteur: ${article.author}\n`);
    });
    
    console.log(`📊 Total: ${metadata.articles.length} articles (${metadata.stats.publishedArticles} publiés, ${metadata.stats.draftArticles} brouillons)`);
  }

  async notifyIndexing(url, type) {
    const rawCredentials = process.env.GOOGLE_INDEXING_CREDENTIALS;
    if (!rawCredentials) {
      console.log('⚠️ Indexing API ignorée: GOOGLE_INDEXING_CREDENTIALS manquant.');
      return;
    }

    let credentials;
    try {
      credentials = JSON.parse(rawCredentials);
    } catch (error) {
      console.log('⚠️ Indexing API ignorée: GOOGLE_INDEXING_CREDENTIALS invalide.');
      return;
    }

    try {
      const auth = new GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/indexing']
      });

      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();

      const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.token}`
        },
        body: JSON.stringify({ url, type })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.log(`⚠️ Indexing API erreur (${response.status}):`, data);
        return;
      }

      console.log(`✅ Indexing API OK: ${type} -> ${url}`);
    } catch (error) {
      console.log('⚠️ Indexing API ignorée:', error.message);
    }
  }
}

// Interface en ligne de commande
const command = process.argv[2];
const slug = process.argv[3];

const publisher = new ArticlePublisher();

switch (command) {
  case 'publish':
    if (!slug) {
      console.error('❌ Usage: npm run publish-article publish <slug>');
      process.exit(1);
    }
    publisher.publishArticle(slug);
    break;
    
  case 'unpublish':
    if (!slug) {
      console.error('❌ Usage: npm run publish-article unpublish <slug>');
      process.exit(1);
    }
    publisher.unpublishArticle(slug);
    break;
    
  case 'list':
    publisher.listArticles();
    break;
    
  default:
    console.log('📚 Commandes disponibles:');
    console.log('  npm run publish-article publish <slug>  - Publier un article');
    console.log('  npm run publish-article unpublish <slug> - Dépublier un article');
    console.log('  npm run publish-article list             - Lister tous les articles');
    break;
}

module.exports = ArticlePublisher;
