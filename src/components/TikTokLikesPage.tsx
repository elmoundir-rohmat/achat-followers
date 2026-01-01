import React, { useState, useEffect } from 'react';
import { Music, Star, Shield, Heart, Zap, X, CheckCircle, ThumbsUp } from 'lucide-react';
import PackageSelector from './PackageSelector';
import TikTokLikesDeliveryModal from './TikTokLikesDeliveryModal';
import GuaranteeSection from './GuaranteeSection';
import FAQSection from './FAQSection';
import { useCart } from '../contexts/CartContext';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';
import { PageService, TikTokLikesPageData } from '../services/pageService';
import { updateSEOMetadata } from '../utils/seoMetadata';
import PortableText from './PortableText';

// FAQ data pour le Schema.org (fallback si Sanity n'a pas de FAQ)
const faqData = [
  {
    question: "Combien de temps faut-il pour recevoir mes likes TikTok ?",
    answer: "Dès que votre paiement est confirmé, la livraison des likes débute rapidement. En général, vous recevez vos likes TikTok dans un délai de 1 à 6 heures. Si vous optez pour l'option express, votre commande est traitée en moins de 30 minutes. Il est également possible de choisir une livraison progressive, répartie sur plusieurs heures, pour un engagement plus naturel et durable de vos vidéos TikTok."
  },
  {
    question: "Les likes TikTok achetés sont-ils réels ?",
    answer: "Oui, absolument. Sur Doctor Followers, nous mettons un point d'honneur à fournir uniquement des likes réels et authentiques. Ces likes proviennent de profils actifs d'Europe de l'Ouest. Aucun faux profil, aucun robot : chaque like livré provient d'un utilisateur authentique, susceptible d'interagir naturellement avec votre contenu."
  },
  {
    question: "Est-ce risqué d'acheter des likes TikTok ?",
    answer: "Non, à condition de passer par un fournisseur sérieux comme Doctor Followers. Nos méthodes de livraison sont conformes aux conditions d'utilisation de TikTok. Nous ne vous demandons jamais vos identifiants, et nous utilisons uniquement des profils authentiques. Depuis 2018, aucun de nos clients n'a été banni ou pénalisé par TikTok."
  },
  {
    question: "Quel est le nombre maximum de likes TikTok que je peux acheter ?",
    answer: "Sur notre site, vous pouvez acheter jusqu'à 100 000 likes TikTok en un seul achat. Pour des quantités plus importantes, vous pouvez nous contacter par email afin que nous vous proposions un devis personnalisé adapté à vos besoins et à vos délais."
  },
  {
    question: "Le paiement est-il sécurisé ?",
    answer: "Absolument. Toutes les transactions sur Doctor Followers sont protégées par un protocole SSL de dernière génération. Nous utilisons des partenaires bancaires reconnus pour garantir la sécurité de vos données. De plus, nous ne demandons jamais vos identifiants TikTok. Seul le lien de votre vidéo est requis."
  },
  {
    question: "Proposez-vous une garantie en cas de perte de likes ?",
    answer: "Oui. Si certains likes disparaissent dans les 30 jours suivant la commande, ils sont automatiquement remplacés grâce à notre garantie incluse. Vous conservez ainsi le même nombre de likes, sans frais supplémentaires."
  }
];

export default function TikTokLikesPage({ onBack }: { onBack: () => void }) {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const { addToCart } = useCart();
  const [pageData, setPageData] = useState<TikTokLikesPageData | null>(null);

  // Charger les données SEO depuis Sanity
  useEffect(() => {
    PageService.getTikTokLikesPage().then(setPageData);
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
    schemaScript.id = 'faq-schema-tiktok-likes';
    
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
    
    const existingScript = document.getElementById('faq-schema-tiktok-likes');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(schemaScript);
    
    return () => {
      const script = document.getElementById('faq-schema-tiktok-likes');
      if (script) {
        script.remove();
      }
    };
  }, [pageData]);

  const getPrice = (packageId: string) => {
    return getPackagePrice(packageId, 'tiktok_likes');
  };

  const getPackageLikes = (packageId: string) => {
    return getPackageQuantity(packageId, 'tiktok_likes');
  };

  const validateTikTokUrl = (url: string): boolean => {
    const tiktokPatterns = [
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
      /^https?:\/\/(www\.)?tiktok\.com\/t\/[\w]+/,
      /^https?:\/\/(vm\.)?tiktok\.com\/[\w]+/,
      /^@[\w.-]+\/video\/\d+$/,
      /^tiktok\.com\/@[\w.-]+\/video\/\d+/
    ];
    return tiktokPatterns.some(pattern => pattern.test(url.trim()));
  };

  const normalizeTikTokUrl = (url: string): string => {
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
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
    const totalPrice = getPrice(selectedPackage) + deliveryOption.additionalCost;
    const normalizedUrl = normalizeTikTokUrl(tiktokUrl);
    
    addToCart({
      likes: getPackageLikes(selectedPackage),
      price: totalPrice,
      followerType: 'premium' as any,
      platform: 'TikTok',
      username: normalizedUrl,
      delivery: deliveryOption
    });
    
    window.location.href = '/cart';
  };

  const handleCheckoutComplete = (orderData: any) => {
    console.log('Commande TikTok Likes terminée:', orderData);
    const totalLikes = orderData.totalLikes || orderData.items.reduce((sum: number, item: any) => sum + (item.likes || 0), 0);
    const totalPrice = orderData.total || orderData.items.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
    
    alert(`Commande TikTok Likes confirmée !\n\n` +
          `✅ ${totalLikes.toLocaleString()} likes TikTok\n` +
          `💰 Prix total: ${totalPrice.toFixed(2)}€\n` +
          `📧 Email: ${orderData.customer?.email || 'N/A'}\n` +
          `🆔 ID commande: ${orderData.orderId}\n\n` +
          `Votre commande a été envoyée au fournisseur et sera traitée dans les plus brefs délais.`);
    
    setCurrentStep('selection');
    setTiktokUrl('');
    setSelectedPackage('');
  };

  return (
    <div className="min-h-screen bg-cream font-rounded">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg mr-5">
                  <Heart className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold text-slate-800 leading-tight">
                  {pageData?.hero?.title || "Acheter des Likes TikTok Réels et Actifs"}
                </h1>
              </div>
              {pageData?.hero?.description ? (
                <div className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  <PortableText content={pageData.hero.description} />
                </div>
              ) : (
                <p className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  Des likes réels et authentiques pour augmenter l'engagement de vos vidéos TikTok
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-base">
                <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                  <Star className="w-5 h-5 text-warm-yellow-500" strokeWidth={1.5} />
                  <span className="font-medium text-slate-700">4.8/5</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                  <ThumbsUp className="w-5 h-5 text-lavender-500" strokeWidth={1.5} />
                  <span className="font-medium text-slate-700">+100K likes</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                  <Shield className="w-5 h-5 text-soft-pink-500" strokeWidth={1.5} />
                  <span className="font-medium text-slate-700">100% sécurisé</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1611162617263-4d4e51421e7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="TikTok Likes and Engagement Analytics" 
                className="rounded-card shadow-soft-xl"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-soft-pink-600 font-semibold text-lg">❤️ +127% Engagement</div>
                <div className="text-sm text-slate-600">Boost achieved</div>
              </div>
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-lavender-600 font-semibold text-lg">📊 +50K Likes</div>
                <div className="text-sm text-slate-600">Monthly delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        
        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
          followerType="premium"
          isTikTokLikes={true}
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
                    {getPackageLikes(selectedPackage).toLocaleString()} likes TikTok Premium
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
                    <span className="text-slate-700 font-medium">Likes réels</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 hover:shadow-soft-xl hover:scale-105 text-white font-semibold py-5 px-14 rounded-button transition-all duration-300 shadow-soft-lg text-lg"
              >
                <Heart className="w-6 h-6 inline mr-3" strokeWidth={2} />
                Acheter maintenant
              </button>

              <p className="text-sm text-slate-600 mt-6">
                🔒 Paiement sécurisé • Aucun mot de passe requis • Livraison garantie
              </p>
            </div>
          </div>
        )}

        {/* Features Section - Types de Likes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-lavender-100 to-baby-purple-100 rounded-card-sm flex items-center justify-center mr-4 shadow-soft">
                <ThumbsUp className="w-7 h-7 text-lavender-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.likeTypes?.international?.title || "Likes Internationaux"}
              </h3>
            </div>
            <div className="space-y-4">
              {(pageData?.likeTypes?.international?.descriptions || [
                "Acheter de vrais TikTok likes, sans ciblage particulier, provenant de l'Europe de l'ouest.",
                "Les likes que nous vous fournissons proviennent de profils actifs et authentiques.",
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
                <Heart className="w-7 h-7 text-soft-pink-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.likeTypes?.french?.title || "Likes TikTok Français"}
              </h3>
            </div>
            <div className="space-y-4">
              {(pageData?.likeTypes?.french?.descriptions || [
                "Acheter des likes ciblés selon votre région française.",
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
              <span className="text-3xl font-semibold bg-gradient-to-r from-soft-pink-500 to-lavender-500 bg-clip-text text-transparent">4.8</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-warm-yellow-400 fill-current" strokeWidth={1.5} />
                ))}
              </div>
              <span className="text-slate-600 font-medium">(189 avis)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Marie, Toulouse", date: "18/03/2025", rating: 5, comment: "Excellent service ! Mes vidéos TikTok ont vu leur engagement exploser en quelques heures. Je recommande vivement !" },
              { name: "Antoine, Nice", date: "12/02/2025", rating: 5, comment: "Les likes sont arrivés très rapidement et de manière naturelle. Mon taux d'engagement a doublé !" },
              { name: "Camille, Bordeaux", date: "28/01/2025", rating: 4, comment: "Service fiable et efficace. Mes vidéos ont gagné en visibilité grâce aux likes français ciblés." }
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
        <div className="bg-gradient-to-br from-soft-pink-50/50 via-peach-50/50 to-lavender-50/50 rounded-card p-10 mb-20 border border-soft-pink-200/50 shadow-soft-lg">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-slate-800 mb-12">
            {pageData?.sectionTitles?.security || "Acheter des likes TikTok en toute sécurité avec Doctor Followers"}
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

        {/* Why Buy Likes Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-slate-800 mb-16">
            {pageData?.sectionTitles?.whyBuy || "Pourquoi acheter des likes TikTok en 2025?"}
          </h2>

          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1611162617263-4d4e51421e7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="TikTok Video with High Likes and Engagement" 
                  className="rounded-card shadow-soft-xl"
                />
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
                    Sur TikTok, l'engagement est roi. Plus vos vidéos reçoivent de likes, 
                    plus l'algorithme les met en avant. Que vous soyez créateur de contenu,
                    entrepreneur ou influenceur, un faible engagement nuit à votre visibilité. 
                    <strong className="text-soft-pink-600">Acheter des likes TikTok</strong> permet de booster votre engagement. 
                    Une vidéo avec beaucoup de likes inspire confiance et attire naturellement plus d'interactions... 
                    et suscite plus d'intérêt de la part de l'algorithme.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.portee?.title || "Améliorer votre portée organique"}
                </h3>
                {pageData?.whyBuySection?.portee?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.portee.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    L'algorithme de TikTok privilégie les contenus qui génèrent de l'engagement rapidement. 
                    Plus vos vidéos reçoivent de likes dans les premières heures, plus elles sont susceptibles 
                    d'apparaître dans l'onglet "Pour vous" et d'être montrées à plus d'utilisateurs. 
                    <strong className="text-soft-pink-600">En achetant des likes TikTok</strong>, 
                    vous renforcez votre portée organique. Plus vos publications engagent, plus TikTok vous montre à de nouveaux utilisateurs. C'est un cercle
                    vertueux que vous pouvez activer avec des likes de qualité.
                  </p>
                )}
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="TikTok Analytics Dashboard showing Reach and Impressions" 
                  className="rounded-card shadow-soft-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="TikTok Business Profile with High Engagement Metrics" 
                  className="rounded-card shadow-soft-xl"
                />
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
                    <strong className="text-orange-600">Construire votre crédibilité</strong> ne doit pas se limiter à gonfler vos chiffres.
                    Chez Doctor Followers, nous vous aidons à construire une crédibilité authentique
                    et durable. Chaque like livré provient d'un utilisateur réel, susceptible d'interagir
                    naturellement avec votre contenu. Associé à un contenu régulier, cela favorise des interactions naturelles.
                    L'objectif n'est pas juste d'avoir plus de likes, mais de <strong className="text-lavender-600">créer une preuve sociale
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
          faqs={pageData?.faq?.questions || faqData}
        />
      </main>

      {/* Modal de confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-card shadow-soft-xl max-w-lg w-full border border-soft-pink-200/50">
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
                    <span className="text-slate-600">Likes TikTok:</span>
                    <span className="font-semibold text-slate-800">{getPackageLikes(selectedPackage).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-semibold text-slate-800">Premium Likes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Prix:</span>
                    <span className="font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">{getPrice(selectedPackage).toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="tiktok-url" className="block text-sm font-medium text-slate-700 mb-2">
                  Lien de votre post TikTok *
                </label>
                <input
                  type="text"
                  id="tiktok-url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@username/video/1234567890"
                  className="w-full px-4 py-3 border border-soft-pink-200/50 rounded-card-sm focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 text-slate-900 bg-white/80 backdrop-blur-sm transition-all"
                />
                <div className="text-xs text-slate-500 mt-2">
                  <p className="font-medium mb-1">Formats acceptés :</p>
                  <p>• https://www.tiktok.com/@username/video/1234567890</p>
                  <p>• https://tiktok.com/@username/video/1234567890</p>
                  <p>• https://vm.tiktok.com/abc123</p>
                  <p>• @username/video/1234567890</p>
                </div>
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
                  disabled={!tiktokUrl.trim()}
                  className="flex-1 bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white py-3 rounded-button font-semibold hover:shadow-soft-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-soft"
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
        likesCount={getPackageLikes(selectedPackage)}
        followerType="premium" as any
        tiktokUrl={tiktokUrl}
        basePrice={getPrice(selectedPackage)}
      />
    </div>
  );
}
