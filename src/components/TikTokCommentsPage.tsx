import React, { useState } from 'react';
import { MessageCircle, Star, Shield, Heart, Zap, ShoppingCart, X } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import TikTokLikesDeliveryModal from './TikTokLikesDeliveryModal';
import { useCart } from '../contexts/CartContext';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';

export default function TikTokCommentsPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const { addToCart } = useCart();

  const getPackagePrice = (packageId: string) => {
    const internationalPrices: Record<string, number> = {
      '10': 3.95,
      '25': 8.95,
      '50': 11.95,
      '100': 19.95,
      '250': 49.95,
      '500': 84.95,
      '1000': 149.00
    };
    const basePrice = internationalPrices[packageId] || 0;
    return followerType === 'french' ? (basePrice * 2) : basePrice;
  };

  const getPackageComments = (packageId: string) => {
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
    const totalPrice = getPackagePrice(selectedPackage) + deliveryOption.additionalCost;
    const normalizedUrl = normalizeTikTokUrl(tiktokUrl);
    
    // ✅ DEBUG : Vérifier les valeurs avant ajout au panier
    const commentsQuantity = getPackageComments(selectedPackage);
    console.log('🔍 DEBUG TikTokCommentsPage - selectedPackage:', selectedPackage);
    console.log('🔍 DEBUG TikTokCommentsPage - commentsQuantity:', commentsQuantity);
    console.log('🔍 DEBUG TikTokCommentsPage - followerType:', followerType);
    console.log('🔍 DEBUG TikTokCommentsPage - normalizedUrl:', normalizedUrl);
    
    const cartItem = {
      followers: 0, // ✅ Ajouter la propriété followers requise
      comments: commentsQuantity,
      price: totalPrice,
      followerType: followerType as 'french' | 'international',
      platform: 'TikTok',
      username: normalizedUrl,
      delivery: deliveryOption
    };
    
    console.log('🔍 DEBUG TikTokCommentsPage - cartItem à ajouter:', cartItem);
    
    addToCart(cartItem);
    
    // Redirection simple vers le panier - Vercel SPA routing va gérer
    window.location.href = '/cart';
  };

  const handleCheckoutComplete = (orderData: any) => {
    console.log('Commande TikTok Comments terminée:', orderData);
    
    // Afficher un message de succès
    const totalComments = orderData.totalComments || orderData.items.reduce((sum: number, item: any) => sum + (item.comments || 0), 0);
    const totalPrice = orderData.total || orderData.items.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
    
    alert(`Commande TikTok Comments confirmée !\n\n` +
          `✅ ${totalComments.toLocaleString()} commentaires TikTok\n` +
          `💰 Prix total: ${totalPrice.toFixed(2)}€\n` +
          `📧 Email: ${orderData.customer?.email || 'N/A'}\n` +
          `🆔 ID commande: ${orderData.orderId}\n\n` +
          `Votre commande a été envoyée au fournisseur et sera traitée dans les plus brefs délais.`);
    
    // Retourner à la page de sélection
    setCurrentStep('selection');
    setTiktokUrl('');
    setSelectedPackage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              TikTok <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Comments</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Boostez vos commentaires TikTok avec nos services premium. 
              Obtenez des commentaires réels et engageants pour maximiser votre visibilité.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-300">Taux de réussite</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-300">Sécurisé</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-300">Support client</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Type de Commentaires */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Choisissez votre type de commentaires
          </h2>
          <FollowerTypeSelector 
            selectedType={followerType} 
            onTypeChange={setFollowerType}
          />
        </div>

        {/* Sélection du Package */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Sélectionnez votre package
          </h2>
          <PackageSelector 
            selectedPackage={selectedPackage}
            onPackageChange={setSelectedPackage}
            followerType={followerType}
            isTikTokComments={true}
          />
        </div>

        {/* Résumé et Bouton d'ajout au panier */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Résumé de votre commande</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {getPackageComments(selectedPackage).toLocaleString()}
                    </div>
                    <div className="text-gray-600">Commentaires TikTok</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {followerType === 'french' ? 'Français' : 'Internationaux'}
                    </div>
                    <div className="text-gray-600">Type de commentaires</div>
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center mx-auto"
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
            Nos garanties TikTok Comments
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
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Commentaires Réels</h4>
              <p className="text-gray-600">Tous les commentaires proviennent de comptes actifs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Livraison Rapide</h4>
              <p className="text-gray-600">Recevez vos commentaires en quelques heures</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3" />
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
                    <span className="text-gray-600">Commentaires TikTok:</span>
                    <span className="font-semibold text-gray-900">{getPackageComments(selectedPackage).toLocaleString()}</span>
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
                  Lien de votre post TikTok *
                </label>
                <input
                  type="text"
                  id="tiktok-url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@username/video/1234567890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <div className="text-xs text-gray-500 mt-2">
                  <p className="font-medium mb-1">Formats acceptés :</p>
                  <p>• https://www.tiktok.com/@username/video/1234567890</p>
                  <p>• https://tiktok.com/@username/video/1234567890</p>
                  <p>• https://vm.tiktok.com/abc123</p>
                  <p>• @username/video/1234567890</p>
                </div>
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
                  disabled={!tiktokUrl.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
        likesCount={getPackageComments(selectedPackage)}
        followerType={followerType as 'french' | 'international'}
        tiktokUrl={tiktokUrl}
        basePrice={getPackagePrice(selectedPackage)}
      />
    </div>
  );
}
