import { BlogMetadata } from '../../types/blog';

// Métadonnées des articles de blog
export const blogMetadata: BlogMetadata[] = [
  {
    id: 8,
    title: "Achat followers Instagram, ça vaut le coup ?",
    excerpt: "Découvrez les aspects techniques et éthiques de l'achat de followers Instagram. Analyse des influenceurs français, types de comptes achetés et implications pour votre stratégie.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
    date: "2025-01-26",
    authorId: "moundir-rohmat",
    category: "Instagram",
    slug: "achat-followers-instagram-ca-vaut-le-coup",
    tags: ["Instagram", "Followers", "Achat", "Influenceurs", "Éthique"],
    readTime: 5,
    featured: true,
    published: true
  },
  {
    id: 7,
    title: "6 conseils pratiques pour augmenter le nombre d'abonnés Instagram",
    excerpt: "Découvrez 6 conseils essentiels pour développer votre audience Instagram. Contenu de qualité, engagement, hashtags et stratégies éprouvées pour attirer de nouveaux abonnés.",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=400&fit=crop",
    date: "2025-01-25",
    authorId: "moundir-rohmat",
    category: "Instagram",
    slug: "6-conseils-pour-augmenter-les-abonnes-instagram",
    tags: ["Instagram", "Abonnés", "Conseils", "Growth", "Engagement"],
    readTime: 3,
    featured: true,
    published: true
  }
];

export const getBlogMetadata = (): BlogMetadata[] => {
  return blogMetadata;
};

export const getBlogMetadataById = (id: number): BlogMetadata | undefined => {
  return blogMetadata.find(post => post.id === id);
};

export const getBlogMetadataBySlug = (slug: string): BlogMetadata | undefined => {
  return blogMetadata.find(post => post.slug === slug);
};
