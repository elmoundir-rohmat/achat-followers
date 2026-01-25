// Mapping des services disponibles

export interface SMMAServiceMapping {
  followerType: 'french' | 'international' | 'likes_french' | 'likes_international' | 'likes_europe' | 'comments_french' | 'comments_international' | 'views_french' | 'views_international' | 'tiktok_french' | 'tiktok_international' | 'tiktok_likes_french' | 'tiktok_likes_international' | 'tiktok_views_french' | 'tiktok_views_international' | 'tiktok_comments_french' | 'tiktok_comments_international' | 'tiktok_comments_random' | 'tiktok_comments_custom';
  smmaServiceId: number;
  description: string;
}

// Mapping des services disponibles
export const SMMA_SERVICE_MAPPING: SMMAServiceMapping[] = [
  {
    followerType: 'international',
    smmaServiceId: 4235,
    description: 'Instagram followers internationaux'
  },
  {
    followerType: 'likes_international',
    smmaServiceId: 1819,
    description: 'Instagram likes Monde'
  },
  {
    followerType: 'likes_europe',
    smmaServiceId: 6073,
    description: 'Instagram likes Europe'
  },
  {
    followerType: 'likes_french',
    smmaServiceId: 9346,
    description: 'Instagram likes France'
  },
  {
    followerType: 'french',
    smmaServiceId: 6777,
    description: 'Instagram followers français'
  },
  {
    followerType: 'comments_international',
    smmaServiceId: 1853,
    description: 'Instagram commentaires internationaux'
  },
  {
    followerType: 'comments_french',
    smmaServiceId: 9564,
    description: 'Instagram commentaires français'
  },
  {
    followerType: 'views_international',
    smmaServiceId: 519,
    description: 'Instagram vues internationaux'
  },
  {
    followerType: 'views_french',
    smmaServiceId: 519,
    description: 'Instagram vues français'
  },
  {
    followerType: 'tiktok_international',
    smmaServiceId: 8200,
    description: 'TikTok followers Premium'
  },
  {
    followerType: 'tiktok_french',
    smmaServiceId: 8200,
    description: 'TikTok followers Premium'
  },
  {
    followerType: 'tiktok_likes_international',
    smmaServiceId: 3850,
    description: 'TikTok likes Premium'
  },
  {
    followerType: 'tiktok_likes_french',
    smmaServiceId: 3850,
    description: 'TikTok likes Premium'
  },
  {
    followerType: 'tiktok_views_international',
    smmaServiceId: 3365,
    description: 'TikTok vues Premium'
  },
  {
    followerType: 'tiktok_views_french',
    smmaServiceId: 3365,
    description: 'TikTok vues Premium'
  },
  {
    followerType: 'tiktok_comments_international',
    smmaServiceId: 7054,
    description: 'TikTok commentaires aléatoires'
  },
  {
    followerType: 'tiktok_comments_french',
    smmaServiceId: 7118,
    description: 'TikTok commentaires personnalisés'
  },
  {
    followerType: 'tiktok_comments_random',
    smmaServiceId: 7054,
    description: 'TikTok commentaires aléatoires'
  },
  {
    followerType: 'tiktok_comments_custom',
    smmaServiceId: 7118,
    description: 'TikTok commentaires personnalisés'
  }
];

/**
 * Obtenir l'ID du service pour un type de followers donné
 */
export function getSMMAServiceId(followerType: 'french' | 'international' | 'likes_french' | 'likes_international' | 'likes_europe' | 'comments_french' | 'comments_international' | 'views_french' | 'views_international' | 'tiktok_french' | 'tiktok_international' | 'tiktok_likes_french' | 'tiktok_likes_international' | 'tiktok_views_french' | 'tiktok_views_international' | 'tiktok_comments_french' | 'tiktok_comments_international'): number | null {
  const mapping = SMMA_SERVICE_MAPPING.find(
    service => service.followerType === followerType
  );
  
  return mapping ? mapping.smmaServiceId : null;
}

/**
 * Obtenir l'ID du service selon le type de service et le type de followers
 */
export function getServiceId(serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_views' | 'tiktok_comments', followerType: 'french' | 'international' | 'europe' | 'random' | 'custom'): number | null {
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
    mappingKey = 'tiktok_international';
  } else if (serviceType === 'tiktok_likes') {
    mappingKey = 'tiktok_likes_international';
  } else if (serviceType === 'tiktok_views') {
    mappingKey = 'tiktok_views_international';
  } else if (serviceType === 'tiktok_comments') {
    if (followerType === 'random') {
      mappingKey = 'tiktok_comments_random';
    } else if (followerType === 'custom') {
      mappingKey = 'tiktok_comments_custom';
    } else {
      mappingKey = followerType === 'french' ? 'tiktok_comments_french' : 'tiktok_comments_international';
    }
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
