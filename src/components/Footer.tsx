import { Instagram, CheckCircle } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string, section?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-cream via-white to-lavender-50/30 py-16 mt-0 font-rounded">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Logo et description */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg mr-4">
              <Instagram className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-3xl font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">Doctor Followers</span>
          </div>
          <p className="text-base text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            La plateforme professionnelle pour booster votre présence sur Instagram
          </p>
          
          {/* Garanties */}
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-10">
            <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
              <CheckCircle className="w-4 h-4 text-lavender-500" strokeWidth={1.5} />
              <span className="text-slate-700 font-medium">Service client 24/7</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
              <CheckCircle className="w-4 h-4 text-lavender-500" strokeWidth={1.5} />
              <span className="text-slate-700 font-medium">Garantie satisfait ou remboursé</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 shadow-soft">
              <CheckCircle className="w-4 h-4 text-lavender-500" strokeWidth={1.5} />
              <span className="text-slate-700 font-medium">Livraison garantie</span>
            </div>
          </div>
        </div>

        {/* Nos meilleurs services */}
        <div className="border-t border-soft-pink-200/50 pt-10 mb-10">
          <h3 className="text-xl font-semibold mb-6 text-slate-800 text-center">Nos meilleurs services</h3>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <button
              onClick={() => onNavigate?.('instagram-followers')}
              className="px-5 py-2.5 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 text-slate-700 hover:text-soft-pink-600 hover:border-soft-pink-300 hover:bg-gradient-to-r hover:from-soft-pink-50 hover:to-lavender-50 transition-all duration-300 shadow-soft hover:shadow-soft-lg font-medium"
            >
              Acheter des followers Instagram
            </button>
            <button
              onClick={() => onNavigate?.('instagram-likes')}
              className="px-5 py-2.5 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 text-slate-700 hover:text-soft-pink-600 hover:border-soft-pink-300 hover:bg-gradient-to-r hover:from-soft-pink-50 hover:to-lavender-50 transition-all duration-300 shadow-soft hover:shadow-soft-lg font-medium"
            >
              Acheter des likes Instagram
            </button>
            <button
              onClick={() => onNavigate?.('tiktok-followers')}
              className="px-5 py-2.5 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 text-slate-700 hover:text-soft-pink-600 hover:border-soft-pink-300 hover:bg-gradient-to-r hover:from-soft-pink-50 hover:to-lavender-50 transition-all duration-300 shadow-soft hover:shadow-soft-lg font-medium"
            >
              Acheter des abonnés TikTok
            </button>
            <button
              onClick={() => onNavigate?.('tiktok-views')}
              className="px-5 py-2.5 rounded-pill bg-white/80 backdrop-blur-sm border border-soft-pink-200/50 text-slate-700 hover:text-soft-pink-600 hover:border-soft-pink-300 hover:bg-gradient-to-r hover:from-soft-pink-50 hover:to-lavender-50 transition-all duration-300 shadow-soft hover:shadow-soft-lg font-medium"
            >
              Acheter des vues TikTok
            </button>
          </div>
        </div>
        
        {/* Informations légales discrètes */}
        <div className="border-t border-soft-pink-200/50 pt-10">
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs mb-6">
            <button 
              onClick={() => onNavigate?.('about')}
              className="text-slate-600 hover:text-soft-pink-600 transition-colors px-3 py-1.5 rounded-pill hover:bg-soft-pink-50 font-medium"
            >
              À propos
            </button>
            <span className="text-soft-pink-300">•</span>
            <button 
              onClick={() => onNavigate?.('contact')}
              className="text-slate-600 hover:text-soft-pink-600 transition-colors px-3 py-1.5 rounded-pill hover:bg-soft-pink-50 font-medium"
            >
              Contact
            </button>
            <span className="text-soft-pink-300">•</span>
            <button 
              onClick={() => onNavigate?.('legal', 'cgv')}
              className="text-slate-600 hover:text-soft-pink-600 transition-colors px-3 py-1.5 rounded-pill hover:bg-soft-pink-50 font-medium"
            >
              CGV
            </button>
            <span className="text-soft-pink-300">•</span>
            <button 
              onClick={() => onNavigate?.('legal', 'privacy')}
              className="text-slate-600 hover:text-soft-pink-600 transition-colors px-3 py-1.5 rounded-pill hover:bg-soft-pink-50 font-medium"
            >
              Politique de confidentialité
            </button>
            <span className="text-soft-pink-300">•</span>
            <button 
              onClick={() => onNavigate?.('legal', 'delivery')}
              className="text-slate-600 hover:text-soft-pink-600 transition-colors px-3 py-1.5 rounded-pill hover:bg-soft-pink-50 font-medium"
            >
              Conditions de livraison
            </button>
            <span className="text-soft-pink-300">•</span>
            <button 
              onClick={() => onNavigate?.('legal', 'refund')}
              className="text-slate-600 hover:text-soft-pink-600 transition-colors px-3 py-1.5 rounded-pill hover:bg-soft-pink-50 font-medium"
            >
              Politique de remboursement
            </button>
          </div>
          <div className="text-xs text-slate-600 text-center space-y-2 leading-relaxed">
            <p className="font-medium">Doctor Followers by ElseWay © 2025 - SIREN: 904 173 820</p>
            <p>Adresse: 1 rue Teddy Riner, 92600 Asnières-sur-Seine, France</p>
            <p>Contact: support@doctorfollowers.com - +33 6 19 47 05 19</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
