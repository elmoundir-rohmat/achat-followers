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
          
          // 🔍 Détecter la plateforme ET le type de service
          let serviceType: string;
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
              console.log('🎵 HomePage - Commande TikTok Followers détectée');
              return smmaServiceClient.orderTikTokFollowers(order);
            } else if (order.serviceType === 'tiktok_likes') {
              console.log('❤️ HomePage - Commande TikTok Likes détectée');
              return smmaServiceClient.orderTikTokLikes(order);
            } else if (order.serviceType === 'tiktok_views') {
              console.log('👁️ HomePage - Commande TikTok Views détectée');
              return smmaServiceClient.orderTikTokViews(order);
            } else if (order.serviceType === 'likes') {
              console.log('📸 HomePage - Commande Instagram Likes détectée');
              return smmaServiceClient.orderLikes(order);
            } else if (order.serviceType === 'views') {
              console.log('📸 HomePage - Commande Instagram Views détectée');
              return smmaServiceClient.orderViews(order);
            } else {
              console.log('📸 HomePage - Commande Instagram Followers détectée');
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <div className="border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50">
                  <Zap className="h-3 w-3 text-blue-500" />
                </div>
                <span>Followers réels • Livraison 24-72h • Paiement sécurisé</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-500 shadow-md">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Doctor Followers
                </p>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
                Achat followers Instagram & TikTok
                <span className="block text-slate-500">simples, rapides et 100% réels.</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mb-8 max-w-xl">
                Boostez vos réseaux sociaux avec de vrais followers et commencez à transformer
                votre audience en revenus, sans design chargé ni parcours compliqué.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={() => onNavigate?.('instagram-followers')}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Acheter des followers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigate?.('instagram-likes')}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Voir les likes
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <span className="mt-0.5 text-blue-500">{feature.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{feature.title}</p>
                      <p className="text-[11px] text-slate-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte de prévisualisation simple pour garder le côté "produit" */}
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500">Pack sélectionné</p>
                    <p className="text-lg font-semibold text-slate-900">10 000 followers</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                    Livraison active
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 mb-4">
                  <div className="flex items-center justify-between mb-2 text-xs text-slate-500">
                    <span>Compte</span>
                    <span>@votreprofil</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Progression</span>
                    <span>72%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <div>
                    <p className="text-xs text-slate-500">Total</p>
                    <p className="text-lg font-semibold text-slate-900">97,00 €</p>
                  </div>
                  <button className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors">
                    Voir les packs
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Paiement sécurisé, aucun mot de passe demandé, support réactif si besoin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Nos services
              </h2>
              <p className="mt-3 text-sm text-slate-600 max-w-md">
                Choisissez votre plateforme et boostez votre présence avec des followers réels et actifs.
              </p>
            </div>
          </div>

          <div className="space-y-10">
            {platformServices.map((platform) => (
              <div key={platform.platform} className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
                    {platform.platformIcon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{platform.platform}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {platform.services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => onNavigate?.(service.id)}
                      onMouseEnter={() => setHoveredService(service.id)}
                      onMouseLeave={() => setHoveredService(null)}
                      className={`group flex flex-col items-start rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 ${
                        hoveredService === service.id ? 'border-slate-300 bg-slate-50' : ''
                      }`}
                    >
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                        {service.icon}
                      </div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">
                        {service.name}
                      </p>
                      <p className="text-xs text-slate-600 mb-3">
                        {service.description}
                      </p>
                      <span className="text-xs font-medium text-slate-700 inline-flex items-center gap-1">
                        Découvrir
                        <ArrowRight className="h-3 w-3" />
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
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-50 mb-3">
              Pourquoi acheter des followers Instagram actifs ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-sm">
            {/* Problème des bots */}
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
              <div className="flex items-center mb-3">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Les bots : un danger</h3>
              </div>
              <ul className="space-y-2 text-slate-600 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">❌</span>
                  <span>N'aident pas l'engagement de votre page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">❌</span>
                  <span>Détectés facilement par Instagram</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">❌</span>
                  <span>Impact négatif sur votre visibilité</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">❌</span>
                  <span>Pénalisation de l'algorithme</span>
                </li>
              </ul>
            </div>

            {/* Solution avec nos followers */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex items-center mb-3">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Users2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">Nos followers réels</h3>
              </div>
              <ul className="space-y-2 text-slate-700 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✅</span>
                  <span><strong className="text-slate-900">Crédibilité</strong> renforcée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✅</span>
                  <span><strong className="text-slate-900">Visibilité</strong> améliorée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">✅</span>
                  <span><strong className="text-slate-900">Croissance</strong> naturelle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✅</span>
                  <span>Engagement authentique</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comment fonctionne notre service */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500 mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
              Comment fonctionne notre service d'achat de followers Instagram actifs
            </h2>
          </div>

          {/* Processus étape par étape */}
          <div className="grid md:grid-cols-3 gap-6 mb-10 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white mx-auto">
                <span className="text-lg font-semibold">1</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Sélectionnez votre pack</h3>
              <p className="text-xs text-slate-600">
                Choisissez le nombre de followers qui correspond à vos besoins.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white mx-auto">
                <span className="text-lg font-semibold">2</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Saisissez votre profil</h3>
              <p className="text-xs text-slate-600">
                Entrez le lien de votre profil Instagram (aucun mot de passe requis).
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white mx-auto">
                <span className="text-lg font-semibold">3</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Livraison automatique</h3>
              <p className="text-xs text-slate-600">
                Suivi en temps réel et livraison progressive de vos followers.
              </p>
            </div>
          </div>

          {/* Avantages du service */}
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Livraison rapide</h4>
              <p className="text-xs text-slate-600">
                Commence immédiatement après votre commande.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Achat sécurisé</h4>
              <p className="text-xs text-slate-600">
                Aucun mot de passe requis, paiement sécurisé.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">Followers stables</h4>
              <p className="text-xs text-slate-600">
                Des abonnés qui restent sur votre compte.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Les avantages d'un achat de followers Instagram */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 text-purple-500 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
              Les avantages d'un achat de followers Instagram actifs et réels
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Preuve sociale</h3>
              <p className="text-xs text-slate-600">
                Amélioration significative de votre crédibilité et attractivité.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Visibilité accrue</h3>
              <p className="text-xs text-slate-600">
                Meilleure visibilité dans l'algorithme Instagram.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Engagement naturel</h3>
              <p className="text-xs text-slate-600">
                Augmentation du taux d'engagement avec des abonnés réels.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center mx-auto mb-3">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Collaborations</h3>
              <p className="text-xs text-slate-600">
                Ouverture à de nouvelles collaborations avec des marques.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pourquoi choisir Doctor Followers */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
              Pourquoi choisir Doctor Followers pour vos followers Instagram
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Fiabilité garantie</h3>
              <p className="text-xs text-slate-600">
                Service client réactif disponible 24/7 avec un support dédié.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-3">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Followers réels</h3>
              <p className="text-xs text-slate-600">
                Uniquement des abonnés issus de comptes actifs et authentiques.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Satisfaction garantie</h3>
              <p className="text-xs text-slate-600">
                Politique de remboursement simple et livraison progressive.
              </p>
            </div>
          </div>

          {/* Call-to-action */}
          <div className="mt-10 text-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-col items-center gap-2 mb-4">
                <Headphones className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-900">Support client 24/7</h3>
              </div>
              <p className="text-xs text-slate-600 mb-5">
                Notre équipe est disponible pour vous accompagner dans votre croissance Instagram.
              </p>
              <button
                onClick={() => onNavigate?.('contact')}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
              Questions fréquentes
            </h2>
            <p className="text-sm text-slate-600">
              Tout ce que vous devez savoir sur nos services.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm"
                >
                  <span className="font-medium text-slate-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-3 text-xs text-slate-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center text-xs">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-semibold text-slate-900 mb-1">24/7</div>
              <div className="text-slate-600">Support client</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-semibold text-slate-900 mb-1">100%</div>
              <div className="text-slate-600">Sécurisé</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-semibold text-slate-900 mb-1">Rapide</div>
              <div className="text-slate-600">Livraison</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-semibold text-slate-900 mb-1">Pro</div>
              <div className="text-slate-600">Service</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center md:text-left md:px-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
                Prêt à booster votre présence ?
              </h3>
              <p className="text-sm text-slate-600 max-w-xl">
                Rejoignez des créateurs qui ont choisi un parcours simple pour faire grandir leurs
                comptes Instagram et TikTok.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => onNavigate?.('instagram-followers')}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <Users className="mr-2 h-4 w-4" />
                Commencer avec les followers
              </button>
              <button
                onClick={() => onNavigate?.('instagram-likes')}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Heart className="mr-2 h-4 w-4" />
                Essayer les likes
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
