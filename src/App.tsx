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
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import BlogPage from './components/BlogPage';
import BlogArticle from './components/BlogArticle';
import PaymentSuccessPageFixed from './components/PaymentSuccessPageFixed';
import PaymentCancelPage from './components/PaymentCancelPage';
import PaymentPage from './components/PaymentPage';
import Footer from './components/Footer';
import { CartProvider, useCart } from './contexts/CartContext';
import { getServicePageBySlug } from './config/serviceSlugs';
import { RoutingService } from './services/routingService';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'instagram-followers' | 'instagram-likes' | 'instagram-comments' | 'instagram-views' | 'tiktok-followers' | 'tiktok-likes' | 'tiktok-views' | 'tiktok-comments' | 'followers' | 'likes' | 'legal' | 'about' | 'contact' | 'blog' | 'blog-article' | 'cart' | 'payment' | 'payment-success' | 'payment-cancel'>('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');
  const [currentLegalSection, setCurrentLegalSection] = useState<string>('');
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Gestion du routage basé sur l'URL
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      
      // Debug pour production
      console.log('Current page:', currentPage, 'URL:', path);
      console.log('Routing to:', path);
      console.log('URL params:', Object.fromEntries(urlParams));
      
      // SOLUTION SPA : Gérer les paramètres de paiement depuis l'accueil
      if (path === '/' && urlParams.has('payment_success')) {
        console.log('🎯 Paramètre payment_success détecté - Navigation vers page de succès');
        setCurrentPage('payment-success');
        // Nettoyer l'URL après navigation
        setTimeout(() => {
          window.history.replaceState({}, '', '/');
        }, 100);
        return;
      }
      
      if (path === '/' && urlParams.has('payment_cancel')) {
        console.log('🎯 Paramètre payment_cancel détecté - Navigation vers page d\'annulation');
        setCurrentPage('payment-cancel');
        // Nettoyer l'URL après navigation
        setTimeout(() => {
          window.history.replaceState({}, '', '/');
        }, 100);
        return;
      }

      // DÉTECTION CARDINITY : Si on a des paramètres Cardinity sur la page d'accueil
      if (path === '/' && (urlParams.has('order_id') || urlParams.has('status'))) {
        const status = urlParams.get('status');
        console.log('🎯 Paramètres Cardinity détectés sur l\'accueil:', {
          order_id: urlParams.get('order_id'),
          status: status,
          amount: urlParams.get('amount')
        });
        
        if (status === 'approved') {
          console.log('✅ Paiement Cardinity approuvé - Navigation vers page de succès');
          setCurrentPage('payment-success');
          return;
        } else {
          console.log('❌ Paiement Cardinity non approuvé - Navigation vers page d\'annulation');
          setCurrentPage('payment-cancel');
          return;
        }
      }
      
      // SOLUTION PROPRE : Gérer les routes de paiement avec redirection 302
      if (path === '/payment/success' || path.includes('payment/success') || window.location.href.includes('payment/success')) {
        console.log('🎯 Route de succès détectée - Redirection vers page de succès');
        setCurrentPage('payment-success');
        return;
      }
      
      if (path === '/payment/cancel' || path.includes('payment/cancel') || window.location.href.includes('payment/cancel')) {
        console.log('🎯 Route d\'annulation détectée - Redirection vers page d\'annulation');
        setCurrentPage('payment-cancel');
        return;
      }
      
      if (path === '/pay' || path.includes('/pay') || window.location.href.includes('/pay')) {
        console.log('🎯 Route de paiement détectée - Redirection vers page de paiement');
        setCurrentPage('payment');
        return;
      }
      
      // Pages de blog
      if (path === '/blogs') {
        setCurrentPage('blog');
      } else if (path.startsWith('/blogs/')) {
        const slug = path.replace('/blogs/', '');
        setCurrentArticleSlug(slug);
        setCurrentPage('blog-article');
      }
      // Page de panier/checkout
      else if (path === '/cart' || path === '/checkout') {
        setCurrentPage('cart');
        setCurrentStep('checkout');
      }
      // Pages de paiement
      else if (path === '/pay') {
        setCurrentPage('payment');
      } else if (path === '/payment/success') {
        setCurrentPage('payment-success');
      } else if (path === '/payment/cancel') {
        setCurrentPage('payment-cancel');
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
      // Page légale
      else if (path === '/legal') {
        setCurrentPage('legal');
        setCurrentLegalSection('');
      }
      // Page À propos
      else if (path === '/about') {
        setCurrentPage('about');
      }
      // Page Contact
      else if (path === '/contact') {
        setCurrentPage('contact');
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
    
    // Écouter aussi les changements d'URL programmatiques
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setTimeout(handleRoute, 0);
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      setTimeout(handleRoute, 0);
    };
    
    handleRoute(); // Vérifier l'URL initiale

    return () => window.removeEventListener('popstate', handleRoute);
  }, []);
  
  // Debug: log current page
  console.log('Current page:', currentPage, 'URL:', window.location.pathname);
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
    
    // Rediriger vers la page de panier avec URL standard
    console.log('🚀 Redirection vers panier: /cart');
    window.history.pushState({}, '', '/cart');
    setCurrentStep('checkout');
  };

  const handleCheckoutComplete = (orderData: any) => {
    alert(`Commande confirmée pour @${orderData.items[0].username} avec ${orderData.totalFollowers} followers à ${orderData.total.toFixed(2)}€`);
    setCurrentStep('selection');
    setSelectedPackage('');
    setSelectedProfile('');
  };

  const handleBackToSelection = () => {
    // Retourner à la page de service précédente basée sur le contenu du panier
    const { items } = useCart();
    
    if (items.length > 0) {
      // Déterminer le type de service basé sur le premier item du panier
      const firstItem = items[0];
      let servicePage = 'instagram-followers'; // par défaut
      
      if (firstItem.likes > 0) {
        servicePage = 'instagram-likes';
      } else if (firstItem.views > 0) {
        servicePage = 'instagram-views';
      } else if (firstItem.comments > 0) {
        servicePage = 'instagram-comments';
      } else if (firstItem.platform === 'TikTok' || firstItem.platform === 'tiktok') {
        if (firstItem.likes > 0) {
          servicePage = 'tiktok-likes';
        } else {
          servicePage = 'tiktok-followers';
        }
      }
      
      const serviceSlugMap: { [key: string]: string } = {
        'instagram-followers': 'products/acheter-followers-instagram',
        'instagram-likes': 'products/acheter-des-likes-instagram',
        'instagram-views': 'products/acheter-des-vues-instagram',
        'instagram-comments': 'products/acheter-des-commentaires-instagram',
        'tiktok-followers': 'products/tiktok/acheter-des-abonnes-tiktok',
        'tiktok-likes': 'products/tiktok/acheter-des-likes-tiktok'
      };
      
      const slug = serviceSlugMap[servicePage];
      if (slug) {
        window.history.pushState({}, '', `/${slug}`);
        setCurrentPage(servicePage as any);
      }
    } else {
      // Si le panier est vide, retourner à l'accueil
      window.history.pushState({}, '', '/');
      setCurrentPage('home');
    }
    
    setCurrentStep('selection');
  };

  // Fonction de navigation avec gestion des slugs
  const handleNavigate = (page: string, section?: string) => {
    // Protection contre les navigations multiples rapides
    if (isNavigating) {
      console.log('Navigation en cours, ignorée');
      return;
    }
    
    console.log('handleNavigate called with:', page, section);
    setIsNavigating(true);
    
    // Si c'est une page légale avec une section spécifique
    if (page === 'legal' && section) {
      setCurrentLegalSection(section);
      setCurrentPage('legal');
      window.history.pushState({}, '', '/legal');
      setTimeout(() => setIsNavigating(false), 100);
      return;
    }
    
    // Si c'est une page légale sans section spécifique
    if (page === 'legal') {
      setCurrentLegalSection('');
      setCurrentPage('legal');
      window.history.pushState({}, '', '/legal');
      setTimeout(() => setIsNavigating(false), 100);
      return;
    }
    
    // Si c'est la page À propos
    if (page === 'about') {
      setCurrentPage('about');
      window.history.pushState({}, '', '/about');
      setTimeout(() => setIsNavigating(false), 100);
      return;
    }
    
    // Si c'est la page Contact
    if (page === 'contact') {
      setCurrentPage('contact');
      window.history.pushState({}, '', '/contact');
      setTimeout(() => setIsNavigating(false), 100);
      return;
    }
    
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
    
    console.log('Mapped slug:', slug, 'Service page found:', !!servicePage);
    
    if (servicePage) {
      // Navigation vers une page de service avec slug
      console.log('Navigating to service page:', servicePage.canonicalUrl);
      
      // Mettre à jour l'URL d'abord
      window.history.pushState({}, '', servicePage.canonicalUrl);
      // Forcer la mise à jour de l'URL (pour les navigateurs avec cache)
      if (window.location.pathname !== servicePage.canonicalUrl) {
        window.history.replaceState({}, '', servicePage.canonicalUrl);
      }
      
      // Appliquer le SEO SANS mettre à jour l'historique (éviter la double mise à jour)
      RoutingService.applyServicePageSEOWithoutHistory(slug);
      
      // Mettre à jour la page après un micro-délai pour éviter les conflits de timing
      setTimeout(() => {
        setCurrentPage(page as any);
        console.log('Page state updated to:', page);
      }, 0);
      
      console.log('URL updated to:', window.location.pathname);
    } else if (page === 'cart') {
      // Navigation vers la page panier
      console.log('Navigating to cart page');
      
      // Mettre à jour l'URL d'abord
      window.history.pushState({}, '', '/cart');
      
      // Mettre à jour la page immédiatement
      setCurrentPage('cart');
      setCurrentStep('checkout');
      console.log('Page state updated to: cart');
      
      console.log('URL updated to:', window.location.pathname);
    } else {
      // Navigation vers une page normale
      console.log('Navigating to normal page:', page);
      
      // Mettre à jour l'URL d'abord
      if (page === 'home') {
        window.history.pushState({}, '', '/');
        // Forcer la mise à jour de l'URL
        if (window.location.pathname !== '/') {
          window.history.replaceState({}, '', '/');
        }
      } else if (page === 'blog') {
        window.history.pushState({}, '', '/blogs');
        // Forcer la mise à jour de l'URL
        if (window.location.pathname !== '/blogs') {
          window.history.replaceState({}, '', '/blogs');
        }
      }
      
      // Mettre à jour la page après un micro-délai
      setTimeout(() => {
        setCurrentPage(page as any);
        console.log('Page state updated to:', page);
      }, 0);
      
      console.log('URL updated to:', window.location.pathname);
    }
    
    // Réinitialiser le flag de navigation après un court délai
    setTimeout(() => {
      setIsNavigating(false);
    }, 100);
  };

  // Page de panier/checkout
  if (currentPage === 'cart') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <CheckoutPage 
          onBack={handleBackToSelection}
          onComplete={handleCheckoutComplete}
        />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Si on est sur la page d'accueil, afficher HomePage
  if (currentPage === 'home') {
    return (
      <div key="home" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <HomePage onNavigate={handleNavigate} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Instagram Followers
  if (currentPage === 'instagram-followers') {
    return (
      <div key="instagram-followers" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <InstagramFollowersPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Instagram Likes
  if (currentPage === 'instagram-likes') {
    return (
      <div key="instagram-likes" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <InstagramLikesPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Instagram Comments
  if (currentPage === 'instagram-comments') {
    return (
      <div key="instagram-comments" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <InstagramCommentsPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Instagram Views
  if (currentPage === 'instagram-views') {
    return (
      <div key="instagram-views" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
        <ModernNavigation onNavigate={handleNavigate} />
        <LegalPage 
          onBack={() => handleNavigate('home')} 
          section={currentLegalSection}
        />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page À propos
  if (currentPage === 'about') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <AboutPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Contact
  if (currentPage === 'contact') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <ContactPage onBack={() => handleNavigate('home')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Blog
  if (currentPage === 'blog') {
    return (
      <div key="blog" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <BlogPage 
          onNavigate={handleNavigate}
          onViewArticle={(slug) => {
            setCurrentArticleSlug(slug);
            setCurrentPage('blog-article');
            window.history.pushState({}, '', `/blogs/${slug}`);
          }}
        />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page Article de Blog
  if (currentPage === 'blog-article') {
    return (
      <div key={`blog-article-${currentArticleSlug}`} className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <BlogArticle 
          slug={currentArticleSlug}
          onBack={() => handleNavigate('blog')}
        />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Si on est sur la page likes, afficher LikesMainPage
  if (currentPage === 'likes') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ModernNavigation onNavigate={handleNavigate} />
        <LikesMainPage onBack={() => handleNavigate('followers')} />
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Page de paiement
  if (currentPage === 'payment') {
    return (
      <PaymentPage onBack={() => handleNavigate('cart')} />
    );
  }

  // Page de succès de paiement
  if (currentPage === 'payment-success') {
    return (
      <PaymentSuccessPageFixed onBack={() => handleNavigate('home')} />
    );
  }

  // Page d'échec de paiement
  if (currentPage === 'payment-cancel') {
    return (
      <PaymentCancelPage onBack={() => handleNavigate('cart')} />
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