// Interfaces TypeScript enrichies pour le SEO optimal

export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  url?: string; // URL du profil de l'auteur
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  seoTitle?: string; // Titre SEO spécifique pour la catégorie
  seoDescription?: string; // Description SEO pour la catégorie
}

export interface SEOData {
  metaTitle: string;        // <title> optimisé (50-60 chars)
  metaDescription: string;  // <meta description> (150-160 chars)
  focusKeyword: string;     // Mot-clé principal
  keywords: string[];       // Mots-clés secondaires
  canonicalUrl?: string;    // URL canonique
  imageAlt: string;         // Alt text pour l'image
  noIndex?: boolean;        // Si l'article ne doit pas être indexé
  noFollow?: boolean;       // Si les liens ne doivent pas être suivis
  robots?: string;          // Directives robots personnalisées
}

export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  type: 'article' | 'website';
  url?: string;
  siteName?: string;
  locale?: string;
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  creator?: string;
  site?: string;
}

export interface SchemaArticle {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
    sameAs?: string[];
  };
  publisher: {
    name: string;
    logo: string;
    url?: string;
  };
  mainEntityOfPage?: string;
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
  keywords?: string[];
  inLanguage?: string;
}

export interface SchemaBreadcrumb {
  itemListElement: Array<{
    position: number;
    name: string;
    item: string;
  }>;
}

export interface BlogPost {
  // Données de base
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  slug: string;
  content?: string;
  tags?: string[];
  readTime?: number;
  
  // SEO Critical
  seo: SEOData;
  
  // Open Graph / Social
  openGraph?: OpenGraphData;
  
  // Twitter Card
  twitter?: TwitterCardData;
  
  // Schema.org Article
  schema?: SchemaArticle;
  
  // Schema.org Breadcrumb
  breadcrumb?: SchemaBreadcrumb;
  
  // Métadonnées additionnelles
  featured?: boolean;
  published?: boolean;
  updatedAt?: string;
  views?: number;
  likes?: number;
  comments?: number;
  
  // SEO technique
  wordCount?: number;
  readingTime?: number;
  lastModified?: string;
  
  // Relations
  relatedPosts?: string[]; // IDs des articles liés
  nextPost?: string;       // Slug du prochain article
  previousPost?: string;   // Slug de l'article précédent
}

export interface BlogMetadata {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  slug: string;
  tags?: string[];
  readTime?: number;
  featured?: boolean;
  published?: boolean;
  views?: number;
  likes?: number;
  
  // SEO léger pour la liste
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
}

export interface BlogListOptions {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  published?: boolean;
  sortBy?: 'date' | 'title' | 'readTime' | 'views' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  year?: number;
  month?: number;
}

export interface BlogSearchResult {
  posts: BlogMetadata[];
  totalResults: number;
  query: string;
  suggestions?: string[];
  filters?: {
    categories: Array<{ name: string; count: number }>;
    tags: Array<{ name: string; count: number }>;
    authors: Array<{ name: string; count: number }>;
  };
}

export interface BlogListResponse {
  posts: BlogMetadata[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  total: number;
  filters?: {
    categories: Array<{ name: string; count: number }>;
    tags: Array<{ name: string; count: number }>;
    authors: Array<{ name: string; count: number }>;
  };
}

export interface SEOAnalysis {
  score: number; // 0-100
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
  }>;
  recommendations: string[];
  metrics: {
    titleLength: number;
    descriptionLength: number;
    keywordDensity: number;
    readabilityScore: number;
    imageOptimization: boolean;
    internalLinks: number;
    externalLinks: number;
  };
}

export interface BlogCacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  etag?: string;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  categoriesCount: number;
  authorsCount: number;
  averageReadTime: number;
  averageWordCount: number;
  seoScore: number;
}

// Types pour les erreurs
export interface BlogError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Types pour les événements de tracking
export interface BlogEvent {
  type: 'view' | 'like' | 'share' | 'search' | 'category_filter' | 'tag_filter';
  postId?: number;
  postSlug?: string;
  data?: any;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
}

// Types pour les métadonnées de fichier
export interface MarkdownFrontmatter {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  slug: string;
  tags?: string[];
  readTime?: number;
  featured?: boolean;
  published?: boolean;
  
  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    keywords?: string[];
    canonicalUrl?: string;
    imageAlt: string;
    noIndex?: boolean;
    noFollow?: boolean;
  };
  
  // Open Graph
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'article' | 'website';
  };
  
  // Twitter
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    image?: string;
    creator?: string;
  };
  
  // Schema
  schema?: {
    headline?: string;
    description?: string;
    datePublished?: string;
    dateModified?: string;
    author?: {
      name: string;
      url?: string;
    };
    publisher?: {
      name: string;
      logo: string;
    };
  };
}

export interface ParsedMarkdownFile {
  frontmatter: MarkdownFrontmatter;
  content: string;
  html: string;
  readingTime: number;
  wordCount: number;
  headings: Array<{
    level: number;
    text: string;
    id: string;
  }>;
  images: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  links: Array<{
    href: string;
    text: string;
    external: boolean;
  }>;
}