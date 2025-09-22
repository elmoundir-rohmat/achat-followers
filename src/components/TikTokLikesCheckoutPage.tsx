import React, { useState } from 'react';
import { ArrowLeft, Heart, Music, Clock, Shield, CheckCircle, CreditCard, Lock, ShoppingCart, User, Mail, MapPin, Phone, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import MockPayment from './MockPayment';
import CardinityPayment from './CardinityPayment';
import ConfirmDialog from './ConfirmDialog';
import Toast, { ToastProps } from './Toast';
import { smmaService, SMMAOrder } from '../services/smmaService';

interface TikTokLikesCheckoutPageProps {
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

export default function TikTokLikesCheckoutPage({ onBack, onComplete }: TikTokLikesCheckoutPageProps) {
  const { items, getTotalPrice, getTotalLikes, clearCart, removeFromCart } = useCart();
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
  const [orderId] = useState(`TIKTOK-LIKES-ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [isProcessingSMMA, setIsProcessingSMMA] = useState(false);
  const [smmaResult, setSmmaResult] = useState<any>(null);
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
    console.log('✅ Paiement TikTok Likes réussi:', result);
    
    setIsProcessingSMMA(true);
    
    try {
      // Appeler l'API SMMA pour chaque article du panier TikTok Likes
      const smmaOrders: SMMAOrder[] = items.map(item => ({
        username: item.url || 'unknown', // Utiliser l'URL TikTok au lieu du username
        followers: item.likes, // Pour les likes, on utilise le champ likes
        followerType: item.followerType === 'french' ? 'tiktok_likes_french' : 'tiktok_likes_international',
        orderId: orderId,
        paymentId: result.payment_id || result.transaction_id,
        runs: item.deliveryOption?.runs,
        interval: item.deliveryOption?.interval,
        platform: 'tiktok'
      }));

      console.log('📦 Commandes SMMA TikTok Likes à traiter:', smmaOrders);
      console.log('🔗 URL TikTok à envoyer:', items[0]?.url);
      console.log('📊 Type de follower:', items[0]?.followerType);
      console.log('💖 Nombre de likes:', items[0]?.likes);

      // Traiter chaque commande SMMA TikTok Likes
      const smmaResults = await Promise.all(
        smmaOrders.map(order => smmaService.orderTikTokLikes(order))
      );

      console.log('📊 Résultats SMMA TikTok Likes:', smmaResults);
      setSmmaResult(smmaResults);

      // Préparer les données de commande complètes
      const orderData = {
        items,
        customer: customerData,
        total: getTotalPrice(),
        totalLikes: getTotalLikes(),
        orderId,
        paymentResult: result,
        smmaResults: smmaResults,
        platform: 'TikTok Likes'
      };

      // Notifier le parent et vider le panier immédiatement comme Instagram Likes
      onComplete(orderData);
      clearCart();

    } catch (error) {
      console.error('❌ Erreur lors du traitement SMMA TikTok Likes:', error);
      setSmmaResult({ error: 'Erreur lors du traitement de la commande TikTok Likes' });
    } finally {
      setIsProcessingSMMA(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Erreur de paiement TikTok Likes:', error);
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

  const confirmAction = () => {
    if (confirmDialog.action === 'remove' && confirmDialog.itemId) {
      removeFromCart(confirmDialog.itemId);
    } else if (confirmDialog.action === 'clear') {
      clearCart();
      onBack();
    }
    setConfirmDialog({ isOpen: false });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Votre panier est vide</h2>
          <p className="text-gray-300 mb-6">Ajoutez des likes TikTok à votre panier pour continuer</p>
          <button
            onClick={onBack}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showPayment ? (
          <div className="max-w-2xl mx-auto">
            {/* Mode développement : utiliser MockPayment, sinon CardinityPayment */}
            {import.meta.env.DEV ? (
              <MockPayment
                amount={getTotalPrice()}
                orderId={orderId}
                description={`TikTok Likes - ${getTotalLikes().toLocaleString()} likes`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            ) : (
              <CardinityPayment
                amount={getTotalPrice()}
                orderId={orderId}
                description={`TikTok Likes - ${getTotalLikes().toLocaleString()} likes`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            )}
            
            {/* Affichage du traitement SMMA */}
            {isProcessingSMMA && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Traitement de votre commande</h3>
                    <p className="text-blue-700">Veuillez patienter pendant que nous traitons votre commande TikTok Likes...</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <button
                  onClick={onBack}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-xl mr-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout TikTok Likes</h1>
                    <p className="text-gray-600">Finalisez votre commande de likes TikTok</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-600 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Vider le panier
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulaire client */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="w-6 h-6 mr-3 text-pink-600" />
                    Informations de facturation
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={customerData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Votre prénom"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={customerData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
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
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={customerData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse *
                      </label>
                      <input
                        type="text"
                        id="address"
                        value={customerData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Votre adresse complète"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                          Pays
                        </label>
                        <select
                          id="country"
                          value={customerData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Canada">Canada</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={customerData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+33 1 23 45 67 89"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Continuer vers le paiement
                    </button>
                  </form>
                </div>
              </div>

              {/* Résumé de la commande */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-3 text-pink-600" />
                    Résumé de votre commande
                  </h2>
                  
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">TikTok Likes</h3>
                            <p className="text-sm text-gray-600">
                              {item.likes?.toLocaleString()} likes {item.followerType === 'french' ? 'Français' : 'Internationaux'}
                            </p>
                            {item.url && (
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                {item.url}
                              </p>
                            )}
                            {item.delivery && (
                              <p className="text-xs text-gray-500">
                                Livraison: {item.delivery.name}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-pink-600">
                              {item.price?.toFixed(2)}€
                            </div>
                            <button
                              onClick={() => handleRemoveItem(index.toString())}
                              className="text-red-400 hover:text-red-600 text-sm"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-pink-600">{getTotalPrice().toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Garanties */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    Nos garanties
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Likes réels et durables</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Garantie de remplacement</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Aucun risque pour votre compte</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Support client 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dialog de confirmation */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmAction}
        title={confirmDialog.action === 'clear' ? 'Vider le panier' : 'Supprimer l\'article'}
        message={
          confirmDialog.action === 'clear' 
            ? 'Êtes-vous sûr de vouloir vider votre panier ?'
            : 'Êtes-vous sûr de vouloir supprimer cet article ?'
        }
      />

      {/* Toast notifications */}
      <Toast {...toast} />
    </div>
  );
}
