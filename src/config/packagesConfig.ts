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

// Packages pour les commentaires Instagram internationaux
export const COMMENTS_PACKAGES_INTERNATIONAL: PackageConfig[] = [
  {
    id: '10',
    quantity: 10,
    priceInternational: 3.95,
    priceFrench: 3.95,
    features: ['Livraison rapide', 'Commentaires réels', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '25',
    quantity: 25,
    priceInternational: 5.95,
    priceFrench: 5.95,
    features: ['Livraison progressive', 'Commentaires actifs', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '50',
    quantity: 50,
    priceInternational: 9.95,
    priceFrench: 9.95,
    features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '75',
    quantity: 75,
    priceInternational: 11.95,
    priceFrench: 11.95,
    features: ['Livraison progressive', 'Commentaires premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-48h'
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 16.95,
    priceFrench: 16.95,
    features: ['Livraison progressive', 'Commentaires premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '150',
    quantity: 150,
    priceInternational: 22.95,
    priceFrench: 22.95,
    features: ['Livraison naturelle', 'Commentaires vérifiés', 'Garantie 30j', 'Bonus engagement'],
    delivery: '5-7 jours'
  },
  {
    id: '200',
    quantity: 200,
    priceInternational: 29.95,
    priceFrench: 29.95,
    features: ['Livraison premium', 'Qualité maximale', 'Garantie 30j', 'Manager dédié'],
    delivery: '7-10 jours'
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 35.95,
    priceFrench: 35.95,
    features: ['Livraison VIP', 'Commentaires haut de gamme', 'Garantie 30j', 'Service personnalisé'],
    delivery: '10-15 jours'
  }
];

// Packages pour les commentaires Instagram français
export const COMMENTS_PACKAGES_FRENCH: PackageConfig[] = [
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

// Garder l'ancien tableau pour la compatibilité (déprécié)
export const COMMENTS_PACKAGES: PackageConfig[] = COMMENTS_PACKAGES_INTERNATIONAL;

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

// Packages pour les vues TikTok Premium (un seul type, pas de distinction monde/français)
export const TIKTOK_VIEWS_PACKAGES: PackageConfig[] = [
  {
    id: '100',
    quantity: 100,
    priceInternational: 1.00,
    priceFrench: 1.00,
    features: ['Livraison instantanée', 'Vues Premium', 'Garantie 30j'],
    delivery: 'Instantané'
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 1.95,
    priceFrench: 1.95,
    features: ['Livraison instantanée', 'Vues Premium', 'Garantie 30j'],
    delivery: 'Instantané',
    popular: true
  },
  {
    id: '10000',
    quantity: 10000,
    priceInternational: 5.95,
    priceFrench: 5.95,
    features: ['Livraison instantanée', 'Vues Premium', 'Garantie 30j', 'Support prioritaire'],
    delivery: 'Instantané',
    popular: true
  },
  {
    id: '100000',
    quantity: 100000,
    priceInternational: 39.95,
    priceFrench: 39.95,
    features: ['Livraison instantanée', 'Vues Premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: 'Instantané'
  },
  {
    id: '1000000',
    quantity: 1000000,
    priceInternational: 199.95,
    priceFrench: 199.95,
    features: ['Livraison instantanée', 'Vues Premium', 'Garantie 30j', 'Manager dédié'],
    delivery: 'Instantané'
  }
];

// Packages pour les commentaires TikTok Aléatoires
export const TIKTOK_COMMENTS_RANDOM_PACKAGES: PackageConfig[] = [
  {
    id: '10',
    quantity: 10,
    priceInternational: 1.49,
    priceFrench: 1.49,
    features: ['Livraison rapide', 'Commentaires aléatoires', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '20',
    quantity: 20,
    priceInternational: 1.95,
    priceFrench: 1.95,
    features: ['Livraison progressive', 'Commentaires aléatoires', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '50',
    quantity: 50,
    priceInternational: 4.95,
    priceFrench: 4.95,
    features: ['Livraison sécurisée', 'Commentaires aléatoires', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 7.95,
    priceFrench: 7.95,
    features: ['Livraison progressive', 'Commentaires aléatoires', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 14.95,
    priceFrench: 14.95,
    features: ['Livraison naturelle', 'Commentaires aléatoires', 'Garantie 30j', 'Bonus engagement'],
    delivery: '5-7 jours'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 24.95,
    priceFrench: 24.95,
    features: ['Livraison premium', 'Commentaires aléatoires', 'Garantie 30j', 'Manager dédié'],
    delivery: '7-10 jours'
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 39.95,
    priceFrench: 39.95,
    features: ['Livraison VIP', 'Commentaires aléatoires', 'Garantie 30j', 'Service personnalisé'],
    delivery: '10-15 jours'
  }
];

// Packages pour les commentaires TikTok Personnalisés
export const TIKTOK_COMMENTS_CUSTOM_PACKAGES: PackageConfig[] = [
  {
    id: '10',
    quantity: 10,
    priceInternational: 2.45,
    priceFrench: 2.45,
    features: ['Livraison rapide', 'Commentaires personnalisés', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '20',
    quantity: 20,
    priceInternational: 3.95,
    priceFrench: 3.95,
    features: ['Livraison progressive', 'Commentaires personnalisés', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '50',
    quantity: 50,
    priceInternational: 6.95,
    priceFrench: 6.95,
    features: ['Livraison sécurisée', 'Commentaires personnalisés', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 9.95,
    priceFrench: 9.95,
    features: ['Livraison progressive', 'Commentaires personnalisés', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  }
];

// Garder l'ancien pour compatibilité (déprécié)
export const TIKTOK_COMMENTS_PACKAGES: PackageConfig[] = TIKTOK_COMMENTS_RANDOM_PACKAGES;

// Packages pour les followers TikTok Premium (un seul type, pas de distinction monde/français)
export const TIKTOK_FOLLOWERS_PACKAGES: PackageConfig[] = [
  {
    id: '10',
    quantity: 10,
    priceInternational: 0.99,
    priceFrench: 0.99,
    features: ['Livraison rapide', 'Followers Premium', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 3.95,
    priceFrench: 3.95,
    features: ['Livraison progressive', 'Followers Premium', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 5.95,
    priceFrench: 5.95,
    features: ['Livraison sécurisée', 'Followers Premium', 'Garantie 30j'],
    delivery: '24-48h'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 12.95,
    priceFrench: 12.95,
    features: ['Livraison sécurisée', 'Followers Premium', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 19.95,
    priceFrench: 19.95,
    features: ['Livraison progressive', 'Followers Premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '2500',
    quantity: 2500,
    priceInternational: 39.95,
    priceFrench: 39.95,
    features: ['Livraison sécurisée', 'Followers Premium', 'Garantie 30j', 'Support prioritaire'],
    delivery: '48-72h'
  },
  {
    id: '5000',
    quantity: 5000,
    priceInternational: 69.95,
    priceFrench: 69.95,
    features: ['Livraison naturelle', 'Followers Premium', 'Garantie 30j', 'Bonus engagement'],
    delivery: '5-7 jours'
  },
  {
    id: '10000',
    quantity: 10000,
    priceInternational: 119.95,
    priceFrench: 119.95,
    features: ['Livraison premium', 'Followers Premium', 'Garantie 30j', 'Manager dédié'],
    delivery: '7-10 jours'
  }
];

// Packages pour les likes TikTok Premium (un seul type, pas de distinction monde/français)
export const TIKTOK_LIKES_PACKAGES: PackageConfig[] = [
  {
    id: '10',
    quantity: 10,
    priceInternational: 0.99,
    priceFrench: 0.99,
    features: ['Livraison rapide', 'Likes Premium', 'Garantie 30j'],
    delivery: '6-12h'
  },
  {
    id: '100',
    quantity: 100,
    priceInternational: 2.95,
    priceFrench: 2.95,
    features: ['Livraison progressive', 'Likes Premium', 'Garantie 30j'],
    delivery: '12-24h'
  },
  {
    id: '250',
    quantity: 250,
    priceInternational: 5.95,
    priceFrench: 5.95,
    features: ['Livraison sécurisée', 'Likes Premium', 'Garantie 30j'],
    delivery: '24-48h'
  },
  {
    id: '500',
    quantity: 500,
    priceInternational: 9.95,
    priceFrench: 9.95,
    features: ['Livraison sécurisée', 'Likes Premium', 'Garantie 30j', 'Support prioritaire'],
    delivery: '24-48h',
    popular: true
  },
  {
    id: '1000',
    quantity: 1000,
    priceInternational: 17.95,
    priceFrench: 17.95,
    features: ['Livraison progressive', 'Likes Premium', 'Garantie 30j', 'Remplacement gratuit'],
    delivery: '24-72h',
    popular: true
  },
  {
    id: '2500',
    quantity: 2500,
    priceInternational: 29.95,
    priceFrench: 29.95,
    features: ['Livraison sécurisée', 'Likes Premium', 'Garantie 30j', 'Support prioritaire'],
    delivery: '48-72h'
  },
  {
    id: '5000',
    quantity: 5000,
    priceInternational: 49.95,
    priceFrench: 49.95,
    features: ['Livraison naturelle', 'Likes Premium', 'Garantie 30j', 'Bonus engagement'],
    delivery: '5-7 jours'
  },
  {
    id: '10000',
    quantity: 10000,
    priceInternational: 69.95,
    priceFrench: 69.95,
    features: ['Livraison premium', 'Likes Premium', 'Garantie 30j', 'Manager dédié'],
    delivery: '7-10 jours'
  }
];

/**
 * Obtenir les packages selon le type de service
 */
export function getPackagesForService(serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_views' | 'tiktok_comments', followerType?: 'french' | 'international' | 'europe' | 'random' | 'custom'): PackageConfig[] {
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
      if (followerType === 'french') {
        return COMMENTS_PACKAGES_FRENCH;
      } else {
        return COMMENTS_PACKAGES_INTERNATIONAL;
      }
    case 'views':
      return VIEWS_PACKAGES;
    case 'tiktok_followers':
      return TIKTOK_FOLLOWERS_PACKAGES;
    case 'tiktok_likes':
      return TIKTOK_LIKES_PACKAGES;
    case 'tiktok_views':
      return TIKTOK_VIEWS_PACKAGES;
    case 'tiktok_comments':
      // Pour tiktok_comments, on utilise 'random' ou 'custom' au lieu de 'french'/'international'
      if (followerType === 'custom') {
        return TIKTOK_COMMENTS_CUSTOM_PACKAGES;
      } else {
        return TIKTOK_COMMENTS_RANDOM_PACKAGES; // 'random' par défaut
      }
    default:
      return FOLLOWERS_PACKAGES_INTERNATIONAL;
  }
}

/**
 * Obtenir le prix d'un package selon le type de follower
 */
export function getPackagePrice(packageId: string, serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_views' | 'tiktok_comments', followerType?: 'french' | 'international' | 'europe' | 'random' | 'custom'): number {
  // Retourner 0 immédiatement si packageId est vide
  if (!packageId) return 0;
  
  // Pour tiktok_followers, tiktok_likes et tiktok_views, on ignore le followerType car il n'y a qu'un seul type Premium
  // Pour tiktok_comments, on utilise 'random' ou 'custom' directement
  let packages: PackageConfig[];
  if (serviceType === 'tiktok_followers' || serviceType === 'tiktok_likes' || serviceType === 'tiktok_views') {
    packages = getPackagesForService(serviceType, undefined);
  } else if (serviceType === 'tiktok_comments') {
    // Pour tiktok_comments, on utilise 'random' ou 'custom'
    packages = getPackagesForService(serviceType, followerType as 'random' | 'custom' || 'random');
  } else {
    packages = getPackagesForService(serviceType, followerType);
  }
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
  
  // Pour tiktok_followers, tiktok_likes, tiktok_views et tiktok_comments, on utilise toujours priceInternational (même prix pour tous)
  let price: number;
  if (serviceType === 'tiktok_followers' || serviceType === 'tiktok_likes' || serviceType === 'tiktok_views' || serviceType === 'tiktok_comments') {
    price = pkg.priceInternational; // Prix unique pour Premium Followers/Likes/Views/Comments
  } else {
    price = followerType === 'french' ? pkg.priceFrench : pkg.priceInternational;
  }
  console.log('💰 Prix calculé:', { price, followerType, priceFrench: pkg.priceFrench, priceInternational: pkg.priceInternational });
  
  return price;
}

/**
 * Obtenir la quantité d'un package
 */
export function getPackageQuantity(packageId: string, serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_views' | 'tiktok_comments', followerType?: 'french' | 'international' | 'europe' | 'random' | 'custom'): number {
  // Retourner 0 immédiatement si packageId est vide
  if (!packageId) return 0;
  
  // Pour tiktok_comments, on doit passer le followerType pour obtenir les bons packages
  const packages = serviceType === 'tiktok_comments' && followerType 
    ? getPackagesForService(serviceType, followerType as 'random' | 'custom')
    : getPackagesForService(serviceType);
  const pkg = packages.find(p => p.id === packageId);
  
  return pkg ? pkg.quantity : 0;
}
