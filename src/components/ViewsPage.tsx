import React, { useState } from 'react';
import { ShoppingCart, CreditCard, User, Mail, MapPin, Phone, Eye, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CardinityPayment from './CardinityPayment';
import MockPayment from './MockPayment';
import SMMATest from './SMMATest';
import ConfirmDialog from './ConfirmDialog';
import Toast, { ToastProps } from './Toast';
import { smmaService, SMMAOrder } from '../services/smmaService';

interface ViewsPageProps {
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

export default function ViewsPage({ onBack, onComplete }: ViewsPageProps) {
  const { items, getTotalPrice, getTotalViews, clearCart, removeFromCart } = useCart();
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
      // Appeler l'API SMMA pour chaque article du panier (vues)
      const smmaOrders: SMMAOrder[] = [];
      
      items.forEach(item => {
        if (item.selectedPosts && item.selectedPosts.length > 0) {
          // Pour les vues sur des reels spécifiques
          item.selectedPosts.forEach(post => {
            smmaOrders.push({
              username: item.username || 'unknown',
              followers: 0,
              followerType: item.followerType,
              orderId: orderId,
              paymentId: result.payment_id || result.transaction_id,
              postId: post.postId,
              viewsToAdd: post.viewsToAdd
            });
          });
        } else {
          // Pour les vues généraux (fallback)
          smmaOrders.push({
            username: item.username || 'unknown',
            followers: item.views || 0,
            followerType: item.followerType,
            orderId: orderId,
            paymentId: result.payment_id || result.transaction_id
          });
        }
      });

      console.log('📦 Commandes SMMA à traiter (vues):', smmaOrders);

      // Traiter chaque commande SMMA
      const smmaResults = await Promise.all(
        smmaOrders.map(order => smmaService.orderViews(order))
      );

      console.log('📊 Résultats SMMA (vues):', smmaResults);
      setSmmaResult(smmaResults);

      // Préparer les données de commande complètes
      const orderData = {
        items,
        customer: customerData,
        total: getTotalPrice(),
        totalViews: getTotalViews(),
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
            {/* Mode développement : utiliser MockPayment, sinon CardinityPayment */}
            {import.meta.env.DEV ? (
              <MockPayment
                amount={getTotalPrice()}
                orderId={orderId}
                description={`${getTotalViews()} vues Instagram`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            ) : (
              <CardinityPayment
                amount={getTotalPrice()}
                orderId={orderId}
                description={`${getTotalViews()} vues Instagram`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            )}
            
            {/* Affichage du traitement SMMA */}
            {isProcessingSMMA && (
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-purple-600 mr-3" xmlns="http://www.w3.org/2000/schema#" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-purple-700 font-medium">
                    Traitement de votre commande de vues avec la plateforme SMMA...
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
              <User className="w-6 h-6 mr-3 text-purple-600" />
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
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
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transform hover:scale-105 hover:shadow-xl'
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
                    🧪 Tester SMMA (Vues)
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
                <div key={item.id} className="p-4 bg-gray-50 rounded-lg relative">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Supprimer cet article"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="flex justify-between items-center mb-3 pr-8">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {(item.views || item.followers).toLocaleString()} vues {item.followerType === 'french' ? 'françaises' : 'internationales'}
                      </div>
                      {item.username && (
                        <div className="text-sm text-gray-600">
                          @{item.username}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-purple-600">
                      {item.price.toFixed(2)}€
                    </div>
                  </div>
                  
                  {/* Affichage des reels sélectionnés */}
                  {item.selectedPosts && item.selectedPosts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">
                        Reels sélectionnés ({item.selectedPosts.length}):
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {item.selectedPosts.map((post, index) => (
                          <div key={post.postId} className="flex items-center space-x-2 text-xs">
                            <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                              {post.mediaUrl && (
                                <img 
                                  src={post.mediaUrl} 
                                  alt="Reel" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">Reel #{index + 1}</div>
                              <div className="text-purple-600">+{post.viewsToAdd} vues</div>
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
                <span className="text-lg font-semibold text-gray-700">Total vues:</span>
                <span className="text-lg font-bold text-gray-900">{getTotalViews().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-purple-600">{getTotalPrice().toFixed(2)}€</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center text-purple-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Garantie 30 jours</span>
              </div>
              <div className="flex items-center text-purple-700 mt-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Livraison progressive</span>
              </div>
              <div className="flex items-center text-purple-700 mt-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Vues réelles</span>
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
