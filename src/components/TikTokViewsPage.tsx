import React, { useState } from 'react';
import { Music, Star, Shield, Eye, Zap, ShoppingCart, X } from 'lucide-react';
import PackageSelector from './PackageSelector';
import TikTokViewsDeliveryModal from './TikTokViewsDeliveryModal';
import { useCart } from '../contexts/CartContext';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';

export default function TikTokViewsPage({ onBack }: { onBack: () => void }) {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const { addToCart } = useCart();

  const getPrice = (packageId: string) => {
    return getPackagePrice(packageId, 'tiktok_views');
  };

  const getPackageViews = (packageId: string) => {
    return getPackageQuantity(packageId, 'tiktok_views');
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
    
    const totalPrice = getPrice(selectedPackage) + deliveryOption.additionalCost;
    const normalizedUrl = normalizeTikTokUrl(tiktokUrl);
    
    const cartItem = {
      views: getPackageViews(selectedPackage),
      price: totalPrice,
      followerType: 'premium' as any, // Premium Vues pour TikTok
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
    <div className="min-h-screen bg-cream font-rounded">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg">
                <Eye className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-slate-800 mb-6 leading-tight">
              Boostez vos <span className="bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">Vues TikTok</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Augmentez la visibilité de vos vidéos TikTok avec des vues authentiques et engageantes
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-6 border border-soft-pink-200/50 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <Star className="w-8 h-8 text-warm-yellow-500 mr-3" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-slate-800">Vues Réelles</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Des vues authentiques provenant d'utilisateurs réels pour une croissance naturelle
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-6 border border-soft-pink-200/50 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-lavender-500 mr-3" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-slate-800">Livraison Rapide</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Commencez à voir les résultats en quelques minutes après votre commande
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-6 border border-soft-pink-200/50 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-soft-pink-500 mr-3" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-slate-800">Sécurisé</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Service 100% sécurisé avec garantie de remboursement si non satisfait
            </p>
          </div>
        </div>

        {/* Main Content */}
         <div className="max-w-4xl mx-auto">
           {/* Package Selection Premium Vues */}
           <div className="mb-20">
             <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 text-slate-800">Premium Vues TikTok</h2>
             <p className="text-slate-600 mb-10 text-center text-lg">
               Choisissez votre package de vues premium
             </p>
             <PackageSelector
               selectedPackage={selectedPackage}
               onPackageChange={setSelectedPackage}
               followerType="premium"
               isTikTokViews={true}
             />
           </div>

           {/* Résumé et Bouton d'ajout au panier */}
           {selectedPackage && (
             <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-xl p-10 border border-soft-pink-200/50 mb-16">
               <div className="text-center">
                 <h3 className="text-3xl font-semibold text-slate-800 mb-8">Résumé de votre commande</h3>
                 
                 <div className="bg-gradient-to-br from-soft-pink-50 via-peach-50 to-lavender-50 rounded-card-sm p-8 mb-8 border border-soft-pink-200/50">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                     <div>
                       <div className="text-4xl font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">
                         {getPackageViews(selectedPackage).toLocaleString()}
                       </div>
                       <div className="text-slate-600 mt-2 font-medium">Vues TikTok</div>
                     </div>
                     <div>
                       <div className="text-4xl font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">
                         Premium
                       </div>
                       <div className="text-slate-600 mt-2 font-medium">Type de vues</div>
                     </div>
                     <div>
                       <div className="text-4xl font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">
                         {getPrice(selectedPackage).toFixed(2)}€
                       </div>
                       <div className="text-slate-600 mt-2 font-medium">Prix total</div>
                     </div>
                   </div>
                 </div>

                 <button
                   onClick={handlePurchase}
                   className="bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 hover:shadow-soft-xl hover:scale-105 text-white px-14 py-5 rounded-button text-xl font-semibold transition-all duration-300 shadow-soft-lg flex items-center mx-auto"
                 >
                   <Zap className="w-6 h-6 mr-3" strokeWidth={2} />
                   Acheter maintenant
                 </button>
               </div>
             </div>
           )}

           {/* Section Garanties */}
           <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-xl p-10 border border-soft-pink-200/50">
             <h3 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-slate-800">
               Nos garanties TikTok
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="text-center">
                 <div className="w-18 h-18 bg-gradient-to-br from-lavender-100 to-baby-purple-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                   <Shield className="w-9 h-9 text-lavender-600" strokeWidth={1.5} />
                 </div>
                 <h4 className="text-xl font-semibold text-slate-800 mb-3">Garantie 30 jours</h4>
                 <p className="text-slate-600 leading-relaxed">Remboursement intégral si non satisfait</p>
               </div>
               <div className="text-center">
                 <div className="w-18 h-18 bg-gradient-to-br from-soft-pink-100 to-peach-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                   <Zap className="w-9 h-9 text-soft-pink-600" strokeWidth={1.5} />
                 </div>
                 <h4 className="text-xl font-semibold text-slate-800 mb-3">Livraison rapide</h4>
                 <p className="text-slate-600 leading-relaxed">Commencez à voir les résultats en quelques minutes</p>
               </div>
               <div className="text-center">
                 <div className="w-18 h-18 bg-gradient-to-br from-warm-yellow-100 to-soft-orange-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                   <Star className="w-9 h-9 text-soft-orange-600" strokeWidth={1.5} />
                 </div>
                 <h4 className="text-xl font-semibold text-slate-800 mb-3">Vues Réelles</h4>
                 <p className="text-slate-600 leading-relaxed">Toutes les vues proviennent de comptes actifs</p>
               </div>
             </div>
           </div>
         </div>
      </div>

      {/* Modal de confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-card shadow-soft-xl max-w-lg w-full border border-soft-pink-200/50 p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Confirmer votre commande</h3>
            
            {/* Résumé de la commande */}
            <div className="bg-gradient-to-br from-soft-pink-50/50 via-peach-50/50 to-lavender-50/50 rounded-card-sm p-4 mb-6 border border-soft-pink-200/50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Pack sélectionné :</span>
                  <span className="font-semibold text-slate-800">{getPackageViews(selectedPackage).toLocaleString()} vues Premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Prix :</span>
                  <span className="font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">{getPrice(selectedPackage).toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Saisie de l'URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL de votre vidéo TikTok *
              </label>
              <input
                type="text"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://tiktok.com/@username/video/1234567890"
                className="w-full px-4 py-3 border border-soft-pink-200/50 rounded-card-sm focus:outline-none focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 bg-white/80 backdrop-blur-sm transition-all text-slate-900"
              />
              <div className="text-xs text-slate-500 mt-2">
                Formats acceptés : https://tiktok.com/@user/video/123 ou https://vm.tiktok.com/abc123
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 border border-soft-pink-200/50 text-slate-700 rounded-button hover:bg-soft-pink-50/50 transition-all font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white rounded-button hover:shadow-soft-lg transition-all duration-300 shadow-soft font-semibold"
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
            basePrice={getPrice(selectedPackage)}
            viewsCount={getPackageViews(selectedPackage)}
            followerType="premium" as any
            tiktokUrl={tiktokUrl}
          />
        </>
      )}
    </div>
  );
}
