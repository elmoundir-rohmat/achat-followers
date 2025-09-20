import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, CreditCard, User, Mail, MapPin, Phone } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CardinityPayment from './CardinityPayment';

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
  const { items, getTotalPrice, getTotalFollowers, clearCart } = useCart();
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

  const handlePaymentSuccess = (result: any) => {
    console.log('✅ Paiement réussi:', result);
    const orderData = {
      items,
      customer: customerData,
      total: getTotalPrice(),
      totalFollowers: getTotalFollowers(),
      orderId,
      paymentResult: result
    };
    onComplete(orderData);
    clearCart();
  };

  const handlePaymentError = (error: any) => {
    console.error('❌ Erreur de paiement:', error);
    setShowPayment(false);
    // Vous pouvez ajouter une notification d'erreur ici
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-pink-500 mr-3" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FollowBoost
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showPayment ? (
          <div className="max-w-2xl mx-auto">
            <CardinityPayment
              amount={getTotalPrice()}
              orderId={orderId}
              description={`${getTotalFollowers()} followers Instagram`}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
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

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg flex items-center justify-center"
              >
                <CreditCard className="w-6 h-6 mr-3" />
                Finaliser la commande - {getTotalPrice().toFixed(2)}€
              </button>
            </form>
          </div>

          {/* Résumé de la commande */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Résumé de votre commande
            </h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {item.followers.toLocaleString()} followers {item.followerType === 'french' ? 'français' : 'internationaux'}
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
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-700">Total followers:</span>
                <span className="text-lg font-bold text-gray-900">{getTotalFollowers().toLocaleString()}</span>
              </div>
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
    </div>
  );
}
