// Service de blog utilisant Sanity comme source de données
// Ce service remplace progressivement blogService.ts

import { 
  BlogPost, 
  BlogMetadata, 
  BlogListResponse, 
  BlogListOptions, 
  BlogSearchResult,
  BlogError
} from './blogTypes'
import { SanityService } from '../../services/sanityService'

export class BlogServiceSanity {
  private static readonly DEFAULT_PAGE_SIZE = 12
  private static readonly MAX_PAGE_SIZE = 50

  /**
   * Force le rechargement des métadonnées (pour le développement)
   */
  static async forceReloadMetadata(): Promise<void> {
    // Sanity utilise un cache CDN, pas besoin de gestion manuelle
  }

  /**
   * Charge la liste des articles avec pagination et filtres optimisés pour le SEO
   */
  static async getArticlesList(options: BlogListOptions = {}): Promise<BlogListResponse> {
    try {
      const {
        page = 1,
        limit = Math.min(options.limit || this.DEFAULT_PAGE_SIZE, this.MAX_PAGE_SIZE),
        category,
        tag,
        author,
        featured,
        published = true,
        sortBy = 'date',
        sortOrder = 'desc',
        search,
        year,
        month
      } = options

      // Récupérer tous les articles depuis Sanity
      const allPosts = await SanityService.getBlogMetadata()

      // Filtrer les articles
      let filteredArticles = allPosts.filter(article => {
        if (published !== undefined && article.published !== published) return false
        if (category && article.category !== category) return false
        if (tag && !article.tags?.includes(tag)) return false
        if (author && article.author !== author) return false
        if (featured !== undefined && article.featured !== featured) return false
        if (year && new Date(article.date).getFullYear() !== year) return false
        if (month && new Date(article.date).getMonth() + 1 !== month) return false
        if (search && !this.matchesSearch(article, search)) return false
        return true
      })

      // Trier les articles
      filteredArticles = this.sortArticles(filteredArticles, sortBy, sortOrder)

      // Pagination
      const totalItems = filteredArticles.length
      const totalPages = Math.ceil(totalItems / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

      // Générer les filtres pour le SEO
      const filters = this.generateFilters(allPosts)

      return {
        posts: paginatedArticles,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNext: page < totalPages,
          hasPrevious: page > 1
        },
        total: totalItems,
        filters
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des articles:', error)
      throw {
        code: 'FETCH_ERROR',
        message: 'Erreur lors de la récupération des articles',
        details: error,
        timestamp: new Date().toISOString()
      } as BlogError
    }
  }

  /**
   * Récupère un article complet par son slug
   */
  static async getArticle(slug: string): Promise<BlogPost> {
    try {
      const post = await SanityService.getBlogPostBySlug(slug)
      if (!post) {
        throw {
          code: 'NOT_FOUND',
          message: `Article non trouvé: ${slug}`,
          timestamp: new Date().toISOString()
        } as BlogError
      }
      return post
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error)
      throw error as BlogError
    }
  }

  /**
   * Recherche d'articles
   */
  static async searchArticles(query: string, options: BlogListOptions = {}): Promise<BlogSearchResult> {
    try {
      const results = await this.getArticlesList({
        ...options,
        search: query
      })

      return {
        posts: results.posts,
        totalResults: results.total,
        query,
        filters: results.filters
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      throw {
        code: 'SEARCH_ERROR',
        message: 'Erreur lors de la recherche',
        details: error,
        timestamp: new Date().toISOString()
      } as BlogError
    }
  }

  // Méthodes utilitaires privées
  private static matchesSearch(article: BlogMetadata, search: string): boolean {
    const searchLower = search.toLowerCase()
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      article.category.toLowerCase().includes(searchLower)
    )
  }

  private static sortArticles(articles: BlogMetadata[], sortBy: string, sortOrder: 'asc' | 'desc'): BlogMetadata[] {
    const sorted = [...articles].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'views':
          comparison = (a.views || 0) - (b.views || 0)
          break
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }

  private static generateFilters(articles: BlogMetadata[]) {
    const categoryCounts = new Map<string, number>()
    const tagCounts = new Map<string, number>()
    const authorCounts = new Map<string, number>()

    articles.forEach(article => {
      categoryCounts.set(article.category, (categoryCounts.get(article.category) || 0) + 1)
      article.tags?.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
      authorCounts.set(article.author, (authorCounts.get(article.author) || 0) + 1)
    })

    return {
      categories: Array.from(categoryCounts.entries()).map(([name, count]) => ({ name, count })),
      tags: Array.from(tagCounts.entries()).map(([name, count]) => ({ name, count })),
      authors: Array.from(authorCounts.entries()).map(([name, count]) => ({ name, count }))
    }
  }
}

