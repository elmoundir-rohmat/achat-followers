import React, { useState } from 'react';
import { Music, Star, Shield, Users2, Zap, ShoppingCart, X } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import TikTokDeliveryModal from './TikTokDeliveryModal';
import TikTokCheckoutPage from './TikTokCheckoutPage';
import { useCart } from '../contexts/CartContext';

export default function TikTokFollowersPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const { addToCart } = useCart();

  const getPackagePrice = (packageId: string) => {
    const internationalPrices: Record<string, number> = {
      '25': 0.99,
      '100': 2.95,
      '250': 6.95,
      '500': 8.95,
      '1000': 14.95,
      '5000': 49.95,
      '10000': 97,
      '25000': 229
    };
    const basePrice = internationalPrices[packageId] || 0;
    return followerType === 'french' ? (basePrice * 2) : basePrice;
  };

  const getPackageFollowers = (packageId: string) => {
    return parseInt(packageId) || 0;
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
    const totalPrice = getPackagePrice(selectedPackage) + deliveryOption.additionalCost;
    
    addToCart({
      followers: followersCount, // Quantité commandée (pas multipliée)
      price: totalPrice,
      followerType: followerType as 'french' | 'international',
      platform: 'TikTok',
      username: tiktokUrl,
      deliveryOption: {
        runs: deliveryOption.runs,
        interval: deliveryOption.interval,
        totalTime: deliveryOption.totalTime,
        additionalCost: deliveryOption.additionalCost
      }
    });
    
    // Passer à la page de checkout
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
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-600 via-red-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Music className="w-16 h-16 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold">
                Followers TikTok
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Des followers réels et actifs pour faire exploser votre communauté TikTok
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-yellow-400 mr-2" />
                <span>4.8/5</span>
              </div>
              <div className="flex items-center">
                <Users2 className="w-6 h-6 mr-2" />
                <span>Service pro</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                <span>100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Type de Followers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Choisissez votre type de followers
          </h2>
          <FollowerTypeSelector 
            selectedType={followerType} 
            onTypeChange={setFollowerType}
          />
        </div>

        {/* Sélection du Package */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Sélectionnez votre package
          </h2>
          <PackageSelector 
            selectedPackage={selectedPackage}
            onPackageChange={setSelectedPackage}
            followerType={followerType}
          />
        </div>

        {/* Résumé et Bouton d'ajout au panier */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Résumé de votre commande</h3>
              
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-pink-600">
                      {getPackageFollowers(selectedPackage).toLocaleString()}
                    </div>
                    <div className="text-gray-600">Followers TikTok</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {followerType === 'french' ? 'Français' : 'Internationaux'}
                    </div>
                    <div className="text-gray-600">Type de followers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {getPackagePrice(selectedPackage).toFixed(2)}€
                    </div>
                    <div className="text-gray-600">Prix total</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-12 py-4 rounded-2xl text-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center mx-auto"
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
              <h4 className="text-lg font-semibold text-gray-900 mb-2">100% Sécurisé</h4>
              <p className="text-gray-600">Aucun risque pour votre compte TikTok</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Livraison Rapide</h4>
              <p className="text-gray-600">Followers livrés en 24-48h maximum</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Garantie 30j</h4>
              <p className="text-gray-600">Remboursement si pas satisfait</p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal de saisie du lien TikTok */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Music className="w-6 h-6 mr-3" />
                  <h2 className="text-xl font-bold">Confirmer votre commande</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Résumé de votre commande
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Followers TikTok:</span>
                    <span className="font-semibold text-gray-900">{getPackageFollowers(selectedPackage).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-900">{followerType === 'french' ? 'Français' : 'Internationaux'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix:</span>
                    <span className="font-semibold text-green-600">{getPackagePrice(selectedPackage).toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="tiktok-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Lien de votre compte TikTok *
                </label>
                <input
                  type="text"
                  id="tiktok-url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@votre_nom_utilisateur"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Exemples: https://tiktok.com/@username ou tiktok.com/@username
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
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
        followerType={followerType as 'french' | 'international'}
        tiktokUrl={tiktokUrl}
        basePrice={getPackagePrice(selectedPackage)}
      />

    </div>
  );
}
