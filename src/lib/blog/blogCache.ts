// Système de cache intelligent pour le blog

import { BlogArticle, BlogMetadata, BlogCacheEntry } from './blogTypes';
import { BLOG_CONFIG } from './blogConstants';

export class BlogCache {
  private static readonly articleCache = new Map<string, BlogCacheEntry<BlogArticle>>();
  private static metadataCache: BlogCacheEntry<BlogMetadata[]> | null = null;
  private static readonly searchCache = new Map<string, BlogCacheEntry<BlogMetadata[]>>();

  /**
   * Récupère un article du cache
   */
  static getCachedArticle(slug: string): BlogArticle | null {
    const entry = this.articleCache.get(slug);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.articleCache.delete(slug);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Met en cache un article
   */
  static setCachedArticle(slug: string, article: BlogArticle): void {
    const entry: BlogCacheEntry<BlogArticle> = {
      data: article,
      timestamp: Date.now(),
      expiresAt: Date.now() + BLOG_CONFIG.CACHE_DURATION
    };
    
    this.articleCache.set(slug, entry);
    this.cleanupCache();
  }

  /**
   * Récupère les métadonnées du cache
   */
  static getCachedMetadata(): BlogMetadata[] | null {
    if (!this.metadataCache) return null;
    
    if (this.isExpired(this.metadataCache)) {
      this.metadataCache = null;
      return null;
    }
    
    return this.metadataCache.data;
  }

  /**
   * Met en cache les métadonnées
   */
  static setCachedMetadata(metadata: BlogMetadata[]): void {
    this.metadataCache = {
      data: metadata,
      timestamp: Date.now(),
      expiresAt: Date.now() + BLOG_CONFIG.CACHE_DURATION
    };
  }

  /**
   * Récupère un résultat de recherche du cache
   */
  static getCachedSearch(query: string): BlogMetadata[] | null {
    const entry = this.searchCache.get(query);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.searchCache.delete(query);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Met en cache un résultat de recherche
   */
  static setCachedSearch(query: string, results: BlogMetadata[]): void {
    const entry: BlogCacheEntry<BlogMetadata[]> = {
      data: results,
      timestamp: Date.now(),
      expiresAt: Date.now() + (BLOG_CONFIG.CACHE_DURATION / 2) // Cache plus court pour les recherches
    };
    
    this.searchCache.set(query, entry);
  }

  /**
   * Vérifie si une entrée de cache est expirée
   */
  private static isExpired(entry: BlogCacheEntry<any>): boolean {
    return Date.now() > entry.expiresAt;
  }

  /**
   * Nettoie le cache en supprimant les entrées expirées
   */
  private static cleanupCache(): void {
    // Nettoyer le cache des articles
    for (const [key, entry] of this.articleCache.entries()) {
      if (this.isExpired(entry)) {
        this.articleCache.delete(key);
      }
    }

    // Nettoyer le cache des recherches
    for (const [key, entry] of this.searchCache.entries()) {
      if (this.isExpired(entry)) {
        this.searchCache.delete(key);
      }
    }

    // Limiter la taille du cache des articles
    if (this.articleCache.size > BLOG_CONFIG.MAX_CACHE_SIZE) {
      const entries = Array.from(this.articleCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, entries.length - BLOG_CONFIG.MAX_CACHE_SIZE);
      toDelete.forEach(([key]) => this.articleCache.delete(key));
    }
  }

  /**
   * Vide complètement le cache
   */
  static clearCache(): void {
    this.articleCache.clear();
    this.metadataCache = null;
    this.searchCache.clear();
  }

  /**
   * Vide le cache d'un article spécifique
   */
  static clearArticleCache(slug: string): void {
    this.articleCache.delete(slug);
  }

  /**
   * Vide le cache des métadonnées
   */
  static clearMetadataCache(): void {
    this.metadataCache = null;
  }

  /**
   * Vide le cache des recherches
   */
  static clearSearchCache(): void {
    this.searchCache.clear();
  }

  /**
   * Obtient les statistiques du cache
   */
  static getCacheStats(): {
    articleCacheSize: number;
    searchCacheSize: number;
    hasMetadataCache: boolean;
    totalMemoryUsage: number;
  } {
    return {
      articleCacheSize: this.articleCache.size,
      searchCacheSize: this.searchCache.size,
      hasMetadataCache: this.metadataCache !== null,
      totalMemoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * Estime l'utilisation mémoire du cache
   */
  private static estimateMemoryUsage(): number {
    let totalSize = 0;
    
    // Estimer la taille des articles en cache
    for (const entry of this.articleCache.values()) {
      totalSize += JSON.stringify(entry.data).length;
    }
    
    // Estimer la taille des recherches en cache
    for (const entry of this.searchCache.values()) {
      totalSize += JSON.stringify(entry.data).length;
    }
    
    // Estimer la taille des métadonnées en cache
    if (this.metadataCache) {
      totalSize += JSON.stringify(this.metadataCache.data).length;
    }
    
    return totalSize;
  }

  /**
   * Préchage des articles populaires
   */
  static async preloadPopularArticles(articles: BlogMetadata[]): Promise<void> {
    const popularArticles = articles
      .filter(article => article.featured || (article.views && article.views >= 1000))
      .slice(0, 5); // Précharger seulement les 5 plus populaires

    for (const article of popularArticles) {
      if (!this.getCachedArticle(article.slug)) {
        try {
          // Ici, on chargerait l'article depuis le service
          // Pour l'instant, on simule juste le préchargement
          console.log(`Préchargement de l'article: ${article.slug}`);
        } catch (error) {
          console.error(`Erreur lors du préchargement de ${article.slug}:`, error);
        }
      }
    }
  }

  /**
   * Invalide le cache après une mise à jour
   */
  static invalidateCacheAfterUpdate(slug?: string): void {
    if (slug) {
      this.clearArticleCache(slug);
    } else {
      this.clearCache();
    }
  }
}
