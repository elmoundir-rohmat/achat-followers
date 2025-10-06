import React, { useEffect, useState } from 'react';
import { CheckCircle, Users, Clock, Mail, ArrowLeft } from 'lucide-react';

interface PaymentSuccessPageProps {
  onBack?: () => void;
}

export default function PaymentSuccessPage({ onBack }: PaymentSuccessPageProps) {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [smmaResults, setSmmaResults] = useState<any>(null);

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

    // Récupérer les résultats SMMA
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
    }
  }, []);

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

          {/* Résultats SMMA */}
          {smmaResults && (
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
