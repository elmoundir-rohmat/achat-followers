import React, { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, User, Mail, MapPin, Phone, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CardinityPayment from './CardinityPayment';
import MockPayment from './MockPayment';
import SMMATest from './SMMATest';
import ConfirmDialog from './ConfirmDialog';
import Toast, { ToastProps } from './Toast';
import { smmaServiceClient, SMMAOrder } from '../services/smmaServiceClient';

interface CheckoutPageProps {
  onBack: () => void;
  onComplete: (orderData: any) => void;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  country: string;
  phone: string;
}

export default function CheckoutPage({ onBack, onComplete }: CheckoutPageProps) {
  const { items, getTotalPrice, getTotalFollowers, getTotalLikes, getTotalViews, getTotalComments, clearCart, removeFromCart, addToCart } = useCart();
  
  // Si le panier est vide, afficher un message
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6">Ajoutez des produits à votre panier pour continuer</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    country: 'France',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<CustomerData>>({});
  const [showPayment, setShowPayment] = useState(false);
  const [orderId] = useState(`ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [isProcessingSMMA, setIsProcessingSMMA] = useState(false);
  const [smmaResult, setSmmaResult] = useState<any>(null);
  const [showSMMATest, setShowSMMATest] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    itemId?: string;
    action?: 'remove' | 'clear';
  }>({ isOpen: false });
  const [toast, setToast] = useState<ToastProps>({
    type: 'error',
    title: '',
    message: '',
    onClose: () => setToast(prev => ({ ...prev, isVisible: false })),
    isVisible: false
  });

  // Redirection automatique vers la page de paiement
  useEffect(() => {
    if (showPayment) {
      // Sauvegarder les détails de la commande
      const orderDetails = {
        orderId,
        amount: getTotalPrice(),
        currency: 'EUR',
        description: `${getTotalFollowers()} followers Instagram`,
        followers: getTotalFollowers(),
        followerType: items[0]?.followerType || 'international',
        username: items[0]?.username || 'Non spécifié',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
      
      // Rediriger vers la page de paiement après un court délai
      const timer = setTimeout(() => {
        // SOLUTION DÉFINITIVE : Utiliser la navigation React
        const event = new CustomEvent('navigate', { detail: { page: 'payment' } });
        window.dispatchEvent(event);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [showPayment, orderId, getTotalPrice, getTotalFollowers, items]);

  const validateForm = () => {
    const newErrors: Partial<CustomerData> = {};
    
    if (!customerData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!customerData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!customerData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }
    if (!customerData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!customerData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = async (result: any) => {
    console.log('✅ Paiement réussi:', result);
    
    setIsProcessingSMMA(true);
    
    try {
      // Appeler l'API SMMA pour chaque article du panier
      const smmaOrders: SMMAOrder[] = items.map(item => ({
        username: item.username || 'unknown',
        followers: item.followers,
        followerType: item.followerType,
        orderId: orderId,
        paymentId: result.payment_id || result.transaction_id
      }));

      console.log('📦 Commandes SMMA à traiter:', smmaOrders);

      // Traiter chaque commande SMMA
      const smmaResults = await Promise.all(
        smmaOrders.map(order => smmaServiceClient.orderFollowers(order))
      );

      console.log('📊 Résultats SMMA:', smmaResults);
      setSmmaResult(smmaResults);

      // Préparer les données de commande complètes
      const orderData = {
        items,
        customer: customerData,
        total: getTotalPrice(),
        totalFollowers: getTotalFollowers(),
        orderId,
        paymentResult: result,
        smmaResults: smmaResults
      };

      onComplete(orderData);
      clearCart();

    } catch (error) {
      console.error('❌ Erreur lors du traitement SMMA:', error);
      setSmmaResult({ error: 'Erreur lors du traitement de la commande' });
    } finally {
      setIsProcessingSMMA(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Erreur de paiement:', error);
    setShowPayment(false);
    
    // Afficher la notification d'erreur
    setToast({
      type: 'error',
      title: 'Paiement échoué',
      message: 'Le paiement a échoué. Merci de réessayer.',
      onClose: () => setToast(prev => ({ ...prev, isVisible: false })),
      isVisible: true,
      duration: 6000
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setConfirmDialog({
      isOpen: true,
      itemId,
      action: 'remove'
    });
  };

  const handleClearCart = () => {
    setConfirmDialog({
      isOpen: true,
      action: 'clear'
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.action === 'remove' && confirmDialog.itemId) {
      removeFromCart(confirmDialog.itemId);
    } else if (confirmDialog.action === 'clear') {
      clearCart();
    }
    setConfirmDialog({ isOpen: false });
  };

  const handleCancelAction = () => {
    setConfirmDialog({ isOpen: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSMMATest ? (
          <div className="mb-8">
            <button
              onClick={() => setShowSMMATest(false)}
              className="mb-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ← Retour au checkout
            </button>
            <SMMATest />
          </div>
        ) : showPayment ? (
          <div className="max-w-2xl mx-auto">
            {/* Redirection automatique vers la page de paiement */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Redirection vers le paiement...
                </h2>
                <p className="text-gray-600">
                  Préparation de votre commande
                </p>
              </div>
            </div>
            
            {/* Affichage du traitement SMMA */}
            {isProcessingSMMA && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-blue-700 font-medium">
                    Traitement de votre commande avec la plateforme SMMA...
                  </span>
                </div>
              </div>
            )}

            {/* Résultats SMMA */}
            {smmaResult && !isProcessingSMMA && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">✅ Commandes SMMA traitées</h4>
                {Array.isArray(smmaResult) ? (
                  smmaResult.map((result, index) => (
                    <div key={index} className="text-sm text-green-700 mb-1">
                      {result.success ? (
                        <span>✅ {result.message}</span>
                      ) : (
                        <span>❌ {result.error}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-green-700">
                    {smmaResult.error ? `❌ ${smmaResult.error}` : '✅ Traitement terminé'}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire client */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-600" />
              Informations de livraison
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={customerData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={customerData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  value={customerData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Adresse *
                </label>
                <input
                  type="text"
                  value={customerData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123 Rue de la Paix, 75001 Paris"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays *
                  </label>
                  <select
                    value={customerData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="06 12 34 56 78"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={items.length === 0}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg text-lg flex items-center justify-center ${
                    items.length === 0
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mr-3" />
                  {items.length === 0 ? 'Panier vide' : `Finaliser la commande - ${getTotalPrice().toFixed(2)}€`}
                </button>
                
                {/* Bouton de test SMMA en mode développement */}
                {import.meta.env.DEV && (
                  <button
                    type="button"
                    onClick={() => setShowSMMATest(true)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
                  >
                    🧪 Tester SMMA (ID 720)
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Résumé de la commande */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Résumé de votre commande
              </h2>
              {items.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                  title="Vider tout le panier"
                >
                  Vider le panier
                </button>
              )}
            </div>
            
            <div className="space-y-4 mb-6">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">Votre panier est vide</p>
                  <p className="text-sm">Retournez à la page précédente pour ajouter des articles</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="relative p-4 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Supprimer cet article"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="flex justify-between items-center pr-8">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {(() => {
                            // DEBUG: Log des données de l'item
                            console.log('🔍 DEBUG Item data:', {
                              id: item.id,
                              comments: item.comments,
                              selectedPosts: item.selectedPosts,
                              selectedPostsLength: item.selectedPosts?.length
                            });
                            
                            const likes = item.likes || 0;
                            const views = item.views || 0;
                            const comments = item.comments || 0;
                            const followers = item.followers || 0;
                            
                            // Calculer le total réel pour chaque type si des posts sont sélectionnés
                            let totalLikes = likes;
                            let totalViews = views;
                            let totalComments = comments;
                            
                            if (item.selectedPosts && item.selectedPosts.length > 0) {
                              totalLikes = item.selectedPosts.reduce((sum, post) => sum + (post.likesToAdd || 0), 0);
                              totalViews = item.selectedPosts.reduce((sum, post) => sum + (post.viewsToAdd || 0), 0);
                              totalComments = item.selectedPosts.reduce((sum, post) => sum + (post.commentsToAdd || 0), 0);
                            }
                            
                            // DEBUG: Log des calculs
                            console.log('🔍 DEBUG Calculs:', {
                              commentsOriginal: comments,
                              totalCommentsCalculated: totalComments,
                              selectedPostsCount: item.selectedPosts?.length
                            });
                            
                            // Déterminer le type de service basé sur la valeur la plus élevée
                            const maxValue = Math.max(totalLikes, totalViews, totalComments, followers);
                            
                            // Ajouter l'indicateur de posts si des posts sont sélectionnés
                            const postIndicator = item.selectedPosts && item.selectedPosts.length > 1 
                              ? ` (${item.selectedPosts.length}x)` 
                              : '';
                            
                            // Ajouter l'indicateur de plateforme si nécessaire
                            const platformIndicator = item.platform ? ` ${item.platform}` : '';
                            
                            if (maxValue === totalLikes && totalLikes > 0) {
                              // Calculer la quantité par post pour l'affichage
                              const likesPerPost = item.selectedPosts && item.selectedPosts.length > 0 
                                ? (item.selectedPosts[0]?.likesToAdd || 0)
                                : likes;
                              return `${likesPerPost.toLocaleString()} likes${platformIndicator} ${item.followerType === 'french' ? 'français' : 'internationaux'}${postIndicator}`;
                            } else if (maxValue === totalViews && totalViews > 0) {
                              // Calculer la quantité par post pour l'affichage
                              const viewsPerPost = item.selectedPosts && item.selectedPosts.length > 0 
                                ? (item.selectedPosts[0]?.viewsToAdd || 0)
                                : views;
                              return `${viewsPerPost.toLocaleString()} vues${platformIndicator} ${item.followerType === 'french' ? 'français' : 'internationaux'}${postIndicator}`;
                            } else if (maxValue === totalComments && totalComments > 0) {
                              // Calculer la quantité par post pour l'affichage
                              const commentsPerPost = item.selectedPosts && item.selectedPosts.length > 0 
                                ? (item.selectedPosts[0]?.commentsToAdd || 0)
                                : comments;
                              return `${commentsPerPost.toLocaleString()} commentaires${platformIndicator} ${item.followerType === 'french' ? 'français' : 'internationaux'}${postIndicator}`;
                            } else {
                              return `${followers.toLocaleString()} followers${platformIndicator} ${item.followerType === 'french' ? 'français' : 'internationaux'}${postIndicator}`;
                            }
                          })()}
                        </div>
                        {item.username && (
                          <div className="text-sm text-gray-600">
                            @{item.username}
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-blue-600">
                        {item.price.toFixed(2)}€
                      </div>
                    </div>
                    
                    {/* Affichage des posts sélectionnés */}
                    {item.selectedPosts && item.selectedPosts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-2">
                          Posts sélectionnés ({item.selectedPosts.length}):
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {item.selectedPosts.map((post, index) => (
                            <div key={post.postId} className="flex items-center space-x-2 text-xs">
                              <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                                {post.mediaUrl && (
                                  <img 
                                    src={post.mediaUrl} 
                                    alt="Post" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">Post #{index + 1}</div>
                                {post.likesToAdd && (
                                  <div className="text-pink-600">+{post.likesToAdd} likes</div>
                                )}
                                {post.commentsToAdd && (
                                  <div className="text-blue-600">+{post.commentsToAdd} commentaires</div>
                                )}
                                {post.viewsToAdd && (
                                  <div className="text-purple-600">+{post.viewsToAdd} vues</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-700">Total followers:</span>
                <span className="text-lg font-bold text-gray-900">{getTotalFollowers().toLocaleString()}</span>
              </div>
              {getTotalLikes() > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-700">Total likes:</span>
                  <span className="text-lg font-bold text-gray-900">{getTotalLikes().toLocaleString()}</span>
                </div>
              )}
              {getTotalViews() > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-700">Total vues:</span>
                  <span className="text-lg font-bold text-gray-900">{getTotalViews().toLocaleString()}</span>
                </div>
              )}
              {getTotalComments() > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-700">Total commentaires:</span>
                  <span className="text-lg font-bold text-gray-900">{getTotalComments().toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">{getTotalPrice().toFixed(2)}€</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Garantie 30 jours</span>
              </div>
              <div className="flex items-center text-green-700 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Livraison progressive</span>
              </div>
              <div className="flex items-center text-green-700 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Profils réels</span>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Dialog de confirmation */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={confirmDialog.action === 'remove' ? 'Supprimer l\'article' : 'Vider le panier'}
        message={
          confirmDialog.action === 'remove' 
            ? 'Êtes-vous sûr de vouloir supprimer cet article de votre panier ?' 
            : 'Êtes-vous sûr de vouloir vider tout votre panier ? Cette action est irréversible.'
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {/* Toast de notification */}
      <Toast {...toast} />
    </div>
  );
}
