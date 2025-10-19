import React, { useState } from 'react';
import { Heart, ShoppingCart, Zap } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import GuaranteeSection from './GuaranteeSection';
import InstagramSearchModal from './InstagramSearchModal';
import InstagramPostsModal from './InstagramPostsModal';
// LikesPage supprimé - utilisation du CheckoutPage unifié
import { useCart } from '../contexts/CartContext';
import { InstagramPost } from '../services/instagramService';

interface LikesMainPageProps {
  onBack: () => void;
}

export default function LikesMainPage({ onBack }: LikesMainPageProps) {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>([]);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const { addToCart, updateLastItemUsername, updateLastItemPosts } = useCart();

  const getPackagePrice = (packageId: string) => {
    // Prix pour les likes (généralement moins cher que les followers)
    const likesPrices: Record<string, number> = {
      '25': 0.49,
      '100': 1.49,
      '250': 3.49,
      '500': 4.49,
      '1000': 7.49,
      '5000': 24.95,
      '10000': 48.95,
      '25000': 114.95
    };
    const basePrice = likesPrices[packageId] || 0;
    return followerType === 'french' ? (basePrice * 2) : basePrice;
  };

  const getPackageLikes = (packageId: string) => {
    return parseInt(packageId) || 0;
  };

  const handlePurchase = () => {
    if (!selectedPackage) {
      alert('Veuillez sélectionner un pack');
      return;
    }
    
    // Ne pas ajouter au panier maintenant - attendre la sélection des posts
    setIsModalOpen(true);
  };

  const handleProfileSelect = (username: string, cartData: any) => {
    setSelectedProfile(username);
    setIsModalOpen(false);
    setIsPostsModalOpen(true);
  };

  const handlePostsSelected = (posts: InstagramPost[], likesPerPost: number) => {
    try {
      setSelectedPosts(posts);
      
      // Pour les likes, chaque post reçoit le nombre complet de likes du pack
      const postsData = posts.map(post => {
        if (!post.code) {
          throw new Error(`Code Instagram manquant pour le post. Impossible de commander des likes.`);
        }
        return {
          postId: post.code, // Utiliser uniquement le code court Instagram
          likesToAdd: getPackageLikes(selectedPackage), // Chaque post reçoit le nombre complet de likes du pack
          mediaUrl: post.media_url || post.thumbnail_url
        };
      });
    
      // Calculer le prix total (prix par post × nombre de posts)
      const totalPrice = getPackagePrice(selectedPackage) * posts.length;
      
      // Ajouter au panier SEULEMENT après la sélection des posts
      addToCart({
        followers: 0,
        likes: getPackageLikes(selectedPackage), // Quantité de base pour l'affichage
        price: totalPrice,
        followerType: followerType as 'french' | 'international',
        username: selectedProfile,
        platform: 'Instagram',
        selectedPosts: postsData
      });
      
      // Fermer le modal des posts
      setIsPostsModalOpen(false);
      
      // Rediriger vers le panier
      window.location.href = '/cart';
    } catch (error) {
      console.error('❌ Erreur lors de la sélection des posts:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsPostsModalOpen(false);
    }
  };

  const handleCheckoutComplete = (orderData: any) => {
    alert(`Commande confirmée pour @${orderData.items[0].username} avec ${orderData.totalLikes} likes répartis sur ${selectedPosts.length} posts à ${orderData.total.toFixed(2)}€`);
    setCurrentStep('selection');
    setSelectedPackage('');
    setSelectedProfile('');
    setSelectedPosts([]);
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
  };

  // Le checkout est maintenant géré par l'App.tsx via /cart

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-600 via-red-600 to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Boostez vos likes Instagram
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Des likes réels et authentiques pour augmenter l'engagement de vos posts
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Zap className="w-6 h-6 mr-2" />
              <span className="font-semibold">Livraison 24-72h</span>
            </div>
            <div className="flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2" />
              <span className="font-semibold">Service professionnel</span>
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
          isLikes={true}
        />

        <GuaranteeSection />

        {/* Purchase Section */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-pink-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Résumé de votre commande
              </h3>
              
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-700">
                    {getPackageLikes(selectedPackage).toLocaleString()} likes {followerType === 'french' ? 'français' : 'internationaux'}
                  </span>
                  <span className="text-3xl font-bold text-pink-600">
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
                    Likes réels
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                <Heart className="w-6 h-6 inline mr-3" />
                Acheter maintenant
              </button>

              <p className="text-sm text-gray-500 mt-4">
                🔒 Paiement sécurisé • Aucun mot de passe requis • Livraison garantie
              </p>
            </div>
          </div>
        )}
      </main>


      <InstagramSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProfile={handleProfileSelect}
        cartData={{
          followers: 0,
          likes: getPackageLikes(selectedPackage),
          price: getPackagePrice(selectedPackage),
          followerType: followerType as 'french' | 'international'
        }}
      />

      <InstagramPostsModal
        isOpen={isPostsModalOpen}
        onClose={() => setIsPostsModalOpen(false)}
        username={selectedProfile}
        totalLikes={getPackageLikes(selectedPackage)}
        onPostsSelected={handlePostsSelected}
        pricePerPost={getPackagePrice(selectedPackage)}
      />
    </div>
  );
}
