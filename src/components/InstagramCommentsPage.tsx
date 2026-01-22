import React, { useState, useCallback, useEffect } from 'react';
import { MessageCircle, Instagram, Star, Shield, Clock, CheckCircle, TrendingUp, Users2, Zap, MessageSquare } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import GuaranteeSection from './GuaranteeSection';
import InstagramSearchModal from './InstagramSearchModal';
import InstagramPostsModal from './InstagramPostsModal';
// CommentsPage supprimé - utilisation du CheckoutPage unifié
import FAQSection from './FAQSection';
import { useCart } from '../contexts/CartContext';
import { InstagramPost } from '../services/instagramService';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';
import { PageService, InstagramCommentsPageData } from '../services/pageService';
import PortableText from './PortableText';

export default function InstagramCommentsPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>([]);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const { addToCart, addToCartWithPosts, updateLastItemUsername, updateLastItemPosts, updateLastItemPrice, items, setItems, saveCartToStorage } = useCart();
  const [pageData, setPageData] = useState<InstagramCommentsPageData | null>(null);

  // Charger les données SEO depuis Sanity
  useEffect(() => {
    PageService.getInstagramCommentsPage()
      .then((data) => {
        setPageData(data)
      })
      .catch((error) => {
        console.error('❌ Erreur chargement Instagram Comments:', error)
      })
  }, []);

  // Mettre à jour les métadonnées SEO
  useEffect(() => {
    if (pageData?.seo) {
      // Titre de la page
      if (pageData.seo.metaTitle) {
        document.title = pageData.seo.metaTitle;
      }

      // Meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (pageData.seo.metaDescription) {
        if (metaDescription) {
          metaDescription.setAttribute('content', pageData.seo.metaDescription);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = pageData.seo.metaDescription;
          document.head.appendChild(meta);
        }
      }

      // Keywords
      if (pageData.seo.keywords && pageData.seo.keywords.length > 0) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', pageData.seo.keywords.join(', '));
        } else {
          const meta = document.createElement('meta');
          meta.name = 'keywords';
          meta.content = pageData.seo.keywords.join(', ');
          document.head.appendChild(meta);
        }
      }

      // Canonical URL
      if (pageData.seo.canonicalUrl) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', pageData.seo.canonicalUrl);
        } else {
          const link = document.createElement('link');
          link.rel = 'canonical';
          link.href = pageData.seo.canonicalUrl;
          document.head.appendChild(link);
        }
      }

      // Open Graph
      if (pageData.openGraph) {
        if (pageData.openGraph.title) {
          let ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) {
            ogTitle.setAttribute('content', pageData.openGraph.title);
          } else {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:title');
            meta.content = pageData.openGraph.title;
            document.head.appendChild(meta);
          }
        }

        if (pageData.openGraph.description) {
          let ogDesc = document.querySelector('meta[property="og:description"]');
          if (ogDesc) {
            ogDesc.setAttribute('content', pageData.openGraph.description);
          } else {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:description');
            meta.content = pageData.openGraph.description;
            document.head.appendChild(meta);
          }
        }

        if (pageData.openGraph.image?.url) {
          let ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage) {
            ogImage.setAttribute('content', pageData.openGraph.image.url);
          } else {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:image');
            meta.content = pageData.openGraph.image.url;
            document.head.appendChild(meta);
          }
        }
      }

      // Twitter Card
      if (pageData.twitter) {
        if (pageData.twitter.card) {
          let twitterCard = document.querySelector('meta[name="twitter:card"]');
          if (twitterCard) {
            twitterCard.setAttribute('content', pageData.twitter.card);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'twitter:card';
            meta.content = pageData.twitter.card;
            document.head.appendChild(meta);
          }
        }

        if (pageData.twitter.title) {
          let twitterTitle = document.querySelector('meta[name="twitter:title"]');
          if (twitterTitle) {
            twitterTitle.setAttribute('content', pageData.twitter.title);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'twitter:title';
            meta.content = pageData.twitter.title;
            document.head.appendChild(meta);
          }
        }

        if (pageData.twitter.description) {
          let twitterDesc = document.querySelector('meta[name="twitter:description"]');
          if (twitterDesc) {
            twitterDesc.setAttribute('content', pageData.twitter.description);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'twitter:description';
            meta.content = pageData.twitter.description;
            document.head.appendChild(meta);
          }
        }

        if (pageData.twitter.image?.url) {
          let twitterImage = document.querySelector('meta[name="twitter:image"]');
          if (twitterImage) {
            twitterImage.setAttribute('content', pageData.twitter.image.url);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'twitter:image';
            meta.content = pageData.twitter.image.url;
            document.head.appendChild(meta);
          }
        }
      }
    }
  }, [pageData]);

  const getPackagePriceLocal = useCallback((packageId: string) => {
    return getPackagePrice(packageId, 'comments', followerType as 'french' | 'international');
  }, [followerType]);

  const getPackageComments = useCallback((packageId: string) => {
    return getPackageQuantity(packageId, 'comments');
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
      
      // Pour les commentaires, chaque post reçoit le nombre de commentaires du pack
      const postsData = posts.map(post => {
        if (!post.code) {
          throw new Error(`Code Instagram manquant pour le post. Impossible de commander des commentaires.`);
        }
        return {
          postId: post.code, // Utiliser uniquement le code court Instagram
          commentsToAdd: getPackageComments(selectedPackage), // Chaque post reçoit le nombre complet de commentaires du pack
          mediaUrl: post.media_url || post.thumbnail_url
        };
      });
    
      // Calculer le prix total (prix par post × nombre de posts)
      const totalPrice = pricePerPost * posts.length;
      
      // Ajouter au panier SEULEMENT après la sélection des posts
      addToCart({
        followers: 0,
        likes: 0,
        comments: getPackageComments(selectedPackage),
        views: 0,
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
    alert(`Commande confirmée pour @${orderData.items[0].username} avec ${orderData.totalComments} commentaires répartis sur ${selectedPosts.length} posts à ${orderData.total.toFixed(2)}€`);
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
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <FollowerTypeSelector
          selectedType={followerType}
          onTypeChange={setFollowerType}
          title={pageData?.pageH1 || "Acheter des commentaires Instagram"}
          headingLevel="h1"
          serviceKey="instagram_comments"
        />

        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
          followerType={followerType}
          isComments={true}
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
                    {getPackageComments(selectedPackage).toLocaleString()} commentaires {followerType === 'french' ? 'français' : 'internationaux'}
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
                    <span className="text-slate-700 font-medium">Commentaires réels</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 hover:shadow-soft-xl hover:scale-105 text-white font-semibold py-5 px-14 rounded-button transition-all duration-300 shadow-soft-lg text-lg"
              >
                <MessageCircle className="w-6 h-6 inline mr-3" strokeWidth={2} />
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
                <MessageSquare className="w-7 h-7 text-lavender-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.commentTypes?.international?.title || "Commentaires Internationaux"}
              </h3>
            </div>
            <div className="space-y-4">
              {(pageData?.commentTypes?.international?.descriptions || [
                "Acheter de vrais commentaires Instagram, sans ciblage particulier, provenant de l'Europe de l'ouest.",
                "Les commentaires que nous vous fournissons proviennent de profils actifs et authentiques.",
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
                <MessageCircle className="w-7 h-7 text-soft-pink-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.commentTypes?.french?.title || "Commentaires Instagram Français"}
              </h3>
            </div>
            <div className="space-y-4">
              {(pageData?.commentTypes?.french?.descriptions || [
                "Acheter des commentaires ciblés selon votre région française.",
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
              <span className="text-slate-600 font-medium">(127 avis)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sophie, Lyon", date: "22/03/2025", rating: 5, comment: "Service exceptionnel ! Les commentaires sont très naturels et ont vraiment boosté l'engagement de mes posts. Je recommande !" },
              { name: "Julien, Marseille", date: "15/02/2025", rating: 5, comment: "Les commentaires français sont parfaits et très pertinents. Mon taux d'engagement a explosé grâce à ce service." },
              { name: "Emma, Strasbourg", date: "03/02/2025", rating: 5, comment: "Excellent service ! Les commentaires sont authentiques et ont attiré plus de vraies interactions sur mes posts." }
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
            {pageData?.sectionTitles?.security || "Acheter des commentaires Instagram en toute sécurité avec Doctor Followers"}
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

      </main>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-8">
                <div className="flex h-16 w-16 shrink-0 aspect-square items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg mr-5">
                  <Instagram className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl md:text-5xl font-semibold text-slate-800 leading-tight">
                  {pageData?.hero?.title || "Commentaires Instagram"}
                </h2>
              </div>
              {pageData?.hero?.description ? (
                <div className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  <PortableText content={pageData.hero.description} />
                </div>
              ) : (
                <p className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  Des commentaires authentiques et personnalisés pour booster l'engagement de vos posts
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-base">
                <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                  <Star className="w-5 h-5 text-warm-yellow-500" strokeWidth={1.5} />
                  <span className="font-medium text-slate-700">4.9/5</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                  <MessageCircle className="w-5 h-5 text-lavender-500" strokeWidth={1.5} />
                  <span className="font-medium text-slate-700">+50K commentaires</span>
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
                  alt={pageData.hero.image.alt || "Instagram Comments and Engagement Analytics"} 
                  className="rounded-card shadow-soft-xl"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Instagram Comments and Engagement Analytics" 
                  className="rounded-card shadow-soft-xl"
                />
              )}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-soft-pink-600 font-semibold text-lg">💬 +85% Engagement</div>
                <div className="text-sm text-slate-600">Boost achieved</div>
              </div>
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-lavender-600 font-semibold text-lg">📊 +20K Comments</div>
                <div className="text-sm text-slate-600">Monthly delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Why Buy Comments Section */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-slate-800 mb-16">
            {pageData?.sectionTitles?.whyBuy || "Pourquoi acheter des commentaires Instagram en 2025?"}
          </h2>

          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {pageData?.whyBuySection?.engagement?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.engagement.image.url} 
                    alt={pageData.whyBuySection.engagement.image.alt || "Instagram Comments and Engagement Analytics"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Instagram Comments and Engagement Analytics" 
                    className="rounded-card shadow-soft-xl"
                  />
                )}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.engagement?.title || "Augmenter votre engagement"}
                </h3>
                {pageData?.whyBuySection?.engagement?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.engagement.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    Sur Instagram, les commentaires sont l'indicateur le plus fort d'engagement. Plus vos posts reçoivent de commentaires, plus l'algorithme les met en avant. Que vous soyez créateur de contenu, entrepreneur ou influenceur, un faible engagement nuit à votre visibilité. Acheter des commentaires Instagram permet de booster votre engagement. Un post avec beaucoup de commentaires inspire confiance et attire naturellement plus d'interactions... et suscite plus d'intérêt de la part de l'algorithme.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-1 lg:order-none">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.portee?.title || "Améliorer votre portée organique"}
                </h3>
                {pageData?.whyBuySection?.portee?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.portee.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    L'algorithme d'Instagram privilégie les contenus qui génèrent de l'engagement rapidement. Plus vos posts reçoivent de commentaires dans les premières heures, plus ils sont susceptibles d'apparaître dans l'onglet Explorer et d'être montrés à plus d'utilisateurs... En achetant des commentaires Instagram français, vous renforcez votre portée organique. Plus vos publications engagent, plus Instagram vous montre à de nouveaux utilisateurs. C'est un cercle vertueux que vous pouvez activer avec des commentaires de qualité.
                  </p>
                )}
              </div>
              <div className="order-first lg:order-none">
                {pageData?.whyBuySection?.portee?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.portee.image.url} 
                    alt={pageData.whyBuySection.portee.image.alt || "Instagram Analytics Dashboard showing Comments and Reach"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Instagram Analytics Dashboard showing Comments and Reach" 
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
                    alt={pageData.whyBuySection.credibilite.image.alt || "Instagram Business Profile with High Comments"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Instagram Business Profile with High Comments" 
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
                    Construire votre crédibilité ne doit pas se limiter à gonfler vos chiffres. Chez Doctor Followers, nous vous aidons à construire une crédibilité authentique et durable. Chaque commentaire livré provient d'un utilisateur réel, susceptible d'interagir naturellement avec votre contenu. Associé à un contenu régulier, cela favorise des interactions naturelles. L'objectif n'est pas juste d'avoir plus de commentaires, mais de créer une preuve sociale forte qui attire de vrais fans et clients.
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
          faqs={pageData?.faq?.questions || [
            {
              question: "Combien de temps faut-il pour recevoir mes commentaires ?",
              answer: "Dès que votre paiement est confirmé, la livraison des commentaires débute rapidement. En général, vous recevez vos commentaires dans un délai de 1 à 12 heures. Si vous optez pour l'option express, votre commande est traitée en moins de 2 heures. Il est également possible de choisir une livraison progressive, répartie sur plusieurs heures, pour un engagement plus naturel et durable de vos posts Instagram."
            },
            {
              question: "Les commentaires Instagram achetés sont-ils réels ?",
              answer: "Oui, absolument. Sur Doctor Followers, nous mettons un point d'honneur à fournir uniquement des commentaires réels et authentiques. Ces commentaires proviennent de profils actifs d'Europe de l'Ouest, et pour les commandes premium, ils sont spécifiquement sélectionnés selon votre région afin de garantir une meilleure compatibilité avec votre audience cible. Aucun faux profil, aucun robot : chaque commentaire livré provient d'un utilisateur authentique, susceptible d'interagir naturellement avec votre contenu."
            },
            {
              question: "Est-ce risqué d'acheter des commentaires Instagram ?",
              answer: "Non, à condition de passer par un fournisseur sérieux comme Doctor Followers. Nos méthodes de livraison sont conformes aux conditions d'utilisation d'Instagram. Nous ne vous demandons jamais vos identifiants, et nous utilisons uniquement des profils authentiques. Depuis 2018, aucun de nos clients n'a été banni ou pénalisé par Instagram."
            },
            {
              question: "Quel est le nombre maximum de commentaires Instagram que je peux acheter ?",
              answer: "Sur notre site, vous pouvez acheter jusqu'à 10 000 commentaires Instagram en un seul achat. Pour des quantités plus importantes, vous pouvez nous contacter par email afin que nous vous proposions un devis personnalisé adapté à vos besoins et à vos délais."
            },
            {
              question: "Le paiement est-il sécurisé ?",
              answer: "Absolument. Toutes les transactions sur Doctor Followers sont protégées par un protocole SSL de dernière génération. Nous utilisons des partenaires bancaires reconnus pour garantir la sécurité de vos données. De plus, nous ne demandons jamais vos identifiants Instagram. Seul le lien de votre profil est requis."
            },
            {
              question: "Proposez-vous une garantie en cas de perte de commentaires ?",
              answer: "Oui. Si certains commentaires disparaissent dans les 30 jours suivant la commande, ils sont automatiquement remplacés grâce à notre garantie incluse. Vous conservez ainsi le même nombre de commentaires, sans frais supplémentaires."
            },
            {
              question: "Les commentaires achetés peuvent-ils disparaître ?",
              answer: "Comme tout engagement sur Instagram, un commentaire peut disparaître avec le temps, notamment si le profil qui a commenté est suspendu ou supprimé. Cela reste marginal, mais pour compenser ces éventuelles pertes, notre garantie de remplacement est prévue dans chaque commande."
            },
            {
              question: "D'où viennent vos commentaires ?",
              answer: "Nos commentaires proviennent principalement de profils francophones d'Europe de l'Ouest, comme la France, la Belgique ou la Suisse. Ce ciblage permet de renforcer votre crédibilité si vous vous adressez à une audience francophone."
            },
            {
              question: "Comment optimiser l'effet des commentaires achetés ?",
              answer: "Acheter des commentaires Instagram permet de booster votre engagement, mais l'impact réel dépend aussi de votre activité sur la plateforme. Il est essentiel de publier régulièrement, de proposer un contenu de qualité, d'interagir avec votre audience et de soigner votre stratégie de communication. Ces efforts renforcent l'engagement de vos posts et valorisent l'investissement."
            },
            {
              question: "Est-ce que les commentaires achetés vont générer plus d'engagement ?",
              answer: "Chez Doctor Followers, nous fournissons uniquement des commentaires Instagram réels, issus de profils actifs. Leur impact sur l'engagement dépendra en grande partie de la qualité de votre contenu. Si vos publications sont pertinentes, attrayantes et bien ciblées, les commentaires achetés peuvent naturellement attirer plus d'interactions (likes, réponses, nouveaux followers). Toutefois, comme pour tout engagement, l'effet ne peut jamais être garanti à 100 %. C'est pourquoi nous recommandons d'allier achat de commentaires avec une stratégie de contenu régulière et engageante."
            },
            {
              question: "Puis-je choisir sur quels posts appliquer les commentaires ?",
              answer: "Oui, absolument ! Après avoir sélectionné votre pack de commentaires et votre profil Instagram, vous pourrez choisir spécifiquement sur quels posts vous souhaitez appliquer les commentaires. Notre système vous permet de sélectionner les posts de votre choix et de répartir les commentaires selon vos préférences."
            },
            {
              question: "Les commentaires sont-ils distribués de manière naturelle ?",
              answer: "Oui, nous distribuons les commentaires de manière progressive et naturelle pour éviter tout soupçon. Les commentaires arrivent de façon échelonnée sur plusieurs heures, simulant un engagement organique naturel. Cela garantit que vos posts gagnent en visibilité sans éveiller les soupçons de l'algorithme d'Instagram."
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
          comments: getPackageComments(selectedPackage),
          price: getPackagePriceLocal(selectedPackage),
          followerType: followerType as 'french' | 'international'
        }}
      />

      <InstagramPostsModal
        isOpen={isPostsModalOpen}
        onClose={() => setIsPostsModalOpen(false)}
        username={selectedProfile}
        totalLikes={getPackageComments(selectedPackage)}
        onPostsSelected={handlePostsSelected}
        isComments={true}
        selectedPackage={selectedPackage}
        getPackagePrice={getPackagePriceLocal}
        pricePerPost={getPackagePriceLocal(selectedPackage)}
      />
    </div>
  );
}
