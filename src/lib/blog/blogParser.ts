// Parser markdown et utilitaires pour le système de blog

import { 
  BlogArticle, 
  BlogMetadata, 
  MarkdownFrontmatter, 
  ParsedMarkdownFile,
  Author,
  Category,
  SEOData
} from './blogTypes';
import { BLOG_CATEGORIES, VALIDATION_PATTERNS } from './blogConstants';

export class BlogParser {
  /**
   * Parse un fichier markdown complet avec frontmatter
   */
  static parseMarkdownFile(content: string): ParsedMarkdownFile {
    const { frontmatter, markdown } = this.extractFrontmatter(content);
    const html = this.markdownToHtml(markdown);
    const readingTime = this.calculateReadingTime(markdown);

    return {
      frontmatter,
      content: markdown,
      html,
      readingTime
    };
  }

  /**
   * Extrait le frontmatter YAML du contenu markdown
   */
  static extractFrontmatter(content: string): { frontmatter: MarkdownFrontmatter; markdown: string } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      throw new Error('Frontmatter non trouvé dans le fichier markdown');
    }

    const frontmatterYaml = match[1];
    const markdown = match[2];

    try {
      const frontmatter = this.parseYaml(frontmatterYaml);
      this.validateFrontmatter(frontmatter);
      return { frontmatter, markdown };
    } catch (error) {
      throw new Error(`Erreur de parsing du frontmatter: ${error}`);
    }
  }

  /**
   * Parse YAML simple (version basique)
   */
  private static parseYaml(yaml: string): MarkdownFrontmatter {
    const lines = yaml.split('\n');
    const frontmatter: any = {};

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex === -1) continue;

      const key = trimmedLine.substring(0, colonIndex).trim();
      let value = trimmedLine.substring(colonIndex + 1).trim();

      // Supprimer les guillemets
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Parser les arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        frontmatter[key] = arrayContent.split(',').map(item => item.trim().replace(/['"]/g, ''));
      } else {
        frontmatter[key] = value;
      }
    }

    return frontmatter as MarkdownFrontmatter;
  }

  /**
   * Valide le frontmatter
   */
  private static validateFrontmatter(frontmatter: MarkdownFrontmatter): void {
    const requiredFields = ['id', 'title', 'excerpt', 'author', 'category', 'tags', 'date'];
    
    for (const field of requiredFields) {
      if (!frontmatter[field as keyof MarkdownFrontmatter]) {
        throw new Error(`Champ requis manquant: ${field}`);
      }
    }

    // Valider le slug
    if (!VALIDATION_PATTERNS.SLUG.test(frontmatter.id)) {
      throw new Error('ID invalide (doit contenir uniquement des lettres minuscules, chiffres et tirets)');
    }

    // Valider la date
    if (!VALIDATION_PATTERNS.DATE.test(frontmatter.date)) {
      throw new Error('Format de date invalide');
    }
  }

  /**
   * Convertit markdown en HTML
   */
  static markdownToHtml(markdown: string): string {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" loading="lazy" />');

    // Line breaks
    html = html.replace(/\n\n/gim, '</p><p>');
    html = html.replace(/\n/gim, '<br />');

    // Wrap in paragraphs
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/gim, '');
    html = html.replace(/<p><br \/><\/p>/gim, '');

    return html;
  }

  /**
   * Calcule le temps de lecture estimé
   */
  static calculateReadingTime(content: string): number {
    const words = content.split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * Optimise les images dans le HTML
   */
  static optimizeImages(html: string): string {
    return html.replace(
      /<img([^>]+)src="([^"]+)"([^>]*)>/gim,
      '<img$1src="$2"$3 loading="lazy" decoding="async" />'
    );
  }

  /**
   * Convertit les métadonnées en objet BlogArticle complet
   */
  static createBlogArticle(
    frontmatter: MarkdownFrontmatter, 
    content: string, 
    html: string
  ): BlogArticle {
    const author = this.getAuthorById(frontmatter.author);
    const category = this.getCategoryById(frontmatter.category);
    const seo = this.generateSEOData(frontmatter, content);

    return {
      id: frontmatter.id,
      slug: frontmatter.id,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      content: html,
      author,
      category,
      tags: frontmatter.tags,
      publishedAt: frontmatter.publishedAt,
      updatedAt: new Date().toISOString(),
      readTime: this.calculateReadingTime(content),
      featured: frontmatter.featured,
      published: frontmatter.published,
      image: frontmatter.image,
      seo,
      views: 0,
      likes: 0,
      comments: 0
    };
  }

  /**
   * Convertit les métadonnées en objet BlogMetadata léger
   */
  static createBlogMetadata(frontmatter: MarkdownFrontmatter, content: string): BlogMetadata {
    return {
      id: frontmatter.id,
      slug: frontmatter.id,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      author: frontmatter.author,
      category: frontmatter.category,
      tags: frontmatter.tags,
      publishedAt: frontmatter.publishedAt,
      readTime: this.calculateReadingTime(content),
      featured: frontmatter.featured,
      published: frontmatter.published,
      image: frontmatter.image,
      views: 0,
      likes: 0
    };
  }

  /**
   * Génère les données SEO
   */
  private static generateSEOData(frontmatter: MarkdownFrontmatter, content: string): SEOData {
    const baseTitle = frontmatter.title;
    const baseDescription = frontmatter.excerpt;

    return {
      title: frontmatter.seo?.title || `${baseTitle} | Doctor Followers`,
      description: frontmatter.seo?.description || baseDescription,
      keywords: frontmatter.seo?.keywords || frontmatter.tags,
      canonical: `https://doctorfollowers.com/blogs/${frontmatter.id}`,
      openGraph: {
        title: frontmatter.seo?.openGraph?.title || baseTitle,
        description: frontmatter.seo?.openGraph?.description || baseDescription,
        image: frontmatter.seo?.openGraph?.image || frontmatter.image,
        type: 'article'
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.seo?.twitter?.title || baseTitle,
        description: frontmatter.seo?.twitter?.description || baseDescription,
        image: frontmatter.seo?.twitter?.image || frontmatter.image
      }
    };
  }

  /**
   * Récupère les informations d'un auteur
   */
  private static getAuthorById(authorId: string): Author {
    // Pour l'instant, retourner un auteur par défaut
    // Plus tard, ceci sera récupéré depuis authors.json
    return {
      id: authorId,
      name: authorId === 'moundir-rohmat' ? 'Moundir Rohmat' : 'Auteur',
      email: `${authorId}@doctorfollowers.com`,
      bio: 'Expert en marketing digital et réseaux sociaux',
      avatar: '/blog/assets/images/authors/default-avatar.jpg'
    };
  }

  /**
   * Récupère les informations d'une catégorie
   */
  private static getCategoryById(categoryId: string): Category {
    const category = Object.values(BLOG_CATEGORIES).find(cat => cat.id === categoryId);
    
    if (!category) {
      throw new Error(`Catégorie non trouvée: ${categoryId}`);
    }

    return category;
  }
}
