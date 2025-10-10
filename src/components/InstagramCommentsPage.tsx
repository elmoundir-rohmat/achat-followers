import React, { useState, useCallback } from 'react';
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

export default function InstagramCommentsPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('french');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>([]);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const { addToCart, addToCartWithPosts, updateLastItemUsername, updateLastItemPosts, updateLastItemPrice, items, setItems, saveCartToStorage } = useCart();

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
    setSelectedPosts(posts);
    
    // Pour les commentaires, chaque post reçoit le nombre de commentaires du pack
    const postsData = posts.map(post => ({
      postId: post.id,
      commentsToAdd: getPackageComments(selectedPackage), // Chaque post reçoit le nombre complet de commentaires du pack
      mediaUrl: post.media_url || post.thumbnail_url
    }));
    
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
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Instagram className="w-16 h-16 mr-4" />
                <h1 className="text-5xl md:text-7xl font-bold">
                  Commentaires Instagram
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Des commentaires authentiques et personnalisés pour booster l'engagement de vos posts
              </p>
              <div className="flex items-center space-x-8 text-lg">
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-yellow-400 mr-2" />
                  <span>4.9/5</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  <span>+50K commentaires</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  <span>100% sécurisé</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Instagram Comments and Engagement Analytics" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-blue-600 font-bold text-lg">💬 +85% Engagement</div>
                <div className="text-sm text-gray-600">Boost achieved</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-purple-600 font-bold text-lg">📊 +20K Comments</div>
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
          title="Type de commentaires"
        />

        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
          followerType={followerType}
          isComments={true}
        />

        {/* Purchase Section */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100 mb-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Résumé de votre commande
              </h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-700">
                    {getPackageComments(selectedPackage).toLocaleString()} commentaires {followerType === 'french' ? 'français' : 'internationaux'}
                  </span>
                  <span className="text-3xl font-bold text-blue-600">
                    {getPackagePriceLocal(selectedPackage).toFixed(2)}€
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
                    Commentaires réels
                  </div>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                <MessageCircle className="w-6 h-6 inline mr-3" />
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
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Commentaires Internationaux</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Acheter de vrais commentaires Instagram, sans ciblage particulier, provenant de l'Europe de l'ouest.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Les commentaires que nous vous fournissons proviennent de profils actifs et authentiques.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Livraison progressive pour un engagement naturel et durable.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Commentaires Instagram Français</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Acheter des commentaires ciblés selon votre région française.</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Nous sélectionnons les profils qui sont intéressés par votre domaine d'activité</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
                <p className="text-gray-600">Ce sont des profils très actifs qui vont générer plus d'interactions que l'utilisateur moyen.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Avis des clients</h2>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">4.9</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">(127 avis)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sophie, Lyon", date: "22/03/2025", rating: 5, comment: "Service exceptionnel ! Les commentaires sont très naturels et ont vraiment boosté l'engagement de mes posts. Je recommande !" },
              { name: "Julien, Marseille", date: "15/02/2025", rating: 5, comment: "Les commentaires français sont parfaits et très pertinents. Mon taux d'engagement a explosé grâce à ce service." },
              { name: "Emma, Strasbourg", date: "03/02/2025", rating: 5, comment: "Excellent service ! Les commentaires sont authentiques et ont attiré plus de vraies interactions sur mes posts." }
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
        <div className="bg-blue-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Acheter des commentaires Instagram en toute sécurité avec Doctor Followers
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

        {/* Why Buy Comments Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi acheter des commentaires Instagram en 2025?
          </h2>

          <div className="space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Instagram Post with High Comments and Engagement" 
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Augmenter votre engagement</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Sur Instagram, les commentaires sont l'indicateur le plus fort d'engagement. Plus vos posts reçoivent de commentaires, 
                  plus l'algorithme les met en avant. Que vous soyez créateur de contenu,
                  entrepreneur ou influenceur, un faible engagement nuit à votre visibilité. 
                  <strong className="text-blue-600">Acheter des commentaires Instagram</strong> permet de booster votre engagement. 
                  Un post avec beaucoup de commentaires inspire confiance et attire naturellement plus d'interactions... 
                  et suscite plus d'intérêt de la part de l'algorithme.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Améliorer votre portée organique</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  L'algorithme d'Instagram privilégie les contenus qui génèrent de l'engagement rapidement. 
                  Plus vos posts reçoivent de commentaires dans les premières heures, plus ils sont susceptibles 
                  d'apparaître dans l'onglet Explorer et d'être montrés à plus d'utilisateurs...
                  <strong className="text-indigo-600">En achetant des commentaires Instagram français</strong>, 
                  vous renforcez votre portée organique.
                  Plus vos publications engagent, plus Instagram vous montre à de nouveaux utilisateurs. C'est un cercle
                  vertueux que vous pouvez activer avec des commentaires de qualité.
                </p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Instagram Analytics Dashboard showing Reach and Comments" 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Instagram Business Profile with High Comment Engagement" 
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Construire votre crédibilité</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  <strong className="text-purple-600">Construire votre crédibilité</strong> ne doit pas se limiter à gonfler vos chiffres.
                  Chez Doctor Followers, nous vous aidons à construire une crédibilité authentique
                  et durable. Chaque commentaire livré provient d'un utilisateur réel, susceptible d'interagir
                  naturellement avec votre contenu. Associé à un contenu régulier, cela favorise des interactions naturelles.
                  L'objectif n'est pas juste d'avoir plus de commentaires, mais de <strong className="text-purple-600">créer une preuve sociale
                  forte</strong> qui attire de vrais fans et clients.
                </p>
              </div>
            </div>
          </div>
        </div>

        <GuaranteeSection />

        {/* FAQ Section */}
        <FAQSection 
          faqs={[
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
