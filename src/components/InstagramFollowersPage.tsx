import React, { useState, useEffect } from 'react';
import { Users, Instagram, Star, Shield, Clock, CheckCircle, Heart, TrendingUp, Users2, Zap, ArrowLeft } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import GuaranteeSection from './GuaranteeSection';
import InstagramSearchModal from './InstagramSearchModal';
import CheckoutPage from './CheckoutPage';
import FAQSection from './FAQSection';
import { useCart } from '../contexts/CartContext';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';
import { PageService, InstagramFollowersPageData } from '../services/pageService';
import { updateSEOMetadata } from '../utils/seoMetadata';
import PortableText from './PortableText';

// FAQ data pour le Schema.org
const faqData = [
  {
    question: "Comment acheter des followers Instagram sur Doctor Followers ?",
    answer: "Le processus est très simple : 1) Choisissez votre pack de followers (français ou internationaux), 2) Sélectionnez la quantité désirée, 3) Cliquez sur 'Acheter maintenant' et entrez votre nom d'utilisateur Instagram, 4) Procédez au paiement sécurisé. Aucun mot de passe n'est requis, seulement le lien de votre profil Instagram. La livraison commence automatiquement dès la confirmation du paiement."
  },
  {
    question: "Combien de temps faut-il pour recevoir mes followers Instagram ?",
    answer: "La livraison débute immédiatement après la confirmation de votre paiement. En général, vous recevez vos followers Instagram dans un délai de 6 à 24 heures. Pour une croissance plus naturelle et discrète, vous pouvez choisir une livraison progressive répartie sur plusieurs jours. Notre système respecte les limites d'Instagram pour éviter tout risque de détection."
  },
  {
    question: "Les followers Instagram achetés sont-ils réels et actifs ?",
    answer: "Oui, absolument. Chez Doctor Followers, nous fournissons exclusivement des followers Instagram réels et actifs. Ce sont des comptes authentiques d'utilisateurs réels, principalement originaires d'Europe de l'Ouest (France, Belgique, Suisse). Aucun bot, aucun faux profil, aucun compte inactif. Chaque follower acheté est un utilisateur réel susceptible d'interagir avec votre contenu si celui-ci correspond à ses centres d'intérêt."
  },
  {
    question: "Quelle est la différence entre followers français et internationaux ?",
    answer: "Les followers Instagram français sont ciblés selon votre région et votre domaine d'activité. Ils sont plus susceptibles d'interagir avec votre contenu car ils partagent des intérêts similaires. Les followers internationaux proviennent d'Europe de l'Ouest sans ciblage spécifique. Ils sont idéaux pour augmenter rapidement votre nombre d'abonnés et améliorer votre crédibilité générale. Le choix dépend de vos objectifs : engagement localisé ou croissance rapide."
  },
  {
    question: "Est-ce risqué d'acheter des followers Instagram ? Mon compte peut-il être banni ?",
    answer: "Non, votre compte Instagram ne risque rien si vous passez par un fournisseur sérieux comme Doctor Followers. Nos méthodes sont 100% conformes aux conditions d'utilisation d'Instagram. Nous respectons les limites de l'algorithme, utilisons uniquement des profils authentiques, et ne demandons jamais vos identifiants. Nous livrons progressivement pour une croissance naturelle. Aucun de nos clients n'a jamais été banni grâce à nos méthodes sécurisées."
  },
  {
    question: "Quel est le nombre minimum et maximum de followers que je peux acheter ?",
    answer: "Vous pouvez acheter des followers Instagram à partir de 25 abonnés jusqu'à 50 000 en un seul achat. Pour des quantités supérieures (100 000+ followers), contactez-nous par email pour un devis personnalisé. Nous proposons également des packs progressifs pour une croissance régulière sur plusieurs semaines."
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons tous les moyens de paiement sécurisés : cartes bancaires (Visa, Mastercard, American Express), PayPal, et virements bancaires. Toutes les transactions sont protégées par un protocole SSL de dernière génération et un cryptage 256 bits. Vos données bancaires ne sont jamais stockées sur nos serveurs."
  },
  {
    question: "Proposez-vous une garantie sur les followers Instagram achetés ?",
    answer: "Oui, nous offrons une garantie de 30 jours incluse dans chaque commande. Si certains followers se désabonnent dans les 30 jours suivant la livraison, ils sont automatiquement remplacés gratuitement. De plus, nous proposons une garantie 'Satisfait ou remboursé' : si vous n'êtes pas satisfait, nous vous remboursons intégralement dans les 24 heures."
  },
  {
    question: "Les followers achetés vont-ils interagir avec mes publications (likes, commentaires) ?",
    answer: "Les followers que nous fournissons sont des utilisateurs réels et actifs. Leur niveau d'interaction dépend principalement de la qualité et de la pertinence de votre contenu. Si vos publications sont attrayantes, bien ciblées et régulières, certains followers achetés peuvent naturellement interagir (likes, vues, commentaires). Cependant, l'engagement ne peut jamais être garanti à 100%, comme pour toute communauté organique. Nous recommandons d'allier achat de followers avec une stratégie de contenu régulière."
  },
  {
    question: "Instagram peut-il détecter que j'ai acheté des followers ?",
    answer: "Non, Instagram ne peut pas détecter nos followers car ce sont des comptes réels et authentiques. Nous livrons progressivement pour simuler une croissance naturelle, respectons les limites de l'algorithme, et utilisons uniquement des profils avec une activité normale. Contrairement aux bots ou faux comptes, nos followers passent inaperçus car ils se comportent comme des utilisateurs organiques."
  },
  {
    question: "Dois-je fournir mon mot de passe Instagram pour acheter des followers ?",
    answer: "Absolument pas ! Nous ne demandons jamais vos identifiants Instagram. C'est même l'un des signes d'un service sérieux. Seul le lien de votre profil Instagram (ex: instagram.com/votrenom) est requis. Nous ne stockons aucune donnée sensible et respectons votre vie privée. Votre compte reste 100% sécurisé."
  },
  {
    question: "Que se passe-t-il si ma livraison est incomplète ou si des followers manquent ?",
    answer: "Si vous constatez que votre commande est incomplète, contactez immédiatement notre service client. Nous vérifions chaque commande et complétons automatiquement la livraison si nécessaire. Dans le cas rare d'un problème technique, nous livrons les followers manquants dans les 48 heures ou vous remboursons intégralement si vous le préférez."
  },
  {
    question: "Puis-je acheter des followers pour plusieurs comptes Instagram en même temps ?",
    answer: "Oui, vous pouvez commander des followers pour autant de comptes Instagram que vous souhaitez. Chaque commande est traitée indépendamment. Pour des commandes multiples, nous recommandons de les espacer légèrement (quelques heures d'intervalle) pour une croissance plus naturelle. Contactez-nous pour des commandes en gros volume (plus de 5 comptes simultanés)."
  },
  {
    question: "Les followers restent-ils sur mon compte à long terme ?",
    answer: "Oui, la grande majorité des followers restent sur votre compte. Comme pour toute communauté organique, il est normal qu'une petite partie (environ 2-5%) se désabonne avec le temps, notamment si votre contenu ne correspond pas à leurs intérêts. C'est pourquoi nous incluons une garantie de 30 jours pour remplacer automatiquement les followers perdus. Après cette période, la rétention est généralement excellente (95%+) si vous maintenez une activité régulière."
  },
  {
    question: "Comment optimiser l'impact des followers Instagram achetés ?",
    answer: "Pour maximiser l'effet des followers achetés : 1) Publiez du contenu régulièrement (minimum 3-4 fois par semaine), 2) Créez du contenu de qualité et engageant, 3) Interagissez avec votre audience (répondez aux commentaires, stories), 4) Utilisez les hashtags pertinents, 5) Publiez aux heures de forte activité, 6) Collaborez avec d'autres comptes. Ces bonnes pratiques renforcent l'engagement et valorisent votre investissement."
  },
  {
    question: "Puis-je annuler ma commande avant la livraison ?",
    answer: "Oui, vous pouvez annuler votre commande à tout moment avant le début de la livraison. Contactez-nous par email avec votre numéro de commande et nous procédons au remboursement intégral dans les 24 heures. Une fois la livraison commencée, notre garantie de remplacement s'applique en cas de problème."
  },
  {
    question: "Combien coûte l'achat de followers Instagram ?",
    answer: "Nos prix varient selon la quantité et le type de followers (français ou internationaux). Les packs démarrent à partir de 9,99€ pour 25 followers et peuvent aller jusqu'à 299,99€ pour 50 000 followers. Plus vous achetez, plus le prix par follower diminue. Les followers français sont généralement 10-15% plus chers que les internationaux car ils sont ciblés et plus engagés."
  },
  {
    question: "Vos followers Instagram proviennent-ils de vrais pays ?",
    answer: "Oui, absolument. Nos followers Instagram proviennent de vrais comptes situés principalement en Europe de l'Ouest : France, Belgique, Suisse, Allemagne, Espagne, Italie. Chaque follower a une localisation réelle, une activité normale, et des centres d'intérêt authentiques. Pour les followers français, nous sélectionnons spécifiquement des comptes situés en France pour garantir une meilleure compatibilité avec votre audience."
  }
];

export default function InstagramFollowersPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('international');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const { addToCart, updateLastItemUsername } = useCart();
  const [pageData, setPageData] = useState<InstagramFollowersPageData | null>(null);

  // Charger les données SEO depuis Sanity
  useEffect(() => {
    PageService.getInstagramFollowersPage().then(setPageData);
  }, []);

  // Mettre à jour les métadonnées SEO
  useEffect(() => {
    updateSEOMetadata(pageData);
  }, [pageData]);

  // Fonction pour naviguer vers d'autres pages Instagram
  const navigateToInstagramService = (service: 'likes' | 'views' | 'comments') => {
    const urls = {
      likes: '/products/acheter-des-likes-instagram',
      views: '/products/acheter-des-vues-instagram',
      comments: '/products/acheter-des-commentaires-instagram'
    };
    window.location.href = urls[service];
  };

  // Ajouter le Schema FAQPage dynamique pour le SEO (utilise les FAQ de Sanity si disponibles)
  useEffect(() => {
    const faqsToUse = pageData?.faq?.questions || faqData;
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'faq-schema-instagram-followers';
    
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
    
    const existingScript = document.getElementById('faq-schema-instagram-followers');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(schemaScript);
    
    return () => {
      const script = document.getElementById('faq-schema-instagram-followers');
      if (script) {
        script.remove();
      }
    };
  }, [pageData]);

  const getPackagePriceLocal = (packageId: string) => {
    return getPackagePrice(packageId, 'followers', followerType as 'french' | 'international');
  };

  const getPackageFollowers = (packageId: string) => {
    return getPackageQuantity(packageId, 'followers');
  };

  const handlePurchase = () => {
    if (!selectedPackage) {
      alert('Veuillez sélectionner un pack');
      return;
    }
    
    addToCart({
      followers: getPackageFollowers(selectedPackage),
      price: getPackagePriceLocal(selectedPackage),
      followerType: followerType as 'french' | 'international'
    });
    
    setIsModalOpen(true);
  };

  const handleProfileSelect = (username: string, cartData: any) => {
    setSelectedProfile(username);
    updateLastItemUsername(username);
    setIsModalOpen(false);
    
    // Redirection simple vers le panier - Vercel SPA routing va gérer
    window.location.href = '/cart';
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
    <div className="min-h-screen bg-cream font-rounded">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <FollowerTypeSelector
          selectedType={followerType}
          onTypeChange={setFollowerType}
          serviceKey="instagram_followers"
        />

        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
          followerType={followerType}
        />

        {/* Purchase Button */}
        <div className="flex justify-center mb-3">
          <button
            onClick={handlePurchase}
            disabled={!selectedPackage}
            className="w-full sm:w-auto bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 hover:shadow-soft-xl hover:scale-105 text-white font-semibold py-5 px-14 rounded-button transition-all duration-300 shadow-soft-lg text-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Users className="w-6 h-6 inline mr-3" strokeWidth={2} />
            Acheter maintenant
          </button>
        </div>
        <p className="text-sm text-slate-600 text-center mt-0 mb-12">
          🔒 Paiement sécurisé • Aucun mot de passe requis
        </p>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-lavender-100 to-baby-purple-100 rounded-card-sm flex items-center justify-center mr-4 shadow-soft">
                <Users className="w-7 h-7 text-lavender-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.followerTypes?.international?.title || "Followers Internationaux"}
              </h3>
            </div>
            <div className="space-y-4">
              {(pageData?.followerTypes?.international?.descriptions || [
                "Acheter de vrais Instagram followers, sans ciblage particulier, provenant de l'Europe de l'ouest.",
                "Les followers que nous vous fournissons n'auront pas d'intérêts particuliers pour votre activité.",
                "Leur engagement est variable en fonction de la qualité de votre contenu."
              ]).map((description, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-lavender-500 mr-1 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-slate-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-lavender-200/50">
              <h4 className="text-xl font-semibold text-slate-800 mb-4">
                Vous receverez des followers de ce type.
              </h4>
              <div className="mt-4">
                {pageData?.followerTypes?.international?.exampleImage?.url ? (
                  <img 
                    src={pageData.followerTypes.international.exampleImage.url} 
                    alt={pageData.followerTypes.international.exampleImage.alt || "Exemples de followers Instagram internationaux"} 
                    className="rounded-card shadow-soft-lg w-full max-w-full"
                  />
                ) : (
                  <img 
                    src="/images/followers-instagram-internationaux-exemple.png" 
                    alt="Exemples de followers Instagram internationaux" 
                    className="rounded-card shadow-soft-lg w-full max-w-full"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg border-2 border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-soft-pink-100 to-peach-100 rounded-card-sm flex items-center justify-center mr-4 shadow-soft">
                <Heart className="w-7 h-7 text-soft-pink-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800">
                {pageData?.followerTypes?.french?.title || "Abonnés Instagram Français"}
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
            <div className="mt-6 pt-6 border-t border-soft-pink-200/50">
              <h4 className="text-xl font-semibold text-slate-800 mb-4">
                Vous receverez des followers de ce type.
              </h4>
              <div className="mt-4">
                {pageData?.followerTypes?.french?.exampleImage?.url ? (
                  <img 
                    src={pageData.followerTypes.french.exampleImage.url} 
                    alt={pageData.followerTypes.french.exampleImage.alt || "Exemples de followers Instagram français"} 
                    className="rounded-card shadow-soft-lg w-full max-w-full"
                  />
                ) : (
                  <img 
                    src="/images/followers-instagram-francais-exemple.png" 
                    alt="Exemples de followers Instagram français" 
                    className="rounded-card shadow-soft-lg w-full max-w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 overflow-hidden mb-20">
          <div className="grid grid-cols-3 text-center border-b border-soft-pink-200/50">
            <div className="px-6 py-5 text-left font-semibold text-slate-700 bg-white/90">
              Comparatif
            </div>
            <div className="px-6 py-5 font-semibold text-slate-800 bg-white/90">
              Monde
            </div>
            <div className="px-6 py-5 font-semibold text-slate-800 bg-soft-pink-50/60">
              France
            </div>
          </div>
          <div className="grid grid-cols-3 border-b border-soft-pink-200/50">
            <div className="px-6 py-6 text-left font-semibold text-slate-700 bg-white/90">
              Type De Compte
            </div>
            <div className="px-6 py-6 text-center text-slate-700 bg-white/90">
              Réels
            </div>
            <div className="px-6 py-6 text-center text-slate-800 font-semibold bg-soft-pink-50/60">
              Réels
            </div>
          </div>
          <div className="grid grid-cols-3 border-b border-soft-pink-200/50">
            <div className="px-6 py-6 text-left font-semibold text-slate-700 bg-white/90">
              Provenance
            </div>
            <div className="px-6 py-6 text-center text-slate-700 bg-white/90">
              Monde (Amerique Latine et Europe)
            </div>
            <div className="px-6 py-6 text-center text-slate-800 font-semibold bg-soft-pink-50/60">
              France
            </div>
          </div>
          <div className="grid grid-cols-3 border-b border-soft-pink-200/50">
            <div className="px-6 py-6 text-left font-semibold text-slate-700 bg-white/90">
              Niveau D'activité
            </div>
            <div className="px-6 py-6 text-center text-slate-700 bg-white/90">
              Actifs
            </div>
            <div className="px-6 py-6 text-center text-slate-800 font-semibold bg-soft-pink-50/60">
              Actifs
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="px-6 py-6 text-left font-semibold text-slate-700 bg-white/90">
              Taux d'Engagement
            </div>
            <div className="px-6 py-6 text-center text-slate-700 bg-white/90">
              Bon
            </div>
            <div className="px-6 py-6 text-center text-slate-800 font-semibold bg-soft-pink-50/60">
              Fort
            </div>
          </div>
        </div>

        {/* Security & Guarantees Section */}
        <div className="bg-gradient-to-br from-lavender-50/50 via-soft-pink-50/50 to-peach-50/50 rounded-card p-10 mb-20 border border-soft-pink-200/50 shadow-soft-lg">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-slate-800 mb-12">
            {pageData?.sectionTitles?.security || "Renforcez votre crédibilité sur Instagram"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg text-center border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
              <div className="w-18 h-18 bg-gradient-to-br from-lavender-100 to-baby-purple-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                <Shield className="w-9 h-9 text-lavender-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {pageData?.securitySection?.serviceClient?.title || "Service client 24/7"}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {pageData?.securitySection?.serviceClient?.description || (
                  <>
                    Bien que les incidents soient rares, notre <strong className="text-lavender-600">Service client</strong> est disponible
                    par e-mail du lundi au dimanche, 24 heures sur 24. Si vous avez une demande
                    spécifique, nous pouvons également vous contacter par téléphone.
                  </>
                )}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg text-center border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
              <div className="w-18 h-18 bg-gradient-to-br from-soft-pink-100 to-peach-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                <CheckCircle className="w-9 h-9 text-soft-pink-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {pageData?.securitySection?.remboursement?.title || "Politique de remboursement"}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {pageData?.securitySection?.remboursement?.description || (
                  <>
                    Notre offre <strong className="text-soft-pink-600">'Satisfait ou remboursé'</strong> est très simple: Satisfait ou remboursé.
                    Dans le cas où la commande ne vous convient
                    pas, nous vous faisons un remboursement dans les 24h.
                  </>
                )}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-card-sm p-8 shadow-soft-lg text-center border border-soft-pink-200/50 hover:shadow-soft-xl transition-all duration-300">
              <div className="w-18 h-18 bg-gradient-to-br from-warm-yellow-100 to-soft-orange-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-soft-lg">
                <Zap className="w-9 h-9 text-soft-orange-600" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {pageData?.securitySection?.paiements?.title || "Paiements sécurisés"}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {pageData?.securitySection?.paiements?.description || (
                  <>
                    <strong className="text-soft-orange-600">Vos paiements sont 100% sécurisés</strong> grâce à un protocole
                    SSL et des prestataires reconnus -et surtout, nous ne vous
                    demanderons jamais vos identifiants Instagram.
                  </>
                )}
              </p>
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg mr-5">
                  <Instagram className="w-9 h-9 text-white" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold text-slate-800 leading-tight">
                  {pageData?.hero?.title || "Acheter des Followers Instagram Réels et Actifs"}
                </h1>
              </div>
              {pageData?.hero?.description ? (
                <div className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  <PortableText content={pageData.hero.description} />
                </div>
              ) : (
                <p className="text-lg md:text-xl mb-10 text-slate-600 leading-relaxed">
                  Acheter des followers Instagram réels et actifs pour faire grandir votre communauté
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-base">
                <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
                  <Star className="w-5 h-5 text-warm-yellow-500" strokeWidth={1.5} />
                  <span className="font-medium text-slate-700">4.7/5</span>
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
                  alt={pageData.hero.image.alt || "Instagram Followers Growth Dashboard"} 
                  className="rounded-card shadow-soft-xl"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Instagram Followers Growth Dashboard" 
                  className="rounded-card shadow-soft-xl"
                />
              )}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-lavender-600 font-semibold text-lg">+2.5M Followers</div>
                <div className="text-sm text-slate-600">Growth achieved</div>
              </div>
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-card-sm p-4 shadow-soft-lg border border-soft-pink-200/50">
                <div className="text-soft-pink-600 font-semibold text-lg">📈 +127% Growth</div>
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
            {pageData?.sectionTitles?.whyBuy || "Pourquoi acheter des followers Instagram réels et actifs en 2025?"}
          </h2>

          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {pageData?.whyBuySection?.credibilite?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.credibilite.image.url} 
                    alt={pageData.whyBuySection.credibilite.image.alt || "Instagram Profile with High Follower Count"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Instagram Profile with High Follower Count" 
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
                    Sur Instagram, la crédibilité d'un compte repose sur deux éléments : 
                    le nombre d'abonnés et l'engagement. Que vous soyez créateur de contenu,
                    entrepreneur ou influenceur, un faible nombre de followers nuit à votre image. 
                    <strong className="text-soft-pink-600">Acheter des abonnés Instagram</strong> permet de franchir ce cap. 
                    Un compte bien suivi inspire confiance, attire naturellement plus d'abonnés... 
                    et suscite plus d'intérêt de la part de l'algorithme. Pour compléter votre stratégie, 
                    pensez également à <a href="/products/acheter-des-likes-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('likes'); }} className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline">acheter des likes Instagram</a>, 
                    <a href="/products/acheter-des-vues-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('views'); }} className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline"> des vues Instagram</a> ou 
                    <a href="/products/acheter-des-commentaires-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('comments'); }} className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline"> des commentaires Instagram</a> pour renforcer votre engagement.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-6">
                  {pageData?.whyBuySection?.explorer?.title || 'Apparaître dans l\'onglet "Explorer"'}
                </h3>
                {pageData?.whyBuySection?.explorer?.description ? (
                  <div className="text-base md:text-lg text-slate-600 leading-relaxed">
                    <PortableText content={pageData.whyBuySection.explorer.description} />
                  </div>
                ) : (
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    L'onglet "Explorer" est la vitrine ultime sur Instagram. C'est ici que l'algorithme
                    met en avant les contenus susceptibles de devenir viraux. Pour y figurer, votre compte
                    doit générer un taux d'interaction élevé : <a href="/products/acheter-des-likes-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('likes'); }} className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline">likes</a>, 
                    <a href="/products/acheter-des-commentaires-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('comments'); }} className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline"> commentaires</a>, 
                    <a href="/products/acheter-des-vues-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('views'); }} className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline"> vues</a>, partages...
                    <strong className="text-soft-pink-600">En achetant des followers Instagram français</strong>, 
                    vous renforcez votre activité sur la plateforme.
                    Plus vos publications engagent, plus Instagram vous met en avant. C'est un cercle
                    vertueux que vous pouvez activer avec des followers de qualité.
                  </p>
                )}
              </div>
              <div>
                {pageData?.whyBuySection?.explorer?.image?.url ? (
                  <img 
                    src={pageData.whyBuySection.explorer.image.url} 
                    alt={pageData.whyBuySection.explorer.image.alt || "Instagram Explorer Tab with Trending Posts"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Instagram Explorer Tab with Trending Posts" 
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
                    alt={pageData.whyBuySection.communaute.image.alt || "Instagram Community Building and Engagement"} 
                    className="rounded-card shadow-soft-xl"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Instagram Community Building and Engagement" 
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
                    abonnés</strong> susceptibles de devenir clients, fans ou partenaires. Pour maximiser l'engagement, 
                    combinez vos followers avec des <a href="/products/acheter-des-likes-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('likes'); }} className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline">likes Instagram</a>, 
                    <a href="/products/acheter-des-vues-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('views'); }} className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline"> des vues Instagram</a> et 
                    <a href="/products/acheter-des-commentaires-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('comments'); }} className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline"> des commentaires Instagram</a> pour créer une dynamique d'interaction complète.
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

      <InstagramSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProfile={handleProfileSelect}
        cartData={{
          followers: getPackageFollowers(selectedPackage),
          price: getPackagePriceLocal(selectedPackage),
          followerType: followerType as 'french' | 'international'
        }}
      />
    </div>
  );
}
