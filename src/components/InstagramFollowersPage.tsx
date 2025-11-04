import React, { useState, useEffect } from 'react';
import { Users, Instagram, Star, Shield, Clock, CheckCircle, Heart, TrendingUp, Users2, Zap } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import GuaranteeSection from './GuaranteeSection';
import InstagramSearchModal from './InstagramSearchModal';
import CheckoutPage from './CheckoutPage';
import FAQSection from './FAQSection';
import { useCart } from '../contexts/CartContext';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';

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

  // Fonction pour naviguer vers d'autres pages Instagram
  const navigateToInstagramService = (service: 'likes' | 'views' | 'comments') => {
    const urls = {
      likes: '/products/acheter-des-likes-instagram',
      views: '/products/acheter-des-vues-instagram',
      comments: '/products/acheter-des-commentaires-instagram'
    };
    window.location.href = urls[service];
  };

  // Ajouter le Schema FAQPage dynamique pour le SEO
  useEffect(() => {
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'faq-schema-instagram-followers';
    
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    schemaScript.textContent = JSON.stringify(schemaData);
    
    // Supprimer l'ancien schema s'il existe
    const existingScript = document.getElementById('faq-schema-instagram-followers');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(schemaScript);
    
    // Cleanup
    return () => {
      const script = document.getElementById('faq-schema-instagram-followers');
      if (script) {
        script.remove();
      }
    };
  }, []);

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
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Instagram className="w-16 h-16 mr-4" />
                <h1 className="text-5xl md:text-7xl font-bold">
                  Acheter des Followers Instagram Réels et Actifs
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Acheter des followers Instagram réels et actifs pour faire grandir votre communauté
              </p>
              <div className="flex items-center space-x-8 text-lg">
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 mr-2" />
                  <span>4.7/5</span>
                </div>
                <div className="flex items-center">
                  <Users2 className="w-6 h-6 mr-2" />
                  <span>Service pro</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  <span>100% sécurisé</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Instagram Followers Growth Dashboard" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-green-600 font-bold text-lg">+2.5M Followers</div>
                <div className="text-sm text-gray-600">Growth achieved</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-blue-600 font-bold text-lg">📈 +127% Growth</div>
                <div className="text-sm text-gray-600">Monthly increase</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Purchase Section */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100 mb-12">
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
                    {getPackagePriceLocal(selectedPackage)?.toFixed(2)}€
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
                <Users className="w-6 h-6 inline mr-3" />
                Acheter maintenant
              </button>

              <p className="text-sm text-gray-500 mt-4">
                🔒 Paiement sécurisé • Aucun mot de passe requis • Livraison garantie
              </p>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Followers Internationaux</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Acheter de vrais Instagram followers, sans ciblage particulier, provenant de l'Europe de l'ouest.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Les followers que nous vous fournissons n'auront pas d'intérêts particuliers pour votre activité.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Leur engagement est variable en fonction de la qualité de votre contenu.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-pink-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Abonnés Instagram Français</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Acheter des Followers ciblés selon votre région.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Nous sélectionnons les followers qui sont intéressés par votre domaine d'activité</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Ce sont des profils très actifs qui vont générer plus d'interactions que l'utilisateur moyen.</p>
              </div>
            </div>
          </div>
        </div>


        {/* Security & Guarantees Section */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Renforcez votre crédibilité sur Instagram
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Service client 24/7</h3>
              <p className="text-gray-600 text-sm">
                Bien que les incidents soient rares, notre <strong className="text-blue-600">Service client</strong> est disponible
                par e-mail du lundi au dimanche, 24 heures sur 24. Si vous avez une demande
                spécifique, nous pouvons également vous contacter par téléphone.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Politique de remboursement</h3>
              <p className="text-gray-600 text-sm">
                Notre offre <strong className="text-green-600">'Satisfait ou remboursé'</strong> est très simple: Satisfait ou remboursé.
                Dans le cas où la commande ne vous convient
                pas, nous vous faisons un remboursement dans les 24h.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Paiements sécurisés</h3>
              <p className="text-gray-600 text-sm">
                <strong className="text-purple-600">Vos paiements sont 100% sécurisés</strong> grâce à un protocole
                SSL et des prestataires reconnus -et surtout, nous ne vous
                demanderons jamais vos identifiants Instagram.
              </p>
            </div>
          </div>
        </div>

        {/* Why Buy Followers Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi acheter des followers Instagram réels et actifs en 2025?
          </h2>

          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Instagram Profile with High Follower Count" 
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Améliorer votre crédibilité</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Sur Instagram, la crédibilité d'un compte repose sur deux éléments : 
                  le nombre d'abonnés et l'engagement. Que vous soyez créateur de contenu,
                  entrepreneur ou influenceur, un faible nombre de followers nuit à votre image. 
                  <strong className="text-blue-600">Acheter des abonnés Instagram</strong> permet de franchir ce cap. 
                  Un compte bien suivi inspire confiance, attire naturellement plus d'abonnés... 
                  et suscite plus d'intérêt de la part de l'algorithme. Pour compléter votre stratégie, 
                  pensez également à <a href="/products/acheter-des-likes-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('likes'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline">acheter des likes Instagram</a>, 
                  <a href="/products/acheter-des-vues-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('views'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des vues Instagram</a> ou 
                  <a href="/products/acheter-des-commentaires-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('comments'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des commentaires Instagram</a> pour renforcer votre engagement.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Apparaître dans l'onglet "Explorer"</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  L'onglet "Explorer" est la vitrine ultime sur Instagram. C'est ici que l'algorithme
                  met en avant les contenus susceptibles de devenir viraux. Pour y figurer, votre compte
                  doit générer un taux d'interaction élevé : <a href="/products/acheter-des-likes-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('likes'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline">likes</a>, 
                  <a href="/products/acheter-des-commentaires-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('comments'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> commentaires</a>, 
                  <a href="/products/acheter-des-vues-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('views'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> vues</a>, partages...
                  <strong className="text-pink-600">En achetant des followers Instagram français</strong>, 
                  vous renforcez votre activité sur la plateforme.
                  Plus vos publications engagent, plus Instagram vous met en avant. C'est un cercle
                  vertueux que vous pouvez activer avec des followers de qualité.
                </p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Instagram Explorer Tab with Trending Posts" 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Instagram Community Building and Engagement" 
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Bâtir une vraie communauté</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  <strong className="text-purple-600">Bâtir une vraie communauté</strong> ne doit pas se limiter à gonfler vos chiffres.
                  Chez Doctor Followers, nous vous aidons à bâtir une communauté authentique
                  et durable. Chaque abonné livré est un utilisateur réel, sélectionné pour correspondre
                  à votre profil. Associé à un contenu régulier, cela favorise des interactions naturelles.
                  L'objectif n'est pas juste d'avoir plus de followers, mais de <strong className="text-purple-600">créer des liens avec des
                  abonnés</strong> susceptibles de devenir clients, fans ou partenaires. Pour maximiser l'engagement, 
                  combinez vos followers avec des <a href="/products/acheter-des-likes-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('likes'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline">likes Instagram</a>, 
                  <a href="/products/acheter-des-vues-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('views'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des vues Instagram</a> et 
                  <a href="/products/acheter-des-commentaires-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('comments'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des commentaires Instagram</a> pour créer une dynamique d'interaction complète.
                </p>
              </div>
            </div>
          </div>
        </div>

        <GuaranteeSection />

        {/* FAQ Section */}
        <FAQSection 
          faqs={faqData}
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
