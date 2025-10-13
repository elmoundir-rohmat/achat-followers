import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, Shield, ArrowLeft, Users, Clock, Heart, MessageCircle, Eye } from 'lucide-react';
import CardinityHostedPayment from './CardinityHostedPayment';
import { useCart } from '../contexts/CartContext';
import { CARDINITY_CONFIG } from '../config/cardinity';
import { smmaService, SMMAOrder } from '../services/smmaService';

interface PaymentPageProps {
  onBack?: () => void;
}

export default function PaymentPage({ onBack }: PaymentPageProps) {
  const { cartItems, clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Récupérer les détails de la commande depuis le localStorage ou les props
    const savedOrder = localStorage.getItem('pendingOrder');
    console.log('🔍 PaymentPage: pendingOrder récupéré:', savedOrder);
    
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        console.log('📋 PaymentPage: pendingOrder parsé:', order);
        setOrderDetails(order);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de commande:', error);
      }
    }

    // Si pas de commande sauvegardée, créer une commande à partir du panier
    if (!savedOrder && cartItems.length > 0) {
      const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
      const totalFollowers = cartItems.reduce((sum, item) => sum + item.followers, 0);
      const totalLikes = cartItems.reduce((sum, item) => sum + (item.likes || 0), 0);
      const totalComments = cartItems.reduce((sum, item) => sum + (item.comments || 0), 0);
      const totalViews = cartItems.reduce((sum, item) => sum + (item.views || 0), 0);
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Créer une description détaillée basée sur le contenu du panier
      let description = '';
      const firstItem = cartItems[0];
      
      if (totalLikes > 0) {
        description = `${totalLikes} likes Instagram`;
      } else if (totalComments > 0) {
        description = `${totalComments} comments Instagram`;
      } else if (totalViews > 0) {
        description = `${totalViews} views Instagram`;
      } else if (totalFollowers > 0) {
        description = `${totalFollowers} followers Instagram`;
      } else {
        description = `${totalFollowers} followers Instagram`;
      }
      
      const newOrder = {
        orderId,
        amount: totalAmount,
        currency: 'EUR',
        description: description,
        followers: totalFollowers,
        followerType: cartItems[0]?.followerType || 'international',
        username: cartItems[0]?.username || '', // ✅ Vide si non défini, pas de valeur fictive
        // SAUVEGARDER TOUTES LES DONNÉES DU PANIER
        cartItems: cartItems, // Sauvegarder les articles complets
        selectedPosts: cartItems[0]?.selectedPosts || [], // Sauvegarder les posts sélectionnés
        timestamp: new Date().toISOString()
      };
      
      setOrderDetails(newOrder);
      localStorage.setItem('pendingOrder', JSON.stringify(newOrder));
      console.log('💾 PaymentPage: pendingOrder sauvegardé:', newOrder);
      console.log('🔍 Détails du panier pour description:', {
        totalFollowers,
        totalLikes,
        totalComments,
        totalViews,
        firstItem: firstItem,
        description
      });
      
      // Sauvegarder aussi les détails du panier pour l'intégration SMMA
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      console.log('💾 PaymentPage: cartItems sauvegardé:', cartItems);
    }
  }, [cartItems]);

  const handlePaymentSuccess = async (result: any) => {
    console.log('✅ Paiement réussi:', result);
    setIsProcessing(true);
    
    try {
      // Appeler l'API SMMA pour traiter la commande
      if (orderDetails && cartItems.length > 0) {
        const smmaOrders: SMMAOrder[] = cartItems.map(item => {
          // ✅ VALIDATION : Ne jamais envoyer de valeur par défaut
          if (!item.username || item.username.trim() === '') {
            throw new Error('URL de profil manquante pour la commande SMMA');
          }
          return {
            username: item.username,
            followers: item.followers,
            followerType: item.followerType,
            orderId: orderDetails.orderId,
            paymentId: result.payment_id || result.transaction_id || result.id
          };
        });

        console.log('📦 Commandes SMMA à traiter:', smmaOrders);

        // Traiter chaque commande SMMA
        const smmaResults = await Promise.all(
          smmaOrders.map(order => smmaService.orderFollowers(order))
        );

        console.log('📊 Résultats SMMA:', smmaResults);
        
        // Sauvegarder les résultats SMMA dans le localStorage pour la page de succès
        localStorage.setItem('smmaResults', JSON.stringify(smmaResults));
      }
      
      // Nettoyer le panier
      clearCart();
      
      // Rediriger vers la page de succès
      window.location.href = '/payment/success';
      
    } catch (error) {
      console.error('❌ Erreur lors du traitement SMMA:', error);
      // Même en cas d'erreur SMMA, on redirige vers la page de succès
      // car le paiement a réussi
      clearCart();
      window.location.href = '/payment/success';
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Erreur de paiement:', error);
    setIsProcessing(false);
    
    // Rediriger vers la page d'échec
    window.location.href = '/payment/cancel?error=payment_failed&error_description=' + encodeURIComponent(error.message || 'Erreur de paiement');
  };

  const handlePaymentCancel = () => {
    console.log('🚫 Paiement annulé');
    setIsProcessing(false);
    
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/cart';
    }
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails de commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handlePaymentCancel}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Paiement sécurisé
              </h1>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Lock className="w-4 h-4 mr-1" />
              Paiement 100% sécurisé
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Résumé de la commande */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Résumé de votre commande
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  {(() => {
                    // Choisir l'icône selon le type de service
                    const description = orderDetails.description || '';
                    if (description.includes('likes')) {
                      return <Heart className="w-6 h-6 text-pink-600 mr-3" />;
                    } else if (description.includes('comments')) {
                      return <MessageCircle className="w-6 h-6 text-green-600 mr-3" />;
                    } else if (description.includes('views')) {
                      return <Eye className="w-6 h-6 text-purple-600 mr-3" />;
                    } else {
                      return <Users className="w-6 h-6 text-blue-600 mr-3" />;
                    }
                  })()}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {(() => {
                        // Détecter le type de service depuis la description
                        const description = orderDetails.description || '';
                        if (description.toLowerCase().includes('likes')) {
                          const likesMatch = description.match(/(\d+)\s*likes/i);
                          return `${likesMatch ? likesMatch[1] : '0'} likes`;
                        } else if (description.toLowerCase().includes('commentaires') || description.toLowerCase().includes('comments')) {
                          const commentsMatch = description.match(/(\d+)\s*(commentaires|comments)/i);
                          return `${commentsMatch ? commentsMatch[1] : '0'} commentaires`;
                        } else if (description.toLowerCase().includes('vues') || description.toLowerCase().includes('views')) {
                          const viewsMatch = description.match(/(\d+)\s*(vues|views)/i);
                          return `${viewsMatch ? viewsMatch[1] : '0'} vues`;
                        } else {
                          return `${orderDetails.followers?.toLocaleString() || '0'} followers`;
                        }
                      })()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {orderDetails.followerType === 'french' ? 'Français' : 'Internationaux'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {orderDetails.amount?.toFixed(2)}€
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">{orderDetails.amount?.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span className="font-semibold">{(orderDetails.amount * 0.2).toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">{orderDetails.amount?.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Garanties */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">✅ Garanties incluses</h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Followers 100% réels et actifs</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Livraison en 24-72h</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Garantie 30 jours satisfait ou remboursé</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de paiement */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">
                Informations de paiement
              </h2>
            </div>

            {CARDINITY_CONFIG.isTestMode && (
              <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Mode test activé</strong> - Utilisez les cartes de test Cardinity pour simuler le paiement
                </p>
              </div>
            )}

            {/* Mode développement : utiliser MockPayment, sinon CardinityPayment */}
            {import.meta.env.DEV ? (
              <MockPayment
                amount={orderDetails.amount}
                orderId={orderDetails.orderId}
                description={orderDetails.description}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            ) : (
              <CardinityHostedPayment
                amount={orderDetails.amount}
                orderId={orderDetails.orderId}
                description={orderDetails.description}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            )}

            {/* Informations de sécurité */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Lock className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-semibold text-gray-700">Paiement sécurisé</span>
              </div>
              <p className="text-xs text-gray-600">
                Vos données sont protégées par un chiffrement SSL 256-bit. 
                Nous ne stockons jamais vos informations de carte bancaire.
              </p>
            </div>

            {/* Cartes de test - seulement en mode test */}
            {CARDINITY_CONFIG.isTestMode && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                  💳 Cartes de test Cardinity
                </h4>
                <div className="text-xs text-yellow-700 space-y-1">
                  <p><strong>Succès:</strong> 4111111111111111 (12/25, CVV: 123)</p>
                  <p><strong>Échec:</strong> 4000000000000002 (12/25, CVV: 123)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
