import React, { useState, useEffect } from 'react';
import { Heart, Instagram, Star, Shield, Clock, CheckCircle, TrendingUp, Users2, Zap, ThumbsUp } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import GuaranteeSection from './GuaranteeSection';
import InstagramSearchModal from './InstagramSearchModal';
import InstagramPostsModal from './InstagramPostsModal';
// LikesPage supprimé - utilisation du CheckoutPage unifié
import FAQSection from './FAQSection';
import { useCart } from '../contexts/CartContext';
import { InstagramPost } from '../services/instagramService';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';

// FAQ data pour le Schema.org
const faqData = [
  {
    question: "Combien de temps faut-il pour recevoir mes likes ?",
    answer: "Dès que votre paiement est confirmé, la livraison des likes débute rapidement. En général, vous recevez vos likes dans un délai de 1 à 6 heures. Si vous optez pour l'option express, votre commande est traitée en moins de 30 minutes. Il est également possible de choisir une livraison progressive, répartie sur plusieurs heures, pour un engagement plus naturel et durable de vos posts Instagram."
  },
  {
    question: "Les likes Instagram achetés sont-ils réels ?",
    answer: "Oui, absolument. Sur Doctor Followers, nous mettons un point d'honneur à fournir uniquement des likes réels et authentiques. Ces likes proviennent de profils actifs d'Europe de l'Ouest, et pour les commandes premium, ils sont spécifiquement sélectionnés selon votre région afin de garantir une meilleure compatibilité avec votre audience cible. Aucun faux profil, aucun robot : chaque like livré provient d'un utilisateur authentique, susceptible d'interagir naturellement avec votre contenu."
  },
  {
    question: "Est-ce risqué d'acheter des likes Instagram ?",
    answer: "Non, à condition de passer par un fournisseur sérieux comme Doctor Followers. Nos méthodes de livraison sont conformes aux conditions d'utilisation d'Instagram. Nous ne vous demandons jamais vos identifiants, et nous utilisons uniquement des profils authentiques. Depuis 2018, aucun de nos clients n'a été banni ou pénalisé par Instagram."
  },
  {
    question: "Quel est le nombre maximum de likes Instagram que je peux acheter ?",
    answer: "Sur notre site, vous pouvez acheter jusqu'à 100 000 likes Instagram en un seul achat. Pour des quantités plus importantes, vous pouvez nous contacter par email afin que nous vous proposions un devis personnalisé adapté à vos besoins et à vos délais."
  },
  {
    question: "Le paiement est-il sécurisé ?",
    answer: "Absolument. Toutes les transactions sur Doctor Followers sont protégées par un protocole SSL de dernière génération. Nous utilisons des partenaires bancaires reconnus pour garantir la sécurité de vos données. De plus, nous ne demandons jamais vos identifiants Instagram. Seul le lien de votre profil est requis."
  },
  {
    question: "Proposez-vous une garantie en cas de perte de likes ?",
    answer: "Oui. Si certains likes disparaissent dans les 30 jours suivant la commande, ils sont automatiquement remplacés grâce à notre garantie incluse. Vous conservez ainsi le même nombre de likes, sans frais supplémentaires."
  },
  {
    question: "Les likes achetés peuvent-ils disparaître ?",
    answer: "Comme tout engagement sur Instagram, un like peut disparaître avec le temps, notamment si le profil qui a liké est suspendu ou supprimé. Cela reste marginal, mais pour compenser ces éventuelles pertes, notre garantie de remplacement est prévue dans chaque commande."
  },
  {
    question: "D'où viennent vos likes ?",
    answer: "Nos likes proviennent principalement de profils francophones d'Europe de l'Ouest, comme la France, la Belgique ou la Suisse. Ce ciblage permet de renforcer votre crédibilité si vous vous adressez à une audience francophone."
  },
  {
    question: "Comment optimiser l'effet des likes achetés ?",
    answer: "Acheter des likes Instagram permet de booster votre engagement, mais l'impact réel dépend aussi de votre activité sur la plateforme. Il est essentiel de publier régulièrement, de proposer un contenu de qualité, d'interagir avec votre audience et de soigner votre stratégie de communication. Ces efforts renforcent l'engagement de vos posts et valorisent l'investissement."
  },
  {
    question: "Est-ce que les likes achetés vont générer plus d'engagement ?",
    answer: "Chez Doctor Followers, nous fournissons uniquement des likes Instagram réels, issus de profils actifs. Leur impact sur l'engagement dépendra en grande partie de la qualité de votre contenu. Si vos publications sont pertinentes, attrayantes et bien ciblées, les likes achetés peuvent naturellement attirer plus d'interactions (commentaires, partages, nouveaux followers). Toutefois, comme pour tout engagement, l'effet ne peut jamais être garanti à 100 %. C'est pourquoi nous recommandons d'allier achat de likes avec une stratégie de contenu régulière et engageante."
  },
  {
    question: "Puis-je choisir sur quels posts appliquer les likes ?",
    answer: "Oui, absolument ! Après avoir sélectionné votre pack de likes et votre profil Instagram, vous pourrez choisir spécifiquement sur quels posts vous souhaitez appliquer les likes. Notre système vous permet de sélectionner les posts de votre choix et de répartir les likes selon vos préférences."
  },
  {
    question: "Les likes sont-ils distribués de manière naturelle ?",
    answer: "Oui, nous distribuons les likes de manière progressive et naturelle pour éviter tout soupçon. Les likes arrivent de façon échelonnée sur plusieurs heures, simulant un engagement organique naturel. Cela garantit que vos posts gagnent en visibilité sans éveiller les soupçons de l'algorithme d'Instagram."
  }
];

export default function InstagramLikesPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>([]);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const { addToCart, updateLastItemUsername, updateLastItemPosts } = useCart();

  // Fonction pour naviguer vers d'autres pages Instagram
  const navigateToInstagramService = (service: 'followers' | 'views' | 'comments') => {
    const urls = {
      followers: '/products/acheter-followers-instagram',
      views: '/products/acheter-des-vues-instagram',
      comments: '/products/acheter-des-commentaires-instagram'
    };
    window.location.href = urls[service];
  };

  // Ajouter le Schema FAQPage dynamique pour le SEO
  useEffect(() => {
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'faq-schema-instagram-likes';
    
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
    const existingScript = document.getElementById('faq-schema-instagram-likes');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(schemaScript);
    
    // Cleanup
    return () => {
      const script = document.getElementById('faq-schema-instagram-likes');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const getPackagePriceLocal = (packageId: string) => {
    const price = getPackagePrice(packageId, 'likes', followerType as 'french' | 'international');
    console.log('🔍 getPackagePriceLocal:', { packageId, serviceType: 'likes', followerType, price });
    return price;
  };

  const getPackageLikes = (packageId: string) => {
    return getPackageQuantity(packageId, 'likes');
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
      const pricePerPost = getPackagePriceLocal(selectedPackage);
      const totalPrice = pricePerPost * posts.length;
      
      console.log('💰 Calcul du prix pour les likes:', {
        selectedPackage,
        pricePerPost,
        postsLength: posts.length,
        totalPrice,
        followerType
      });
      
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
      <div className="bg-gradient-to-br from-pink-600 via-red-600 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Instagram className="w-16 h-16 mr-4" />
                <h1 className="text-5xl md:text-7xl font-bold">
                  Acheter des Likes Instagram Réels et Actifs
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Des likes réels et authentiques pour augmenter l'engagement de vos posts
              </p>
              <div className="flex items-center space-x-8 text-lg">
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 mr-2" />
                  <span>4.8/5</span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-6 h-6 mr-2" />
                  <span>+100K likes</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  <span>100% sécurisé</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Instagram Likes and Engagement Analytics" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-red-600 font-bold text-lg">❤️ +127% Engagement</div>
                <div className="text-sm text-gray-600">Boost achieved</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-pink-600 font-bold text-lg">📊 +50K Likes</div>
                <div className="text-sm text-gray-600">Monthly delivered</div>
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
          title="Type de likes"
          serviceKey="instagram_likes"
        />

        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
          followerType={followerType}
          isLikes={true}
        />

        {/* Purchase Section */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-pink-100 mb-12">
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

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <ThumbsUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Likes Internationaux</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Acheter de vrais Instagram likes, sans ciblage particulier, provenant de l'Europe de l'ouest.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Les likes que nous vous fournissons proviennent de profils actifs et authentiques.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Livraison progressive pour un engagement naturel et durable.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-pink-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Likes Instagram Français</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Acheter des likes ciblés selon votre région française.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Nous sélectionnons les profils qui sont intéressés par votre domaine d'activité</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Ce sont des profils très actifs qui vont générer plus d'interactions que l'utilisateur moyen.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Avis des clients</h2>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-pink-600">4.8</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">(189 avis)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Marie, Toulouse", date: "18/03/2025", rating: 5, comment: "Excellent service ! Mes posts ont vu leur engagement exploser en quelques heures. Je recommande vivement !" },
              { name: "Antoine, Nice", date: "12/02/2025", rating: 5, comment: "Les likes sont arrivés très rapidement et de manière naturelle. Mon taux d'engagement a doublé !" },
              { name: "Camille, Bordeaux", date: "28/01/2025", rating: 4, comment: "Service fiable et efficace. Mes posts ont gagné en visibilité grâce aux likes français ciblés." }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.date}</div>
                </div>
                <div className="flex space-x-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Guarantees Section */}
        <div className="bg-pink-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Acheter des likes Instagram en toute sécurité avec Doctor Followers
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

        {/* Why Buy Likes Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi acheter des likes Instagram en 2025?
          </h2>

          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1611162617263-4d4e51421e7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Instagram Post with High Likes and Engagement" 
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Augmenter votre engagement</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Sur Instagram, l'engagement est roi. Plus vos posts reçoivent de likes, 
                  plus l'algorithme les met en avant. Que vous soyez créateur de contenu,
                  entrepreneur ou influenceur, un faible engagement nuit à votre visibilité. 
                  <strong className="text-pink-600">Acheter des likes Instagram</strong> permet de booster votre engagement. 
                  Un post avec beaucoup de likes inspire confiance et attire naturellement plus d'interactions... 
                  et suscite plus d'intérêt de la part de l'algorithme. Pour une stratégie complète, combinez vos likes avec des 
                  <a href="/products/acheter-followers-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('followers'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> followers Instagram</a>, 
                  <a href="/products/acheter-des-vues-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('views'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des vues Instagram</a> et 
                  <a href="/products/acheter-des-commentaires-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('comments'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des commentaires Instagram</a> pour maximiser votre visibilité.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Améliorer votre portée organique</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  L'algorithme d'Instagram privilégie les contenus qui génèrent de l'engagement rapidement. 
                  Plus vos posts reçoivent de <a href="/products/acheter-des-likes-instagram" onClick={(e) => { e.preventDefault(); }} className="text-blue-600 hover:text-blue-800 font-semibold underline">likes</a> dans les premières heures, plus ils sont susceptibles 
                  d'apparaître dans l'onglet Explorer et d'être montrés à plus d'utilisateurs. Pour renforcer votre stratégie, 
                  <strong className="text-red-600">en achetant des likes Instagram français</strong>, 
                  vous renforcez votre portée organique. Complétez avec des 
                  <a href="/products/acheter-followers-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('followers'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> followers Instagram</a> pour augmenter votre base d'abonnés, 
                  <a href="/products/acheter-des-vues-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('views'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des vues Instagram</a> pour vos Reels et 
                  <a href="/products/acheter-des-commentaires-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('comments'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des commentaires Instagram</a> pour enrichir vos posts. 
                  Plus vos publications engagent, plus Instagram vous montre à de nouveaux utilisateurs. C'est un cercle
                  vertueux que vous pouvez activer avec des likes de qualité.
                </p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Instagram Analytics Dashboard showing Reach and Impressions" 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Instagram Business Profile with High Engagement Metrics" 
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Construire votre crédibilité</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  <strong className="text-orange-600">Construire votre crédibilité</strong> ne doit pas se limiter à gonfler vos chiffres.
                  Chez Doctor Followers, nous vous aidons à construire une crédibilité authentique
                  et durable. Chaque like livré provient d'un utilisateur réel, susceptible d'interagir
                  naturellement avec votre contenu. Associé à un contenu régulier, cela favorise des interactions naturelles.
                  L'objectif n'est pas juste d'avoir plus de likes, mais de <strong className="text-orange-600">créer une preuve sociale
                  forte</strong> qui attire de vrais fans et clients. Pour une crédibilité complète, alliez vos likes avec des 
                  <a href="/products/acheter-followers-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('followers'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> followers Instagram réels</a>, 
                  <a href="/products/acheter-des-vues-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('views'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des vues Instagram</a> et 
                  <a href="/products/acheter-des-commentaires-instagram" onClick={(e) => { e.preventDefault(); navigateToInstagramService('comments'); }} className="text-blue-600 hover:text-blue-800 font-semibold underline"> des commentaires Instagram</a> pour créer une présence complète et engageante.
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
          followers: 0,
          likes: getPackageLikes(selectedPackage),
          price: getPackagePriceLocal(selectedPackage),
          followerType: followerType as 'french' | 'international'
        }}
      />

      <InstagramPostsModal
        isOpen={isPostsModalOpen}
        onClose={() => setIsPostsModalOpen(false)}
        username={selectedProfile}
        totalLikes={getPackageLikes(selectedPackage)}
        onPostsSelected={handlePostsSelected}
        pricePerPost={getPackagePriceLocal(selectedPackage)}
      />
    </div>
  );
}
