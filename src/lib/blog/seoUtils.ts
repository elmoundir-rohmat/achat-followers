// Système de génération SEO optimisé pour Google

import { 
  BlogPost, 
  SEOData, 
  OpenGraphData, 
  TwitterCardData, 
  SchemaArticle, 
  SchemaBreadcrumb,
  SEOAnalysis 
} from './blogTypes';

export class SEOUtils {
  private static readonly BASE_URL = 'https://doctorfollowers.com';
  private static readonly SITE_NAME = 'Doctor Followers';
  private static readonly DEFAULT_LOCALE = 'fr_FR';

  /**
   * Génère les métadonnées SEO complètes pour un article
   */
  static generateSEOData(post: BlogPost): SEOData {
    return {
      metaTitle: this.optimizeTitle(post.title, post.seo.focusKeyword),
      metaDescription: this.optimizeDescription(post.excerpt, post.seo.focusKeyword),
      focusKeyword: post.seo.focusKeyword,
      keywords: this.generateKeywords(post),
      canonicalUrl: `${this.BASE_URL}/blogs/${post.slug}`,
      imageAlt: post.seo.imageAlt || this.generateImageAlt(post.title),
      noIndex: post.seo.noIndex || false,
      noFollow: post.seo.noFollow || false,
      robots: this.generateRobotsDirective(post)
    };
  }

  /**
   * Génère les données Open Graph
   */
  static generateOpenGraphData(post: BlogPost): OpenGraphData {
    return {
      title: post.openGraph?.title || post.seo.metaTitle,
      description: post.openGraph?.description || post.seo.metaDescription,
      image: post.openGraph?.image || post.image,
      imageWidth: 1200,
      imageHeight: 630,
      type: 'article',
      url: `${this.BASE_URL}/blogs/${post.slug}`,
      siteName: this.SITE_NAME,
      locale: this.DEFAULT_LOCALE
    };
  }

  /**
   * Génère les données Twitter Card
   */
  static generateTwitterCardData(post: BlogPost): TwitterCardData {
    return {
      card: 'summary_large_image',
      title: post.twitter?.title || post.seo.metaTitle,
      description: post.twitter?.description || post.seo.metaDescription,
      image: post.twitter?.image || post.image,
      imageAlt: post.seo.imageAlt,
      creator: post.twitter?.creator || '@doctorfollowers',
      site: '@doctorfollowers'
    };
  }

  /**
   * Génère le Schema.org Article
   */
  static generateSchemaArticle(post: BlogPost): SchemaArticle {
    return {
      headline: post.schema?.headline || post.title,
      description: post.schema?.description || post.excerpt,
      image: post.image,
      datePublished: post.date,
      dateModified: post.updatedAt || post.date,
      author: {
        name: post.author,
        url: `${this.BASE_URL}/authors/${post.author.toLowerCase().replace(/\s+/g, '-')}`,
        sameAs: this.getAuthorSocialLinks(post.author)
      },
      publisher: {
        name: this.SITE_NAME,
        logo: `${this.BASE_URL}/logo.png`,
        url: this.BASE_URL
      },
      mainEntityOfPage: `${this.BASE_URL}/blogs/${post.slug}`,
      articleSection: post.category,
      wordCount: post.wordCount || this.calculateWordCount(post.content || ''),
      timeRequired: `PT${post.readTime || 5}M`,
      keywords: post.tags || [],
      inLanguage: 'fr'
    };
  }

  /**
   * Génère le Schema.org Breadcrumb
   */
  static generateBreadcrumbSchema(post: BlogPost): SchemaBreadcrumb {
    return {
      itemListElement: [
        {
          position: 1,
          name: 'Accueil',
          item: this.BASE_URL
        },
        {
          position: 2,
          name: 'Blog',
          item: `${this.BASE_URL}/blogs`
        },
        {
          position: 3,
          name: post.category,
          item: `${this.BASE_URL}/blogs/category/${post.category.toLowerCase()}`
        },
        {
          position: 4,
          name: post.title,
          item: `${this.BASE_URL}/blogs/${post.slug}`
        }
      ]
    };
  }

  /**
   * Optimise le titre pour le SEO (50-60 caractères)
   */
  private static optimizeTitle(title: string, focusKeyword: string): string {
    let optimizedTitle = title;
    
    // S'assurer que le mot-clé principal est dans le titre
    if (!optimizedTitle.toLowerCase().includes(focusKeyword.toLowerCase())) {
      optimizedTitle = `${focusKeyword} - ${optimizedTitle}`;
    }
    
    // Limiter à 60 caractères
    if (optimizedTitle.length > 60) {
      optimizedTitle = optimizedTitle.substring(0, 57) + '...';
    }
    
    // S'assurer qu'il fait au moins 30 caractères
    if (optimizedTitle.length < 30) {
      optimizedTitle += ' | Doctor Followers';
    }
    
    return optimizedTitle;
  }

  /**
   * Optimise la description pour le SEO (150-160 caractères)
   */
  private static optimizeDescription(excerpt: string, focusKeyword: string): string {
    let description = excerpt;
    
    // S'assurer que le mot-clé principal est dans la description
    if (!description.toLowerCase().includes(focusKeyword.toLowerCase())) {
      description = `${focusKeyword}: ${description}`;
    }
    
    // Limiter à 160 caractères
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }
    
    // S'assurer qu'il fait au moins 120 caractères
    if (description.length < 120) {
      description += ' Découvrez nos conseils d\'experts sur Doctor Followers.';
    }
    
    return description;
  }

  /**
   * Génère les mots-clés secondaires
   */
  private static generateKeywords(post: BlogPost): string[] {
    const keywords = new Set<string>();
    
    // Ajouter le mot-clé principal
    keywords.add(post.seo.focusKeyword);
    
    // Ajouter les tags
    if (post.tags) {
      post.tags.forEach(tag => keywords.add(tag));
    }
    
    // Ajouter des mots-clés basés sur la catégorie
    const categoryKeywords = this.getCategoryKeywords(post.category);
    categoryKeywords.forEach(keyword => keywords.add(keyword));
    
    // Ajouter des mots-clés générés à partir du contenu
    if (post.content) {
      const contentKeywords = this.extractKeywordsFromContent(post.content);
      contentKeywords.forEach(keyword => keywords.add(keyword));
    }
    
    return Array.from(keywords).slice(0, 10); // Limiter à 10 mots-clés
  }

  /**
   * Génère l'alt text pour l'image
   */
  private static generateImageAlt(title: string): string {
    return `Image illustrant l'article: ${title}`;
  }

  /**
   * Génère la directive robots
   */
  private static generateRobotsDirective(post: BlogPost): string {
    const directives = [];
    
    if (post.seo.noIndex) {
      directives.push('noindex');
    } else {
      directives.push('index');
    }
    
    if (post.seo.noFollow) {
      directives.push('nofollow');
    } else {
      directives.push('follow');
    }
    
    return directives.join(', ');
  }

  /**
   * Obtient les mots-clés par catégorie
   */
  private static getCategoryKeywords(category: string): string[] {
    const categoryKeywords: { [key: string]: string[] } = {
      'Instagram': ['instagram', 'réseaux sociaux', 'social media', 'followers', 'likes', 'engagement'],
      'TikTok': ['tiktok', 'vidéo', 'court métrage', 'viral', 'trending'],
      'YouTube': ['youtube', 'vidéo', 'abonnés', 'vues', 'monétisation'],
      'Facebook': ['facebook', 'page', 'groupe', 'publicité', 'reach'],
      'Conseils': ['conseils', 'stratégie', 'marketing', 'croissance', 'tips']
    };
    
    return categoryKeywords[category] || [];
  }

  /**
   * Extrait les mots-clés du contenu
   */
  private static extractKeywordsFromContent(content: string): string[] {
    // Supprimer le HTML et le markdown
    const plainText = content
      .replace(/<[^>]*>/g, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .toLowerCase();
    
    // Extraire les mots de plus de 3 caractères
    const words = plainText
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !this.isStopWord(word));
    
    // Compter les occurrences
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Retourner les mots les plus fréquents
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Vérifie si un mot est un mot d'arrêt
   */
  private static isStopWord(word: string): boolean {
    const stopWords = [
      'avec', 'pour', 'dans', 'sur', 'par', 'une', 'des', 'les', 'que', 'qui',
      'mais', 'donc', 'alors', 'ainsi', 'toute', 'tous', 'tout', 'cette',
      'celui', 'celle', 'ceux', 'celles', 'plus', 'moins', 'très', 'bien',
      'aussi', 'encore', 'déjà', 'jamais', 'toujours', 'souvent', 'parfois'
    ];
    return stopWords.includes(word);
  }

  /**
   * Calcule le nombre de mots
   */
  private static calculateWordCount(content: string): number {
    return content.split(/\s+/).length;
  }

  /**
   * Obtient les liens sociaux d'un auteur
   */
  private static getAuthorSocialLinks(author: string): string[] {
    // Mapping des auteurs vers leurs profils sociaux
    const authorProfiles: { [key: string]: string[] } = {
      'Moundir Rohmat': [
        'https://twitter.com/moundir_rohmat',
        'https://linkedin.com/in/moundir-rohmat'
      ]
    };
    
    return authorProfiles[author] || [];
  }

  /**
   * Analyse le SEO d'un article
   */
  static analyzeSEO(post: BlogPost): SEOAnalysis {
    const issues: SEOAnalysis['issues'] = [];
    const recommendations: string[] = [];
    
    // Analyser le titre
    if (post.seo.metaTitle.length < 30) {
      issues.push({
        type: 'warning',
        message: 'Titre trop court',
        suggestion: 'Ajoutez des mots-clés pour atteindre 30-60 caractères'
      });
    } else if (post.seo.metaTitle.length > 60) {
      issues.push({
        type: 'error',
        message: 'Titre trop long',
        suggestion: 'Réduisez le titre à moins de 60 caractères'
      });
    }
    
    // Analyser la description
    if (post.seo.metaDescription.length < 120) {
      issues.push({
        type: 'warning',
        message: 'Description trop courte',
        suggestion: 'Ajoutez plus de détails pour atteindre 120-160 caractères'
      });
    } else if (post.seo.metaDescription.length > 160) {
      issues.push({
        type: 'error',
        message: 'Description trop longue',
        suggestion: 'Réduisez la description à moins de 160 caractères'
      });
    }
    
    // Analyser la densité de mots-clés
    const keywordDensity = this.calculateKeywordDensity(post.content || '', post.seo.focusKeyword);
    if (keywordDensity < 0.5) {
      issues.push({
        type: 'warning',
        message: 'Densité de mot-clé faible',
        suggestion: 'Utilisez le mot-clé principal plus souvent dans le contenu'
      });
    } else if (keywordDensity > 3) {
      issues.push({
        type: 'error',
        message: 'Densité de mot-clé excessive',
        suggestion: 'Réduisez l\'utilisation du mot-clé principal'
      });
    }
    
    // Calculer le score SEO
    const score = this.calculateSEOScore(post, issues);
    
    return {
      score,
      issues,
      recommendations,
      metrics: {
        titleLength: post.seo.metaTitle.length,
        descriptionLength: post.seo.metaDescription.length,
        keywordDensity,
        readabilityScore: this.calculateReadabilityScore(post.content || ''),
        imageOptimization: !!post.seo.imageAlt,
        internalLinks: this.countInternalLinks(post.content || ''),
        externalLinks: this.countExternalLinks(post.content || '')
      }
    };
  }

  /**
   * Calcule la densité de mots-clés
   */
  private static calculateKeywordDensity(content: string, keyword: string): number {
    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
    return (keywordCount / words.length) * 100;
  }

  /**
   * Calcule le score SEO
   */
  private static calculateSEOScore(post: BlogPost, issues: SEOAnalysis['issues']): number {
    let score = 100;
    
    // Pénaliser les erreurs
    issues.forEach(issue => {
      if (issue.type === 'error') score -= 20;
      else if (issue.type === 'warning') score -= 10;
    });
    
    // Bonus pour les bonnes pratiques
    if (post.seo.imageAlt) score += 5;
    if (post.tags && post.tags.length >= 3) score += 5;
    if (post.wordCount && post.wordCount > 300) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calcule le score de lisibilité
   */
  private static calculateReadabilityScore(content: string): number {
    // Algorithme simplifié de lisibilité
    const sentences = content.split(/[.!?]+/).length;
    const words = content.split(/\s+/).length;
    const syllables = this.countSyllables(content);
    
    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    
    // Score de lisibilité simplifié (0-100)
    return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 1.5) - (avgSyllablesPerWord * 10)));
  }

  /**
   * Compte les syllabes dans un texte
   */
  private static countSyllables(text: string): number {
    // Approximation simple du nombre de syllabes
    return text.toLowerCase().replace(/[^aeiouy]/g, '').length;
  }

  /**
   * Compte les liens internes
   */
  private static countInternalLinks(content: string): number {
    const internalLinkRegex = /href="(?:https?:\/\/)?(?:www\.)?doctorfollowers\.com/g;
    return (content.match(internalLinkRegex) || []).length;
  }

  /**
   * Compte les liens externes
   */
  private static countExternalLinks(content: string): number {
    const externalLinkRegex = /href="https?:\/\/(?!doctorfollowers\.com)/g;
    return (content.match(externalLinkRegex) || []).length;
  }
}
