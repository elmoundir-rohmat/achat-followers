// Mapping des services SMMA (JustAnotherPanel)
// L'ID correspond au type de service, pas à la quantité

export interface SMMAServiceMapping {
  followerType: 'french' | 'international' | 'likes_french' | 'likes_international' | 'likes_europe' | 'comments_french' | 'comments_international' | 'views_french' | 'views_international' | 'tiktok_french' | 'tiktok_international' | 'tiktok_likes_french' | 'tiktok_likes_international' | 'tiktok_views_french' | 'tiktok_views_international' | 'tiktok_comments_french' | 'tiktok_comments_international';
  smmaServiceId: number;
  description: string;
}

// Mapping des services disponibles
export const SMMA_SERVICE_MAPPING: SMMAServiceMapping[] = [
  {
    followerType: 'international',
    smmaServiceId: 3510, // Service Instagram followers internationaux
    description: 'Instagram followers internationaux'
  },
  {
    followerType: 'likes_international',
    smmaServiceId: 1819, // Service Instagram likes Monde
    description: 'Instagram likes Monde'
  },
  {
    followerType: 'likes_europe',
    smmaServiceId: 6073, // Service Instagram likes Europe
    description: 'Instagram likes Europe'
  },
  {
    followerType: 'likes_french',
    smmaServiceId: 9346, // Service Instagram likes France
    description: 'Instagram likes France'
  },
  {
    followerType: 'french',
    smmaServiceId: 6777, // Service Instagram followers français
    description: 'Instagram followers français'
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
  },
  {
    followerType: 'tiktok_views_international',
    smmaServiceId: 4412, // Service TikTok vues internationaux
    description: 'TikTok vues internationaux'
  },
  {
    followerType: 'tiktok_views_french',
    smmaServiceId: 4412, // Service TikTok vues français (même service)
    description: 'TikTok vues français'
  },
  {
    followerType: 'tiktok_comments_international',
    smmaServiceId: 6474, // Service TikTok commentaires internationaux
    description: 'TikTok commentaires internationaux'
  },
  {
    followerType: 'tiktok_comments_french',
    smmaServiceId: 6474, // Service TikTok commentaires français (même service)
    description: 'TikTok commentaires français'
  }
];

/**
 * Obtenir l'ID du service SMMA pour un type de followers donné (ancienne méthode)
 */
export function getSMMAServiceId(followerType: 'french' | 'international' | 'likes_french' | 'likes_international' | 'likes_europe' | 'comments_french' | 'comments_international' | 'views_french' | 'views_international' | 'tiktok_french' | 'tiktok_international' | 'tiktok_likes_french' | 'tiktok_likes_international' | 'tiktok_views_french' | 'tiktok_views_international' | 'tiktok_comments_french' | 'tiktok_comments_international'): number | null {
  const mapping = SMMA_SERVICE_MAPPING.find(
    service => service.followerType === followerType
  );
  
  return mapping ? mapping.smmaServiceId : null;
}

/**
 * NOUVELLE MÉTHODE : Obtenir l'ID du service SMMA selon le type de service et le type de followers
 */
export function getServiceId(serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_views' | 'tiktok_comments', followerType: 'french' | 'international' | 'europe'): number | null {
  // Construire la clé de mapping
  let mappingKey: string;
  
  if (serviceType === 'followers') {
    mappingKey = followerType; // 'french' ou 'international'
  } else if (serviceType === 'likes') {
    if (followerType === 'international') {
      mappingKey = 'likes_international';
    } else if (followerType === 'europe') {
      mappingKey = 'likes_europe';
    } else if (followerType === 'french') {
      mappingKey = 'likes_french';
    } else {
      mappingKey = `likes_${followerType}`; // fallback
    }
  } else if (serviceType === 'comments') {
    mappingKey = `comments_${followerType}`; // 'comments_french' ou 'comments_international'
  } else if (serviceType === 'views') {
    mappingKey = `views_${followerType}`; // 'views_french' ou 'views_international'
  } else if (serviceType === 'tiktok_followers') {
    mappingKey = `tiktok_${followerType}`; // 'tiktok_french' ou 'tiktok_international'
  } else if (serviceType === 'tiktok_likes') {
    mappingKey = `tiktok_likes_${followerType}`; // 'tiktok_likes_french' ou 'tiktok_likes_international'
  } else if (serviceType === 'tiktok_views') {
    mappingKey = `tiktok_views_${followerType}`; // 'tiktok_views_french' ou 'tiktok_views_international'
  } else if (serviceType === 'tiktok_comments') {
    mappingKey = `tiktok_comments_${followerType}`; // 'tiktok_comments_french' ou 'tiktok_comments_international'
  } else {
    return null;
  }
  
  const mapping = SMMA_SERVICE_MAPPING.find(
    service => service.followerType === mappingKey as any
  );
  
  return mapping ? mapping.smmaServiceId : null;
}

/**
 * Obtenir la description du service
 */
export function getServiceDescription(followerType: 'french' | 'international' | 'likes_french' | 'likes_international' | 'likes_europe' | 'comments_french' | 'comments_international' | 'views_french' | 'views_international' | 'tiktok_french' | 'tiktok_international' | 'tiktok_likes_french' | 'tiktok_likes_international' | 'tiktok_views_french' | 'tiktok_views_international' | 'tiktok_comments_french' | 'tiktok_comments_international'): string {
  const mapping = SMMA_SERVICE_MAPPING.find(
    service => service.followerType === followerType
  );
  
  return mapping ? mapping.description : `${followerType} followers`;
}
