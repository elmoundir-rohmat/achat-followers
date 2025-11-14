// Configuration des types disponibles pour chaque service
export interface ServiceTypeConfig {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string; // Nom de l'icône Lucide
}

export interface ServiceConfig {
  serviceName: string;
  availableTypes: ServiceTypeConfig[];
}

// Configuration des types pour chaque service
export const SERVICE_CONFIGS: Record<string, ServiceConfig> = {
  // Instagram Followers - seulement Monde et France
  'instagram_followers': {
    serviceName: 'Instagram Followers',
    availableTypes: [
      {
        id: 'international',
        title: 'Followers Monde',
        description: 'Followers provenant du monde entier',
        features: [
          'Diversité géographique',
          'Croissance rapide',
          'Portée internationale',
          'Prix avantageux'
        ],
        icon: 'Globe'
      },
      {
        id: 'french',
        title: 'Followers France',
        description: 'Followers ciblés spécifiquement depuis la France',
        features: [
          'Profils 100% français',
          'Meilleur engagement local',
          'Contenu en français',
          'Support français'
        ],
        icon: 'MapPin'
      }
    ]
  },

  // Instagram Likes - Monde, Europe et France
  'instagram_likes': {
    serviceName: 'Instagram Likes',
    availableTypes: [
      {
        id: 'international',
        title: 'Likes Monde',
        description: 'Likes provenant du monde entier',
        features: [
          'Diversité géographique',
          'Croissance rapide',
          'Portée internationale',
          'Prix avantageux'
        ],
        icon: 'Globe'
      },
      {
        id: 'europe',
        title: 'Likes Europe',
        description: 'Likes ciblés spécifiquement depuis l\'Europe',
        features: [
          'Profils européens',
          'Engagement naturel',
          'Qualité européenne',
          'Sécurité garantie'
        ],
        icon: 'Flag'
      },
      {
        id: 'french',
        title: 'Likes France',
        description: 'Likes ciblés spécifiquement depuis la France',
        features: [
          'Profils 100% français',
          'Meilleur engagement local',
          'Contenu en français',
          'Support français'
        ],
        icon: 'MapPin'
      }
    ]
  },

  // Instagram Comments - seulement Monde et France
  'instagram_comments': {
    serviceName: 'Instagram Comments',
    availableTypes: [
      {
        id: 'international',
        title: 'Comments Monde',
        description: 'Commentaires provenant du monde entier',
        features: [
          'Diversité géographique',
          'Engagement rapide',
          'Portée internationale',
          'Prix avantageux'
        ],
        icon: 'Globe'
      },
      {
        id: 'french',
        title: 'Comments France',
        description: 'Commentaires ciblés spécifiquement depuis la France',
        features: [
          'Profils 100% français',
          'Meilleur engagement local',
          'Contenu en français',
          'Support français'
        ],
        icon: 'MapPin'
      }
    ]
  },

  // Instagram Views - seulement Monde et France
  'instagram_views': {
    serviceName: 'Instagram Views',
    availableTypes: [
      {
        id: 'international',
        title: 'Views Monde',
        description: 'Vues provenant du monde entier',
        features: [
          'Diversité géographique',
          'Croissance rapide',
          'Portée internationale',
          'Prix avantageux'
        ],
        icon: 'Globe'
      },
      {
        id: 'french',
        title: 'Views France',
        description: 'Vues ciblées spécifiquement depuis la France',
        features: [
          'Profils 100% français',
          'Meilleur engagement local',
          'Contenu en français',
          'Support français'
        ],
        icon: 'MapPin'
      }
    ]
  },

  // TikTok Followers - Premium Followers (un seul type)
  'tiktok_followers': {
    serviceName: 'TikTok Followers',
    availableTypes: [
      {
        id: 'premium',
        title: 'Premium Followers',
        description: 'Followers premium de qualité supérieure',
        features: [
          'Qualité premium',
          'Croissance rapide',
          'Engagement naturel',
          'Garantie 30 jours'
        ],
        icon: 'Star'
      }
    ]
  },

  // TikTok Likes - seulement Monde et France
  'tiktok_likes': {
    serviceName: 'TikTok Likes',
    availableTypes: [
      {
        id: 'international',
        title: 'Likes Monde',
        description: 'Likes provenant du monde entier',
        features: [
          'Diversité géographique',
          'Engagement rapide',
          'Portée internationale',
          'Prix avantageux'
        ],
        icon: 'Globe'
      },
      {
        id: 'french',
        title: 'Likes France',
        description: 'Likes ciblés spécifiquement depuis la France',
        features: [
          'Profils 100% français',
          'Meilleur engagement local',
          'Contenu en français',
          'Support français'
        ],
        icon: 'MapPin'
      }
    ]
  },

  // TikTok Comments - seulement Monde et France
  'tiktok_comments': {
    serviceName: 'TikTok Comments',
    availableTypes: [
      {
        id: 'international',
        title: 'Comments Monde',
        description: 'Commentaires provenant du monde entier',
        features: [
          'Diversité géographique',
          'Engagement rapide',
          'Portée internationale',
          'Prix avantageux'
        ],
        icon: 'Globe'
      },
      {
        id: 'french',
        title: 'Comments France',
        description: 'Commentaires ciblés spécifiquement depuis la France',
        features: [
          'Profils 100% français',
          'Meilleur engagement local',
          'Contenu en français',
          'Support français'
        ],
        icon: 'MapPin'
      }
    ]
  },

  // TikTok Views - seulement Monde et France
  'tiktok_views': {
    serviceName: 'TikTok Views',
    availableTypes: [
      {
        id: 'international',
        title: 'Views Monde',
        description: 'Vues provenant du monde entier',
        features: [
          'Diversité géographique',
          'Croissance rapide',
          'Portée internationale',
          'Prix avantageux'
        ],
        icon: 'Globe'
      },
      {
        id: 'french',
        title: 'Views France',
        description: 'Vues ciblées spécifiquement depuis la France',
        features: [
          'Profils 100% français',
          'Meilleur engagement local',
          'Contenu en français',
          'Support français'
        ],
        icon: 'MapPin'
      }
    ]
  }
};

// Fonction utilitaire pour obtenir la configuration d'un service
export function getServiceConfig(serviceKey: string): ServiceConfig | null {
  return SERVICE_CONFIGS[serviceKey] || null;
}

// Fonction utilitaire pour obtenir les types disponibles pour un service
export function getAvailableTypes(serviceKey: string): ServiceTypeConfig[] {
  const config = getServiceConfig(serviceKey);
  return config ? config.availableTypes : [];
}
