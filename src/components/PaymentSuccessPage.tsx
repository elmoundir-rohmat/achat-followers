import React, { useEffect, useState } from 'react';
import { CheckCircle, Users, Clock, Mail, ArrowLeft } from 'lucide-react';
import { smmaServiceClient, SMMAOrder } from '../services/smmaServiceClient';

interface PaymentSuccessPageProps {
  onBack?: () => void;
}

export default function PaymentSuccessPage({ onBack }: PaymentSuccessPageProps) {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [smmaResults, setSmmaResults] = useState<any>(null);
  const [isProcessingSMMA, setIsProcessingSMMA] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Récupérer les détails de la commande depuis l'URL ou le localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    const amount = urlParams.get('amount');
    const currency = urlParams.get('currency');
    
    // Récupérer les détails depuis le localStorage si disponibles
    const savedOrder = localStorage.getItem('pendingOrder');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        const fullOrderDetails = {
          orderId: orderId || order.orderId,
          amount: amount || order.amount,
          currency: currency || order.currency || 'EUR',
          followers: order.followers,
          followerType: order.followerType,
          username: order.username,
          description: order.description,
          platform: order.platform || 'Instagram',
          customer: order.customer, // ✅ Récupérer les données client
          timestamp: new Date().toLocaleString('fr-FR'),
          // Garder la référence complète pour l'email
          _fullOrder: order
        };
        setOrderDetails(fullOrderDetails);
        
        // NE PAS nettoyer le localStorage ici, on en a besoin pour SMMA
        // localStorage.removeItem('pendingOrder');
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de commande:', error);
      }
    }

    // Vérifier d'abord si on a des paramètres Cardinity
    const cardinityOrderId = urlParams.get('order_id');
    const cardinityStatus = urlParams.get('status');
    
    if (cardinityOrderId && cardinityStatus === 'approved') {
      // Déclencher SMMA immédiatement pour les paiements Cardinity
      processSMMAIntegrationWithCardinity(cardinityOrderId, urlParams.get('id') || cardinityOrderId);
    } else {
      // Récupérer les résultats SMMA pour les autres cas
      const savedSmmaResults = localStorage.getItem('smmaResults');
      if (savedSmmaResults) {
        try {
          const results = JSON.parse(savedSmmaResults);
          setSmmaResults(results);
          
          // Envoyer les emails de confirmation
          const savedPendingOrder = localStorage.getItem('pendingOrder');
          if (savedPendingOrder) {
            try {
              const pendingOrder = JSON.parse(savedPendingOrder);
              sendConfirmationEmail({
                ...pendingOrder,
                orderId: orderId || pendingOrder.orderId,
                amount: amount || pendingOrder.amount,
                currency: currency || pendingOrder.currency || 'EUR',
              });
            } catch (error) {
              console.error('❌ Erreur lors de la préparation de l\'email:', error);
            }
          }
          
          // Nettoyer le localStorage
          localStorage.removeItem('smmaResults');
        } catch (error) {
          console.error('Erreur lors de la récupération des résultats SMMA:', error);
        }
      } else {
        // Si pas de résultats SMMA, déclencher l'intégration maintenant
        processSMMAIntegration();
      }
    }
  }, []);

  // Fonction pour envoyer les emails de confirmation
  const sendConfirmationEmail = async (order: any) => {
    // Éviter les doublons
    if (emailSent || !order?.customer?.email) {
      return;
    }

    try {
      const response = await fetch('/api/email/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.orderId,
          amount: order.amount,
          currency: order.currency || 'EUR',
          description: order.description || `${order.followers || 0} followers ${order.platform || 'Instagram'}`,
          customer: order.customer,
          username: order.username,
          followers: order.followers,
          followerType: order.followerType,
          platform: order.platform || 'Instagram',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Emails de confirmation envoyés:', result);
        setEmailSent(true);
      } else {
        console.error('❌ Erreur lors de l\'envoi des emails:', await response.text());
      }
    } catch (error) {
      // Ne pas bloquer l'utilisateur en cas d'erreur d'email
      console.error('❌ Erreur lors de l\'envoi des emails (non bloquant):', error);
    }
  };

  const processSMMAIntegrationWithCardinity = async (orderId: string, paymentId: string) => {
    setIsProcessingSMMA(true);
    
    try {
      // RÉCUPÉRER LES DONNÉES SAUVEGARDÉES AVANT LE PAIEMENT
      const savedPendingOrder = localStorage.getItem('pendingOrder');
      
      let serviceType = 'followers';
      let quantity = 25;
      let username = ''; // ✅ Vide par défaut, pas de valeur fictive
      let selectedPosts: any[] = [];
      let originalFollowerType = 'international'; // Déclarer en dehors du bloc if
      let customComments: string[] | undefined = undefined; // Pour les commentaires TikTok personnalisés
      
      if (savedPendingOrder) {
        try {
          const pendingOrder = JSON.parse(savedPendingOrder);
          
          // Extraire les données du panier sauvegardé
          username = pendingOrder.username || ''; // ✅ Vide si non défini
          selectedPosts = pendingOrder.selectedPosts || [];
          originalFollowerType = pendingOrder.followerType || 'international';
          
          // Récupérer customComments depuis les items du panier (pour commentaires TikTok personnalisés)
          if (pendingOrder.items && pendingOrder.items.length > 0) {
            const firstItem = pendingOrder.items[0];
            if (firstItem.customComments && Array.isArray(firstItem.customComments)) {
              customComments = firstItem.customComments;
            }
          }
          
          // ✅ DÉTECTER LA PLATEFORME depuis pendingOrder
          const platform = pendingOrder.platform || 'Instagram';
          
          // Détecter le type de service depuis la description ET la plateforme
          const description = pendingOrder.description || '';
          if (description.toLowerCase().includes('likes')) {
            serviceType = platform === 'TikTok' ? 'tiktok_likes' : 'likes';
            const likesMatch = description.match(/(\d+)\s*likes/i);
            quantity = likesMatch ? parseInt(likesMatch[1]) : 50;
          } else if (description.toLowerCase().includes('commentaires') || description.toLowerCase().includes('comments')) {
            serviceType = platform === 'TikTok' ? 'tiktok_comments' : 'comments';
            const commentsMatch = description.match(/(\d+)\s*(commentaires|comments)/i);
            quantity = commentsMatch ? parseInt(commentsMatch[1]) : 10;
          } else if (description.toLowerCase().includes('vues') || description.toLowerCase().includes('views')) {
            serviceType = platform === 'TikTok' ? 'tiktok_views' : 'views';
            const viewsMatch = description.match(/(\d+)\s*(vues|views)/i);
            quantity = viewsMatch ? parseInt(viewsMatch[1]) : 100;
          } else {
            // ✅ FOLLOWERS : Détecter TikTok ou Instagram
            serviceType = platform === 'TikTok' ? 'tiktok_followers' : 'followers';
            const followersMatch = description.match(/(\d+)\s*followers/i);
            quantity = followersMatch ? parseInt(followersMatch[1]) : 50;
          }
          
        } catch (error) {
          // Erreur silencieuse lors du parsing
        }
      }
      
      // Créer la commande SMMA directement selon le type de service
      let smmaOrder: SMMAOrder;
      
      switch (serviceType) {
        case 'likes':
          // Utiliser le premier post sélectionné
          const firstPost = selectedPosts.length > 0 ? selectedPosts[0] : null;
          if (!firstPost?.postId) {
            throw new Error('Post Instagram manquant. Impossible de commander des likes.');
          }
          const postId = firstPost.postId;
          
          smmaOrder = {
            username: username,
            followers: 0, // Pas utilisé pour les likes
            likesToAdd: quantity, // Quantité pour les likes
            postId: postId, // Vrai ID du post sélectionné
            followerType: originalFollowerType, // 'french' ou 'international' SEULEMENT pour les followers
            serviceType: 'likes', // Type de service : likes
            orderId: orderId,
            paymentId: paymentId
          };
          
          console.log('📸 Post sélectionné pour les likes:', {
            postId,
            totalPosts: selectedPosts.length,
            firstPost: firstPost
          });
          break;
        case 'comments':
          // Utiliser le premier post sélectionné
          const firstCommentPost = selectedPosts.length > 0 ? selectedPosts[0] : null;
          if (!firstCommentPost?.postId) {
            throw new Error('Post Instagram manquant. Impossible de commander des commentaires.');
          }
          const commentPostId = firstCommentPost.postId;
          
          smmaOrder = {
            username: username,
            followers: 0, // Pas utilisé pour les comments
            commentsToAdd: quantity, // Quantité pour les comments
            postId: commentPostId, // Vrai ID du post sélectionné
            followerType: originalFollowerType, // 'french' ou 'international' SEULEMENT pour les followers
            serviceType: 'comments', // Type de service : comments
            orderId: orderId,
            paymentId: paymentId
          };
          
          console.log('💬 Post sélectionné pour les comments:', {
            postId: commentPostId,
            totalPosts: selectedPosts.length
          });
          break;
        case 'views':
          // Utiliser le premier post sélectionné
          const firstViewPost = selectedPosts.length > 0 ? selectedPosts[0] : null;
          if (!firstViewPost?.postId) {
            throw new Error('Post Instagram manquant. Impossible de commander des vues.');
          }
          const viewPostId = firstViewPost.postId;
          
          smmaOrder = {
            username: username,
            followers: 0, // Pas utilisé pour les views
            viewsToAdd: quantity, // Quantité pour les views
            postId: viewPostId, // Vrai ID du post sélectionné
            followerType: originalFollowerType, // 'french' ou 'international' SEULEMENT pour les followers
            serviceType: 'views', // Type de service : views
            orderId: orderId,
            paymentId: paymentId
          };
          
          console.log('👀 Post sélectionné pour les views:', {
            postId: viewPostId,
            totalPosts: selectedPosts.length
          });
          break;
        case 'tiktok_views':
          smmaOrder = {
            username: username,
            viewsToAdd: quantity, // ✅ Quantité pour les vues TikTok
            followerType: originalFollowerType, // 'french' ou 'international' pour les vues
            serviceType: serviceType, // 'tiktok_views'
            orderId: orderId,
            paymentId: paymentId
          };
          break;
        case 'tiktok_comments':
          smmaOrder = {
            username: username,
            commentsToAdd: quantity, // ✅ Quantité pour les commentaires TikTok (utilisé pour aléatoires)
            followerType: originalFollowerType, // 'custom' ou 'random' pour les commentaires TikTok
            serviceType: serviceType, // 'tiktok_comments'
            orderId: orderId,
            paymentId: paymentId,
            // Pour les commentaires personnalisés, passer la liste des commentaires
            customComments: customComments // ✅ Liste des commentaires personnalisés (undefined pour aléatoires)
          };
          console.log('💬 TikTok Comments détecté - customComments:', customComments);
          break;
        case 'tiktok_likes':
          smmaOrder = {
            username: username,
            likesToAdd: quantity, // ✅ Quantité pour les likes TikTok
            followerType: originalFollowerType, // 'french' ou 'international' pour les likes
            serviceType: serviceType, // 'tiktok_likes'
            orderId: orderId,
            paymentId: paymentId
          };
          break;
        default:
          smmaOrder = {
            username: username,
            followers: quantity, // Quantité pour les followers
            followerType: originalFollowerType, // 'french' ou 'international' pour les followers
            serviceType: serviceType, // ✅ Utiliser le serviceType détecté (peut être 'tiktok_followers')
            orderId: orderId,
            paymentId: paymentId
          };
      }

      // Envoyer la commande SMMA selon le type de service
      let smmaResult;
      switch (serviceType) {
        case 'likes':
          smmaResult = await smmaServiceClient.orderLikes(smmaOrder);
          break;
        case 'tiktok_likes':
          console.log('🎵 TikTok Likes détecté');
          smmaResult = await smmaServiceClient.orderTikTokLikes(smmaOrder);
          break;
        case 'comments':
          smmaResult = await smmaServiceClient.orderComments(smmaOrder);
          break;
        case 'tiktok_comments':
          console.log('💬 TikTok Comments détecté');
          smmaResult = await smmaServiceClient.orderTikTokComments(smmaOrder);
          break;
        case 'views':
          smmaResult = await smmaServiceClient.orderViews(smmaOrder);
          break;
        case 'tiktok_views':
          console.log('👁️ TikTok Views détecté');
          smmaResult = await smmaServiceClient.orderTikTokViews(smmaOrder);
          break;
        case 'tiktok_followers':
          console.log('🎵 TikTok Followers détecté');
          smmaResult = await smmaServiceClient.orderTikTokFollowers(smmaOrder);
          break;
        default:
          console.log('📸 Instagram Followers détecté');
          smmaResult = await smmaServiceClient.orderFollowers(smmaOrder);
      }
      
      console.log('📊 Résultat:', smmaResult);
      setSmmaResults([smmaResult]);
      
      // Envoyer les emails de confirmation après le traitement SMMA
      const savedPendingOrder = localStorage.getItem('pendingOrder');
      if (savedPendingOrder) {
        try {
          const pendingOrder = JSON.parse(savedPendingOrder);
          await sendConfirmationEmail({
            ...pendingOrder,
            orderId: orderId || pendingOrder.orderId,
            amount: pendingOrder.amount,
            currency: pendingOrder.currency || 'EUR',
          });
        } catch (error) {
          console.error('❌ Erreur lors de la préparation de l\'email:', error);
        }
      }
      
      // Nettoyer le localStorage après succès
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('cartItems');
      
    } catch (error) {
      console.error('❌ Erreur lors du traitement SMMA avec Cardinity:', error);
      setSmmaResults({ error: 'Erreur lors du traitement de la commande' });
    } finally {
      setIsProcessingSMMA(false);
    }
  };

  const processSMMAIntegration = async () => {
    if (!orderDetails || isProcessingSMMA) return;
    
    console.log('🚀 Traitement de la commande...');
    setIsProcessingSMMA(true);
    
    try {
      // Récupérer les paramètres URL
      const urlParams = new URLSearchParams(window.location.search);
      
      // Récupérer les détails du panier depuis le localStorage
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        const cartItems = JSON.parse(savedCartItems);
        
        const smmaOrders: SMMAOrder[] = cartItems.map((item: any) => {
          // ✅ VALIDATION : Ne jamais envoyer de valeur par défaut
          if (!item.username || item.username.trim() === '') {
            throw new Error('URL de profil manquante pour la commande SMMA');
          }
          
          // Détecter la plateforme
          const serviceType = item.platform === 'TikTok' ? 'tiktok_followers' : 'followers';
          
          return {
            username: item.username,
            followers: item.followers,
            followerType: item.followerType,
            serviceType: serviceType,
            orderId: orderDetails.orderId,
            paymentId: urlParams.get('id') || orderDetails.orderId
          };
        });

        // Traiter chaque commande SMMA selon la plateforme
        const smmaResults = await Promise.all(
          smmaOrders.map(order => {
            if (order.serviceType === 'tiktok_followers') {
              return smmaServiceClient.orderTikTokFollowers(order);
            } else {
              return smmaServiceClient.orderFollowers(order);
            }
          })
        );

        setSmmaResults(smmaResults);
        
        // Envoyer les emails de confirmation après le traitement SMMA
        const savedPendingOrder = localStorage.getItem('pendingOrder');
        if (savedPendingOrder) {
          try {
            const pendingOrder = JSON.parse(savedPendingOrder);
            await sendConfirmationEmail({
              ...pendingOrder,
              orderId: orderDetails.orderId,
              amount: orderDetails.amount,
              currency: orderDetails.currency || 'EUR',
            });
          } catch (error) {
            console.error('❌ Erreur lors de la préparation de l\'email:', error);
          }
        }
        
        // Nettoyer le panier
        localStorage.removeItem('cartItems');
      }
    } catch (error) {
      console.error('❌ Erreur lors du traitement SMMA:', error);
      setSmmaResults({ error: 'Erreur lors du traitement de la commande' });
    } finally {
      setIsProcessingSMMA(false);
    }
  };

  const handleBackToHome = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  // Fonction de test pour déclencher manuellement l'intégration SMMA
  const testSMMAIntegration = async () => {
    console.log('🧪 Test manuel du traitement...');
    
    const testOrder = {
      username: 'test_user',
      followers: 50,
      followerType: 'international' as const,
      orderId: `TEST-${Date.now()}`,
      paymentId: `PAY-${Date.now()}`
    };

    try {
            const result = await smmaServiceClient.orderFollowers(testOrder);
      console.log('🧪 Résultat du test:', result);
      setSmmaResults([result]);
    } catch (error) {
      console.error('🧪 Erreur test SMMA:', error);
      setSmmaResults({ error: 'Erreur lors du test SMMA' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Icône de succès */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Paiement réussi !
            </h1>
            <p className="text-gray-600">
              Votre commande a été confirmée avec succès
            </p>
          </div>

          {/* Détails de la commande */}
          {orderDetails && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Détails de votre commande
              </h2>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro de commande :</span>
                  <span className="font-semibold">{orderDetails.orderId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Compte :</span>
                  <span className="font-semibold">{orderDetails.username || 'URL non disponible'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Followers :</span>
                  <span className="font-semibold">
                    {orderDetails.followers?.toLocaleString()} {orderDetails.followerType === 'french' ? 'français' : 'internationaux'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant :</span>
                  <span className="font-semibold text-green-600">
                    {orderDetails.amount}€
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date :</span>
                  <span className="font-semibold">{orderDetails.timestamp}</span>
                </div>
              </div>
            </div>
          )}

          {/* Traitement SMMA en cours */}
          {isProcessingSMMA && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                <h3 className="text-lg font-bold text-blue-600">
                  Traitement de la commande...
                </h3>
              </div>
              <div className="text-center text-sm text-gray-700">
                <p>🚀 Transmission de votre commande en cours...</p>
                <p>⏱️ Veuillez patienter quelques instants</p>
              </div>
            </div>
          )}

          {/* Garanties */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-600">Followers réels</h4>
              <p className="text-sm text-gray-600">100% authentiques</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-600">Traitement rapide</h4>
              <p className="text-sm text-gray-600">Service efficace</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-600">Support 24/7</h4>
              <p className="text-sm text-gray-600">Assistance continue</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleBackToHome}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Retour à l'accueil
            </button>
            
            <p className="text-sm text-gray-500">
              Merci de votre confiance ! Votre commande est en cours de traitement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
