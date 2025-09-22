// Types pour les articles de blog
export interface BlogMetadata {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  authorId: string;
  category: string;
  slug: string;
  tags: string[];
  readTime: number;
  featured?: boolean;
  published: boolean;
}

export interface BlogContent {
  id: number;
  content: string; // Contenu Markdown
  lastModified: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface BlogPost extends BlogMetadata {
  content?: string; // Contenu chargé à la demande
  author?: Author; // Auteur chargé à la demande
}

// Types pour les filtres et recherches
export interface BlogFilters {
  category?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
}

export interface BlogSearchParams {
  query?: string;
  filters?: BlogFilters;
  sortBy?: 'date' | 'title' | 'readTime';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
