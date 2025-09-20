import React, { useState } from 'react';
import { Instagram, ShoppingCart, Zap } from 'lucide-react';
import FollowerTypeSelector from './components/FollowerTypeSelector';
import PackageSelector from './components/PackageSelector';
import GuaranteeSection from './components/GuaranteeSection';
import InstagramSearchModal from './components/InstagramSearchModal';
import CheckoutPage from './components/CheckoutPage';
import { CartProvider, useCart } from './contexts/CartContext';

function AppContent() {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const { addToCart, updateLastItemUsername } = useCart();

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
    
    // Ajouter au panier d'abord
    addToCart({
      followers: getPackageFollowers(selectedPackage),
      price: getPackagePrice(selectedPackage),
      followerType: followerType as 'french' | 'international'
    });
    
    // Ouvrir le modal de recherche
    setIsModalOpen(true);
  };

  const handleProfileSelect = (username: string, cartData: any) => {
    console.log('🎯 handleProfileSelect appelé avec:', username);
    
    setSelectedProfile(username);
    
    // Mettre à jour le dernier article du panier avec le nom d'utilisateur
    updateLastItemUsername(username);
    
    // Fermer le modal
    setIsModalOpen(false);
    
    // Rediriger vers le checkout immédiatement
    console.log('🚀 Redirection vers checkout...');
    setCurrentStep('checkout');
  };

  const handleCheckoutComplete = (orderData: any) => {
    alert(`Commande confirmée pour @${orderData.items[0].username} avec ${orderData.totalFollowers} followers à ${orderData.total.toFixed(2)}€`);
    setCurrentStep('selection');
    setSelectedPackage('');
    setSelectedProfile('');
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
  };

  if (currentStep === 'checkout') {
    return (
      <CheckoutPage 
        onBack={handleBackToSelection}
        onComplete={handleCheckoutComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Instagram className="w-8 h-8 text-pink-500 mr-3" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FollowBoost
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">🚀 Livraison rapide</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">🔒 100% Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Boostez votre Instagram
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Des followers réels et actifs pour faire grandir votre communauté
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              <span className="font-semibold">Livraison 24-72h</span>
            </div>
            <div className="flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2" />
              <span className="font-semibold">+50k clients satisfaits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FollowerTypeSelector
          selectedType={followerType}
          onTypeChange={setFollowerType}
        />

        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
          followerType={followerType}
        />

        <GuaranteeSection />

        {/* Purchase Section */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Résumé de votre commande
              </h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-700">
                    {getPackageFollowers(selectedPackage).toLocaleString()} followers {followerType === 'french' ? 'français' : 'internationaux'}
                  </span>
                  <span className="text-3xl font-bold text-blue-600">
                    {getPackagePrice(selectedPackage).toFixed(2)}€
                  </span>
                </div>
                
                <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Garantie 30 jours
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Livraison progressive
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Profils réels
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                <ShoppingCart className="w-6 h-6 inline mr-3" />
                Acheter maintenant
              </button>

              <p className="text-sm text-gray-500 mt-4">
                🔒 Paiement sécurisé • Aucun mot de passe requis • Livraison garantie
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Instagram className="w-8 h-8 text-pink-500 mr-3" />
            <span className="text-2xl font-bold">FollowBoost</span>
          </div>
          <p className="text-gray-400 mb-6">
            La plateforme de confiance pour booster votre présence sur Instagram
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>✓ Service client 24/7</span>
            <span>✓ Garantie satisfait ou remboursé</span>
            <span>✓ Plus de 50 000 clients</span>
          </div>
        </div>
      </footer>

      <InstagramSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProfile={handleProfileSelect}
        cartData={{
          followers: getPackageFollowers(selectedPackage),
          price: getPackagePrice(selectedPackage),
          followerType: followerType as 'french' | 'international'
        }}
      />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;