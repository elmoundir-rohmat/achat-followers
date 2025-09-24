import React, { useState, useEffect } from 'react';
import { Instagram, ShoppingCart, Zap } from 'lucide-react';
import FollowerTypeSelector from './components/FollowerTypeSelector';
import PackageSelector from './components/PackageSelector';
import GuaranteeSection from './components/GuaranteeSection';
import InstagramSearchModal from './components/InstagramSearchModal';
import CheckoutPage from './components/CheckoutPage';
import LikesMainPage from './components/LikesMainPage';
import HomePage from './components/HomePage';
import ModernNavigation from './components/ModernNavigation';
import InstagramFollowersPage from './components/InstagramFollowersPage';
import InstagramLikesPage from './components/InstagramLikesPage';
import InstagramCommentsPage from './components/InstagramCommentsPage';
import InstagramViewsPage from './components/InstagramViewsPage';
import TikTokFollowersPage from './components/TikTokFollowersPage';
import TikTokLikesPage from './components/TikTokLikesPage';
import LegalPage from './components/LegalPage';
import BlogPage from './components/BlogPage';
import BlogArticle from './components/BlogArticle';
import Footer from './components/Footer';
import { CartProvider, useCart } from './contexts/CartContext';
import { getServicePageBySlug } from './config/serviceSlugs';
import { RoutingService } from './services/routingService';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'instagram-followers' | 'instagram-likes' | 'instagram-comments' | 'instagram-views' | 'tiktok-followers' | 'tiktok-likes' | 'tiktok-views' | 'tiktok-comments' | 'followers' | 'likes' | 'legal' | 'blog' | 'blog-article'>('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');
  
  // Gestion du routage basé sur l'URL
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      
      // Debug pour production
      console.log('Routing to:', path);
      
      // Pages de blog
      if (path === '/blogs') {
        setCurrentPage('blog');
      } else if (path.startsWith('/blogs/')) {
        const slug = path.replace('/blogs/', '');
        setCurrentArticleSlug(slug);
        setCurrentPage('blog-article');
      }
      // Pages de services avec slugs
      else if (path.startsWith('/products/acheter-followers-instagram') || path === '/products/acheter-followers-instagram') {
        setCurrentPage('instagram-followers');
        RoutingService.applyServicePageSEO('products/acheter-followers-instagram');
      } else if (path.startsWith('/products/acheter-des-likes-instagram') || path === '/products/acheter-des-likes-instagram') {
        setCurrentPage('instagram-likes');
        RoutingService.applyServicePageSEO('products/acheter-des-likes-instagram');
      } else if (path.startsWith('/products/acheter-des-vues-instagram') || path === '/products/acheter-des-vues-instagram') {
        setCurrentPage('instagram-views');
        RoutingService.applyServicePageSEO('products/acheter-des-vues-instagram');
      } else if (path.startsWith('/products/acheter-des-commentaires-instagram') || path === '/products/acheter-des-commentaires-instagram') {
        setCurrentPage('instagram-comments');
        RoutingService.applyServicePageSEO('products/acheter-des-commentaires-instagram');
      } else if (path.startsWith('/products/tiktok/acheter-des-abonnes-tiktok') || path === '/products/tiktok/acheter-des-abonnes-tiktok') {
        setCurrentPage('tiktok-followers');
        RoutingService.applyServicePageSEO('products/tiktok/acheter-des-abonnes-tiktok');
      } else if (path.startsWith('/products/tiktok/acheter-des-likes-tiktok') || path === '/products/tiktok/acheter-des-likes-tiktok') {
        setCurrentPage('tiktok-likes');
        RoutingService.applyServicePageSEO('products/tiktok/acheter-des-likes-tiktok');
      } else if (path.startsWith('/products/tiktok/acheter-vues-tiktok') || path === '/products/tiktok/acheter-vues-tiktok') {
        setCurrentPage('tiktok-views');
        RoutingService.applyServicePageSEO('products/tiktok/acheter-vues-tiktok');
      } else if (path.startsWith('/products/tiktok/acheter-des-commentaires-tiktok') || path === '/products/tiktok/acheter-des-commentaires-tiktok') {
        setCurrentPage('tiktok-comments');
        RoutingService.applyServicePageSEO('products/tiktok/acheter-des-commentaires-tiktok');
      }
      // Page d'accueil
      else if (path === '/') {
        setCurrentPage('home');
      }
      // Page non trouvée - rediriger vers l'accueil
      else {
        console.warn('Route non trouvée:', path, '- redirection vers l\'accueil');
        setCurrentPage('home');
        window.history.replaceState({}, '', '/');
      }
    };

    // Écouter les changements d'URL
    window.addEventListener('popstate', handleRoute);
    handleRoute(); // Vérifier l'URL initiale

    return () => window.removeEventListener('popstate', handleRoute);
  }, []);
  
  // Debug: log current page
  console.log('Current page:', currentPage);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={(page) => setCurrentPage(page as any)} />
        <CheckoutPage 
          onBack={handleBackToSelection}
          onComplete={handleCheckoutComplete}
        />
      </div>
    );
  }

  // Fonction de navigation avec gestion des slugs
  const handleNavigate = (page: string) => {
    // Mapper les IDs internes vers les slugs correspondants
    const pageSlugMap: { [key: string]: string } = {
      'instagram-followers': 'products/acheter-followers-instagram',
      'instagram-likes': 'products/acheter-des-likes-instagram',
      'instagram-views': 'products/acheter-des-vues-instagram',
      'instagram-comments': 'products/acheter-des-commentaires-instagram',
      'tiktok-followers': 'products/tiktok/acheter-des-abonnes-tiktok',
      'tiktok-likes': 'products/tiktok/acheter-des-likes-tiktok',
      'tiktok-views': 'products/tiktok/acheter-vues-tiktok',
      'tiktok-comments': 'products/tiktok/acheter-des-commentaires-tiktok'
    };

    const slug = pageSlugMap[page] || page;
    const servicePage = getServicePageBySlug(slug);
    
    if (servicePage) {
      // Navigation vers une page de service avec slug
      setCurrentPage(page as any);
      // Appliquer le SEO SANS mettre à jour l'historique (éviter la double mise à jour)
      RoutingService.applyServicePageSEOWithoutHistory(slug);
      // Mettre à jour l'URL après avoir défini la page
      window.history.pushState({}, '', servicePage.canonicalUrl);
    } else {
      // Navigation vers une page normale
      setCurrentPage(page as any);
    }
  };

  // Si on est sur la page d'accueil, afficher HomePage
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <HomePage onNavigate={handleNavigate} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Instagram Followers
  if (currentPage === 'instagram-followers') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <InstagramFollowersPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Instagram Likes
  if (currentPage === 'instagram-likes') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <InstagramLikesPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Instagram Comments
  if (currentPage === 'instagram-comments') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <InstagramCommentsPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Instagram Views
  if (currentPage === 'instagram-views') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <InstagramViewsPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page TikTok Followers
  if (currentPage === 'tiktok-followers') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <TikTokFollowersPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page TikTok Likes
  if (currentPage === 'tiktok-likes') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <TikTokLikesPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page TikTok Views
  if (currentPage === 'tiktok-views') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">TikTok Views</h1>
            <p className="text-xl mb-8">Page en cours de développement</p>
            <button
              onClick={() => handleNavigate('home')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page TikTok Comments
  if (currentPage === 'tiktok-comments') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">TikTok Comments</h1>
            <p className="text-xl mb-8">Page en cours de développement</p>
            <button
              onClick={() => handleNavigate('home')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Légale
  if (currentPage === 'legal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={(page) => setCurrentPage(page as any)} />
        <LegalPage onBack={() => setCurrentPage('home')} />
        <Footer onNavigate={(page) => setCurrentPage(page as any)} />
      </div>
    );
  }

  // Page Blog
  if (currentPage === 'blog') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={(page) => {
          if (page === 'blog') {
            setCurrentPage('blog');
            window.history.pushState({}, '', '/blogs');
          } else {
            setCurrentPage(page as any);
          }
        }} />
        <BlogPage 
          onNavigate={(page) => setCurrentPage(page as any)}
          onViewArticle={(slug) => {
            setCurrentArticleSlug(slug);
            setCurrentPage('blog-article');
            window.history.pushState({}, '', `/blogs/${slug}`);
          }}
        />
        <Footer onNavigate={(page) => setCurrentPage(page as any)} />
      </div>
    );
  }

  // Page Article de Blog
  if (currentPage === 'blog-article') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={(page) => {
          if (page === 'blog') {
            setCurrentPage('blog');
            window.history.pushState({}, '', '/blogs');
          } else {
            setCurrentPage(page as any);
          }
        }} />
        <BlogArticle 
          slug={currentArticleSlug}
          onBack={() => {
            setCurrentPage('blog');
            window.history.pushState({}, '', '/blogs');
          }}
        />
        <Footer onNavigate={(page) => setCurrentPage(page as any)} />
      </div>
    );
  }

  // Si on est sur la page likes, afficher LikesMainPage
  if (currentPage === 'likes') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={(page) => setCurrentPage(page as any)} />
        <LikesMainPage onBack={() => setCurrentPage('followers')} />
        <Footer onNavigate={(page) => setCurrentPage(page as any)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <ModernNavigation onNavigate={(page) => setCurrentPage(page as any)} />

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

      <Footer onNavigate={(page) => setCurrentPage(page as any)} />

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