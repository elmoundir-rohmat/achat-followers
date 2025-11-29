import React, { useState } from 'react';
import { Music, Star, Shield, Heart, Zap, ShoppingCart, X } from 'lucide-react';
import PackageSelector from './PackageSelector';
import TikTokLikesDeliveryModal from './TikTokLikesDeliveryModal';
// TikTokLikesCheckoutPage supprimé - utilisation du CheckoutPage unifié
import { useCart } from '../contexts/CartContext';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';

export default function TikTokLikesPage({ onBack }: { onBack: () => void }) {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const { addToCart } = useCart();

  const getPrice = (packageId: string) => {
    return getPackagePrice(packageId, 'tiktok_likes');
  };

  const getPackageLikes = (packageId: string) => {
    return getPackageQuantity(packageId, 'tiktok_likes');
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
    if (!tiktokUrl.trim()) {
      alert('Veuillez entrer le lien de votre post TikTok');
      return;
    }
    
    if (!validateTikTokUrl(tiktokUrl)) {
      alert('Format de lien TikTok invalide.\n\nFormats acceptés :\n• https://www.tiktok.com/@username/video/1234567890\n• https://tiktok.com/@username/video/1234567890\n• https://vm.tiktok.com/abc123\n• @username/video/1234567890');
      return;
    }
    
    setIsModalOpen(false);
    setIsDeliveryModalOpen(true);
  };

  const handleDeliveryConfirm = (deliveryOption: any) => {
    const totalPrice = getPrice(selectedPackage) + deliveryOption.additionalCost;
    const normalizedUrl = normalizeTikTokUrl(tiktokUrl);
    
    addToCart({
      likes: getPackageLikes(selectedPackage),
      price: totalPrice,
      followerType: 'premium' as any, // Premium Likes pour TikTok
      platform: 'TikTok', // ✅ Utiliser 'TikTok' (pas 'tiktok')
      username: normalizedUrl, // ✅ Utiliser 'username' (pas 'url')
      delivery: deliveryOption
    });
    
    // Redirection simple vers le panier - Vercel SPA routing va gérer
    window.location.href = '/cart';
  };

  const handleCheckoutComplete = (orderData: any) => {
    console.log('Commande TikTok Likes terminée:', orderData);
    
    // Afficher un message de succès comme Instagram Likes
    const totalLikes = orderData.totalLikes || orderData.items.reduce((sum: number, item: any) => sum + (item.likes || 0), 0);
    const totalPrice = orderData.total || orderData.items.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
    
    alert(`Commande TikTok Likes confirmée !\n\n` +
          `✅ ${totalLikes.toLocaleString()} likes TikTok\n` +
          `💰 Prix total: ${totalPrice.toFixed(2)}€\n` +
          `📧 Email: ${orderData.customer?.email || 'N/A'}\n` +
          `🆔 ID commande: ${orderData.orderId}\n\n` +
          `Votre commande a été envoyée au fournisseur et sera traitée dans les plus brefs délais.`);
    
    // Retourner à la page de sélection
    setCurrentStep('selection');
    setTiktokUrl('');
    setSelectedPackage('');
  };

  // Le checkout est maintenant géré par l'App.tsx via /cart

  return (
    <div className="min-h-screen bg-cream font-rounded">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg">
                <Heart className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-slate-800 mb-6 leading-tight">
              TikTok <span className="bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">Likes</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Boostez vos likes TikTok avec nos services premium. 
              Obtenez des likes réels et durables pour maximiser votre visibilité.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-6 border border-soft-pink-200/50 shadow-soft-lg">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-8 h-8 text-warm-yellow-500" strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-semibold text-slate-800 mb-2">99.9%</div>
                <div className="text-slate-600 font-medium">Taux de réussite</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-6 border border-soft-pink-200/50 shadow-soft-lg">
                <div className="flex items-center justify-center mb-3">
                  <Shield className="w-8 h-8 text-soft-pink-500" strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-semibold text-slate-800 mb-2">100%</div>
                <div className="text-slate-600 font-medium">Sécurisé</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-6 border border-soft-pink-200/50 shadow-soft-lg">
                <div className="flex items-center justify-center mb-3">
                  <Zap className="w-8 h-8 text-lavender-500" strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-semibold text-slate-800 mb-2">24/7</div>
                <div className="text-slate-600 font-medium">Support client</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        
        {/* Sélection du Package Premium Likes */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 text-slate-800">
            Premium Likes TikTok
          </h2>
          <p className="text-center text-slate-600 mb-10 text-lg">
            Choisissez votre package de likes premium
          </p>
          <PackageSelector 
            selectedPackage={selectedPackage}
            onPackageChange={setSelectedPackage}
            followerType="premium"
            isTikTokLikes={true}
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
                      {getPackageLikes(selectedPackage).toLocaleString()}
                    </div>
                    <div className="text-slate-600 mt-2 font-medium">Likes TikTok</div>
                  </div>
                  <div>
                    <div className="text-4xl font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">
                      Premium
                    </div>
                    <div className="text-slate-600 mt-2 font-medium">Type de likes</div>
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
              <h4 className="text-xl font-semibold text-slate-800 mb-3">100% Sécurisé</h4>
              <p className="text-slate-600 leading-relaxed">Aucun risque pour votre compte TikTok</p>
            </div>
            <div className="text-center">
              <div className="w-18 h-18 bg-gradient-to-br from-soft-pink-100 to-peach-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                <Star className="w-9 h-9 text-soft-pink-600" strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-3">Likes Réels</h4>
              <p className="text-slate-600 leading-relaxed">Tous les likes proviennent de comptes actifs</p>
            </div>
            <div className="text-center">
              <div className="w-18 h-18 bg-gradient-to-br from-warm-yellow-100 to-soft-orange-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                <Zap className="w-9 h-9 text-soft-orange-600" strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-3">Livraison Rapide</h4>
              <p className="text-slate-600 leading-relaxed">Recevez vos likes en quelques minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-card shadow-soft-xl max-w-lg w-full border border-soft-pink-200/50">
            {/* Header */}
            <div className="bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white p-6 rounded-t-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Music className="w-6 h-6" strokeWidth={1.5} />
                  <h2 className="text-xl font-semibold">Confirmer votre commande</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Résumé de votre commande
                </h3>
                <div className="bg-gradient-to-br from-soft-pink-50/50 via-peach-50/50 to-lavender-50/50 rounded-card-sm p-4 space-y-2 border border-soft-pink-200/50">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Likes TikTok:</span>
                    <span className="font-semibold text-slate-800">{getPackageLikes(selectedPackage).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-semibold text-slate-800">Premium Likes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Prix:</span>
                    <span className="font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">{getPrice(selectedPackage).toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="tiktok-url" className="block text-sm font-medium text-slate-700 mb-2">
                  Lien de votre post TikTok *
                </label>
                <input
                  type="text"
                  id="tiktok-url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@username/video/1234567890"
                  className="w-full px-4 py-3 border border-soft-pink-200/50 rounded-card-sm focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 text-slate-900 bg-white/80 backdrop-blur-sm transition-all"
                />
                <div className="text-xs text-slate-500 mt-2">
                  <p className="font-medium mb-1">Formats acceptés :</p>
                  <p>• https://www.tiktok.com/@username/video/1234567890</p>
                  <p>• https://tiktok.com/@username/video/1234567890</p>
                  <p>• https://vm.tiktok.com/abc123</p>
                  <p>• @username/video/1234567890</p>
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
                  disabled={!tiktokUrl.trim()}
                  className="flex-1 bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white py-3 rounded-button font-semibold hover:shadow-soft-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-soft"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de livraison */}
      <TikTokLikesDeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onBack={() => {
          setIsDeliveryModalOpen(false);
          setIsModalOpen(true);
        }}
        onConfirm={handleDeliveryConfirm}
        likesCount={getPackageLikes(selectedPackage)}
        followerType="premium" as any
        tiktokUrl={tiktokUrl}
        basePrice={getPrice(selectedPackage)}
      />
    </div>
  );
}
