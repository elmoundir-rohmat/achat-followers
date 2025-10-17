import React from 'react';
import { Check, Zap, Shield, Clock } from 'lucide-react';
import { getPackagesForService, PackageConfig } from '../config/packagesConfig';

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
  isComments?: boolean;
  isViews?: boolean;
  isTikTokViews?: boolean;
  isTikTokComments?: boolean;
}

export default function PackageSelector({ selectedPackage, onPackageChange, followerType, isLikes = false, isComments = false, isViews = false, isTikTokViews = false, isTikTokComments = false }: Props) {
  // Déterminer le type de service
  const serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_views' | 'tiktok_comments' = isTikTokComments ? 'tiktok_comments' : isTikTokViews ? 'tiktok_views' : isViews ? 'views' : isComments ? 'comments' : isLikes ? 'likes' : 'followers';
  
  // Obtenir les packages depuis la configuration centralisée
  const packagesConfig = getPackagesForService(serviceType);
  
  // Convertir les packages de configuration en packages d'interface
  const packages: Package[] = packagesConfig.map(pkg => ({
    id: pkg.id,
    followers: pkg.quantity,
    price: followerType === 'french' ? pkg.priceFrench : pkg.priceInternational,
    popular: pkg.popular,
    features: pkg.features,
    delivery: pkg.delivery,
    icon: <Shield className="w-5 h-5" /> // Icône par défaut, peut être personnalisée
  }));

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
                {isViews ? 'Vues' : isLikes ? 'Likes' : isComments ? 'Commentaires' : 'Followers'}
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