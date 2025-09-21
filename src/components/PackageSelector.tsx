import React from 'react';
import { Check, Zap, Shield, Clock } from 'lucide-react';

interface Package {
  id: string;
  followers: number;
  price: number;
  popular?: boolean;
  features: string[];
  delivery: string;
  icon: React.ReactNode;
}

interface Props {
  selectedPackage: string;
  onPackageChange: (packageId: string) => void;
  followerType: string;
  isLikes?: boolean;
}

export default function PackageSelector({ selectedPackage, onPackageChange, followerType, isLikes = false }: Props) {
  const getPrice = (basePrice: number) => {
    // Pour les likes, les prix sont généralement moins chers
    const adjustedPrice = isLikes ? basePrice * 0.5 : basePrice;
    return followerType === 'french' ? Math.round(adjustedPrice * 1.3) : adjustedPrice;
  };

  const packages: Package[] = [
    {
      id: '25',
      followers: 25,
      price: followerType === 'french' ? (0.99 * 2) : 0.99,
      features: ['Livraison rapide', 'Profils réels', 'Garantie 30j'],
      delivery: '6-12h',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: '100',
      followers: 100,
      price: followerType === 'french' ? (2.95 * 2) : 2.95,
      features: ['Livraison progressive', 'Profils actifs', 'Garantie 30j'],
      delivery: '12-24h',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: '250',
      followers: 250,
      price: followerType === 'french' ? (6.95 * 2) : 6.95,
      features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j'],
      delivery: '24-48h',
      icon: <Check className="w-5 h-5" />
    },
    {
      id: '500',
      followers: 500,
      price: followerType === 'french' ? (8.95 * 2) : 8.95,
      popular: true,
      features: ['Livraison sécurisée', 'Engagement naturel', 'Garantie 30j', 'Support prioritaire'],
      delivery: '24-48h',
      icon: <Check className="w-5 h-5" />
    },
    {
      id: '1000',
      followers: 1000,
      price: followerType === 'french' ? (14.95 * 2) : 14.95,
      popular: true,
      features: ['Livraison progressive', 'Profils premium', 'Garantie 30j', 'Remplacement gratuit'],
      delivery: '24-72h',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: '5000',
      followers: 5000,
      price: followerType === 'french' ? (49.95 * 2) : 49.95,
      features: ['Livraison naturelle', 'Profils vérifiés', 'Garantie 30j', 'Bonus engagement'],
      delivery: '5-7 jours',
      icon: <Check className="w-5 h-5" />
    },
    {
      id: '10000',
      followers: 10000,
      price: followerType === 'french' ? Math.round(97 * 2) : 97,
      features: ['Livraison premium', 'Qualité maximale', 'Garantie 30j', 'Manager dédié'],
      delivery: '7-10 jours',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: '25000',
      followers: 25000,
      price: followerType === 'french' ? Math.round(229 * 2) : 229,
      features: ['Livraison VIP', 'Profils haut de gamme', 'Garantie 30j', 'Service personnalisé'],
      delivery: '10-15 jours',
      icon: <Zap className="w-5 h-5" />
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-black mb-6 text-center">
        Sélectionnez votre pack
      </h2>
      
      {/* Grille compacte 4x2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedPackage === pkg.id
                ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            } ${pkg.popular ? 'ring-1 ring-orange-400' : ''}`}
            onClick={() => onPackageChange(pkg.id)}
          >
            {/* Badge populaire compact */}
            {pkg.popular && (
              <div className="absolute -top-1 -right-1">
                <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                  ★
                </span>
              </div>
            )}
            
            {/* Contenu compact */}
            <div className="text-center">
              <div className="text-sm font-bold mb-1 text-black">
                {pkg.followers.toLocaleString()}
              </div>
              <div className="text-xs opacity-75 text-black">
                {isLikes ? 'Likes' : 'Followers'}
              </div>
              <div className={`text-sm font-bold mt-1 ${
                selectedPackage === pkg.id ? 'text-white' : 'text-blue-600'
              }`}>
                {pkg.price.toFixed(2)}€
              </div>
            </div>

            {/* Indicateur de sélection */}
            {selectedPackage === pkg.id && (
              <div className="absolute top-1 right-1">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-blue-500" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
    </div>
  );
}