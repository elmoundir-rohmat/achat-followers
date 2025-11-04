import { Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string, section?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <Instagram className="w-8 h-8 text-blue-500 mr-3" />
          <span className="text-2xl font-bold">Doctor Followers</span>
        </div>
        <p className="text-gray-400 mb-6">
          La plateforme professionnelle pour booster votre présence sur Instagram
        </p>
        <div className="flex justify-center space-x-8 text-sm text-gray-400 mb-6">
          <span>✓ Service client 24/7</span>
          <span>✓ Garantie satisfait ou remboursé</span>
          <span>✓ Livraison garantie</span>
        </div>

        {/* Nos meilleurs services */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Nos meilleurs services</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => onNavigate?.('instagram-followers')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Acheter des followers Instagram
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => onNavigate?.('instagram-likes')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Acheter des likes Instagram
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => onNavigate?.('tiktok-followers')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Acheter des abonnés TikTok
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => onNavigate?.('tiktok-views')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Acheter des vues TikTok
            </button>
          </div>
        </div>
        
        {/* Informations légales discrètes */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-gray-600 mb-3">
            <button 
              onClick={() => onNavigate?.('about')}
              className="hover:text-gray-400 transition-colors"
            >
              À propos
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="hover:text-gray-400 transition-colors"
            >
              Contact
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate?.('legal', 'cgv')}
              className="hover:text-gray-400 transition-colors"
            >
              CGV
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate?.('legal', 'privacy')}
              className="hover:text-gray-400 transition-colors"
            >
              Politique de confidentialité
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate?.('legal', 'delivery')}
              className="hover:text-gray-400 transition-colors"
            >
              Conditions de livraison
            </button>
            <span>•</span>
            <button 
              onClick={() => onNavigate?.('legal', 'refund')}
              className="hover:text-gray-400 transition-colors"
            >
              Politique de remboursement
            </button>
          </div>
          <div className="text-xs text-gray-600">
            <p> Doctor Followers by ElseWay © 2025 - SIREN: 904 173 820</p>
            <p className="mt-1">Adresse: 1 rue Teddy Riner, 92600 Asnières-sur-Seine, France</p>
            <p className="mt-1">Contact: support@doctorfollowers.com - +33 6 19 47 05 19</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
