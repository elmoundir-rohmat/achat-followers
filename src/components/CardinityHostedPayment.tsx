import React, { useState } from 'react';
import { CARDINITY_CONFIG } from '../config/cardinity';

interface CardinityHostedPaymentProps {
  amount: number;
  orderId: string;
  description: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
}

export default function CardinityHostedPayment({
  amount,
  orderId,
  description,
  onSuccess,
  onError,
  onCancel
}: CardinityHostedPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const handlePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Appeler l'API backend pour créer le paiement Cardinity
      const response = await fetch('/api/cardinity/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          orderId: orderId,
          description: description,
          currency: CARDINITY_CONFIG.currency,
          country: CARDINITY_CONFIG.country,
          language: CARDINITY_CONFIG.language,
          returnUrl: CARDINITY_CONFIG.successUrl,
          cancelUrl: CARDINITY_CONFIG.cancelUrl
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const paymentData = await response.json();
      
      console.log('💳 Redirection vers Hosted Payment Page Cardinity:', paymentData);

      // Sauvegarder les détails de la commande
      const orderDetails = {
        orderId,
        amount,
        currency: CARDINITY_CONFIG.currency,
        description,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
      
      console.log('💾 Détails de commande sauvegardés pour SMMA');

      // Créer un formulaire et le soumettre automatiquement
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://checkout.cardinity.com';
      form.style.display = 'none';

      // Ajouter tous les paramètres comme champs cachés
      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      // Ajouter le formulaire au DOM et le soumettre
      document.body.appendChild(form);
      form.submit();

    } catch (error: any) {
      console.error('❌ Erreur de paiement:', error);
      setError(error.message || 'Erreur lors de la création du paiement');
      onError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        💳 Paiement sécurisé
      </h3>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          <strong>Montant :</strong> {amount.toFixed(2)}€
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Commande :</strong> {orderId}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Description :</strong> {description}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Redirection vers le paiement...
            </span>
          ) : (
            'Payer avec Cardinity'
          )}
        </button>

        <button
          onClick={onCancel}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Annuler
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>🔒 Paiement sécurisé par Cardinity</p>
        <p>Visa, Mastercard, American Express acceptés</p>
        {CARDINITY_CONFIG.isTestMode && (
          <p className="text-yellow-600 font-semibold">Mode test activé</p>
        )}
      </div>
    </div>
  );
}
