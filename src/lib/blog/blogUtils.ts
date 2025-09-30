// Utilitaires pour le système de blog

import { BlogMetadata, BlogArticle, BlogError } from './blogTypes';
import { BLOG_CONFIG, ERROR_MESSAGES, BLOG_ERROR_CODES } from './blogConstants';

export class BlogUtils {
  /**
   * Génère l'URL d'un article
   */
  static generateArticleUrl(slug: string): string {
    return `${BLOG_CONFIG.BLOG_BASE_URL}/${slug}`;
  }

  /**
   * Génère l'URL complète d'un article
   */
  static generateFullArticleUrl(slug: string): string {
    return `${BLOG_CONFIG.BASE_URL}${this.generateArticleUrl(slug)}`;
  }

  /**
   * Calcule le temps de lecture estimé
   */
  static calculateReadTime(content: string): number {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / BLOG_CONFIG.WORDS_PER_MINUTE);
  }

  /**
   * Formate une date pour l'affichage
   */
  static formatDate(date: string): string {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  }

  /**
   * Formate une date relative (il y a X jours)
   */
  static formatRelativeDate(date: string): string {
    try {
      const dateObj = new Date(date);
      const now = new Date();
      const diffInMs = now.getTime() - dateObj.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) return 'Aujourd\'hui';
      if (diffInDays === 1) return 'Hier';
      if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
      if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
      if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
      return `Il y a ${Math.floor(diffInDays / 365)} ans`;
    } catch (error) {
      return 'Date invalide';
    }
  }

  /**
   * Valide les métadonnées d'un article
   */
  static validateMetadata(metadata: BlogMetadata): boolean {
    try {
      // Vérifier les champs requis
      const requiredFields = ['id', 'title', 'excerpt', 'author', 'category', 'publishedAt'];
      for (const field of requiredFields) {
        if (!metadata[field as keyof BlogMetadata]) {
          throw new Error(`Champ requis manquant: ${field}`);
        }
      }

      // Vérifier le format de la date
      if (isNaN(Date.parse(metadata.publishedAt))) {
        throw new Error('Format de date invalide');
      }

      // Vérifier que les tags sont un array
      if (!Array.isArray(metadata.tags)) {
        throw new Error('Les tags doivent être un tableau');
      }

      return true;
    } catch (error) {
      console.error('Erreur de validation:', error);
      return false;
    }
  }

  /**
   * Valide un slug d'article
   */
  static validateSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
  }

  /**
   * Génère un slug à partir d'un titre
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Supprimer les tirets multiples
      .trim();
  }

  /**
   * Tronque un texte à une longueur donnée
   */
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Extrait les mots-clés d'un texte
   */
  static extractKeywords(text: string, maxKeywords: number = 10): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  /**
   * Crée une erreur blog standardisée
   */
  static createError(code: string, message?: string, details?: any): BlogError {
    return {
      code,
      message: message || ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] || 'Erreur inconnue',
      details
    };
  }

  /**
   * Vérifie si un article est récent (moins de 7 jours)
   */
  static isRecentArticle(publishedAt: string): boolean {
    const published = new Date(publishedAt);
    const now = new Date();
    const diffInMs = now.getTime() - published.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays <= 7;
  }

  /**
   * Vérifie si un article est populaire (basé sur les vues)
   */
  static isPopularArticle(views: number = 0): boolean {
    return views >= 1000; // Seuil de popularité
  }

  /**
   * Génère un résumé automatique d'un article
   */
  static generateExcerpt(content: string, maxLength: number = 160): string {
    // Supprimer le markdown
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Images
      .replace(/\n+/g, ' ') // Line breaks
      .trim();

    return this.truncateText(plainText, maxLength);
  }

  /**
   * Formate les statistiques d'un article
   */
  static formatStats(views: number, likes: number): { views: string; likes: string } {
    const formatNumber = (num: number): string => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
      return num.toString();
    };

    return {
      views: formatNumber(views),
      likes: formatNumber(likes)
    };
  }

  /**
   * Génère des suggestions de recherche
   */
  static generateSearchSuggestions(query: string, articles: BlogMetadata[]): string[] {
    const suggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Suggestions basées sur les titres
    articles.forEach(article => {
      if (article.title.toLowerCase().includes(queryLower)) {
        suggestions.push(article.title);
      }
    });

    // Suggestions basées sur les tags
    articles.forEach(article => {
      article.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower) && !suggestions.includes(tag)) {
          suggestions.push(tag);
        }
      });
    });

    return suggestions.slice(0, 5); // Limiter à 5 suggestions
  }
}
