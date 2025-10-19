// Configuration centralisée des packages pour chaque service

export interface PackageConfig {
  id: string;
  quantity: number;
  priceInternational: number;
  priceFrench: number;
  features: string[];
  delivery: string;
  popular?: boolean;
}

// Packages pour les followers Instagram internationaux
export const FOLLOWERS_PACKAGES_INTERNATIONAL: PackageConfig[] = [
  {
    id: '100',
    quantity: 100,
    priceInternational: 4.95,
    priceFrench: 3.98,
    features: ['Livraison progressive', 'Profils actifs', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 6.95,
    priceFrench: 13.90,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j'],
    delivery: '24-48h'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 12.95,
    priceFrench: 17.90,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 19.95,
    priceFrench: 29.90,
    features: ['Livraison progressive', 'Profils premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '5000',
    quantity: 5000,
    priceInternational: 89.95,
    priceFrench: 99.90,
    features: ['Livraison naturelle', 'Profils vérifiés', 'Garantie 30j', 'Bonus engagement'],
    delivery: '5-7 jours'
  },
  {
    id: '10000',
    quantity: 10000,
    priceInternational: 149.95,
    priceFrench: 194.00,
    features: ['Livraison premium', 'Qualité maximale', 'Garantie 30j', 'Manager dédié'],
    delivery: '7-10 jours'
  },
  {
    id: '25000',
    quantity: 25000,
    priceInternational: 249.95,
    priceFrench: 458.00,
    features: ['Livraison VIP', 'Profils haut de gamme', 'Garantie 30j', 'Service personnalisé'],
    delivery: '10-15 jours'
  },
  {
    id: '50000',
    quantity: 50000,
    priceInternational: 449.95,
    priceFrench: 458.00,
    features: ['Livraison VIP', 'Profils haut de gamme', 'Garantie 30j', 'Service personnalisé', 'Manager dédié'],
    delivery: '15-20 jours'
  }
];

// Packages pour les followers Instagram français
export const FOLLOWERS_PACKAGES_FRENCH: PackageConfig[] = [
  {
    id: '100',
    quantity: 100,
    priceInternational: 4.95,
    priceFrench: 14.95,
    features: ['Livraison progressive', 'Profils actifs', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 6.95,
    priceFrench: 29.95,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j'],
    delivery: '24-48h'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 12.95,
    priceFrench: 54.95,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 19.95,
    priceFrench: 99.95,
    features: ['Livraison progressive', 'Profils premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '2500',
    quantity: 2500,
    priceInternational: 19.95,
    priceFrench: 199.95,
    features: ['Livraison sécurisée', 'Profils premium', 'Garantie 30j', 'Support prioritaire'],
    delivery: '48-72h'
  }
];

// Fonction pour obtenir les packages selon le type
export const getFollowersPackages = (followerType: 'international' | 'french'): PackageConfig[] => {
  return followerType === 'french' ? FOLLOWERS_PACKAGES_FRENCH : FOLLOWERS_PACKAGES_INTERNATIONAL;
};

// Garder l'ancien tableau pour la compatibilité (déprécié)
export const FOLLOWERS_PACKAGES: PackageConfig[] = FOLLOWERS_PACKAGES_INTERNATIONAL;

// Packages pour les likes Instagram Monde (international)
export const LIKES_PACKAGES_INTERNATIONAL: PackageConfig[] = [
  {
    id: '50',
    quantity: 50,
    priceInternational: 1.99,
    priceFrench: 1.99,
    features: ['Livraison rapide', 'Likes mondiaux', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 2.49,
    priceFrench: 2.49,
    features: ['Livraison progressive', 'Likes actifs mondiaux', 'Garantie 30j'],
    delivery: '12-24h',
    popular: true
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 4.99,
    priceFrench: 4.99,
    features: ['Livraison sécurisée', 'Engagement naturel mondial', 'Garantie 30j'],
    delivery: '24-48h'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 7.99,
    priceFrench: 7.99,
    features: ['Livraison sécurisée', 'Engagement naturel mondial', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 9.99,
    priceFrench: 9.99,
    features: ['Livraison progressive', 'Likes premium mondiaux', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h'
  }
];

// Packages pour les likes Instagram Europe
export const LIKES_PACKAGES_EUROPE: PackageConfig[] = [
  {
    id: '100',
    quantity: 100,
    priceInternational: 5.99,
    priceFrench: 5.99,
    features: ['Livraison rapide', 'Likes européens', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 12.99,
    priceFrench: 12.99,
    features: ['Livraison progressive', 'Likes actifs européens', 'Garantie 30j'],
    delivery: '12-24h',
    popular: true
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 19.99,
    priceFrench: 19.99,
    features: ['Livraison sécurisée', 'Engagement naturel européen', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 24.99,
    priceFrench: 24.99,
    features: ['Livraison progressive', 'Likes premium européens', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h'
  }
];

// Packages pour les likes Instagram France
export const LIKES_PACKAGES_FRENCH: PackageConfig[] = [
  {
    id: '50',
    quantity: 50,
    priceInternational: 3.99,
    priceFrench: 3.99,
    features: ['Livraison rapide', 'Likes français', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '150',
    quantity: 150,
    priceInternational: 7.99,
    priceFrench: 7.99,
    features: ['Livraison progressive', 'Likes actifs français', 'Garantie 30j'],
    delivery: '12-24h',
    popular: true
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 13.99,
    priceFrench: 13.99,
    features: ['Livraison sécurisée', 'Engagement naturel français', 'Garantie 30j'],
    delivery: '24-48h'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 24.99,
    priceFrench: 24.99,
    features: ['Livraison sécurisée', 'Engagement naturel français', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 35.99,
    priceFrench: 35.99,
    features: ['Livraison progressive', 'Likes premium français', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h'
  }
];

// Garder l'ancien tableau pour la compatibilité (déprécié)
export const LIKES_PACKAGES: PackageConfig[] = LIKES_PACKAGES_INTERNATIONAL;

// Packages pour les commentaires Instagram
export const COMMENTS_PACKAGES: PackageConfig[] = [
  {
    id: '10',
    quantity: 10,
    priceInternational: 3.95,
    priceFrench: 7.90,
    features: ['Livraison rapide', 'Commentaires réels', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '25',
    quantity: 25,
    priceInternational: 8.95,
    priceFrench: 17.90,
    features: ['Livraison progressive', 'Commentaires actifs', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '50',
    quantity: 50,
    priceInternational: 11.95,
    priceFrench: 23.90,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 19.95,
    priceFrench: 39.90,
    features: ['Livraison progressive', 'Commentaires premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 49.95,
    priceFrench: 99.90,
    features: ['Livraison naturelle', 'Commentaires vérifiés', 'Garantie 30j', 'Bonus engagement'],
    delivery: '5-7 jours'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 84.95,
    priceFrench: 169.90,
    features: ['Livraison premium', 'Qualité maximale', 'Garantie 30j', 'Manager dédié'],
    delivery: '7-10 jours'
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 149.00,
    priceFrench: 298.00,
    features: ['Livraison VIP', 'Commentaires haut de gamme', 'Garantie 30j', 'Service personnalisé'],
    delivery: '10-15 jours'
  }
];

// Packages pour les vues Instagram (reels/clips)
export const VIEWS_PACKAGES: PackageConfig[] = [
  {
    id: '100',
    quantity: 100,
    priceInternational: 1.49,
    priceFrench: 2.98,
    features: ['Livraison instantanée', 'Vues réelles', 'Garantie 30j'],
    delivery: 'Instantané'
  },
  {
    id: '200',
    quantity: 200,
    priceInternational: 2.90,
    priceFrench: 5.80,
    features: ['Livraison instantanée', 'Vues actives', 'Garantie 30j'],
    delivery: 'Instantané'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 4.90,
    priceFrench: 9.80,
    features: ['Livraison instantanée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'],
    delivery: 'Instantané',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 7.90,
    priceFrench: 15.80,
    features: ['Livraison instantanée', 'Vues premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: 'Instantané',
    popular: true
  },
  {
    id: '2500',
    quantity: 2500,
    priceInternational: 14.90,
    priceFrench: 29.80,
    features: ['Livraison instantanée', 'Vues vérifiées', 'Garantie 30j', 'Bonus engagement'],
    delivery: 'Instantané'
  },
  {
    id: '5000',
    quantity: 5000,
    priceInternational: 24.90,
    priceFrench: 49.80,
    features: ['Livraison instantanée', 'Qualité maximale', 'Garantie 30j', 'Manager dédié'],
    delivery: 'Instantané'
  },
  {
    id: '10000',
    quantity: 10000,
    priceInternational: 38.90,
    priceFrench: 77.80,
    features: ['Livraison instantanée', 'Vues haut de gamme', 'Garantie 30j', 'Service personnalisé'],
    delivery: 'Instantané'
  }
];

// Packages pour les vues TikTok
export const TIKTOK_VIEWS_PACKAGES: PackageConfig[] = [
  { id: '100', quantity: 100, priceInternational: 0.99, priceFrench: 1.98, features: ['Livraison instantanée', 'Vues réelles', 'Garantie 30j'], delivery: 'Instantané' },
  { id: '250', quantity: 250, priceInternational: 1.95, priceFrench: 3.90, features: ['Livraison instantanée', 'Vues actives', 'Garantie 30j'], delivery: 'Instantané' },
  { id: '1000', quantity: 1000, priceInternational: 2.95, priceFrench: 5.90, features: ['Livraison instantanée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'], delivery: 'Instantané', popular: true },
  { id: '5000', quantity: 5000, priceInternational: 9.95, priceFrench: 19.90, features: ['Livraison instantanée', 'Vues premium', 'Garantie 30j', 'Remplacement gratuit'], delivery: 'Instantané' },
  { id: '10000', quantity: 10000, priceInternational: 14.94, priceFrench: 29.88, features: ['Livraison instantanée', 'Vues vérifiées', 'Garantie 30j', 'Bonus engagement'], delivery: 'Instantané' },
  { id: '25000', quantity: 25000, priceInternational: 29.95, priceFrench: 59.90, features: ['Livraison instantanée', 'Qualité maximale', 'Garantie 30j', 'Manager dédié'], delivery: 'Instantané' },
  { id: '50000', quantity: 50000, priceInternational: 49.95, priceFrench: 99.90, features: ['Livraison instantanée', 'Vues premium', 'Garantie 30j', 'Support VIP'], delivery: 'Instantané' },
  { id: '250000', quantity: 250000, priceInternational: 99.00, priceFrench: 198.00, features: ['Livraison instantanée', 'Vues massives', 'Garantie 30j', 'Support VIP', 'Bonus exclusif'], delivery: 'Instantané' }
];

// Packages pour les commentaires TikTok
export const TIKTOK_COMMENTS_PACKAGES: PackageConfig[] = [
  {
    id: '10',
    quantity: 10,
    priceInternational: 3.95,
    priceFrench: 7.90,
    features: ['Livraison rapide', 'Commentaires réels', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '25',
    quantity: 25,
    priceInternational: 8.95,
    priceFrench: 17.90,
    features: ['Livraison progressive', 'Commentaires actifs', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '50',
    quantity: 50,
    priceInternational: 11.95,
    priceFrench: 23.90,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 19.95,
    priceFrench: 39.90,
    features: ['Livraison progressive', 'Commentaires premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 49.95,
    priceFrench: 99.90,
    features: ['Livraison naturelle', 'Commentaires vérifiés', 'Garantie 30j', 'Bonus engagement'],
    delivery: '5-7 jours'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 84.95,
    priceFrench: 169.90,
    features: ['Livraison premium', 'Qualité maximale', 'Garantie 30j', 'Manager dédié'],
    delivery: '7-10 jours'
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 149.00,
    priceFrench: 298.00,
    features: ['Livraison VIP', 'Commentaires haut de gamme', 'Garantie 30j', 'Service personnalisé'],
    delivery: '10-15 jours'
  }
];

/**
 * Obtenir les packages selon le type de service
 */
export function getPackagesForService(serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_views' | 'tiktok_comments', followerType?: 'french' | 'international' | 'europe'): PackageConfig[] {
  switch (serviceType) {
    case 'followers':
      return followerType ? getFollowersPackages(followerType as 'french' | 'international') : FOLLOWERS_PACKAGES_INTERNATIONAL;
    case 'likes':
      if (followerType === 'international') {
        return LIKES_PACKAGES_INTERNATIONAL;
      } else if (followerType === 'europe') {
        return LIKES_PACKAGES_EUROPE;
      } else if (followerType === 'french') {
        return LIKES_PACKAGES_FRENCH;
      } else {
        return LIKES_PACKAGES_INTERNATIONAL; // fallback
      }
    case 'comments':
      return COMMENTS_PACKAGES;
    case 'views':
      return VIEWS_PACKAGES;
    case 'tiktok_views':
      return TIKTOK_VIEWS_PACKAGES;
    case 'tiktok_comments':
      return TIKTOK_COMMENTS_PACKAGES;
    default:
      return FOLLOWERS_PACKAGES_INTERNATIONAL;
  }
}

/**
 * Obtenir le prix d'un package selon le type de follower
 */
export function getPackagePrice(packageId: string, serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_views' | 'tiktok_comments', followerType: 'french' | 'international' | 'europe'): number {
  // Retourner 0 immédiatement si packageId est vide
  if (!packageId) return 0;
  
  const packages = getPackagesForService(serviceType, followerType);
  console.log('🔍 getPackagePrice debug:', {
    packageId,
    serviceType,
    followerType,
    packagesLength: packages.length,
    packages: packages.slice(0, 3) // Afficher les 3 premiers packages
  });
  
  const pkg = packages.find(p => p.id === packageId);
  console.log('🔍 Package trouvé:', pkg);
  
  if (!pkg) {
    console.log('❌ Package non trouvé pour ID:', packageId);
    return 0;
  }
  
  const price = followerType === 'french' ? pkg.priceFrench : pkg.priceInternational;
  console.log('💰 Prix calculé:', { price, followerType, priceFrench: pkg.priceFrench, priceInternational: pkg.priceInternational });
  
  return price;
}

/**
 * Obtenir la quantité d'un package
 */
export function getPackageQuantity(packageId: string, serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_views' | 'tiktok_comments'): number {
  // Retourner 0 immédiatement si packageId est vide
  if (!packageId) return 0;
  
  const packages = getPackagesForService(serviceType);
  const pkg = packages.find(p => p.id === packageId);
  
  return pkg ? pkg.quantity : 0;
}
