import React, { useEffect, useState } from 'react';
import { CARDINITY_CONFIG, CardinityPaymentData } from '../config/cardinity';

interface CardinityPaymentProps {
  amount: number;
  orderId: string;
  description: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
}

export default function CardinityPayment({
  amount,
  orderId,
  description,
  onSuccess,
  onError,
  onCancel
}: CardinityPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Vérifier que Cardinity est chargé
    if (typeof window !== 'undefined' && window.Cardinity) {
      console.log('✅ Cardinity SDK chargé');
    } else {
      console.error('❌ Cardinity SDK non chargé');
      setError('Erreur de chargement du système de paiement');
    }
  }, []);

  const handlePayment = async () => {
    if (!window.Cardinity) {
      setError('Système de paiement non disponible');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Préparer les données de paiement
      const paymentData: CardinityPaymentData = {
        amount: Math.round(amount * 100), // Convertir en centimes
        currency: CARDINITY_CONFIG.currency,
        country: CARDINITY_CONFIG.country,
        language: CARDINITY_CONFIG.language,
        order_id: orderId,
        description: description,
        success_url: CARDINITY_CONFIG.successUrl,
        cancel_url: CARDINITY_CONFIG.cancelUrl
      };

      console.log('💳 Données de paiement:', paymentData);

      // Créer le paiement avec Cardinity
      const payment = await window.Cardinity.createPayment({
        ...paymentData,
        consumer_key: CARDINITY_CONFIG.consumerKey
      });

      console.log('✅ Paiement créé:', payment);

      // Rediriger vers le formulaire de paiement Cardinity
      window.location.href = payment.payment_url;

    } catch (error) {
      console.error('❌ Erreur de paiement:', error);
      setError('Erreur lors de la création du paiement');
      onError(error);
    } finally {
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
          {error}
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
              Création du paiement...
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
      </div>
    </div>
  );
}
