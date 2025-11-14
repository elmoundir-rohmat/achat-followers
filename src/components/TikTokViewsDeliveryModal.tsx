import React, { useState } from 'react';
import { X, Clock, Zap, Shield, CheckCircle, Eye } from 'lucide-react';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  runs: number;
  interval: number; // en minutes
  totalTime: string; // temps total estimé
  icon: React.ReactNode;
  color: string;
  additionalCost: number; // coût supplémentaire en euros
  popular?: boolean; // option recommandée
}

interface TikTokViewsDeliveryModalProps {
  onClose: () => void;
  onConfirm: (option: DeliveryOption) => void;
  basePrice: number;
  viewsCount?: number;
  followerType?: 'french' | 'international' | 'premium';
  tiktokUrl?: string;
}

export default function TikTokViewsDeliveryModal({ 
  onClose, 
  onConfirm, 
  basePrice,
  viewsCount = 0,
  followerType = 'premium',
  tiktokUrl = ''
}: TikTokViewsDeliveryModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'instant',
      name: 'Instant Delivery',
      description: 'Vous recevrez vos vues dans 10–15 minutes',
      runs: 1,
      interval: 0,
      totalTime: '10-15 minutes',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      additionalCost: 0.00,
      popular: true
    },
    {
      id: '24hours',
      name: '24 Hours Delivery',
      description: 'Vous recevrez vos vues pendant 24 heures',
      runs: 12,
      interval: 120,
      totalTime: '24 heures',
      icon: <Clock className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      additionalCost: 0.49
    },
    {
      id: '3days',
      name: '3 Days Delivery',
      description: 'Vous recevrez vos vues pendant 3 jours',
      runs: 12,
      interval: 360,
      totalTime: '3 jours',
      icon: <Shield className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      additionalCost: 0.54
    },
    {
      id: '7days',
      name: '7 Days Delivery',
      description: 'Vous recevrez vos vues pendant 7 jours',
      runs: 21,
      interval: 480,
      totalTime: '7 jours',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'from-purple-500 to-indigo-500',
      additionalCost: 0.59
    },
    {
      id: '14days',
      name: '14 Days Delivery',
      description: 'Vous recevrez vos vues pendant 14 jours',
      runs: 14,
      interval: 1440,
      totalTime: '14 jours',
      icon: <Clock className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500',
      additionalCost: 0.64
    },
    {
      id: '30days',
      name: '30 Days Delivery',
      description: 'Vous recevrez vos vues pendant 30 jours',
      runs: 30,
      interval: 1440,
      totalTime: '30 jours',
      icon: <Shield className="w-5 h-5" />,
      color: 'from-gray-500 to-slate-500',
      additionalCost: 0.69
    }
  ];

  const handleConfirm = () => {
    if (!selectedOption) {
      alert('Veuillez sélectionner une option de livraison');
      return;
    }
    
    const option = deliveryOptions.find(opt => opt.id === selectedOption);
    if (option) {
      onConfirm(option);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-bold">Choisissez la durée de livraison</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            Boostez vos vues TikTok avec notre service professionnel
          </p>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Options de livraison disponibles
            </h3>
            
            <div className="space-y-2">
              {deliveryOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                    selectedOption === option.id
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Badge populaire */}
                  {option.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      POPULAIRE
                    </div>
                  )}

                  {/* Indicateur de sélection */}
                  {selectedOption === option.id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {/* Icône */}
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${option.color} text-white flex-shrink-0`}>
                      {option.icon}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {option.name}
                        </h4>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="text-sm text-gray-900">
                            {option.additionalCost === 0 ? '0.00€' : `+${option.additionalCost.toFixed(2)}€`}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 leading-tight">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Eye className="w-4 h-4 mr-2 text-purple-500" />
              Informations importantes
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Toutes les vues proviennent de comptes TikTok réels et actifs</li>
              <li>• Garantie de remplacement si les vues ne sont pas livrées</li>
              <li>• Aucun risque pour votre compte TikTok</li>
              <li>• Support client disponible 24/7</li>
            </ul>
          </div>

          {/* Prix total */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Prix de base:</span>
              <span className="font-semibold">{basePrice.toFixed(2)}€</span>
            </div>
            {selectedOption && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Option de livraison:</span>
                  <span className="font-semibold">
                    {deliveryOptions.find(opt => opt.id === selectedOption)?.additionalCost.toFixed(2)}€
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-purple-600">
                    {(basePrice + (deliveryOptions.find(opt => opt.id === selectedOption)?.additionalCost || 0)).toFixed(2)}€
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Boutons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Confirmer la commande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
