// Mapping des services SMMA (JustAnotherPanel)
// L'ID correspond au type de service, pas à la quantité

export interface SMMAServiceMapping {
  followerType: 'french' | 'international' | 'likes_french' | 'likes_international';
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
  }
];

/**
 * Obtenir l'ID du service SMMA pour un type de followers donné
 */
export function getSMMAServiceId(followerType: 'french' | 'international' | 'likes_french' | 'likes_international'): number | null {
  const mapping = SMMA_SERVICE_MAPPING.find(
    service => service.followerType === followerType
  );
  
  return mapping ? mapping.smmaServiceId : null;
}

/**
 * Obtenir la description du service
 */
export function getServiceDescription(followerType: 'french' | 'international' | 'likes_french' | 'likes_international'): string {
  const mapping = SMMA_SERVICE_MAPPING.find(
    service => service.followerType === followerType
  );
  
  return mapping ? mapping.description : `${followerType} followers`;
}
