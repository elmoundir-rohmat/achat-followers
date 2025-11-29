import React, { useEffect, useState } from 'react';
import { CheckCircle, Users, Clock, Mail, ArrowLeft } from 'lucide-react';
import { smmaService, SMMAOrder } from '../services/smmaService';
import { smmaServiceClient } from '../services/smmaServiceClient';

interface PaymentSuccessPageProps {
  onBack?: () => void;
}

export default function PaymentSuccessPageFixed({ onBack }: PaymentSuccessPageProps) {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [smmaResults, setSmmaResults] = useState<any>(null);
  const [isProcessingSMMA, setIsProcessingSMMA] = useState(false);

  useEffect(() => {
    // Récupérer les paramètres de Cardinity depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const cardinityOrderId = urlParams.get('order_id');
    const cardinityAmount = urlParams.get('amount');
    const cardinityCurrency = urlParams.get('currency');
    const cardinityStatus = urlParams.get('status');
    const cardinityId = urlParams.get('id');
    
    // Vérifier si c'est un retour de paiement Cardinity réussi
    const isCardinitySuccess = cardinityStatus === 'approved' || cardinityId;
    
    if (isCardinitySuccess) {
      console.log('✅ Paiement Cardinity confirmé - Déclenchement de l\'intégration SMMA');
      
      // Récupérer les détails de la commande depuis le localStorage
      const savedOrder = localStorage.getItem('pendingOrder');
      const savedCartItems = localStorage.getItem('cartItems');
      
      if (savedOrder && savedCartItems) {
        try {
          const order = JSON.parse(savedOrder);
          const cartItems = JSON.parse(savedCartItems);
          
          setOrderDetails({
            orderId: cardinityOrderId || order.orderId,
            amount: cardinityAmount || order.amount,
            currency: cardinityCurrency || order.currency || 'EUR',
            followers: order.followers,
            followerType: order.followerType,
            username: order.username,
            timestamp: new Date().toLocaleString('fr-FR'),
            cardinityId: cardinityId
          });
          
          // Déclencher l'intégration SMMA immédiatement
          processSMMAIntegrationWithData(cartItems, cardinityId || cardinityOrderId);
          
          // Nettoyer le localStorage
          localStorage.removeItem('pendingOrder');
          localStorage.removeItem('cartItems');
          
        } catch (error) {
          console.error('Erreur lors de la récupération des détails de commande:', error);
        }
      }
    } else {
      // Si pas de paramètres Cardinity, récupérer les détails normalement
      const savedOrder = localStorage.getItem('pendingOrder');
      if (savedOrder) {
        try {
          const order = JSON.parse(savedOrder);
          setOrderDetails({
            orderId: order.orderId,
            amount: order.amount,
            currency: order.currency || 'EUR',
            followers: order.followers,
            followerType: order.followerType,
            username: order.username,
            timestamp: new Date().toLocaleString('fr-FR')
          });
          localStorage.removeItem('pendingOrder');
        } catch (error) {
          console.error('Erreur lors de la récupération des détails de commande:', error);
        }
      }
    }
  }, []);

  const processSMMAIntegrationWithData = async (cartItems: any[], paymentId: string) => {
    console.log('🚀 Déclenchement de l\'intégration SMMA avec les données Cardinity...');
    setIsProcessingSMMA(true);
    
    try {
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
        console.log('🔍 PaymentSuccessPageFixed - Platform:', item.platform, '→ ServiceType:', serviceType);
        
        return {
          username: item.username,
          followers: item.followers,
          followerType: item.followerType,
          serviceType: serviceType,
          orderId: orderDetails?.orderId || paymentId,
          paymentId: paymentId
        };
      });

      console.log('📦 Commandes SMMA à traiter:', smmaOrders);

      // Traiter chaque commande SMMA selon la plateforme et le type de service
      const smmaResults = await Promise.all(
        smmaOrders.map(order => {
          if (order.serviceType === 'tiktok_followers') {
            console.log('🎵 PaymentSuccessPageFixed - Commande TikTok Followers détectée');
            return smmaServiceClient.orderTikTokFollowers(order);
          } else if (order.serviceType === 'tiktok_likes') {
            console.log('❤️ PaymentSuccessPageFixed - Commande TikTok Likes détectée');
            return smmaServiceClient.orderTikTokLikes(order);
          } else if (order.serviceType === 'tiktok_views') {
            console.log('👁️ PaymentSuccessPageFixed - Commande TikTok Views détectée');
            return smmaServiceClient.orderTikTokViews(order);
          } else if (order.serviceType === 'likes') {
            console.log('📸 PaymentSuccessPageFixed - Commande Instagram Likes détectée');
            return smmaServiceClient.orderLikes(order);
          } else if (order.serviceType === 'views') {
            console.log('📸 PaymentSuccessPageFixed - Commande Instagram Views détectée');
            return smmaServiceClient.orderViews(order);
          } else {
            console.log('📸 PaymentSuccessPageFixed - Commande Instagram Followers détectée');
            return smmaServiceClient.orderFollowers(order);
          }
        })
      );

      console.log('📊 Résultats SMMA:', smmaResults);
      setSmmaResults(smmaResults);
      
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
                <p>🚀 Transmission à Just Another Panel en cours...</p>
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
