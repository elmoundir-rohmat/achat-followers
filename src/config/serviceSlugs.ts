// Configuration des slugs pour les pages de services
export interface ServicePage {
  id: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: 'instagram' | 'tiktok' | 'youtube' | 'facebook';
  serviceType: 'followers' | 'likes' | 'views' | 'comments';
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export const servicePages: ServicePage[] = [
  // Instagram Services
  {
    id: 'instagram-followers',
    slug: 'instagram-followers',
    title: 'Followers Instagram - Acheter des Followers Réels',
    description: 'Achetez des followers Instagram réels et actifs. Livraison rapide et sécurisée. Boostez votre compte Instagram avec nos services professionnels.',
    keywords: ['followers instagram', 'acheter followers', 'followers réels', 'boost instagram', 'croissance instagram'],
    category: 'instagram',
    serviceType: 'followers',
    metaTitle: 'Followers Instagram Réels | Acheter des Followers Actifs',
    metaDescription: 'Obtenez des followers Instagram réels et actifs pour booster votre compte. Livraison rapide, followers de qualité, garantie 30 jours.',
    canonicalUrl: '/instagram-followers'
  },
  {
    id: 'instagram-likes',
    slug: 'instagram-likes',
    title: 'Likes Instagram - Acheter des Likes Réels',
    description: 'Augmentez l\'engagement de vos posts Instagram avec des likes authentiques. Service rapide et fiable pour booster vos publications.',
    keywords: ['likes instagram', 'acheter likes', 'likes réels', 'engagement instagram', 'boost likes'],
    category: 'instagram',
    serviceType: 'likes',
    metaTitle: 'Likes Instagram Réels | Acheter des Likes Authentiques',
    metaDescription: 'Boostez vos posts Instagram avec des likes réels et authentiques. Augmentez votre engagement rapidement et en toute sécurité.',
    canonicalUrl: '/instagram-likes'
  },
  {
    id: 'instagram-views',
    slug: 'instagram-views',
    title: 'Vues Instagram - Acheter des Vues pour Reels et Stories',
    description: 'Augmentez les vues de vos Reels et Stories Instagram. Service professionnel pour booster la visibilité de votre contenu vidéo.',
    keywords: ['vues instagram', 'vues reels', 'vues stories', 'boost vues', 'visibilité instagram'],
    category: 'instagram',
    serviceType: 'views',
    metaTitle: 'Vues Instagram | Acheter des Vues pour Reels et Stories',
    metaDescription: 'Augmentez les vues de vos Reels et Stories Instagram. Service rapide et fiable pour booster la visibilité de votre contenu.',
    canonicalUrl: '/instagram-views'
  },
  {
    id: 'instagram-comments',
    slug: 'instagram-comments',
    title: 'Commentaires Instagram - Acheter des Commentaires Qualitatifs',
    description: 'Boostez vos posts avec des commentaires pertinents et authentiques. Améliorez l\'engagement de votre contenu Instagram.',
    keywords: ['commentaires instagram', 'commentaires réels', 'engagement instagram', 'boost commentaires'],
    category: 'instagram',
    serviceType: 'comments',
    metaTitle: 'Commentaires Instagram | Acheter des Commentaires Qualitatifs',
    metaDescription: 'Obtenez des commentaires pertinents et authentiques pour vos posts Instagram. Améliorez l\'engagement de votre contenu.',
    canonicalUrl: '/instagram-comments'
  },
  
  // TikTok Services
  {
    id: 'tiktok-followers',
    slug: 'tiktok-followers',
    title: 'Followers TikTok - Acheter des Followers Réels',
    description: 'Développez votre audience TikTok avec des followers réels et engagés. Service professionnel pour booster votre compte TikTok.',
    keywords: ['followers tiktok', 'acheter followers tiktok', 'followers réels tiktok', 'boost tiktok'],
    category: 'tiktok',
    serviceType: 'followers',
    metaTitle: 'Followers TikTok Réels | Acheter des Followers Actifs',
    metaDescription: 'Obtenez des followers TikTok réels et engagés pour développer votre audience. Service rapide et sécurisé.',
    canonicalUrl: '/tiktok-followers'
  },
  {
    id: 'tiktok-likes',
    slug: 'tiktok-likes',
    title: 'Likes TikTok - Acheter des Likes pour vos Vidéos',
    description: 'Boostez vos vidéos TikTok avec des likes authentiques. Augmentez la visibilité et l\'engagement de votre contenu.',
    keywords: ['likes tiktok', 'acheter likes tiktok', 'likes réels tiktok', 'boost likes tiktok'],
    category: 'tiktok',
    serviceType: 'likes',
    metaTitle: 'Likes TikTok | Acheter des Likes Authentiques',
    metaDescription: 'Boostez vos vidéos TikTok avec des likes réels et authentiques. Augmentez l\'engagement de votre contenu rapidement.',
    canonicalUrl: '/tiktok-likes'
  },
  {
    id: 'tiktok-views',
    slug: 'tiktok-views',
    title: 'Vues TikTok - Acheter des Vues pour vos Vidéos',
    description: 'Augmentez les vues de vos vidéos TikTok. Service professionnel pour booster la portée de votre contenu.',
    keywords: ['vues tiktok', 'acheter vues tiktok', 'boost vues tiktok', 'visibilité tiktok'],
    category: 'tiktok',
    serviceType: 'views',
    metaTitle: 'Vues TikTok | Acheter des Vues pour vos Vidéos',
    metaDescription: 'Augmentez les vues de vos vidéos TikTok avec notre service professionnel. Boostez la portée de votre contenu.',
    canonicalUrl: '/tiktok-views'
  },
  {
    id: 'tiktok-comments',
    slug: 'tiktok-comments',
    title: 'Commentaires TikTok - Acheter des Commentaires Engagés',
    description: 'Boostez l\'engagement de vos vidéos TikTok avec des commentaires pertinents et authentiques.',
    keywords: ['commentaires tiktok', 'commentaires réels tiktok', 'engagement tiktok', 'boost commentaires tiktok'],
    category: 'tiktok',
    serviceType: 'comments',
    metaTitle: 'Commentaires TikTok | Acheter des Commentaires Engagés',
    metaDescription: 'Obtenez des commentaires pertinents et authentiques pour vos vidéos TikTok. Améliorez l\'engagement de votre contenu.',
    canonicalUrl: '/tiktok-comments'
  }
];

// Fonction pour obtenir une page de service par son slug
export const getServicePageBySlug = (slug: string): ServicePage | undefined => {
  return servicePages.find(page => page.slug === slug);
};

// Fonction pour obtenir une page de service par son ID
export const getServicePageById = (id: string): ServicePage | undefined => {
  return servicePages.find(page => page.id === id);
};

// Fonction pour obtenir toutes les pages d'une catégorie
export const getServicePagesByCategory = (category: string): ServicePage[] => {
  return servicePages.filter(page => page.category === category);
};

// Fonction pour obtenir toutes les pages d'un type de service
export const getServicePagesByType = (serviceType: string): ServicePage[] => {
  return servicePages.filter(page => page.serviceType === serviceType);
};

// Fonction pour obtenir tous les slugs disponibles
export const getAllSlugs = (): string[] => {
  return servicePages.map(page => page.slug);
};

// Fonction pour générer les métadonnées SEO d'une page
export const generateServicePageMeta = (page: ServicePage) => {
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords.join(', '),
    canonical: page.canonicalUrl,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: 'website',
      url: page.canonicalUrl,
      siteName: 'Doctor Followers'
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription
    }
  };
};
