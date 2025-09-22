// Mapping des services SMMA (JustAnotherPanel)
// L'ID correspond au type de service, pas à la quantité

export interface SMMAServiceMapping {
  followerType: 'french' | 'international' | 'likes_french' | 'likes_international' | 'comments_french' | 'comments_international' | 'views_french' | 'views_international' | 'tiktok_french' | 'tiktok_international' | 'tiktok_likes_french' | 'tiktok_likes_international';
  smmaServiceId: number;
  description: string;
}

// Mapping des services disponibles
export const SMMA_SERVICE_MAPPING: SMMAServiceMapping[] = [
  {
    followerType: 'international',
    smmaServiceId: 720, // Service Instagram followers internationaux
    description: 'Instagram followers internationaux'
  },
  {
    followerType: 'likes_international',
    smmaServiceId: 4343, // Service Instagram likes internationaux (JustAnotherPanel)
    description: 'Instagram likes internationaux'
  },
  {
    followerType: 'french',
    smmaServiceId: 720, // Service Instagram followers français
    description: 'Instagram followers français'
  },
  {
    followerType: 'likes_french',
    smmaServiceId: 4343, // Service Instagram likes français (même que les internationaux)
    description: 'Instagram likes français'
  },
  {
    followerType: 'comments_international',
    smmaServiceId: 9564, // Service Instagram commentaires internationaux
    description: 'Instagram commentaires internationaux'
  },
  {
    followerType: 'comments_french',
    smmaServiceId: 9564, // Service Instagram commentaires français (même que les internationaux)
    description: 'Instagram commentaires français'
  },
  {
    followerType: 'views_international',
    smmaServiceId: 519, // Service Instagram vues internationaux (reels/clips)
    description: 'Instagram vues internationaux'
  },
  {
    followerType: 'views_french',
    smmaServiceId: 519, // Service Instagram vues français (même que les internationaux)
    description: 'Instagram vues français'
  },
  {
    followerType: 'tiktok_international',
    smmaServiceId: 9583, // Service TikTok followers internationaux
    description: 'TikTok followers internationaux'
  },
  {
    followerType: 'tiktok_french',
    smmaServiceId: 9583, // Service TikTok followers français (même service)
    description: 'TikTok followers français'
  },
  {
    followerType: 'tiktok_likes_international',
    smmaServiceId: 4174, // Service TikTok likes internationaux
    description: 'TikTok likes internationaux'
  },
  {
    followerType: 'tiktok_likes_french',
    smmaServiceId: 4174, // Service TikTok likes français (même service)
    description: 'TikTok likes français'
  }
];

/**
 * Obtenir l'ID du service SMMA pour un type de followers donné
 */
export function getSMMAServiceId(followerType: 'french' | 'international' | 'likes_french' | 'likes_international' | 'comments_french' | 'comments_international' | 'views_french' | 'views_international' | 'tiktok_french' | 'tiktok_international' | 'tiktok_likes_french' | 'tiktok_likes_international'): number | null {
  const mapping = SMMA_SERVICE_MAPPING.find(
    service => service.followerType === followerType
  );
  
  return mapping ? mapping.smmaServiceId : null;
}

/**
 * Obtenir la description du service
 */
export function getServiceDescription(followerType: 'french' | 'international' | 'likes_french' | 'likes_international' | 'comments_french' | 'comments_international' | 'views_french' | 'views_international' | 'tiktok_french' | 'tiktok_international' | 'tiktok_likes_french' | 'tiktok_likes_international'): string {
  const mapping = SMMA_SERVICE_MAPPING.find(
    service => service.followerType === followerType
  );
  
  return mapping ? mapping.description : `${followerType} followers`;
}
