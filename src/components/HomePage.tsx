import React, { useState, useEffect } from 'react';
import { Instagram, Heart, MessageCircle, Eye, Users, Zap, Shield, Clock, ArrowRight, Star, CheckCircle, TrendingUp, Award, Globe, Smartphone, ChevronDown } from 'lucide-react';
import { smmaService, SMMAOrder } from '../services/smmaService';
import { smmaServiceClient } from '../services/smmaServiceClient';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface PlatformServices {
  platform: string;
  platformIcon: React.ReactNode;
  services: Service[];
}

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [smmaResults, setSmmaResults] = useState<any>(null);
  const [isProcessingSMMA, setIsProcessingSMMA] = useState(false);

  // Vérifier si on est sur une page de paiement
  useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/payment/success') {
      console.log('🎯 Page de succès détectée - Affichage du modal');
      setShowPaymentSuccess(true);
      
      // Récupérer les paramètres Cardinity
      const urlParams = new URLSearchParams(window.location.search);
      const cardinityOrderId = urlParams.get('order_id');
      const cardinityAmount = urlParams.get('amount');
      const cardinityStatus = urlParams.get('status');
      const cardinityId = urlParams.get('id');
      
      console.log('🔍 Paramètres Cardinity:', {
        order_id: cardinityOrderId,
        amount: cardinityAmount,
        status: cardinityStatus,
        id: cardinityId
      });
      
      // Si c'est un retour Cardinity réussi, déclencher SMMA
      if ((cardinityStatus === 'approved' || cardinityId) && (cardinityId || cardinityOrderId)) {
        console.log('✅ Paiement Cardinity confirmé - Déclenchement SMMA');
        processSMMAIntegration((cardinityId || cardinityOrderId) as string);
      }
      
      // Récupérer les détails de la commande
      const savedOrder = localStorage.getItem('pendingOrder');
      if (savedOrder) {
        try {
          const order = JSON.parse(savedOrder);
          setOrderDetails({
            orderId: cardinityOrderId || order.orderId,
            amount: cardinityAmount || order.amount,
            followers: order.followers,
            followerType: order.followerType,
            username: order.username,
            timestamp: new Date().toLocaleString('fr-FR')
          });
          localStorage.removeItem('pendingOrder');
        } catch (error) {
          console.error('Erreur:', error);
        }
      }
    }
  }, []);

  const processSMMAIntegration = async (paymentId: string) => {
    console.log('🚀 Déclenchement SMMA avec paymentId:', paymentId);
    setIsProcessingSMMA(true);
    
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        const cartItems = JSON.parse(savedCartItems);
        
        const smmaOrders: SMMAOrder[] = cartItems.map((item: any) => {
          // ✅ VALIDATION : Ne jamais envoyer de valeur par défaut
          if (!item.username || item.username.trim() === '') {
            throw new Error('URL de profil manquante pour la commande SMMA');
          }
          
          // 🔍 Détecter la plateforme
          const serviceType = item.platform === 'TikTok' ? 'tiktok_followers' : 'followers';
          console.log('🔍 HomePage - Platform:', item.platform, '→ ServiceType:', serviceType);
          
          return {
            username: item.username,
            followers: item.followers,
            followerType: item.followerType,
            serviceType: serviceType,
            orderId: orderDetails?.orderId || paymentId,
            paymentId: paymentId
          };
        });

        console.log('📦 Commandes SMMA:', smmaOrders);

        const smmaResults = await Promise.all(
          smmaOrders.map(order => {
            if (order.serviceType === 'tiktok_followers') {
              console.log('🎵 HomePage - Commande TikTok détectée');
              return smmaServiceClient.orderTikTokFollowers(order);
            } else {
              console.log('📸 HomePage - Commande Instagram détectée');
              return smmaServiceClient.orderFollowers(order);
            }
          })
        );

        console.log('📊 Résultats SMMA:', smmaResults);
        setSmmaResults(smmaResults);
        localStorage.removeItem('cartItems');
      }
    } catch (error) {
      console.error('❌ Erreur SMMA:', error);
      setSmmaResults({ error: 'Erreur lors du traitement' });
    } finally {
      setIsProcessingSMMA(false);
    }
  };


  const faqs = [
    {
      question: "Les followers sont-ils réels ?",
      answer: "Oui, tous nos followers sont des comptes réels et actifs. Nous ne vendons jamais de bots ou de comptes inactifs."
    },
    {
      question: "Combien de temps faut-il pour voir les résultats ?",
      answer: "La livraison commence immédiatement après votre commande et se fait progressivement sur 24-72h pour un aspect naturel."
    },
    {
      question: "Y a-t-il un risque pour mon compte ?",
      answer: "Aucun risque ! Nous respectons les limites d'Instagram et utilisons des méthodes sûres et discrètes."
    },
    {
      question: "Proposez-vous une garantie ?",
      answer: "Oui, nous offrons une garantie de 30 jours. Si vous n'êtes pas satisfait, nous vous remboursons intégralement."
    },
    {
      question: "Puis-je choisir le type de followers ?",
      answer: "Absolument ! Vous pouvez choisir entre des followers français ou internationaux selon vos besoins."
    }
  ];

  const platformServices: PlatformServices[] = [
    {
      platform: 'Instagram',
      platformIcon: <Instagram className="w-8 h-8" />,
      services: [
        {
          id: 'instagram-followers',
          name: 'Followers Instagram',
          description: 'Des followers réels et actifs pour faire grandir votre communauté',
          icon: <Users className="w-6 h-6" />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-pink-500 to-purple-600'
        },
        {
          id: 'instagram-likes',
          name: 'Likes Instagram',
          description: 'Augmentez l\'engagement de vos posts avec des likes authentiques',
          icon: <Heart className="w-6 h-6" />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-red-500 to-pink-600'
        },
        {
          id: 'instagram-views',
          name: 'Vues Instagram',
          description: 'Boostez vos reels, stories et vidéos avec des vues authentiques',
          icon: <Eye className="w-6 h-6" />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600'
        },
        {
          id: 'instagram-comments',
          name: 'Commentaires Instagram',
          description: 'Des commentaires pertinents pour booster vos posts',
          icon: <MessageCircle className="w-6 h-6" />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-600'
        }
      ]
    },
    {
      platform: 'TikTok',
      platformIcon: <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold text-sm">TT</div>,
      services: [
        {
          id: 'tiktok-followers',
          name: 'Followers TikTok',
          description: 'Développez votre audience TikTok avec des followers engagés',
          icon: <Users className="w-6 h-6" />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-gray-800 to-black'
        },
        {
          id: 'tiktok-likes',
          name: 'Likes TikTok',
          description: 'Boostez vos vidéos avec des likes réels et authentiques',
          icon: <Heart className="w-6 h-6" />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-red-600 to-pink-600'
        },
        {
          id: 'tiktok-comments',
          name: 'Commentaires TikTok',
          description: 'Engagez votre audience avec des commentaires pertinents',
          icon: <MessageCircle className="w-6 h-6" />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-blue-600 to-cyan-600'
        },
        {
          id: 'tiktok-views',
          name: 'Vues TikTok',
          description: 'Augmentez la portée de vos vidéos TikTok',
          icon: <Eye className="w-6 h-6" />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-purple-600 to-indigo-600'
        }
      ]
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Livraison Rapide',
      description: 'Résultats visibles en quelques heures'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '100% Sécurisé',
      description: 'Aucun risque pour votre compte'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Garantie 30 jours',
      description: 'Satisfait ou remboursé'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-75"></div>
                <Instagram className="relative w-12 h-12 text-white mr-4" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Acheter followers Instagram, Tiktok, et plus encore...
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            <p>
              Boostez vos réseaux sociaux avec de vrais followers et commencez à transformer votre audience en revenus.
            </p>

            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button
                onClick={() => onNavigate?.('instagram-followers')}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg flex items-center justify-center"
              >
                <Users className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Acheter des Followers
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate?.('instagram-likes')}
                className="group bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg flex items-center justify-center"
              >
                <Heart className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Acheter des Likes
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-blue-400 mr-3">{feature.icon}</div>
                  <div>
                    <div className="font-semibold">{feature.title}</div>
                    <div className="text-sm text-blue-200">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Nos services
          </h2>
          <p className="text-xl text-blue-200">
            Choisissez votre plateforme et boostez votre présence avec des followers réels et actifs.
          </p>
        </div>

        <div className="space-y-16">
          {platformServices.map((platform, platformIndex) => (
            <div key={platform.platform} className={`backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 hover:scale-[1.02] ${
              platformIndex === 0 
                ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/30' 
                : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30'
            }`}>
              <div className="flex items-center mb-8">
                <div className={`mr-4 p-3 rounded-xl ${
                  platformIndex === 0 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}>
                  {platform.platformIcon}
                </div>
                <h3 className="text-3xl font-bold text-white">{platform.platform}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platform.services.map((service) => (
                  <div
                    key={service.id}
                    className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      hoveredService === service.id ? 'scale-105' : ''
                    }`}
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                    onClick={() => onNavigate?.(service.id)}
                  >
                    <div className={`${service.bgColor} rounded-2xl p-6 h-full border-2 border-transparent group-hover:border-white/20 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                      <div className={`${service.color} mb-4`}>
                        {service.icon}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">
                        {service.name}
                      </h4>
                      <p className="text-white/90 text-sm mb-4">
                        {service.description}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Éviter le double clic
                          onNavigate?.(service.id);
                        }}
                        className="flex items-center text-white font-medium group-hover:text-white/80 transition-colors hover:bg-white/10 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm">Découvrir</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-blue-200">
            Tout ce que vous devez savoir sur nos services
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/10 transition-colors"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <div className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-5 h-5 text-blue-400" />
                </div>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4">
                  <p className="text-blue-200">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-blue-200">Support client</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-blue-200">Sécurisé</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">Rapide</div>
            <div className="text-blue-200">Livraison</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Globe className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white mb-2">Pro</div>
            <div className="text-blue-200">Service</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="relative">
            <h3 className="text-4xl font-bold text-white mb-4">
              Prêt à booster votre présence ?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Rejoignez des milliers de créateurs qui font confiance à Doctor Followers
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => onNavigate?.('instagram-followers')}
                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-colors transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <Users className="w-6 h-6 mr-3" />
                Commencer avec les Followers
              </button>
              <button
                onClick={() => onNavigate?.('instagram-likes')}
                className="bg-white/20 text-white font-bold py-4 px-8 rounded-xl hover:bg-white/30 transition-colors transform hover:scale-105 shadow-lg border border-white/30 flex items-center justify-center"
              >
                <Heart className="w-6 h-6 mr-3" />
                Essayer les Likes
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
