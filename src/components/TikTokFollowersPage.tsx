import React, { useState } from 'react';
import { Music, Star, Shield, Users2, Zap, ShoppingCart, X } from 'lucide-react';
import PackageSelector from './PackageSelector';
import TikTokDeliveryModal from './TikTokDeliveryModal';
import TikTokCheckoutPage from './TikTokCheckoutPage';
import { useCart } from '../contexts/CartContext';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';

export default function TikTokFollowersPage({ onBack }: { onBack: () => void }) {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const { addToCart } = useCart();

  const getPrice = (packageId: string) => {
    return getPackagePrice(packageId, 'tiktok_followers');
  };

  const getPackageFollowers = (packageId: string) => {
    return getPackageQuantity(packageId, 'tiktok_followers');
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
      alert('Veuillez entrer le lien de votre compte TikTok');
      return;
    }

    // Valider le format de l'URL TikTok
    const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com\/@|tiktok\.com\/user\/)([a-zA-Z0-9._]+)/;
    if (!tiktokRegex.test(tiktokUrl)) {
      alert('Veuillez entrer un lien TikTok valide (ex: https://tiktok.com/@username)');
      return;
    }

    // Fermer le modal de saisie et ouvrir le modal de livraison
    setIsModalOpen(false);
    setIsDeliveryModalOpen(true);
  };

  const handleDeliveryBack = () => {
    // Retourner à la modal précédente avec le lien TikTok pré-rempli
    setIsDeliveryModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDeliveryConfirm = (deliveryOption: any) => {
    const followersCount = getPackageFollowers(selectedPackage);
    const totalPrice = getPrice(selectedPackage) + deliveryOption.additionalCost;
    
    addToCart({
      followers: followersCount, // Quantité commandée (pas multipliée)
      price: totalPrice,
      followerType: 'premium' as any, // Premium Followers pour TikTok
      platform: 'TikTok',
      username: tiktokUrl,
      deliveryOption: {
        runs: deliveryOption.runs,
        interval: deliveryOption.interval,
        totalTime: deliveryOption.totalTime,
        additionalCost: deliveryOption.additionalCost
      }
    });
    
    // Rediriger vers la page de panier avec URL standard
    window.history.pushState({}, '', '/cart');
    setIsDeliveryModalOpen(false);
    setCurrentStep('checkout');
    setTiktokUrl('');
  };

  const handleOrderComplete = (orderData: any) => {
    console.log('✅ Commande TikTok terminée:', orderData);
    alert(`🎉 Commande TikTok confirmée !\n\n${orderData.totalFollowers.toLocaleString()} followers TikTok seront livrés selon vos options de livraison.\n\nCommande: ${orderData.orderId}`);
    setCurrentStep('selection');
  };

  // Si on est en mode checkout, afficher la page de checkout
  if (currentStep === 'checkout') {
    return (
      <TikTokCheckoutPage
        onBack={() => setCurrentStep('selection')}
        onComplete={handleOrderComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream font-rounded">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg mr-5">
                <Music className="w-9 h-9 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold text-slate-800 leading-tight">
                Followers TikTok
              </h1>
            </div>
            <p className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
              Des followers réels et actifs pour faire exploser votre communauté TikTok
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-base">
              <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                <Star className="w-5 h-5 text-warm-yellow-500" strokeWidth={1.5} />
                <span className="font-medium text-slate-700">4.8/5</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                <Users2 className="w-5 h-5 text-lavender-500" strokeWidth={1.5} />
                <span className="font-medium text-slate-700">Service pro</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                <Shield className="w-5 h-5 text-soft-pink-500" strokeWidth={1.5} />
                <span className="font-medium text-slate-700">100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        
        {/* Sélection du Package Premium Followers */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 text-slate-800">
            Premium Followers TikTok
          </h2>
          <p className="text-center text-slate-600 mb-10 text-lg">
            Choisissez votre package de followers premium
          </p>
          <PackageSelector 
            selectedPackage={selectedPackage}
            onPackageChange={setSelectedPackage}
            followerType="premium"
            isTikTokFollowers={true}
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
                      {getPackageFollowers(selectedPackage).toLocaleString()}
                    </div>
                    <div className="text-slate-600 mt-2 font-medium">Followers TikTok</div>
                  </div>
                  <div>
                    <div className="text-4xl font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">
                      Premium
                    </div>
                    <div className="text-slate-600 mt-2 font-medium">Type de followers</div>
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
                <Zap className="w-9 h-9 text-soft-pink-600" strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-3">Livraison Rapide</h4>
              <p className="text-slate-600 leading-relaxed">Followers livrés en 24-48h maximum</p>
            </div>
            <div className="text-center">
              <div className="w-18 h-18 bg-gradient-to-br from-warm-yellow-100 to-soft-orange-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                <Star className="w-9 h-9 text-soft-orange-600" strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-3">Garantie 30j</h4>
              <p className="text-slate-600 leading-relaxed">Remboursement si pas satisfait</p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal de saisie du lien TikTok */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-card shadow-soft-xl max-w-md w-full border border-soft-pink-200/50">
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
                    <span className="text-slate-600">Followers TikTok:</span>
                    <span className="font-semibold text-slate-800">{getPackageFollowers(selectedPackage).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-semibold text-slate-800">Premium Followers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Prix:</span>
                    <span className="font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">{getPrice(selectedPackage).toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="tiktok-url" className="block text-sm font-medium text-slate-700 mb-2">
                  Lien de votre compte TikTok *
                </label>
                <input
                  type="text"
                  id="tiktok-url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@votre_nom_utilisateur"
                  className="w-full px-4 py-3 border border-soft-pink-200/50 rounded-card-sm focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 text-slate-900 bg-white/80 backdrop-blur-sm transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Exemples: https://tiktok.com/@username ou tiktok.com/@username
                </p>
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
                  className="flex-1 bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white py-3 rounded-button font-semibold hover:shadow-soft-lg transition-all duration-300 shadow-soft"
                >
                  Confirmer l'achat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sélection de la durée de livraison */}
      <TikTokDeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onBack={handleDeliveryBack}
        onConfirm={handleDeliveryConfirm}
        followersCount={getPackageFollowers(selectedPackage)}
        followerType="premium" as any
        tiktokUrl={tiktokUrl}
        basePrice={getPrice(selectedPackage)}
      />

    </div>
  );
}
