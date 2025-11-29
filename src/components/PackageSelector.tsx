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
  isTikTokFollowers?: boolean;
  isTikTokLikes?: boolean;
}

export default function PackageSelector({ selectedPackage, onPackageChange, followerType, isLikes = false, isComments = false, isViews = false, isTikTokViews = false, isTikTokComments = false, isTikTokFollowers = false, isTikTokLikes = false }: Props) {
  // Déterminer le type de service
  const serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_views' | 'tiktok_comments' = isTikTokLikes ? 'tiktok_likes' : isTikTokFollowers ? 'tiktok_followers' : isTikTokComments ? 'tiktok_comments' : isTikTokViews ? 'tiktok_views' : isViews ? 'views' : isComments ? 'comments' : isLikes ? 'likes' : 'followers';
  
  // Obtenir les packages depuis la configuration centralisée
  // Pour tiktok_followers, tiktok_likes et tiktok_views, on ignore le followerType car il n'y a qu'un seul type Premium
  // Pour tiktok_comments, on utilise 'random' ou 'custom' directement
  let packagesConfig: PackageConfig[];
  if (isTikTokFollowers || isTikTokLikes || isTikTokViews) {
    packagesConfig = getPackagesForService(serviceType, undefined);
  } else if (isTikTokComments) {
    packagesConfig = getPackagesForService(serviceType, followerType as 'random' | 'custom' || 'random');
  } else {
    packagesConfig = getPackagesForService(serviceType, followerType as 'french' | 'international' | 'europe');
  }
  
  // Convertir les packages de configuration en packages d'interface
  const packages: Package[] = packagesConfig.map(pkg => ({
    id: pkg.id,
    followers: pkg.quantity,
    price: (isTikTokFollowers || isTikTokLikes || isTikTokViews || isTikTokComments) ? pkg.priceInternational : (followerType === 'french' ? pkg.priceFrench : pkg.priceInternational),
    popular: pkg.popular,
    features: pkg.features,
    delivery: pkg.delivery,
    icon: <Shield className="w-5 h-5" strokeWidth={1.5} /> // Icône par défaut, peut être personnalisée
  }));

  return (
    <div className="mb-12">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-8 text-center">
        Sélectionnez votre pack
      </h2>
      
      {/* Grille compacte 4x2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            className={`relative p-4 rounded-card-sm border cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedPackage === pkg.id
                ? 'border-soft-pink-300 bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 text-white shadow-soft-xl'
                : 'border-soft-pink-200/50 bg-white/80 backdrop-blur-sm hover:border-soft-pink-300/50 hover:shadow-soft-lg'
            } ${pkg.popular ? 'ring-2 ring-warm-yellow-300/50' : ''}`}
            onClick={() => onPackageChange(pkg.id)}
          >
            {/* Badge populaire compact */}
            {pkg.popular && (
              <div className="absolute -top-2 -right-2">
                <span className="bg-gradient-to-br from-warm-yellow-400 to-soft-orange-400 text-white px-2 py-1 rounded-pill text-xs font-bold shadow-soft">
                  ★
                </span>
              </div>
            )}
            
            {/* Contenu compact */}
            <div className="text-center">
              <div className={`text-base font-semibold mb-1 ${
                selectedPackage === pkg.id ? 'text-white' : 'text-slate-800'
              }`}>
                {pkg.followers.toLocaleString()}
              </div>
              <div className={`text-xs mb-2 ${
                selectedPackage === pkg.id ? 'text-white/90' : 'text-slate-600'
              }`}>
                {isViews ? 'Vues' : isTikTokViews ? 'Vues' : isLikes ? 'Likes' : isTikTokLikes ? 'Likes' : isComments ? 'Commentaires' : isTikTokComments ? 'Commentaires' : isTikTokFollowers ? 'Followers' : 'Followers'}
              </div>
              <div className={`text-sm font-semibold ${
                selectedPackage === pkg.id 
                  ? 'text-white' 
                  : 'bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent'
              }`}>
                {pkg.price.toFixed(2)}€
              </div>
            </div>

            {/* Indicateur de sélection */}
            {selectedPackage === pkg.id && (
              <div className="absolute top-2 right-2">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-soft">
                  <Check className="w-3 h-3 text-soft-pink-500" strokeWidth={2.5} />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
    </div>
  );
}