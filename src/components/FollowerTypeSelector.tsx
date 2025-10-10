import React from 'react';
import { Globe, MapPin } from 'lucide-react';

interface FollowerType {
  id: 'french' | 'international';
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

interface Props {
  selectedType: string;
  onTypeChange: (type: string) => void;
  title?: string; // Titre personnalisé
}

export default function FollowerTypeSelector({ selectedType, onTypeChange, title = "Type de followers" }: Props) {
  const followerTypes: FollowerType[] = [
    {
      id: 'international',
      title: 'Followers Internationaux',
      description: 'Abonnés provenant du monde entier',
      features: [
        'Diversité géographique',
        'Croissance rapide',
        'Portée internationale',
        'Prix avantageux'
      ],
      icon: <Globe className="w-6 h-6" />
    },
    {
      id: 'french',
      title: 'Followers Français',
      description: 'Abonnés ciblés spécifiquement depuis la France',
      features: [
        'Profils 100% français',
        'Meilleur engagement local',
        'Contenu en français',
        'Horaires français'
      ],
      icon: <MapPin className="w-6 h-6" />
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-black mb-3 text-center">
        {title}
      </h2>
      <div className="flex gap-3 justify-center max-w-md mx-auto">
        {followerTypes.map((type) => (
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
                {type.icon}
              </div>
              <span className="text-sm font-medium text-black">
                {type.id === 'french' ? 'Français' : 'Internationaux'}
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