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

// Packages pour les followers Instagram
export const FOLLOWERS_PACKAGES: PackageConfig[] = [
  {
    id: '25',
    quantity: 25,
    priceInternational: 0.99,
    priceFrench: 1.98,
    features: ['Livraison rapide', 'Profils réels', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 2.95,
    priceFrench: 5.90,
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
    priceInternational: 8.95,
    priceFrench: 17.90,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 14.95,
    priceFrench: 29.90,
    features: ['Livraison progressive', 'Profils premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '5000',
    quantity: 5000,
    priceInternational: 49.95,
    priceFrench: 99.90,
    features: ['Livraison naturelle', 'Profils vérifiés', 'Garantie 30j', 'Bonus engagement'],
    delivery: '5-7 jours'
  },
  {
    id: '10000',
    quantity: 10000,
    priceInternational: 97.00,
    priceFrench: 194.00,
    features: ['Livraison premium', 'Qualité maximale', 'Garantie 30j', 'Manager dédié'],
    delivery: '7-10 jours'
  },
  {
    id: '25000',
    quantity: 25000,
    priceInternational: 229.00,
    priceFrench: 458.00,
    features: ['Livraison VIP', 'Profils haut de gamme', 'Garantie 30j', 'Service personnalisé'],
    delivery: '10-15 jours'
  }
];

// Packages pour les likes Instagram
export const LIKES_PACKAGES: PackageConfig[] = [
  {
    id: '25',
    quantity: 25,
    priceInternational: 0.49,
    priceFrench: 0.98,
    features: ['Livraison rapide', 'Likes réels', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 1.49,
    priceFrench: 2.98,
    features: ['Livraison progressive', 'Likes actifs', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 3.49,
    priceFrench: 6.98,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j'],
    delivery: '24-48h'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 4.49,
    priceFrench: 8.98,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 7.49,
    priceFrench: 14.98,
    features: ['Livraison progressive', 'Likes premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '5000',
    quantity: 5000,
    priceInternational: 24.95,
    priceFrench: 49.90,
    features: ['Livraison naturelle', 'Likes vérifiés', 'Garantie 30j', 'Bonus engagement'],
    delivery: '5-7 jours'
  },
  {
    id: '10000',
    quantity: 10000,
    priceInternational: 48.95,
    priceFrench: 97.90,
    features: ['Livraison premium', 'Qualité maximale', 'Garantie 30j', 'Manager dédié'],
    delivery: '7-10 jours'
  },
  {
    id: '25000',
    quantity: 25000,
    priceInternational: 114.95,
    priceFrench: 229.90,
    features: ['Livraison VIP', 'Likes haut de gamme', 'Garantie 30j', 'Service personnalisé'],
    delivery: '10-15 jours'
  }
];

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

/**
 * Obtenir les packages selon le type de service
 */
export function getPackagesForService(serviceType: 'followers' | 'likes' | 'comments' | 'views'): PackageConfig[] {
  switch (serviceType) {
    case 'followers':
      return FOLLOWERS_PACKAGES;
    case 'likes':
      return LIKES_PACKAGES;
    case 'comments':
      return COMMENTS_PACKAGES;
    case 'views':
      return VIEWS_PACKAGES;
    default:
      return FOLLOWERS_PACKAGES;
  }
}

/**
 * Obtenir le prix d'un package selon le type de follower
 */
export function getPackagePrice(packageId: string, serviceType: 'followers' | 'likes' | 'comments' | 'views', followerType: 'french' | 'international'): number {
  const packages = getPackagesForService(serviceType);
  const pkg = packages.find(p => p.id === packageId);
  
  if (!pkg) return 0;
  
  return followerType === 'french' ? pkg.priceFrench : pkg.priceInternational;
}

/**
 * Obtenir la quantité d'un package
 */
export function getPackageQuantity(packageId: string, serviceType: 'followers' | 'likes' | 'comments' | 'views'): number {
  const packages = getPackagesForService(serviceType);
  const pkg = packages.find(p => p.id === packageId);
  
  return pkg ? pkg.quantity : 0;
}
