import React, { useState, useCallback, useEffect } from 'react';
import { Eye, Instagram, Star, Shield, Clock, CheckCircle, TrendingUp, Users2, Zap, Play } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import GuaranteeSection from './GuaranteeSection';
import InstagramSearchModal from './InstagramSearchModal';
import InstagramPostsModal from './InstagramPostsModal';
// ViewsPage supprimé - utilisation du CheckoutPage unifié
import FAQSection from './FAQSection';
import PortableText from './PortableText';
import { useCart } from '../contexts/CartContext';
import { InstagramPost } from '../services/instagramService';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';
import { PageService, InstagramViewsPageData } from '../services/pageService';
import { updateSEOMetadata } from '../utils/seoMetadata';

export default function InstagramViewsPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>([]);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const { addToCart, updateLastItemUsername, updateLastItemPosts, updateLastItemPrice } = useCart();
  const [pageData, setPageData] = useState<InstagramViewsPageData | null>(null);

  // Charger les données SEO depuis Sanity
  useEffect(() => {
    PageService.getInstagramViewsPage().then(setPageData);
  }, []);

  // Mettre à jour les métadonnées SEO
  useEffect(() => {
    updateSEOMetadata(pageData);
  }, [pageData]);

  const getPackagePriceLocal = useCallback((packageId: string) => {
    return getPackagePrice(packageId, 'views', followerType as 'french' | 'international');
  }, [followerType]);

  const getPackageViews = useCallback((packageId: string) => {
    return getPackageQuantity(packageId, 'views');
  }, []);

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

  const handlePostsSelected = (posts: InstagramPost[], pricePerPost: number) => {
    try {
      setSelectedPosts(posts);
      
      // Pour les vues, chaque reel reçoit le nombre de vues du pack
      const postsData = posts.map(post => {
        if (!post.code) {
          throw new Error(`Code Instagram manquant pour le post. Impossible de commander des vues.`);
        }
        return {
          postId: post.code, // Utiliser uniquement le code court Instagram
          viewsToAdd: getPackageViews(selectedPackage), // Chaque reel reçoit le nombre complet de vues du pack
          mediaUrl: post.media_url || post.thumbnail_url
        };
      });
    
      // Calculer le prix total (prix par post × nombre de posts)
      const totalPrice = pricePerPost * posts.length;
      
      // Ajouter au panier SEULEMENT après la sélection des posts
      addToCart({
        followers: 0,
        likes: 0,
        comments: 0,
        views: getPackageViews(selectedPackage),
        price: totalPrice,
        followerType: followerType as 'french' | 'international',
        username: selectedProfile,
        platform: 'Instagram',
        selectedPosts: postsData
      });
      
      setIsPostsModalOpen(false);
      
      // Redirection simple vers le panier - Vercel SPA routing va gérer
      window.location.href = '/cart';
    } catch (error) {
      console.error('❌ Erreur lors de la sélection des posts:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsPostsModalOpen(false);
    }
  };

  const handleCheckoutComplete = (orderData: any) => {
    alert(`Commande confirmée pour @${orderData.items[0].username} avec ${orderData.totalViews} vues réparties sur ${selectedPosts.length} reels à ${orderData.total.toFixed(2)}€`);
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
    <div className="min-h-screen bg-cream font-rounded">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg mr-5">
                  <Instagram className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold text-slate-800 leading-tight">
                  {pageData?.hero?.title || "Vues Instagram"}
                </h1>
              </div>
              {pageData?.hero?.description ? (
                <div className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  <PortableText content={pageData.hero.description} />
                </div>
              ) : (
                <p className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  Boostez vos reels avec des vues authentiques pour maximiser votre portée
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-base">
                <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                  <Star className="w-5 h-5 text-warm-yellow-500" strokeWidth={1.5} />
                  <span className="font-medium text-slate-700">4.9/5</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                  <Eye className="w-5 h-5 text-lavender-500" strokeWidth={1.5} />
                  <span className="font-medium text-slate-700">+100K vues</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                  <Shield className="w-5 h-5 text-soft-pink-500" strokeWidth={1.5} />
                  <span className="font-medium text-slate-700">100% sécurisé</span>
                </div>
              </div>
            </div>
            <div className="relative">
              {pageData?.hero?.image?.url ? (
                <img 
                  src={pageData.hero.image.url} 
                  alt={pageData.hero.image.alt || "Instagram Reels with High Views and Engagement"} 
                  className="rounded-card shadow-soft-xl"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Instagram Reels with High Views and Engagement" 
                  className="rounded-card shadow-soft-xl"
                />
              )}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-lavender-600 font-semibold text-lg">👁️ +150% Vues</div>
                <div className="text-sm text-slate-600">Boost achieved</div>
              </div>
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-soft-pink-600 font-semibold text-lg">📊 +50K Views</div>
                <div className="text-sm text-slate-600">Monthly delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <FollowerTypeSelector
          selectedType={followerType}
          onTypeChange={setFollowerType}
          title="Type de vues"
          serviceKey="instagram_views"
        />

        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
          followerType={followerType}
          isViews={true}
        />

        {/* Purchase Section */}
        {selectedPackage && (
          <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-xl p-10 border border-soft-pink-200/50 mb-14">
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-slate-800 mb-6">
                Résumé de votre commande
              </h3>
              
              <div className="bg-gradient-to-br from-soft-pink-50 via-peach-50 to-lavender-50 rounded-card-sm p-8 mb-8 border border-soft-pink-200/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold text-slate-700">
                    {getPackageViews(selectedPackage).toLocaleString()} vues {followerType === 'french' ? 'françaises' : 'internationales'}
                  </span>
                  <span className="text-4xl font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">
                    {getPackagePriceLocal(selectedPackage).toFixed(2)}€
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-lavender-200/50 shadow-soft">
                    <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>
                    <span className="text-slate-700 font-medium">Garantie 30 jours</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-lavender-200/50 shadow-soft">
                    <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>
                    <span className="text-slate-700 font-medium">Livraison progressive</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-lavender-200/50 shadow-soft">
                    <div className="w-2 h-2 bg-lavender-500 rounded-full"></div>
                    <span className="text-slate-700 font-medium">Vues réelles</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 hover:shadow-soft-xl hover:scale-105 text-white font-semibold py-5 px-14 rounded-button transition-all duration-300 shadow-soft-lg text-lg"
              >
                <Eye className="w-6 h-6 inline mr-3" strokeWidth={2} />
                Acheter maintenant
              </button>

              <p className="text-sm text-slate-600 mt-6">
                🔒 Paiement sécurisé • Aucun mot de passe requis • Livraison garantie
              </p>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-lavender-100 to-baby-purple-100 rounded-card-sm flex items-center justify-center mr-4 shadow-soft">
                <Eye className="w-7 h-7 text-lavender-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.viewTypes?.international?.title || "Vues Internationales"}
              </h3>
            </div>
            <div className="space-y-4">
              {(pageData?.viewTypes?.international?.descriptions || [
                "Acheter de vraies vues Instagram pour vos reels, sans ciblage particulier, provenant du monde entier.",
                "Les vues que nous vous fournissons proviennent d'utilisateurs actifs et authentiques.",
                "Livraison progressive pour un engagement naturel et durable."
              ]).map((description, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-lavender-500 mr-1 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-slate-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg border-2 border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-soft-pink-100 to-peach-100 rounded-card-sm flex items-center justify-center mr-4 shadow-soft">
                <Play className="w-7 h-7 text-soft-pink-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.viewTypes?.french?.title || "Vues Instagram Françaises"}
              </h3>
            </div>
            <div className="space-y-4">
              {(pageData?.viewTypes?.french?.descriptions || [
                "Acheter des vues ciblées selon votre région française.",
                "Nous sélectionnons les profils qui sont intéressés par votre domaine d'activité",
                "Ce sont des profils très actifs qui vont générer plus d'interactions que l'utilisateur moyen."
              ]).map((description, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-soft-pink-500 mr-1 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-slate-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gradient-to-br from-soft-pink-50/50 via-peach-50/50 to-lavender-50/50 rounded-card p-10 mb-20 border border-soft-pink-200/50 shadow-soft-lg">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-6">{pageData?.sectionTitles?.testimonials || "Avis des clients"}</h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-semibold bg-gradient-to-r from-soft-pink-500 to-lavender-500 bg-clip-text text-transparent">4.9</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-warm-yellow-400 fill-current" strokeWidth={1.5} />
                ))}
              </div>
              <span className="text-slate-600 font-medium">(89 avis)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Marie, Paris", date: "18/03/2025", rating: 5, comment: "Service parfait ! Mes reels ont explosé en vues grâce à ce service. Les vues sont arrivées de manière très naturelle." },
              { name: "Thomas, Lyon", date: "12/02/2025", rating: 5, comment: "Excellent pour booster mes reels ! Les vues françaises sont de qualité et ont vraiment amélioré ma visibilité." },
              { name: "Camille, Marseille", date: "05/02/2025", rating: 5, comment: "Service fiable et efficace. Mes reels ont gagné en popularité grâce aux vues achetées. Je recommande !" }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-card-sm p-7 shadow-soft-lg border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="font-semibold text-slate-800">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.date}</div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warm-yellow-400 fill-current" strokeWidth={1.5} />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Guarantees Section */}
        <div className="bg-gradient-to-br from-lavender-50/50 via-soft-pink-50/50 to-peach-50/50 rounded-card p-10 mb-20 border border-soft-pink-200/50 shadow-soft-lg">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-slate-800 mb-12">
            {pageData?.sectionTitles?.security || "Acheter des vues Instagram en toute sécurité avec Doctor Followers"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg text-center border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
              <div className="w-18 h-18 bg-gradient-to-br from-lavender-100 to-baby-purple-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                <Shield className="w-9 h-9 text-lavender-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {pageData?.securitySection?.serviceClient?.title || "Service client 24/7"}
              </h3>
              {pageData?.securitySection?.serviceClient?.description ? (
                <div className="text-slate-600 text-sm leading-relaxed">
                  <PortableText content={pageData.securitySection.serviceClient.description} />
                </div>
              ) : (
                <p className="text-slate-600 text-sm leading-relaxed">
                  Bien que les incidents soient rares, notre <strong className="text-lavender-600">Service client</strong> est disponible
                  par e-mail du lundi au dimanche, 24 heures sur 24. Si vous avez une demande
                  spécifique, nous pouvons également vous contacter par téléphone.
                </p>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg text-center border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
              <div className="w-18 h-18 bg-gradient-to-br from-soft-pink-100 to-peach-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                <CheckCircle className="w-9 h-9 text-soft-pink-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {pageData?.securitySection?.remboursement?.title || "Politique de remboursement"}
              </h3>
              {pageData?.securitySection?.remboursement?.description ? (
                <div className="text-slate-600 text-sm leading-relaxed">
                  <PortableText content={pageData.securitySection.remboursement.description} />
                </div>
              ) : (
                <p className="text-slate-600 text-sm leading-relaxed">
                  Notre offre <strong className="text-soft-pink-600">'Satisfait ou remboursé'</strong> est très simple: Satisfait ou remboursé.
                  Dans le cas où la commande ne vous convient
                  pas, nous vous faisons un remboursement dans les 24h.
                </p>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg text-center border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
              <div className="w-18 h-18 bg-gradient-to-br from-warm-yellow-100 to-soft-orange-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                <Zap className="w-9 h-9 text-soft-orange-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {pageData?.securitySection?.paiements?.title || "Paiements sécurisés"}
              </h3>
              {pageData?.securitySection?.paiements?.description ? (
                <div className="text-slate-600 text-sm leading-relaxed">
                  <PortableText content={pageData.securitySection.paiements.description} />
                </div>
              ) : (
                <p className="text-slate-600 text-sm leading-relaxed">
                  <strong className="text-soft-orange-600">Vos paiements sont 100% sécurisés</strong> grâce à un protocole
                  SSL et des prestataires reconnus -et surtout, nous ne vous
                  demanderons jamais vos identifiants Instagram.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Why Buy Views Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-slate-800 mb-16">
            {pageData?.sectionTitles?.whyBuy || "Pourquoi acheter des vues Instagram en 2025?"}
          </h2>

          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {pageData?.whyBuySection?.portee?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.portee.image.url} 
                    alt={pageData.whyBuySection.portee.image.alt || "Instagram Reels with High Views and Engagement"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Instagram Reels with High Views and Engagement" 
                    className="rounded-card shadow-soft-xl"
                  />
                )}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.portee?.title || "Maximiser la portée de vos reels"}
                </h3>
                {pageData?.whyBuySection?.portee?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.portee.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    Les reels Instagram sont devenus le contenu le plus performant de la plateforme. Plus vos reels reçoivent de vues, 
                    plus l'algorithme les met en avant dans l'onglet Explorer et les suggestions. 
                    <strong className="text-soft-pink-600">Acheter des vues Instagram</strong> permet de donner un coup de pouce initial à vos reels. 
                    Un reel avec beaucoup de vues inspire confiance et attire naturellement plus d'engagement... 
                    et suscite plus d'intérêt de la part de l'algorithme pour le promouvoir.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.visibilite?.title || "Améliorer votre visibilité organique"}
                </h3>
                {pageData?.whyBuySection?.visibilite?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.visibilite.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    L'algorithme d'Instagram privilégie les reels qui génèrent de l'engagement rapidement. 
                    Plus vos reels reçoivent de vues dans les premières heures, plus ils sont susceptibles 
                    d'apparaître dans l'onglet Explorer et d'être montrés à plus d'utilisateurs...
                    <strong className="text-soft-pink-600">En achetant des vues Instagram françaises</strong>, 
                    vous renforcez votre portée organique.
                    Plus vos reels engagent, plus Instagram vous montre à de nouveaux utilisateurs. C'est un cercle
                    vertueux que vous pouvez activer avec des vues de qualité.
                  </p>
                )}
              </div>
              <div>
                {pageData?.whyBuySection?.visibilite?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.visibilite.image.url} 
                    alt={pageData.whyBuySection.visibilite.image.alt || "Instagram Analytics Dashboard showing Views and Reach"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Instagram Analytics Dashboard showing Views and Reach" 
                    className="rounded-card shadow-soft-xl"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {pageData?.whyBuySection?.credibilite?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.credibilite.image.url} 
                    alt={pageData.whyBuySection.credibilite.image.alt || "Instagram Business Profile with High Views"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Instagram Business Profile with High Views" 
                    className="rounded-card shadow-soft-xl"
                  />
                )}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.credibilite?.title || "Construire votre crédibilité"}
                </h3>
                {pageData?.whyBuySection?.credibilite?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.credibilite.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <strong className="text-lavender-600">Construire votre crédibilité</strong> ne doit pas se limiter à gonfler vos chiffres.
                    Chez Doctor Followers, nous vous aidons à construire une crédibilité authentique
                    et durable. Chaque vue livrée provient d'un utilisateur réel, susceptible d'interagir
                    naturellement avec votre contenu. Associé à un contenu régulier, cela favorise des interactions naturelles.
                    L'objectif n'est pas juste d'avoir plus de vues, mais de <strong className="text-lavender-600">créer une preuve sociale
                    forte</strong> qui attire de vrais fans et clients.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <GuaranteeSection />

        {/* Contenu riche avant FAQ */}
        {pageData?.contentBeforeFaq && (
          <div className="mt-10 py-8 px-4 bg-gradient-to-br from-soft-pink-50/30 via-peach-50/30 to-lavender-50/30">
            <div className="max-w-4xl mx-auto">
              <PortableText content={pageData.contentBeforeFaq} />
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <FAQSection 
          title="Questions fréquentes sur l'achat de vues Instagram"
          faqs={pageData?.faq?.questions || [
            {
              question: "Combien de temps faut-il pour recevoir mes vues ?",
              answer: "Dès que votre paiement est confirmé, la livraison des vues débute rapidement. En général, vous recevez vos vues dans un délai de 1 à 12 heures. Si vous optez pour l'option express, votre commande est traitée en moins de 2 heures. Il est également possible de choisir une livraison progressive, répartie sur plusieurs heures, pour un engagement plus naturel et durable de vos reels Instagram."
            },
            {
              question: "Les vues Instagram achetées sont-elles réelles ?",
              answer: "Oui, absolument. Sur Doctor Followers, nous mettons un point d'honneur à fournir uniquement des vues réelles et authentiques. Ces vues proviennent de profils actifs d'Europe de l'Ouest, et pour les commandes premium, elles sont spécifiquement sélectionnées selon votre région afin de garantir une meilleure compatibilité avec votre audience cible. Aucun faux profil, aucun robot : chaque vue livrée provient d'un utilisateur authentique, susceptible d'interagir naturellement avec votre contenu."
            },
            {
              question: "Est-ce risqué d'acheter des vues Instagram ?",
              answer: "Non, à condition de passer par un fournisseur sérieux comme Doctor Followers. Nos méthodes de livraison sont conformes aux conditions d'utilisation d'Instagram. Nous ne vous demandons jamais vos identifiants, et nous utilisons uniquement des profils authentiques. Depuis 2018, aucun de nos clients n'a été banni ou pénalisé par Instagram."
            },
            {
              question: "Quel est le nombre maximum de vues Instagram que je peux acheter ?",
              answer: "Sur notre site, vous pouvez acheter jusqu'à 100 000 vues Instagram en un seul achat. Pour des quantités plus importantes, vous pouvez nous contacter par email afin que nous vous proposions un devis personnalisé adapté à vos besoins et à vos délais."
            },
            {
              question: "Le paiement est-il sécurisé ?",
              answer: "Absolument. Toutes les transactions sur Doctor Followers sont protégées par un protocole SSL de dernière génération. Nous utilisons des partenaires bancaires reconnus pour garantir la sécurité de vos données. De plus, nous ne demandons jamais vos identifiants Instagram. Seul le lien de votre profil est requis."
            },
            {
              question: "Proposez-vous une garantie en cas de perte de vues ?",
              answer: "Oui. Si certaines vues disparaissent dans les 30 jours suivant la commande, elles sont automatiquement remplacées grâce à notre garantie incluse. Vous conservez ainsi le même nombre de vues, sans frais supplémentaires."
            },
            {
              question: "Les vues achetées peuvent-elles disparaître ?",
              answer: "Comme tout engagement sur Instagram, une vue peut disparaître avec le temps, notamment si le profil qui a vu le contenu est suspendu ou supprimé. Cela reste marginal, mais pour compenser ces éventuelles pertes, notre garantie de remplacement est prévue dans chaque commande."
            },
            {
              question: "D'où viennent vos vues ?",
              answer: "Nos vues proviennent principalement de profils francophones d'Europe de l'Ouest, comme la France, la Belgique ou la Suisse. Ce ciblage permet de renforcer votre crédibilité si vous vous adressez à une audience francophone."
            },
            {
              question: "Comment optimiser l'effet des vues achetées ?",
              answer: "Acheter des vues Instagram permet de booster votre engagement, mais l'impact réel dépend aussi de votre activité sur la plateforme. Il est essentiel de publier régulièrement des reels de qualité, de proposer un contenu engageant, d'interagir avec votre audience et de soigner votre stratégie de communication. Ces efforts renforcent l'engagement de vos reels et valorisent l'investissement."
            },
            {
              question: "Est-ce que les vues achetées vont générer plus d'engagement ?",
              answer: "Chez Doctor Followers, nous fournissons uniquement des vues Instagram réelles, issues de profils actifs. Leur impact sur l'engagement dépendra en grande partie de la qualité de votre contenu. Si vos reels sont pertinents, attrayants et bien ciblés, les vues achetées peuvent naturellement attirer plus d'interactions (likes, commentaires, nouveaux followers). Toutefois, comme pour tout engagement, l'effet ne peut jamais être garanti à 100 %. C'est pourquoi nous recommandons d'allier achat de vues avec une stratégie de contenu régulière et engageante."
            },
            {
              question: "Puis-je choisir sur quels reels appliquer les vues ?",
              answer: "Oui, absolument ! Après avoir sélectionné votre pack de vues et votre profil Instagram, vous pourrez choisir spécifiquement sur quels reels vous souhaitez appliquer les vues. Notre système vous permet de sélectionner les reels de votre choix et de répartir les vues selon vos préférences."
            },
            {
              question: "Les vues sont-elles distribuées de manière naturelle ?",
              answer: "Oui, nous distribuons les vues de manière progressive et naturelle pour éviter tout soupçon. Les vues arrivent de façon échelonnée sur plusieurs heures, simulant un engagement organique naturel. Cela garantit que vos reels gagnent en visibilité sans éveiller les soupçons de l'algorithme d'Instagram."
            }
          ]}
        />
      </main>

      <InstagramSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProfile={handleProfileSelect}
        cartData={{
          followers: 0,
          likes: 0,
          comments: 0,
          views: getPackageViews(selectedPackage),
          price: getPackagePriceLocal(selectedPackage),
          followerType: followerType as 'french' | 'international'
        }}
      />

      <InstagramPostsModal
        isOpen={isPostsModalOpen}
        onClose={() => setIsPostsModalOpen(false)}
        username={selectedProfile}
        totalLikes={getPackageViews(selectedPackage)}
        onPostsSelected={handlePostsSelected}
        isViews={true}
        selectedPackage={selectedPackage}
        getPackagePrice={getPackagePriceLocal}
        pricePerPost={getPackagePriceLocal(selectedPackage)}
      />
    </div>
  );
}
