import React, { useEffect, useState } from 'react';
import { XCircle, AlertTriangle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';

interface PaymentCancelPageProps {
  onBack?: () => void;
}

export default function PaymentCancelPage({ onBack }: PaymentCancelPageProps) {
  const [errorDetails, setErrorDetails] = useState<any>(null);

  useEffect(() => {
    // Récupérer les détails de l'erreur depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    const orderId = urlParams.get('order_id');
    
    if (error || errorDescription) {
      setErrorDetails({
        error: error || 'Paiement annulé',
        description: errorDescription || 'Le paiement a été annulé par l\'utilisateur',
        orderId: orderId,
        timestamp: new Date().toLocaleString('fr-FR')
      });
    }

    // Récupérer les détails depuis le localStorage si disponibles
    const savedOrder = localStorage.getItem('pendingOrder');
    if (savedOrder && !errorDetails) {
      try {
        const order = JSON.parse(savedOrder);
        setErrorDetails({
          error: 'Paiement annulé',
          description: 'Le paiement a été annulé ou a échoué',
          orderId: order.orderId,
          amount: order.amount,
          followers: order.followers,
          followerType: order.followerType,
          username: order.username,
          timestamp: new Date().toLocaleString('fr-FR')
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
      }
    }
  }, [errorDetails]);

  const handleRetryPayment = () => {
    // Retourner à la page de checkout
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/checkout';
    }
  };

  const handleBackToHome = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  const getErrorIcon = (error: string) => {
    if (error.toLowerCase().includes('cancelled') || error.toLowerCase().includes('annulé')) {
      return <XCircle className="w-12 h-12 text-orange-600" />;
    }
    if (error.toLowerCase().includes('declined') || error.toLowerCase().includes('refusé')) {
      return <AlertTriangle className="w-12 h-12 text-red-600" />;
    }
    return <XCircle className="w-12 h-12 text-red-600" />;
  };

  const getErrorColor = (error: string) => {
    if (error.toLowerCase().includes('cancelled') || error.toLowerCase().includes('annulé')) {
      return 'text-orange-600';
    }
    if (error.toLowerCase().includes('declined') || error.toLowerCase().includes('refusé')) {
      return 'text-red-600';
    }
    return 'text-red-600';
  };

  const getErrorBackground = (error: string) => {
    if (error.toLowerCase().includes('cancelled') || error.toLowerCase().includes('annulé')) {
      return 'bg-orange-100';
    }
    if (error.toLowerCase().includes('declined') || error.toLowerCase().includes('refusé')) {
      return 'bg-red-100';
    }
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Icône d'erreur */}
          <div className="mb-6">
            <div className={`w-20 h-20 ${getErrorBackground(errorDetails?.error || '')} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {getErrorIcon(errorDetails?.error || '')}
            </div>
            <h1 className={`text-3xl font-bold ${getErrorColor(errorDetails?.error || '')} mb-2`}>
              Paiement échoué
            </h1>
            <p className="text-gray-600">
              {errorDetails?.description || 'Une erreur est survenue lors du paiement'}
            </p>
          </div>

          {/* Détails de l'erreur */}
          {errorDetails && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Détails de l'erreur
              </h2>
              
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type d'erreur :</span>
                  <span className="font-semibold text-red-600">{errorDetails.error}</span>
                </div>
                
                {errorDetails.orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numéro de commande :</span>
                    <span className="font-semibold">{errorDetails.orderId}</span>
                  </div>
                )}
                
                {errorDetails.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant :</span>
                    <span className="font-semibold">{errorDetails.amount}€</span>
                  </div>
                )}
                
                {errorDetails.followers && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Followers :</span>
                    <span className="font-semibold">
                      {errorDetails.followers.toLocaleString()} {errorDetails.followerType === 'french' ? 'français' : 'internationaux'}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date :</span>
                  <span className="font-semibold">{errorDetails.timestamp}</span>
                </div>
              </div>
            </div>
          )}

          {/* Causes possibles */}
          <div className="bg-yellow-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center mb-3">
              <HelpCircle className="w-6 h-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-bold text-yellow-600">
                Causes possibles
              </h3>
            </div>
            
            <div className="space-y-2 text-sm text-gray-700 text-left">
              <p>• <strong>Paiement annulé :</strong> Vous avez annulé le paiement</p>
              <p>• <strong>Carte refusée :</strong> Votre banque a refusé la transaction</p>
              <p>• <strong>Données incorrectes :</strong> Informations de carte invalides</p>
              <p>• <strong>Limite dépassée :</strong> Limite de votre carte atteinte</p>
              <p>• <strong>Problème technique :</strong> Erreur temporaire du système</p>
            </div>
          </div>

          {/* Solutions */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-600 mb-3">
              Que faire maintenant ?
            </h3>
            
            <div className="space-y-2 text-sm text-gray-700 text-left">
              <p>✅ <strong>Vérifiez vos informations :</strong> Nom, numéro de carte, date d'expiration</p>
              <p>✅ <strong>Contactez votre banque :</strong> Assurez-vous que les paiements en ligne sont autorisés</p>
              <p>✅ <strong>Essayez une autre carte :</strong> Utilisez une carte différente</p>
              <p>✅ <strong>Réessayez plus tard :</strong> Le problème peut être temporaire</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleRetryPayment}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Réessayer le paiement
            </button>
            
            <button
              onClick={handleBackToHome}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Retour à l'accueil
            </button>
            
            <p className="text-sm text-gray-500">
              Besoin d'aide ? Contactez notre support client 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
