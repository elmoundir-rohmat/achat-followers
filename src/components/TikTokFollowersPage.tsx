import React, { useState, useEffect } from 'react';
import { Music, Star, Shield, Users2, Zap, CheckCircle, Heart, TrendingUp, ArrowLeft, X } from 'lucide-react';
import PackageSelector from './PackageSelector';
import TikTokDeliveryModal from './TikTokDeliveryModal';
import TikTokCheckoutPage from './TikTokCheckoutPage';
import GuaranteeSection from './GuaranteeSection';
import FAQSection from './FAQSection';
import { useCart } from '../contexts/CartContext';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';
import { PageService, TikTokFollowersPageData } from '../services/pageService';
import { updateSEOMetadata } from '../utils/seoMetadata';
import PortableText from './PortableText';

// FAQ data pour le Schema.org (fallback si Sanity n'a pas de FAQ)
const faqData = [
  {
    question: "Comment acheter des followers TikTok sur Doctor Followers ?",
    answer: "Le processus est très simple : 1) Choisissez votre pack de followers TikTok, 2) Sélectionnez la quantité désirée, 3) Cliquez sur 'Acheter maintenant' et entrez le lien de votre compte TikTok, 4) Procédez au paiement sécurisé. Aucun mot de passe n'est requis, seulement le lien de votre profil TikTok. La livraison commence automatiquement dès la confirmation du paiement."
  },
  {
    question: "Combien de temps faut-il pour recevoir mes followers TikTok ?",
    answer: "La livraison débute immédiatement après la confirmation de votre paiement. En général, vous recevez vos followers TikTok dans un délai de 24 à 48 heures. Pour une croissance plus naturelle et discrète, vous pouvez choisir une livraison progressive répartie sur plusieurs jours. Notre système respecte les limites de TikTok pour éviter tout risque de détection."
  },
  {
    question: "Les followers TikTok achetés sont-ils réels et actifs ?",
    answer: "Oui, absolument. Chez Doctor Followers, nous fournissons exclusivement des followers TikTok réels et actifs. Ce sont des comptes authentiques d'utilisateurs réels, principalement originaires d'Europe de l'Ouest. Aucun bot, aucun faux profil, aucun compte inactif. Chaque follower acheté est un utilisateur réel susceptible d'interagir avec votre contenu si celui-ci correspond à ses centres d'intérêt."
  },
  {
    question: "Est-ce risqué d'acheter des followers TikTok ? Mon compte peut-il être banni ?",
    answer: "Non, votre compte TikTok ne risque rien si vous passez par un fournisseur sérieux comme Doctor Followers. Nos méthodes sont 100% conformes aux conditions d'utilisation de TikTok. Nous respectons les limites de l'algorithme, utilisons uniquement des profils authentiques, et ne demandons jamais vos identifiants. Nous livrons progressivement pour une croissance naturelle. Aucun de nos clients n'a jamais été banni grâce à nos méthodes sécurisées."
  },
  {
    question: "Quel est le nombre minimum et maximum de followers que je peux acheter ?",
    answer: "Vous pouvez acheter des followers TikTok à partir de 25 abonnés jusqu'à 50 000 en un seul achat. Pour des quantités supérieures (100 000+ followers), contactez-nous par email pour un devis personnalisé. Nous proposons également des packs progressifs pour une croissance régulière sur plusieurs semaines."
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons tous les moyens de paiement sécurisés : cartes bancaires (Visa, Mastercard, American Express), PayPal, et virements bancaires. Toutes les transactions sont protégées par un protocole SSL de dernière génération et un cryptage 256 bits. Vos données bancaires ne sont jamais stockées sur nos serveurs."
  },
  {
    question: "Proposez-vous une garantie sur les followers TikTok achetés ?",
    answer: "Oui, nous offrons une garantie de 30 jours incluse dans chaque commande. Si certains followers se désabonnent dans les 30 jours suivant la livraison, ils sont automatiquement remplacés gratuitement. De plus, nous proposons une garantie 'Satisfait ou remboursé' : si vous n'êtes pas satisfait, nous vous remboursons intégralement dans les 24 heures."
  }
];

export default function TikTokFollowersPage({ onBack }: { onBack: () => void }) {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const { addToCart } = useCart();
  const [pageData, setPageData] = useState<TikTokFollowersPageData | null>(null);

  // Charger les données SEO depuis Sanity
  useEffect(() => {
    PageService.getTikTokFollowersPage().then(setPageData);
  }, []);

  // Mettre à jour les métadonnées SEO
  useEffect(() => {
    updateSEOMetadata(pageData);
  }, [pageData]);

  // Ajouter le Schema FAQPage dynamique pour le SEO (utilise les FAQ de Sanity si disponibles)
  useEffect(() => {
    const faqsToUse = pageData?.faq?.questions || faqData;
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'faq-schema-tiktok-followers';
    
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqsToUse.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    schemaScript.textContent = JSON.stringify(schemaData);
    
    const existingScript = document.getElementById('faq-schema-tiktok-followers');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(schemaScript);
    
    return () => {
      const script = document.getElementById('faq-schema-tiktok-followers');
      if (script) {
        script.remove();
      }
    };
  }, [pageData]);

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
      followers: followersCount,
      price: totalPrice,
      followerType: 'premium' as any,
      platform: 'TikTok',
      username: tiktokUrl,
      deliveryOption: {
        runs: deliveryOption.runs,
        interval: deliveryOption.interval,
        totalTime: deliveryOption.totalTime,
        additionalCost: deliveryOption.additionalCost
      }
    });
    
    // Rediriger vers la page de panier
    window.location.href = '/cart';
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
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 mt-0 mb-6 text-center">
          {pageData?.pageH1 || "Acheter des followers TikTok"}
        </h1>

        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
          followerType="premium"
          isTikTokFollowers={true}
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
                    {getPackageFollowers(selectedPackage).toLocaleString()} followers TikTok Premium
                  </span>
                  <span className="text-4xl font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">
                    {getPrice(selectedPackage)?.toFixed(2)}€
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
                    <span className="text-slate-700 font-medium">Profils réels</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 hover:shadow-soft-xl hover:scale-105 text-white font-semibold py-5 px-14 rounded-button transition-all duration-300 shadow-soft-lg text-lg"
              >
                <Music className="w-6 h-6 inline mr-3" strokeWidth={2} />
                Acheter maintenant
              </button>

              <p className="text-sm text-slate-600 mt-6">
                🔒 Paiement sécurisé • Aucun mot de passe requis • Livraison garantie
              </p>
            </div>
          </div>
        )}

        {/* Features Section - Types de Followers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-lavender-100 to-baby-purple-100 rounded-card-sm flex items-center justify-center mr-4 shadow-soft">
                <Users2 className="w-7 h-7 text-lavender-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.followerTypes?.international?.title || "Followers Internationaux"}
              </h3>
            </div>
            <div className="space-y-4">
              {(pageData?.followerTypes?.international?.descriptions || [
                "Acheter de vrais TikTok followers, sans ciblage particulier, provenant de l'Europe de l'ouest.",
                "Les followers que nous vous fournissons n'auront pas d'intérêts particuliers pour votre activité.",
                "Leur engagement est variable en fonction de la qualité de votre contenu."
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
                <Heart className="w-7 h-7 text-soft-pink-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.followerTypes?.french?.title || "Abonnés TikTok Français"}
              </h3>
            </div>
            <div className="space-y-4">
              {(pageData?.followerTypes?.french?.descriptions || [
                "Acheter des Followers ciblés selon votre région.",
                "Nous sélectionnons les followers qui sont intéressés par votre domaine d'activité",
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

        {/* Security & Guarantees Section */}
        <div className="bg-gradient-to-br from-lavender-50/50 via-soft-pink-50/50 to-peach-50/50 rounded-card p-10 mb-20 border border-soft-pink-200/50 shadow-soft-lg">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-slate-800 mb-12">
            {pageData?.sectionTitles?.security || "Renforcez votre crédibilité sur TikTok"}
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
                  demanderons jamais vos identifiants TikTok.
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
                  <Music className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl md:text-5xl font-semibold text-slate-800 leading-tight">
                  {pageData?.hero?.title || "Acheter des Followers TikTok Réels et Actifs"}
                </h2>
              </div>
              {pageData?.hero?.description ? (
                <div className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  <PortableText content={pageData.hero.description} />
                </div>
              ) : (
                <p className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  Acheter des followers TikTok réels et actifs pour faire grandir votre communauté
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-base">
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
            <div className="relative">
              {pageData?.hero?.image?.url ? (
                <img 
                  src={pageData.hero.image.url} 
                  alt={pageData.hero.image.alt || "TikTok Followers Growth Dashboard"} 
                  className="rounded-card shadow-soft-xl"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="TikTok Followers Growth Dashboard" 
                  className="rounded-card shadow-soft-xl"
                />
              )}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-lavender-600 font-semibold text-lg">+1.2M Followers</div>
                <div className="text-sm text-slate-600">Growth achieved</div>
              </div>
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-soft-pink-600 font-semibold text-lg">📈 +98% Growth</div>
                <div className="text-sm text-slate-600">Monthly increase</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Why Buy Followers Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-slate-800 mb-16">
            {pageData?.sectionTitles?.whyBuy || "Pourquoi acheter des followers TikTok réels et actifs en 2025?"}
          </h2>

          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {pageData?.whyBuySection?.credibilite?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.credibilite.image.url} 
                    alt={pageData.whyBuySection.credibilite.image.alt || "TikTok Profile with High Follower Count"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="TikTok Profile with High Follower Count" 
                    className="rounded-card shadow-soft-xl"
                  />
                )}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.credibilite?.title || "Améliorer votre crédibilité"}
                </h3>
                {pageData?.whyBuySection?.credibilite?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.credibilite.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    Sur TikTok, la crédibilité d'un compte repose sur deux éléments : 
                    le nombre d'abonnés et l'engagement. Que vous soyez créateur de contenu,
                    entrepreneur ou influenceur, un faible nombre de followers nuit à votre image. 
                    <strong className="text-soft-pink-600">Acheter des abonnés TikTok</strong> permet de franchir ce cap. 
                    Un compte bien suivi inspire confiance, attire naturellement plus d'abonnés... 
                    et suscite plus d'intérêt de la part de l'algorithme.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-1 lg:order-none">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.explorer?.title || 'Apparaître dans l\'onglet "Pour vous"'}
                </h3>
                {pageData?.whyBuySection?.explorer?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.explorer.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    L'onglet "Pour vous" est la vitrine ultime sur TikTok. C'est ici que l'algorithme
                    met en avant les contenus susceptibles de devenir viraux. Pour y figurer, votre compte
                    doit générer un taux d'interaction élevé : likes, commentaires, vues, partages...
                    <strong className="text-soft-pink-600">En achetant des followers TikTok</strong>, 
                    vous renforcez votre activité sur la plateforme.
                    Plus vos publications engagent, plus TikTok vous met en avant. C'est un cercle
                    vertueux que vous pouvez activer avec des followers de qualité.
                  </p>
                )}
              </div>
              <div className="order-first lg:order-none">
                {pageData?.whyBuySection?.explorer?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.explorer.image.url} 
                    alt={pageData.whyBuySection.explorer.image.alt || "TikTok For You Page with Trending Videos"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="TikTok For You Page with Trending Videos" 
                    className="rounded-card shadow-soft-xl"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {pageData?.whyBuySection?.communaute?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.communaute.image.url} 
                    alt={pageData.whyBuySection.communaute.image.alt || "TikTok Community Building and Engagement"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="TikTok Community Building and Engagement" 
                    className="rounded-card shadow-soft-xl"
                  />
                )}
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.communaute?.title || "Bâtir une vraie communauté"}
                </h3>
                {pageData?.whyBuySection?.communaute?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.communaute.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <strong className="text-lavender-600">Bâtir une vraie communauté</strong> ne doit pas se limiter à gonfler vos chiffres.
                    Chez Doctor Followers, nous vous aidons à bâtir une communauté authentique
                    et durable. Chaque abonné livré est un utilisateur réel, sélectionné pour correspondre
                    à votre profil. Associé à un contenu régulier, cela favorise des interactions naturelles.
                    L'objectif n'est pas juste d'avoir plus de followers, mais de <strong className="text-lavender-600">créer des liens avec des
                    abonnés</strong> susceptibles de devenir clients, fans ou partenaires.
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
          faqs={pageData?.faq?.questions || faqData}
          title={pageData?.sectionTitles?.testimonials || "Questions fréquemment posées"}
        />
      </main>

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
