import React, { useState } from 'react';
import { Music, Star, Shield, Eye, Zap, ShoppingCart, X } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import TikTokViewsDeliveryModal from './TikTokViewsDeliveryModal';
import { useCart } from '../contexts/CartContext';
import { getPackagePrice } from '../config/packagesConfig';

export default function TikTokViewsPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const { addToCart } = useCart();

  const getPackagePriceLocal = (packageId: string) => {
    return getPackagePrice(packageId, 'tiktok_views', followerType as 'french' | 'international');
  };

  const getPackageViews = (packageId: string) => {
    return parseInt(packageId) || 0;
  };

  const validateTikTokUrl = (url: string): boolean => {
    // Validation des formats TikTok acceptés
    const tiktokPatterns = [
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/, // Format complet avec @username/video/ID
      /^https?:\/\/(www\.)?tiktok\.com\/t\/[\w]+/, // Format court avec /t/
      /^https?:\/\/(vm\.)?tiktok\.com\/[\w]+/, // Format vm.tiktok.com
      /^@[\w.-]+\/video\/\d+$/, // Format sans https
      /^tiktok\.com\/@[\w.-]+\/video\/\d+/ // Format sans https
    ];
    
    return tiktokPatterns.some(pattern => pattern.test(url.trim()));
  };

  const normalizeTikTokUrl = (url: string): string => {
    let normalizedUrl = url.trim();
    
    // Ajouter https:// si manquant
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Normaliser www.tiktok.com
    normalizedUrl = normalizedUrl.replace(/^https?:\/\/(www\.)?tiktok\.com/, 'https://www.tiktok.com');
    
    return normalizedUrl;
  };

  const handlePurchase = () => {
    if (!selectedPackage) {
      alert('Veuillez sélectionner un pack');
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = () => {
    console.log('🔍 handleConfirmPurchase appelé');
    console.log('🔍 tiktokUrl:', tiktokUrl);
    console.log('🔍 selectedPackage:', selectedPackage);
    
    if (!tiktokUrl.trim()) {
      alert('Veuillez entrer le lien de votre vidéo TikTok');
      return;
    }
    
    if (!validateTikTokUrl(tiktokUrl)) {
      alert('Format de lien TikTok invalide.\n\nFormats acceptés :\n• https://www.tiktok.com/@username/video/1234567890\n• https://tiktok.com/@username/video/1234567890\n• https://vm.tiktok.com/abc123\n• @username/video/1234567890');
      return;
    }
    
    console.log('✅ URL valide, fermeture modal confirmation et ouverture modal livraison');
    setIsModalOpen(false);
    setIsDeliveryModalOpen(true);
  };

  const handleDeliveryConfirm = (deliveryOption: any) => {
    console.log('🔍 handleDeliveryConfirm appelé');
    console.log('🔍 deliveryOption:', deliveryOption);
    console.log('🔍 selectedPackage:', selectedPackage);
    console.log('🔍 tiktokUrl:', tiktokUrl);
    
    const totalPrice = getPackagePriceLocal(selectedPackage) + deliveryOption.additionalCost;
    const normalizedUrl = normalizeTikTokUrl(tiktokUrl);
    
    const cartItem = {
      views: getPackageViews(selectedPackage),
      price: totalPrice,
      followerType: followerType as 'french' | 'international',
      platform: 'TikTok',
      username: normalizedUrl, // URL normalisée de la vidéo TikTok
      delivery: deliveryOption,
      // ✅ Paramètres de drip feed
      runs: deliveryOption.runs,
      interval: deliveryOption.interval
    };
    
    console.log('🔍 Item à ajouter au panier:', cartItem);
    
    addToCart(cartItem);
    
    console.log('✅ Item ajouté au panier, redirection vers /cart');
    
    // Redirection simple vers le panier - Vercel SPA routing va gérer
    window.location.href = '/cart';
  };

  const handleCheckoutComplete = (orderData: any) => {
    console.log('Commande TikTok Views terminée:', orderData);
    
    // Redirection vers la page d'accueil
    window.location.href = '/';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5 mr-2" />
              Retour
            </button>
            <div className="flex items-center text-white">
              <Music className="w-6 h-6 mr-2" />
              <span className="text-lg font-semibold">TikTok Views</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-full">
              <Eye className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Boostez vos <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Vues TikTok</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Augmentez la visibilité de vos vidéos TikTok avec des vues authentiques et engageantes
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <Star className="w-8 h-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Vues Réelles</h3>
            </div>
            <p className="text-blue-100">
              Des vues authentiques provenant d'utilisateurs réels pour une croissance naturelle
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Livraison Rapide</h3>
            </div>
            <p className="text-blue-100">
              Commencez à voir les résultats en quelques minutes après votre commande
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Sécurisé</h3>
            </div>
            <p className="text-blue-100">
              Service 100% sécurisé avec garantie de remboursement si non satisfait
            </p>
          </div>
        </div>

        {/* Main Content */}
         <div className="max-w-4xl mx-auto">
           {/* Follower Type Selector */}
           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
             <h2 className="text-2xl font-bold text-white mb-6">Type de Vues</h2>
             <FollowerTypeSelector
               selectedType={followerType}
               onTypeChange={setFollowerType}
               types={[
                 { id: 'international', label: 'Internationales', description: 'Prix standard' },
                 { id: 'french', label: 'Françaises', description: 'Prix x2' }
               ]}
             />
           </div>

           {/* Package Selection */}
           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
             <h2 className="text-2xl font-bold text-white mb-6">Choisissez votre Pack</h2>
             <PackageSelector
               selectedPackage={selectedPackage}
               onPackageChange={setSelectedPackage}
               followerType={followerType}
               isTikTokViews={true}
             />
           </div>

           {/* Résumé et Bouton d'ajout au panier */}
           {selectedPackage && (
             <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
               <div className="text-center">
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Résumé de votre commande</h3>
                 
                 <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                     <div>
                       <div className="text-3xl font-bold text-purple-600">
                         {getPackageViews(selectedPackage).toLocaleString()}
                       </div>
                       <div className="text-gray-600">Vues TikTok</div>
                     </div>
                     <div>
                       <div className="text-3xl font-bold text-pink-600">
                         {followerType === 'french' ? 'Françaises' : 'Internationales'}
                       </div>
                       <div className="text-gray-600">Type de vues</div>
                     </div>
                     <div>
                       <div className="text-3xl font-bold text-green-600">
                         {getPackagePriceLocal(selectedPackage).toFixed(2)}€
                       </div>
                       <div className="text-gray-600">Prix total</div>
                     </div>
                   </div>
                 </div>

                 <button
                   onClick={handlePurchase}
                   className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-2xl text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center mx-auto"
                 >
                   <Zap className="w-6 h-6 mr-3" />
                   Acheter maintenant
                 </button>
               </div>
             </div>
           )}

           {/* Section Garanties */}
           <div className="bg-white rounded-2xl shadow-xl p-8">
             <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
               Nos garanties TikTok
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="text-center">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Shield className="w-8 h-8 text-green-600" />
                 </div>
                 <h4 className="text-lg font-semibold text-gray-900 mb-2">Garantie 30 jours</h4>
                 <p className="text-gray-600">Remboursement intégral si non satisfait</p>
               </div>
               <div className="text-center">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Zap className="w-8 h-8 text-blue-600" />
                 </div>
                 <h4 className="text-lg font-semibold text-gray-900 mb-2">Livraison rapide</h4>
                 <p className="text-gray-600">Commencez à voir les résultats en quelques minutes</p>
               </div>
               <div className="text-center">
                 <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Star className="w-8 h-8 text-purple-600" />
                 </div>
                 <h4 className="text-lg font-semibold text-gray-900 mb-2">Vues réelles</h4>
                 <p className="text-gray-600">Toutes les vues proviennent de comptes TikTok authentiques</p>
               </div>
             </div>
           </div>
         </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmer votre commande</h3>
            
            {/* Résumé de la commande */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pack sélectionné :</span>
                  <span className="font-semibold">{getPackageViews(selectedPackage).toLocaleString()} vues {followerType === 'french' ? 'françaises' : 'internationales'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix :</span>
                  <span className="font-semibold">{getPackagePriceLocal(selectedPackage).toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Saisie de l'URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de votre vidéo TikTok *
              </label>
              <input
                type="text"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://tiktok.com/@username/video/1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="text-xs text-gray-500 mt-1">
                Formats acceptés : https://tiktok.com/@user/video/123 ou https://vm.tiktok.com/abc123
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {isDeliveryModalOpen && (
        <>
          {console.log('🔍 Rendu du modal de livraison TikTok Views')}
          <TikTokViewsDeliveryModal
            onClose={() => setIsDeliveryModalOpen(false)}
            onConfirm={handleDeliveryConfirm}
            basePrice={getPackagePriceLocal(selectedPackage)}
          />
        </>
      )}
    </div>
  );
}
