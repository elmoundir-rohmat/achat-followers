import React, { useState, useEffect } from 'react';
import { Instagram, Heart, MessageCircle, Eye, Users, Zap, Shield, Clock, ArrowRight, Star, CheckCircle, TrendingUp, Award, Globe, Smartphone, ChevronDown, Bot, Target, Lock, Users2, ThumbsUp, Sparkles, Crown, Headphones } from 'lucide-react';
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
      setShowPaymentSuccess(true);
      
      // Récupérer les paramètres Cardinity
      const urlParams = new URLSearchParams(window.location.search);
      const cardinityOrderId = urlParams.get('order_id');
      const cardinityAmount = urlParams.get('amount');
      const cardinityStatus = urlParams.get('status');
      const cardinityId = urlParams.get('id');
      
      // Si c'est un retour Cardinity réussi, déclencher la commande
      if ((cardinityStatus === 'approved' || cardinityId) && (cardinityId || cardinityOrderId)) {
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
          // Erreur silencieuse lors du parsing
        }
      }
    }
  }, []);

  const processSMMAIntegration = async (paymentId: string) => {
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
          
          // Détecter la plateforme ET le type de service
          let serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_comments' | 'tiktok_views';
          if (item.platform === 'TikTok') {
            if (item.likes && item.likes > 0) {
              serviceType = 'tiktok_likes';
            } else if (item.views && item.views > 0) {
              serviceType = 'tiktok_views';
            } else {
              serviceType = 'tiktok_followers';
            }
          } else {
            if (item.likes && item.likes > 0) {
              serviceType = 'likes';
            } else if (item.views && item.views > 0) {
              serviceType = 'views';
            } else {
              serviceType = 'followers';
            }
          }
          
          return {
            username: item.username,
            followers: item.followers,
            followerType: item.followerType,
            serviceType: serviceType,
            orderId: orderDetails?.orderId || paymentId,
            paymentId: paymentId
          };
        });

        const smmaResults = await Promise.all(
          smmaOrders.map(order => {
            if (order.serviceType === 'tiktok_followers') {
              return smmaServiceClient.orderTikTokFollowers(order);
            } else if (order.serviceType === 'tiktok_likes') {
              return smmaServiceClient.orderTikTokLikes(order);
            } else if (order.serviceType === 'tiktok_views') {
              return smmaServiceClient.orderTikTokViews(order);
            } else if (order.serviceType === 'likes') {
              return smmaServiceClient.orderLikes(order);
            } else if (order.serviceType === 'views') {
              return smmaServiceClient.orderViews(order);
            } else {
              return smmaServiceClient.orderFollowers(order);
            }
          })
        );
        setSmmaResults(smmaResults);
        localStorage.removeItem('cartItems');
      }
    } catch (error) {
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
      platformIcon: <Instagram className="w-8 h-8" strokeWidth={1.5} />,
      services: [
        {
          id: 'instagram-followers',
          name: 'Followers Instagram',
          description: 'Des followers réels et actifs pour faire grandir votre communauté',
          icon: <Users className="w-6 h-6" strokeWidth={1.5} />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-pink-500 to-purple-600'
        },
        {
          id: 'instagram-likes',
          name: 'Likes Instagram',
          description: 'Augmentez l\'engagement de vos posts avec des likes authentiques',
          icon: <Heart className="w-6 h-6" strokeWidth={1.5} />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-red-500 to-pink-600'
        },
        {
          id: 'instagram-views',
          name: 'Vues Instagram',
          description: 'Boostez vos reels, stories et vidéos avec des vues authentiques',
          icon: <Eye className="w-6 h-6" strokeWidth={1.5} />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-purple-500 to-pink-600'
        },
        {
          id: 'instagram-comments',
          name: 'Commentaires Instagram',
          description: 'Des commentaires pertinents pour booster vos posts',
          icon: <MessageCircle className="w-6 h-6" strokeWidth={1.5} />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-600'
        }
      ]
    },
    {
      platform: 'TikTok',
      platformIcon: <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-soft">TT</div>,
      services: [
        {
          id: 'tiktok-followers',
          name: 'Followers TikTok',
          description: 'Développez votre audience TikTok avec des followers engagés',
          icon: <Users className="w-6 h-6" strokeWidth={1.5} />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-gray-800 to-black'
        },
        {
          id: 'tiktok-likes',
          name: 'Likes TikTok',
          description: 'Boostez vos vidéos avec des likes réels et authentiques',
          icon: <Heart className="w-6 h-6" strokeWidth={1.5} />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-red-600 to-pink-600'
        },
        {
          id: 'tiktok-comments',
          name: 'Commentaires TikTok',
          description: 'Engagez votre audience avec des commentaires pertinents',
          icon: <MessageCircle className="w-6 h-6" strokeWidth={1.5} />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-blue-600 to-cyan-600'
        },
        {
          id: 'tiktok-views',
          name: 'Vues TikTok',
          description: 'Augmentez la portée de vos vidéos TikTok',
          icon: <Eye className="w-6 h-6" strokeWidth={1.5} />,
          color: 'text-white',
          bgColor: 'bg-gradient-to-br from-purple-600 to-indigo-600'
        }
      ]
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" strokeWidth={1.5} />,
      title: 'Livraison Rapide',
      description: 'Résultats visibles en quelques heures'
    },
    {
      icon: <Shield className="w-6 h-6" strokeWidth={1.5} />,
      title: '100% Sécurisé',
      description: 'Aucun risque pour votre compte'
    },
    {
      icon: <Clock className="w-6 h-6" strokeWidth={1.5} />,
      title: 'Garantie 30 jours',
      description: 'Satisfait ou remboursé'
    }
  ];

  return (
    <div className="min-h-screen bg-cream text-slate-800 font-rounded">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-32">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-pill border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm px-4 py-2 text-xs font-medium text-slate-600 shadow-soft">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-warm-yellow-200 to-soft-orange-200">
                  <Zap className="h-3 w-3 text-soft-orange-500" />
                </div>
                <span>Followers réels • Livraison 24-72h • Paiement sécurisé</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg">
                  <Instagram className="h-7 w-7 text-white" strokeWidth={1.5} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Doctor Followers
                </p>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-800 mb-6 leading-tight">
                Achat followers Instagram & TikTok
                <span className="block text-slate-600 mt-2">simples, rapides et 100% réels.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
                Boostez vos réseaux sociaux avec de vrais followers et commencez à transformer
                votre audience en revenus, sans design chargé ni parcours compliqué.
            </p>
            
            {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => onNavigate?.('instagram-followers')}
                  className="inline-flex items-center justify-center rounded-button bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 px-8 py-4 text-sm font-semibold text-white shadow-soft-lg hover:shadow-soft-xl hover:scale-105 transition-all duration-300"
                >
                  <Users className="mr-2 h-4 w-4" strokeWidth={2} />
                  Acheter des followers
                  <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => onNavigate?.('instagram-likes')}
                  className="inline-flex items-center justify-center rounded-button border-2 border-soft-pink-300 bg-white/80 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-slate-700 hover:bg-white hover:border-soft-pink-400 hover:scale-105 transition-all duration-300 shadow-soft"
              >
                  <Heart className="mr-2 h-4 w-4" strokeWidth={2} />
                  Voir les likes
              </button>
            </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-card-sm border border-soft-pink-100 bg-white/60 backdrop-blur-sm px-5 py-4 shadow-soft hover:shadow-soft-lg transition-all duration-300"
                  >
                    <span className="mt-0.5 text-soft-pink-500">{feature.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm mb-1">{feature.title}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte de prévisualisation simple pour garder le côté "produit" */}
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-sm rounded-card border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-soft-xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Pack sélectionné</p>
                    <p className="text-xl font-semibold text-slate-800">10 000 followers</p>
                  </div>
                  <span className="rounded-pill bg-gradient-to-r from-lavender-100 to-soft-pink-100 px-4 py-1.5 text-xs font-medium text-lavender-700 border border-lavender-200/50">
                    Livraison active
                  </span>
                </div>
                <div className="rounded-card-sm border border-lavender-100 bg-gradient-to-br from-lavender-50/50 to-soft-pink-50/50 p-5 mb-5">
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
                    <span>Compte</span>
                    <span className="font-medium">@votreprofil</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                    <span>Progression</span>
                    <span className="font-semibold">72%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-lavender-100 overflow-hidden">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 shadow-inner-soft" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-5">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total</p>
                    <p className="text-xl font-semibold text-slate-800">97,00 €</p>
                  </div>
                  <button className="inline-flex items-center rounded-button bg-gradient-to-r from-soft-pink-400 to-lavender-400 px-5 py-2.5 text-xs font-semibold text-white hover:shadow-soft-lg hover:scale-105 transition-all duration-300">
                    Voir les packs
                    <ArrowRight className="ml-2 h-3 w-3" strokeWidth={2} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Paiement sécurisé, aucun mot de passe demandé, support réactif si besoin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-b from-cream to-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
            Nos services
          </h2>
              <p className="text-base text-slate-600 max-w-md leading-relaxed">
            Choisissez votre plateforme et boostez votre présence avec des followers réels et actifs.
          </p>
            </div>
        </div>

          <div className="space-y-14">
            {platformServices.map((platform) => (
              <div key={platform.platform} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-card-sm bg-white border border-soft-pink-200/50 shadow-soft">
                  {platform.platformIcon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">{platform.platform}</h3>
              </div>
              
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {platform.services.map((service) => (
                    <button
                    key={service.id}
                      onClick={() => onNavigate?.(service.id)}
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                      className={`group flex flex-col items-start rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm px-5 py-5 text-left transition-all duration-300 hover:shadow-soft-lg hover:scale-105 ${
                        hoveredService === service.id ? 'border-soft-pink-300 bg-white shadow-soft-lg scale-105' : ''
                      }`}
                  >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-card-sm bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 text-white shadow-soft">
                        {service.icon}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mb-2">
                        {service.name}
                      </p>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                        {service.description}
                      </p>
                      <span className="text-xs font-medium text-soft-pink-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Découvrir
                        <ArrowRight className="h-3 w-3" strokeWidth={2} />
                      </span>
                      </button>
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Pourquoi acheter des followers Instagram actifs */}
      <div className="bg-gradient-to-b from-white to-cream">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-soft-pink-100 to-lavender-100 mb-6 shadow-soft">
              <Bot className="w-7 h-7 text-soft-pink-500" strokeWidth={1.5} />
          </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
            Pourquoi acheter des followers Instagram actifs ?
          </h2>
        </div>
        
          <div className="grid md:grid-cols-2 gap-6 text-sm">
          {/* Problème des bots */}
            <div className="rounded-card border border-soft-pink-200/50 bg-gradient-to-br from-soft-pink-50/50 to-peach-50/50 p-8 shadow-soft-lg">
              <div className="flex items-center mb-5">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 to-peach-400 text-white shadow-soft">
                  <Bot className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Les bots : un danger</h3>
              </div>
              <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-soft-pink-500 mt-0.5 text-lg">❌</span>
                <span>N'aident pas l'engagement de votre page</span>
              </li>
                <li className="flex items-start gap-3">
                  <span className="text-soft-pink-500 mt-0.5 text-lg">❌</span>
                <span>Détectés facilement par Instagram</span>
              </li>
                <li className="flex items-start gap-3">
                  <span className="text-soft-pink-500 mt-0.5 text-lg">❌</span>
                <span>Impact négatif sur votre visibilité</span>
              </li>
                <li className="flex items-start gap-3">
                  <span className="text-soft-pink-500 mt-0.5 text-lg">❌</span>
                <span>Pénalisation de l'algorithme</span>
              </li>
            </ul>
          </div>

          {/* Solution avec nos followers */}
            <div className="rounded-card border border-lavender-200/50 bg-gradient-to-br from-lavender-50/50 to-baby-purple-50/50 p-8 shadow-soft-lg">
              <div className="flex items-center mb-5">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-lavender-400 to-baby-purple-400 text-white shadow-soft">
                  <Users2 className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Nos followers réels</h3>
              </div>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-lavender-600 mt-0.5 text-lg">✅</span>
                  <span><strong className="text-slate-800">Crédibilité</strong> renforcée</span>
              </li>
                <li className="flex items-start gap-3">
                  <span className="text-lavender-600 mt-0.5 text-lg">✅</span>
                  <span><strong className="text-slate-800">Visibilité</strong> améliorée</span>
              </li>
                <li className="flex items-start gap-3">
                  <span className="text-lavender-600 mt-0.5 text-lg">✅</span>
                  <span><strong className="text-slate-800">Croissance</strong> naturelle</span>
              </li>
                <li className="flex items-start gap-3">
                  <span className="text-lavender-500 mt-0.5 text-lg">✅</span>
                <span>Engagement authentique</span>
              </li>
            </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comment fonctionne notre service */}
      <div className="bg-gradient-to-b from-cream to-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-lavender-100 to-baby-purple-100 mb-6 shadow-soft">
              <Target className="w-7 h-7 text-lavender-500" strokeWidth={1.5} />
          </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
            Comment fonctionne notre service d'achat de followers Instagram actifs
          </h2>
        </div>
        
        {/* Processus étape par étape */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 text-sm">
            <div className="rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 to-peach-400 text-white mx-auto shadow-soft-lg">
                <span className="text-xl font-semibold">1</span>
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">Sélectionnez votre pack</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choisissez le nombre de followers qui correspond à vos besoins.
              </p>
            </div>

            <div className="rounded-card-sm border border-lavender-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-lavender-400 to-baby-purple-400 text-white mx-auto shadow-soft-lg">
                <span className="text-xl font-semibold">2</span>
          </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">Saisissez votre profil</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Entrez le lien de votre profil Instagram (aucun mot de passe requis).
              </p>
            </div>

            <div className="rounded-card-sm border border-warm-yellow-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-warm-yellow-400 to-soft-orange-400 text-white mx-auto shadow-soft-lg">
                <span className="text-xl font-semibold">3</span>
          </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">Livraison automatique</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Suivi en temps réel et livraison progressive de vos followers.
              </p>
          </div>
        </div>

        {/* Avantages du service */}
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-card-sm border border-warm-yellow-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-yellow-400 to-soft-orange-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <Zap className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h4 className="text-base font-semibold text-slate-800 mb-2">Livraison rapide</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Commence immédiatement après votre commande.
              </p>
            </div>

            <div className="rounded-card-sm border border-lavender-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-400 to-baby-purple-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <Lock className="w-6 h-6" strokeWidth={1.5} />
          </div>
              <h4 className="text-base font-semibold text-slate-800 mb-2">Achat sécurisé</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Aucun mot de passe requis, paiement sécurisé.
              </p>
            </div>

            <div className="rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soft-pink-400 to-peach-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <Shield className="w-6 h-6" strokeWidth={1.5} />
          </div>
              <h4 className="text-base font-semibold text-slate-800 mb-2">Followers stables</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Des abonnés qui restent sur votre compte.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Les avantages d'un achat de followers Instagram */}
      <div className="bg-gradient-to-b from-white to-cream">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-baby-purple-100 to-lavender-100 mb-6 shadow-soft">
              <Sparkles className="w-7 h-7 text-baby-purple-500" strokeWidth={1.5} />
          </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
            Les avantages d'un achat de followers Instagram actifs et réels
          </h2>
        </div>
        
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="rounded-card-sm border border-baby-purple-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-baby-purple-400 to-lavender-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <TrendingUp className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">Preuve sociale</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Amélioration significative de votre crédibilité et attractivité.
              </p>
            </div>

            <div className="rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soft-pink-400 to-peach-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <Eye className="w-6 h-6" strokeWidth={1.5} />
          </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">Visibilité accrue</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Meilleure visibilité dans l'algorithme Instagram.
              </p>
            </div>

            <div className="rounded-card-sm border border-lavender-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-400 to-baby-purple-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <ThumbsUp className="w-6 h-6" strokeWidth={1.5} />
          </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">Engagement naturel</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Augmentation du taux d'engagement avec des abonnés réels.
              </p>
            </div>

            <div className="rounded-card-sm border border-warm-yellow-200/50 bg-white/80 backdrop-blur-sm p-7 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-yellow-400 to-soft-orange-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <Crown className="w-6 h-6" strokeWidth={1.5} />
          </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">Collaborations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ouverture à de nouvelles collaborations avec des marques.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pourquoi choisir Doctor Followers */}
      <div className="bg-gradient-to-b from-cream to-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-warm-yellow-100 to-soft-orange-100 mb-6 shadow-soft">
              <Award className="w-7 h-7 text-soft-orange-500" strokeWidth={1.5} />
          </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
            Pourquoi choisir Doctor Followers pour vos followers Instagram
          </h2>
        </div>
        
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="rounded-card-sm border border-lavender-200/50 bg-white/80 backdrop-blur-sm p-8 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-400 to-baby-purple-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <Shield className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">Fiabilité garantie</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Service client réactif disponible 24/7 avec un support dédié.
              </p>
            </div>

            <div className="rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-8 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soft-pink-400 to-peach-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <Users2 className="w-6 h-6" strokeWidth={1.5} />
          </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">Followers réels</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Uniquement des abonnés issus de comptes actifs et authentiques.
              </p>
            </div>

            <div className="rounded-card-sm border border-warm-yellow-200/50 bg-white/80 backdrop-blur-sm p-8 text-center shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-yellow-400 to-soft-orange-400 text-white flex items-center justify-center mx-auto mb-4 shadow-soft-lg">
                <CheckCircle className="w-6 h-6" strokeWidth={1.5} />
          </div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">Satisfaction garantie</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Politique de remboursement simple et livraison progressive.
              </p>
          </div>
        </div>
        
        {/* Call-to-action */}
          <div className="mt-14 text-center">
            <div className="rounded-card border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-10 shadow-soft-lg">
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lavender-400 to-baby-purple-400 flex items-center justify-center shadow-soft-lg">
                  <Headphones className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Support client 24/7</h3>
            </div>
              <p className="text-sm text-slate-600 mb-7 leading-relaxed max-w-md mx-auto">
                Notre équipe est disponible pour vous accompagner dans votre croissance Instagram.
            </p>
            <button
              onClick={() => onNavigate?.('contact')}
                className="inline-flex items-center justify-center rounded-button bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 px-8 py-4 text-sm font-semibold text-white hover:shadow-soft-xl hover:scale-105 transition-all duration-300 shadow-soft-lg"
            >
              Nous contacter
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-b from-white to-cream">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
              Questions fréquentes
          </h2>
            <p className="text-base text-slate-600">
              Tout ce que vous devez savoir sur nos services.
          </p>
        </div>

          <div className="space-y-4">
          {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm shadow-soft hover:shadow-soft-lg transition-all duration-300"
              >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-sm"
                >
                  <span className="font-semibold text-slate-800">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-soft-pink-500 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    strokeWidth={1.5}
                  />
              </button>
              {openFaq === index && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-b from-cream to-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-7 shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-100 to-baby-purple-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-lavender-500" strokeWidth={1.5} />
              </div>
              <div className="text-3xl font-semibold text-slate-800 mb-2">24/7</div>
              <div className="text-sm text-slate-600">Support client</div>
            </div>
            <div className="rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-7 shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soft-pink-100 to-peach-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-soft-pink-500" strokeWidth={1.5} />
              </div>
              <div className="text-3xl font-semibold text-slate-800 mb-2">100%</div>
              <div className="text-sm text-slate-600">Sécurisé</div>
          </div>
            <div className="rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-7 shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warm-yellow-100 to-soft-orange-100 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-soft-orange-500" strokeWidth={1.5} />
              </div>
              <div className="text-3xl font-semibold text-slate-800 mb-2">Rapide</div>
              <div className="text-sm text-slate-600">Livraison</div>
          </div>
            <div className="rounded-card-sm border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm p-7 shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-baby-purple-100 to-lavender-100 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-baby-purple-500" strokeWidth={1.5} />
              </div>
              <div className="text-3xl font-semibold text-slate-800 mb-2">Pro</div>
              <div className="text-sm text-slate-600">Service</div>
          </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="rounded-card border border-soft-pink-200/50 bg-white/80 backdrop-blur-sm px-8 py-12 text-center md:text-left md:px-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-soft-xl">
            <div>
              <h3 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4">
              Prêt à booster votre présence ?
            </h3>
              <p className="text-base text-slate-600 max-w-xl leading-relaxed">
                Rejoignez des créateurs qui ont choisi un parcours simple pour faire grandir leurs
                comptes Instagram et TikTok.
            </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => onNavigate?.('instagram-followers')}
                className="inline-flex flex-1 items-center justify-center rounded-button bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 px-8 py-4 text-sm font-semibold text-white hover:shadow-soft-xl hover:scale-105 transition-all duration-300 shadow-soft-lg"
              >
                <Users className="mr-2 h-4 w-4" strokeWidth={2} />
                Commencer avec les followers
              </button>
              <button
                onClick={() => onNavigate?.('instagram-likes')}
                className="inline-flex flex-1 items-center justify-center rounded-button border-2 border-soft-pink-300 bg-white/80 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-slate-700 hover:bg-white hover:border-soft-pink-400 hover:scale-105 transition-all duration-300 shadow-soft"
              >
                <Heart className="mr-2 h-4 w-4" strokeWidth={2} />
                Essayer les likes
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
