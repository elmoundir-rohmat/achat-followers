import { Globe, MapPin, Flag, Shuffle, Edit } from 'lucide-react';
import { ServiceTypeConfig, getAvailableTypes } from '../config/serviceTypes';

interface Props {
  selectedType: string;
  onTypeChange: (type: string) => void;
  title?: string; // Titre personnalisé
  serviceKey?: string; // Clé du service pour obtenir les types disponibles
  customTypes?: ServiceTypeConfig[]; // Types personnalisés (optionnel)
}

export default function FollowerTypeSelector({ selectedType, onTypeChange, title = "Acheter des followers Instagram", serviceKey, customTypes }: Props) {
  // Fonction pour obtenir l'icône React à partir du nom de l'icône
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5" strokeWidth={1.5} />;
      case 'MapPin':
        return <MapPin className="w-5 h-5" strokeWidth={1.5} />;
      case 'Flag':
        return <Flag className="w-5 h-5" strokeWidth={1.5} />;
      case 'Shuffle':
        return <Shuffle className="w-5 h-5" strokeWidth={1.5} />;
      case 'Edit':
        return <Edit className="w-5 h-5" strokeWidth={1.5} />;
      default:
        return <Globe className="w-5 h-5" strokeWidth={1.5} />;
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
    <div className="mb-10">
      <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-6 text-center">
        {title}
      </h2>
      <div className="flex gap-4 justify-center max-w-lg mx-auto">
        {availableTypes.map((type) => (
          <button
            key={type.id}
            className={`relative px-2 py-2 rounded-pill border cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedType === type.id
                ? 'border-soft-pink-300 bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white shadow-soft-lg'
                : 'border-soft-pink-200/50 bg-white/80 backdrop-blur-sm hover:border-soft-pink-300/50 hover:shadow-soft text-slate-700'
            }`}
            onClick={() => onTypeChange(type.id)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full transition-all ${
                selectedType === type.id 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : 'bg-gradient-to-br from-lavender-50 to-soft-pink-50'
              }`}>
                <div className={selectedType === type.id ? 'text-white' : 'text-lavender-600'}>
                  {getIcon(type.icon)}
                </div>
              </div>
              <span className={`text-sm font-semibold ${
                selectedType === type.id ? 'text-white' : 'text-slate-700'
              }`}>
                {type.title}
              </span>
            </div>
            
            {selectedType === type.id && (
              <div className="absolute -top-1.5 -right-1.5">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-soft">
                  <div className="w-2 h-2 bg-soft-pink-500 rounded-full"></div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}