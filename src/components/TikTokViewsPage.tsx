import React, { useState } from 'react';
import { Music, Star, Shield, Eye, Zap, ShoppingCart, X } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import TikTokViewsDeliveryModal from './TikTokViewsDeliveryModal';
import { useCart } from '../contexts/CartContext';

export default function TikTokViewsPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const { addToCart } = useCart();

  const getPackagePrice = (packageId: string) => {
    const internationalPrices: Record<string, number> = {
      '100': 0.99,
      '250': 1.95,
      '1000': 2.95,
      '5000': 9.95,
      '10000': 14.94,
      '25000': 29.95,
      '50000': 49.95,
      '250000': 99.00
    };
    const basePrice = internationalPrices[packageId] || 0;
    return followerType === 'french' ? (basePrice * 2) : basePrice;
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
    if (!tiktokUrl.trim()) {
      alert('Veuillez entrer le lien de votre vidéo TikTok');
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
    const totalPrice = getPackagePrice(selectedPackage) + deliveryOption.additionalCost;
    const normalizedUrl = normalizeTikTokUrl(tiktokUrl);
    
    addToCart({
      views: getPackageViews(selectedPackage),
      price: totalPrice,
      followerType: followerType as 'french' | 'international',
      platform: 'TikTok',
      username: normalizedUrl, // URL normalisée de la vidéo TikTok
      delivery: deliveryOption,
      // ✅ Paramètres de drip feed
      runs: deliveryOption.runs,
      interval: deliveryOption.interval
    });
    
    // Redirection simple vers le panier - Vercel SPA routing va gérer
    window.location.href = '/cart';
  };

  const handleCheckoutComplete = (orderData: any) => {
    console.log('Commande TikTok Views terminée:', orderData);
    
    // Redirection vers la page d'accueil
    window.location.href = '/';
  };

  const packages = [
    { id: '100', label: '100 vues', price: getPackagePrice('100') },
    { id: '250', label: '250 vues', price: getPackagePrice('250') },
    { id: '1000', label: '1,000 vues', price: getPackagePrice('1000') },
    { id: '5000', label: '5,000 vues', price: getPackagePrice('5000') },
    { id: '10000', label: '10,000 vues', price: getPackagePrice('10000') },
    { id: '25000', label: '25,000 vues', price: getPackagePrice('25000') },
    { id: '50000', label: '50,000 vues', price: getPackagePrice('50000') },
    { id: '250000', label: '250,000 vues', price: getPackagePrice('250000') }
  ];

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
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Package Selection */}
          <div className="space-y-8">
            {/* Follower Type Selector */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Choisissez votre Pack</h2>
              <PackageSelector
                packages={packages}
                selectedPackage={selectedPackage}
                onPackageSelect={setSelectedPackage}
              />
            </div>
          </div>

          {/* Right Column - URL Input */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Lien de votre Vidéo</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    URL de la vidéo TikTok
                  </label>
                  <input
                    type="text"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    placeholder="https://tiktok.com/@username/video/1234567890"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-2">Formats acceptés :</p>
                  <ul className="space-y-1 text-xs">
                    <li>• https://tiktok.com/@username/video/1234567890</li>
                    <li>• https://vm.tiktok.com/abc123</li>
                    <li>• @username/video/1234567890</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Prêt à booster vos vues ?</h3>
                <p className="text-purple-100 mb-6">
                  {selectedPackage ? `${getPackageViews(selectedPackage).toLocaleString()} vues ${followerType === 'french' ? 'françaises' : 'internationales'} - ${getPackagePrice(selectedPackage).toFixed(2)}€` : 'Sélectionnez un pack'}
                </p>
                <button
                  onClick={handlePurchase}
                  disabled={!selectedPackage}
                  className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Acheter maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmer votre commande</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Pack sélectionné :</span>
                <span className="font-semibold">{getPackageViews(selectedPackage).toLocaleString()} vues {followerType === 'french' ? 'françaises' : 'internationales'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prix :</span>
                <span className="font-semibold">{getPackagePrice(selectedPackage).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">URL vidéo :</span>
                <span className="font-semibold text-sm break-all">{tiktokUrl || 'Non spécifiée'}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {isDeliveryModalOpen && (
        <TikTokViewsDeliveryModal
          onClose={() => setIsDeliveryModalOpen(false)}
          onConfirm={handleDeliveryConfirm}
          basePrice={getPackagePrice(selectedPackage)}
        />
      )}
    </div>
  );
}
