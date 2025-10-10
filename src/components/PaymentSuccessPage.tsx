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

  useEffect(() => {
    console.log('🎉 PaymentSuccessPage chargée !');
    console.log('🔍 window.location.href:', window.location.href);
    console.log('🔍 window.location.search:', window.location.search);
    
    // Récupérer les détails de la commande depuis l'URL ou le localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    const amount = urlParams.get('amount');
    const currency = urlParams.get('currency');
    
    console.log('🔍 Paramètres URL extraits:', {
      orderId,
      amount,
      currency,
      allParams: Object.fromEntries(urlParams)
    });
    
    // Récupérer les détails depuis le localStorage si disponibles
    const savedOrder = localStorage.getItem('pendingOrder');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        setOrderDetails({
          orderId: orderId || order.orderId,
          amount: amount || order.amount,
          currency: currency || order.currency || 'EUR',
          followers: order.followers,
          followerType: order.followerType,
          username: order.username,
          timestamp: new Date().toLocaleString('fr-FR')
        });
        
        // Nettoyer le localStorage
        localStorage.removeItem('pendingOrder');
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de commande:', error);
      }
    }

    // Vérifier d'abord si on a des paramètres Cardinity
    const cardinityOrderId = urlParams.get('order_id');
    const cardinityStatus = urlParams.get('status');
    
    if (cardinityOrderId && cardinityStatus === 'approved') {
      console.log('🎯 Paramètres Cardinity détectés, déclenchement SMMA immédiat...');
      console.log('🔍 Paramètres détectés:', {
        cardinityOrderId,
        cardinityStatus,
        paymentId: urlParams.get('id'),
        allParams: Object.fromEntries(urlParams)
      });
      // Déclencher SMMA immédiatement pour les paiements Cardinity
      processSMMAIntegrationWithCardinity(cardinityOrderId, urlParams.get('id') || cardinityOrderId);
    } else {
      console.log('❌ Paramètres Cardinity non détectés:', {
        cardinityOrderId,
        cardinityStatus,
        hasOrderId: urlParams.has('order_id'),
        hasStatus: urlParams.has('status'),
        allParams: Object.fromEntries(urlParams)
      });
      // Récupérer les résultats SMMA pour les autres cas
      const savedSmmaResults = localStorage.getItem('smmaResults');
      if (savedSmmaResults) {
        try {
          const results = JSON.parse(savedSmmaResults);
          setSmmaResults(results);
          console.log('📊 Résultats SMMA récupérés:', results);
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

  const processSMMAIntegrationWithCardinity = async (orderId: string, paymentId: string) => {
    console.log('🚀 Déclenchement de l\'intégration SMMA avec Cardinity...', { orderId, paymentId });
    setIsProcessingSMMA(true);
    
    try {
      // RÉCUPÉRER LES DONNÉES SAUVEGARDÉES AVANT LE PAIEMENT
      const savedPendingOrder = localStorage.getItem('pendingOrder');
      console.log('🔍 pendingOrder récupéré:', savedPendingOrder);
      
      let serviceType = 'followers';
      let quantity = 25;
      let username = 'cammjersey';
      let selectedPosts: any[] = [];
      
      if (savedPendingOrder) {
        try {
          const pendingOrder = JSON.parse(savedPendingOrder);
          console.log('📦 pendingOrder parsé:', pendingOrder);
          
          // Extraire les données du panier sauvegardé
          username = pendingOrder.username || 'cammjersey';
          selectedPosts = pendingOrder.selectedPosts || [];
          
          // Détecter le type de service depuis la description
          const description = pendingOrder.description || '';
          if (description.toLowerCase().includes('likes')) {
            serviceType = 'likes';
            const likesMatch = description.match(/(\d+)\s*likes/i);
            quantity = likesMatch ? parseInt(likesMatch[1]) : 50;
          } else if (description.toLowerCase().includes('comments')) {
            serviceType = 'comments';
            const commentsMatch = description.match(/(\d+)\s*comments/i);
            quantity = commentsMatch ? parseInt(commentsMatch[1]) : 10;
          } else if (description.toLowerCase().includes('views')) {
            serviceType = 'views';
            const viewsMatch = description.match(/(\d+)\s*views/i);
            quantity = viewsMatch ? parseInt(viewsMatch[1]) : 100;
          } else {
            serviceType = 'followers';
            const followersMatch = description.match(/(\d+)\s*followers/i);
            quantity = followersMatch ? parseInt(followersMatch[1]) : 25;
          }
          
          console.log('🎯 Données récupérées du panier:', {
            serviceType,
            quantity,
            username,
            selectedPosts: selectedPosts.length
          });
          
        } catch (error) {
          console.error('❌ Erreur parsing pendingOrder:', error);
        }
      } else {
        console.log('⚠️ Aucun pendingOrder trouvé, utilisation des valeurs par défaut');
      }
      
      // Créer la commande SMMA directement selon le type de service
      let smmaOrder: SMMAOrder;
      
      switch (serviceType) {
        case 'likes':
          // Utiliser le premier post sélectionné ou un post par défaut
          const firstPost = selectedPosts.length > 0 ? selectedPosts[0] : null;
          const postId = firstPost?.postId || 'default_post_id';
          
          smmaOrder = {
            username: username,
            followers: 0, // Pas utilisé pour les likes
            likesToAdd: quantity, // Quantité pour les likes
            postId: postId, // Vrai ID du post sélectionné
            followerType: 'likes_international', // CORRECT pour les likes !
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
          // Utiliser le premier post sélectionné ou un post par défaut
          const firstCommentPost = selectedPosts.length > 0 ? selectedPosts[0] : null;
          const commentPostId = firstCommentPost?.postId || 'default_post_id';
          
          smmaOrder = {
            username: username,
            followers: 0, // Pas utilisé pour les comments
            commentsToAdd: quantity, // Quantité pour les comments
            postId: commentPostId, // Vrai ID du post sélectionné
            followerType: 'comments_international', // CORRECT pour les comments !
            orderId: orderId,
            paymentId: paymentId
          };
          
          console.log('💬 Post sélectionné pour les comments:', {
            postId: commentPostId,
            totalPosts: selectedPosts.length
          });
          break;
        case 'views':
          // Utiliser le premier post sélectionné ou un post par défaut
          const firstViewPost = selectedPosts.length > 0 ? selectedPosts[0] : null;
          const viewPostId = firstViewPost?.postId || 'default_post_id';
          
          smmaOrder = {
            username: username,
            followers: 0, // Pas utilisé pour les views
            viewsToAdd: quantity, // Quantité pour les views
            postId: viewPostId, // Vrai ID du post sélectionné
            followerType: 'views_international', // CORRECT pour les views !
            orderId: orderId,
            paymentId: paymentId
          };
          
          console.log('👀 Post sélectionné pour les views:', {
            postId: viewPostId,
            totalPosts: selectedPosts.length
          });
          break;
        default:
          smmaOrder = {
            username: username,
            followers: quantity, // Quantité pour les followers
            followerType: 'international',
            orderId: orderId,
            paymentId: paymentId
          };
      }

      console.log('📦 Commande SMMA créée depuis Cardinity:', smmaOrder);

      // Envoyer la commande SMMA selon le type de service
      let smmaResult;
      switch (serviceType) {
        case 'likes':
          smmaResult = await smmaServiceClient.orderLikes(smmaOrder);
          break;
        case 'comments':
          smmaResult = await smmaServiceClient.orderComments(smmaOrder);
          break;
        case 'views':
          smmaResult = await smmaServiceClient.orderViews(smmaOrder);
          break;
        default:
          smmaResult = await smmaServiceClient.orderFollowers(smmaOrder);
      }
      
      console.log('📊 Résultat SMMA:', smmaResult);
      setSmmaResults([smmaResult]);
      
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
    
    console.log('🚀 Déclenchement de l\'intégration SMMA...');
    setIsProcessingSMMA(true);
    
    try {
      // Récupérer les paramètres URL
      const urlParams = new URLSearchParams(window.location.search);
      
      // Récupérer les détails du panier depuis le localStorage
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        const cartItems = JSON.parse(savedCartItems);
        
        const smmaOrders: SMMAOrder[] = cartItems.map((item: any) => ({
          username: item.username || 'unknown',
          followers: item.followers,
          followerType: item.followerType,
          orderId: orderDetails.orderId,
          paymentId: urlParams.get('id') || orderDetails.orderId
        }));

        console.log('📦 Commandes SMMA à traiter:', smmaOrders);

                // Traiter chaque commande SMMA
                const smmaResults = await Promise.all(
                  smmaOrders.map(order => smmaServiceClient.orderFollowers(order))
                );

        console.log('📊 Résultats SMMA:', smmaResults);
        setSmmaResults(smmaResults);
        
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
    console.log('🧪 Test manuel de l\'intégration SMMA...');
    
    const testOrder = {
      username: 'test_user',
      followers: 25,
      followerType: 'international' as const,
      orderId: `TEST-${Date.now()}`,
      paymentId: `PAY-${Date.now()}`
    };

    try {
            const result = await smmaServiceClient.orderFollowers(testOrder);
      console.log('🧪 Résultat du test SMMA:', result);
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
                  <span className="text-gray-600">Compte Instagram :</span>
                  <span className="font-semibold">@{orderDetails.username || 'Non spécifié'}</span>
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

          {/* Informations de livraison */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-bold text-blue-600">
                Livraison en cours
              </h3>
            </div>
            
            <div className="space-y-2 text-sm text-gray-700">
              <p>✅ Votre commande a été traitée avec succès</p>
              <p>⏱️ La livraison des followers commence dans les 5-10 minutes</p>
              <p>📈 Vous recevrez vos followers progressivement sur 24-72h</p>
              <p>📧 Un email de confirmation vous sera envoyé</p>
            </div>
          </div>

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
                <p>🚀 Transmission à Just Another Panel en cours...</p>
                <p>⏱️ Veuillez patienter quelques instants</p>
              </div>
            </div>
          )}

          {/* Résultats SMMA */}
          {smmaResults && !isProcessingSMMA && (
            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-bold text-green-600">
                  Commande transmise à Just Another Panel
                </h3>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700">
                {Array.isArray(smmaResults) ? (
                  smmaResults.map((result: any, index: number) => (
                    <div key={index} className="p-3 bg-white rounded-lg">
                      <p><strong>Commande #{index + 1}:</strong></p>
                      <p>• ID SMMA: {result.id || 'En cours...'}</p>
                      <p>• Statut: {result.status || 'Traitement en cours'}</p>
                      {result.error && (
                        <p className="text-red-600">• Erreur: {result.error}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-white rounded-lg">
                    <p><strong>Résultat:</strong></p>
                    <p>• {JSON.stringify(smmaResults)}</p>
                  </div>
                )}
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
              <h4 className="font-semibold text-blue-600">Livraison rapide</h4>
              <p className="text-sm text-gray-600">24-72h maximum</p>
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
