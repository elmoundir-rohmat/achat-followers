import React, { useState } from 'react';

interface MockPaymentProps {
  amount: number;
  orderId: string;
  description: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
  onCancel: () => void;
}

export default function MockPayment({
  amount,
  orderId,
  description,
  onSuccess,
  onError,
  onCancel
}: MockPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<'success' | 'error' | null>(null);

  const simulatePayment = async (outcome: 'success' | 'error') => {
    setIsProcessing(true);
    setSelectedOutcome(outcome);

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (outcome === 'success') {
      const mockResult = {
        payment_id: `PAY-${Date.now()}`,
        status: 'approved',
        amount: amount,
        currency: 'EUR',
        order_id: orderId,
        timestamp: new Date().toISOString(),
        transaction_id: `TXN-${Math.random().toString(36).substr(2, 9)}`
      };
      
      console.log('✅ Paiement factice réussi:', mockResult);
      onSuccess(mockResult);
    } else {
      const mockError = {
        error_code: 'PAYMENT_DECLINED',
        error_message: 'Carte refusée par la banque',
        order_id: orderId,
        timestamp: new Date().toISOString()
      };
      
      console.log('❌ Paiement factice échoué:', mockError);
      onError(mockError);
    }

    setIsProcessing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
        🧪 Test de Paiement (Mode Développement)
      </h3>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
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

      {isProcessing ? (
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">
            {selectedOutcome === 'success' ? '✅ Traitement du paiement réussi...' : '❌ Simulation d\'échec de paiement...'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 mb-2">
              Choisissez le résultat du test :
            </p>
          </div>
          
          <button
            onClick={() => simulatePayment('success')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="mr-2">✅</span>
            Simuler Paiement Réussi
          </button>

          <button
            onClick={() => simulatePayment('error')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="mr-2">❌</span>
            Simuler Paiement Échoué
          </button>

          <button
            onClick={onCancel}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Annuler
          </button>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400 text-center">
        <p>🧪 Mode développement - Paiement factice</p>
        <p>Ce composant sera remplacé par Cardinity en production</p>
      </div>
    </div>
  );
}
