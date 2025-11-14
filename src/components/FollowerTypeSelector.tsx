import React from 'react';
import { Globe, MapPin, Flag, Shuffle, Edit } from 'lucide-react';
import { ServiceTypeConfig, getAvailableTypes } from '../config/serviceTypes';

interface Props {
  selectedType: string;
  onTypeChange: (type: string) => void;
  title?: string; // Titre personnalisé
  serviceKey?: string; // Clé du service pour obtenir les types disponibles
  customTypes?: ServiceTypeConfig[]; // Types personnalisés (optionnel)
}

export default function FollowerTypeSelector({ selectedType, onTypeChange, title = "Type de followers", serviceKey, customTypes }: Props) {
  // Fonction pour obtenir l'icône React à partir du nom de l'icône
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-6 h-6" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6" />;
      case 'Flag':
        return <Flag className="w-6 h-6" />;
      case 'Shuffle':
        return <Shuffle className="w-6 h-6" />;
      case 'Edit':
        return <Edit className="w-6 h-6" />;
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  // Obtenir les types disponibles
  let availableTypes: ServiceTypeConfig[] = [];
  
  if (customTypes) {
    // Utiliser les types personnalisés fournis
    availableTypes = customTypes;
  } else if (serviceKey) {
    // Utiliser la configuration du service
    availableTypes = getAvailableTypes(serviceKey);
  } else {
    // Fallback vers l'ancienne logique pour la compatibilité
    availableTypes = [
      {
        id: 'international',
        title: 'Followers Monde',
        description: 'Followers provenant du monde entier',
        features: ['Diversité géographique', 'Croissance rapide', 'Portée internationale', 'Prix avantageux'],
        icon: 'Globe'
      },
      {
        id: 'french',
        title: 'Followers France',
        description: 'Followers ciblés spécifiquement depuis la France',
        features: ['Profils 100% français', 'Meilleur engagement local', 'Contenu en français', 'Support français'],
        icon: 'MapPin'
      }
    ];
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-black mb-3 text-center">
        {title}
      </h2>
      <div className="flex gap-3 justify-center max-w-lg mx-auto">
        {availableTypes.map((type) => (
          <button
            key={type.id}
            className={`relative px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedType === type.id
                ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
            }`}
            onClick={() => onTypeChange(type.id)}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${
                selectedType === type.id ? 'bg-white text-blue-500' : 'bg-gray-100 text-gray-600'
              }`}>
                {getIcon(type.icon)}
              </div>
              <span className="text-sm font-medium text-black">
                {type.title}
              </span>
            </div>
            
            {selectedType === type.id && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}