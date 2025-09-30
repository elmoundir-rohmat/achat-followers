// Constantes et configuration pour le système de blog

export const BLOG_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  
  // Cache
  CACHE_DURATION: 60 * 60 * 1000, // 1 heure en millisecondes
  MAX_CACHE_SIZE: 100, // Nombre maximum d'articles en cache
  
  // Lecture
  WORDS_PER_MINUTE: 200, // Vitesse de lecture moyenne
  
  // Fichiers
  ARTICLES_PATH: '/content/blog/articles',
  METADATA_PATH: '/data/blog/metadata.json',
  ASSETS_PATH: '/content/blog/assets',
  
  // URLs
  BASE_URL: 'https://doctorfollowers.com',
  BLOG_BASE_URL: '/blogs',
  
  // SEO
  DEFAULT_SEO: {
    title: 'Blog | Doctor Followers',
    description: 'Découvrez nos conseils d\'experts pour développer votre présence sur les réseaux sociaux.',
    keywords: ['blog', 'conseils', 'instagram', 'tiktok', 'youtube', 'réseaux sociaux']
  }
} as const;

export const BLOG_CATEGORIES = {
  INSTAGRAM: {
    id: 'instagram',
    name: 'Instagram',
    slug: 'instagram',
    description: 'Conseils et stratégies pour Instagram',
    color: '#E4405F',
    icon: 'instagram'
  },
  TIKTOK: {
    id: 'tiktok',
    name: 'TikTok',
    slug: 'tiktok',
    description: 'Conseils et stratégies pour TikTok',
    color: '#000000',
    icon: 'tiktok'
  },
  YOUTUBE: {
    id: 'youtube',
    name: 'YouTube',
    slug: 'youtube',
    description: 'Conseils et stratégies pour YouTube',
    color: '#FF0000',
    icon: 'youtube'
  },
  FACEBOOK: {
    id: 'facebook',
    name: 'Facebook',
    slug: 'facebook',
    description: 'Conseils et stratégies pour Facebook',
    color: '#1877F2',
    icon: 'facebook'
  },
  CONSEILS: {
    id: 'conseils',
    name: 'Conseils',
    slug: 'conseils',
    description: 'Conseils généraux pour les réseaux sociaux',
    color: '#6366F1',
    icon: 'lightbulb'
  }
} as const;

export const BLOG_SORT_OPTIONS = {
  PUBLISHED_AT_DESC: { field: 'publishedAt', order: 'desc' },
  PUBLISHED_AT_ASC: { field: 'publishedAt', order: 'asc' },
  TITLE_ASC: { field: 'title', order: 'asc' },
  TITLE_DESC: { field: 'title', order: 'desc' },
  READ_TIME_ASC: { field: 'readTime', order: 'asc' },
  READ_TIME_DESC: { field: 'readTime', order: 'desc' },
  VIEWS_DESC: { field: 'views', order: 'desc' }
} as const;

export const BLOG_ERROR_CODES = {
  ARTICLE_NOT_FOUND: 'ARTICLE_NOT_FOUND',
  INVALID_SLUG: 'INVALID_SLUG',
  CACHE_ERROR: 'CACHE_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const;

export const BLOG_EVENTS = {
  ARTICLE_VIEWED: 'article_viewed',
  ARTICLE_LIKED: 'article_liked',
  SEARCH_PERFORMED: 'search_performed',
  CATEGORY_FILTERED: 'category_filtered',
  TAG_FILTERED: 'tag_filtered'
} as const;

// Regex pour validation
export const VALIDATION_PATTERNS = {
  SLUG: /^[a-z0-9-]+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  DATE: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
} as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
  [BLOG_ERROR_CODES.ARTICLE_NOT_FOUND]: 'Article non trouvé',
  [BLOG_ERROR_CODES.INVALID_SLUG]: 'Slug invalide',
  [BLOG_ERROR_CODES.CACHE_ERROR]: 'Erreur de cache',
  [BLOG_ERROR_CODES.PARSE_ERROR]: 'Erreur de parsing',
  [BLOG_ERROR_CODES.NETWORK_ERROR]: 'Erreur réseau',
  [BLOG_ERROR_CODES.VALIDATION_ERROR]: 'Erreur de validation'
} as const;
