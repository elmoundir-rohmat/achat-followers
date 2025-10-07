import React, { useState } from 'react';
import { Users, Instagram, Star, Shield, Clock, CheckCircle, Heart, TrendingUp, Users2, Zap } from 'lucide-react';
import FollowerTypeSelector from './FollowerTypeSelector';
import PackageSelector from './PackageSelector';
import GuaranteeSection from './GuaranteeSection';
import InstagramSearchModal from './InstagramSearchModal';
import CheckoutPage from './CheckoutPage';
import FAQSection from './FAQSection';
import { useCart } from '../contexts/CartContext';
import { getPackagePrice, getPackageQuantity } from '../config/packagesConfig';

export default function InstagramFollowersPage({ onBack }: { onBack: () => void }) {
  const [followerType, setFollowerType] = useState('international');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout'>('selection');
  const { addToCart, updateLastItemUsername } = useCart();

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
    
    // Rediriger vers la page de panier unifiée
    window.history.pushState({}, '', '/cart');
    window.location.reload();
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
                  Acheter des followers Instagram
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
                  et suscite plus d'intérêt de la part de l'algorithme.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Apparaître dans l'onglet "Explorer"</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  L'onglet "Explorer" est la vitrine ultime sur Instagram. C'est ici que l'algorithme
                  met en avant les contenus susceptibles de devenir viraux. Pour y figurer, votre compte
                  doit générer un taux d'interaction élevé : likes, commentaires, partages...
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
                  abonnés</strong> susceptibles de devenir clients, fans ou partenaires.
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
              question: "Combien de temps faut-il pour recevoir ma commande ?",
              answer: "Dès que votre paiement est confirmé, la livraison des abonnés débute rapidement. En général, vous recevez vos followers dans un délai de 6 à 24 heures. Si vous optez pour l'option express, votre commande est traitée en moins d'une heure. Il est également possible de choisir une livraison progressive, répartie sur plusieurs jours, pour une croissance plus discrète et naturelle de votre compte Instagram."
            },
            {
              question: "Les abonnés Instagram achetés sont-ils réels ?",
              answer: "Oui, absolument. Sur Doctor Followers, nous mettons un point d'honneur à fournir uniquement des abonnés réels et actifs. Ces followers proviennent en majorité d'Europe de l'Ouest, et pour les commandes premium, ils sont spécifiquement sélectionnés selon votre région afin de garantir une meilleure compatibilité avec votre audience cible. Aucun faux profil, aucun robot : chaque compte livré est un utilisateur authentique, susceptible d'interagir avec votre contenu si celui-ci correspond à ses centres d'intérêt."
            },
            {
              question: "Est-ce risqué d'acheter des followers Instagram ?",
              answer: "Non, à condition de passer par un fournisseur sérieux comme ThinkWell. Nos méthodes de livraison sont conformes aux conditions d'utilisation d'Instagram. Nous ne vous demandons jamais vos identifiants, et nous utilisons uniquement des profils authentiques. Nos méthodes sont sûres et respectent les limites d'Instagram."
            },
            {
              question: "Quel est le nombre maximum d'abonnés Instagram que je peux acheter ?",
              answer: "Sur notre site, vous pouvez acheter jusqu'à 50 000 abonnés Instagram en un seul achat. Pour des quantités plus importantes, vous pouvez nous contacter par email afin que nous vous proposions un devis personnalisé adapté à vos besoins et à vos délais."
            },
            {
              question: "Le paiement est-il sécurisé ?",
              answer: "Absolument. Toutes les transactions sur Doctor Followers sont protégées par un protocole SSL de dernière génération. Nous utilisons des partenaires bancaires reconnus pour garantir la sécurité de vos données. De plus, nous ne demandons jamais vos identifiants Instagram. Seul le lien de votre profil est requis."
            },
            {
              question: "Proposez-vous une garantie en cas de désabonnement ?",
              answer: "Oui. Si certains abonnés se désabonnent dans les 30 jours suivant la commande, ils sont automatiquement remplacés grâce à notre garantie incluse. Vous conservez ainsi le même nombre d'abonnés, sans frais supplémentaires."
            },
            {
              question: "Les followers achetés peuvent-ils se désabonner ?",
              answer: "Comme tout utilisateur d'Instagram, un abonné peut se désabonner avec le temps, notamment s'il ne s'identifie pas à votre contenu. Cela reste marginal, mais pour compenser ces éventuelles pertes, notre garantie de remplacement est prévue dans chaque commande."
            },
            {
              question: "D'où viennent vos abonnés ?",
              answer: "Nos followers proviennent principalement de pays francophones d'Europe de l'Ouest, comme la France, la Belgique ou la Suisse. Ce ciblage permet de renforcer votre crédibilité si vous vous adressez à une audience francophone."
            },
            {
              question: "Comment optimiser l'effet des abonnés achetés ?",
              answer: "Acheter des followers Instagram permet de booster votre crédibilité, mais l'impact réel dépend aussi de votre activité sur la plateforme. Il est essentiel de publier régulièrement, de proposer un contenu de qualité, d'interagir avec votre audience et de soigner votre stratégie de communication. Ces efforts renforcent l'engagement de vos nouveaux abonnés et valorisent l'investissement."
            },
            {
              question: "Est-ce que les abonnés achetés vont interagir avec mes publications ?",
              answer: "Chez Doctor Followers, nous fournissons uniquement des abonnés Instagram réels, issus de comptes actifs. Leur niveau d'interaction dépendra en grande partie de la qualité de votre contenu. Si vos publications sont pertinentes, attrayantes et bien ciblées, certains followers achetés peuvent naturellement interagir (likes, vues, commentaires). Toutefois, comme pour toute communauté, l'engagement ne peut jamais être garanti à 100 %. C'est pourquoi nous recommandons d'allier achat de followers avec une stratégie de contenu régulière et engageante."
            }
          ]}
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
