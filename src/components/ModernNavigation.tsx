import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Heart, MessageCircle, Eye, Users, ChevronDown, Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface Platform {
  name: string;
  icon: React.ReactNode;
  services: Service[];
}

interface ModernNavigationProps {
  onNavigate?: (page: string) => void;
}

export default function ModernNavigation({ onNavigate }: ModernNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { items } = useCart();

  const platforms: Platform[] = [
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" strokeWidth={1.5} />,
      services: [
        { id: 'instagram-followers', name: 'Followers', icon: <Users className="w-4 h-4" strokeWidth={1.5} />, href: '' },
        { id: 'instagram-likes', name: 'Likes', icon: <Heart className="w-4 h-4" strokeWidth={1.5} />, href: '' },
        { id: 'instagram-comments', name: 'Commentaires', icon: <MessageCircle className="w-4 h-4" strokeWidth={1.5} />, href: '' },
        { id: 'instagram-views', name: 'Vues', icon: <Eye className="w-4 h-4" strokeWidth={1.5} />, href: '' }
      ]
    },
    {
      name: 'TikTok',
      icon: <div className="w-5 h-5 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-full flex items-center justify-center font-semibold text-xs shadow-soft">TT</div>,
      services: [
        { id: 'tiktok-followers', name: 'Followers', icon: <Users className="w-4 h-4" strokeWidth={1.5} />, href: '' },
        { id: 'tiktok-likes', name: 'Likes', icon: <Heart className="w-4 h-4" strokeWidth={1.5} />, href: '' },
        { id: 'tiktok-comments', name: 'Commentaires', icon: <MessageCircle className="w-4 h-4" strokeWidth={1.5} />, href: '' },
        { id: 'tiktok-views', name: 'Vues', icon: <Eye className="w-4 h-4" strokeWidth={1.5} />, href: '' }
      ]
    }
  ];

  const handleDropdownToggle = (platformName: string) => {
    setActiveDropdown(activeDropdown === platformName ? null : platformName);
  };

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeDropdown]);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-soft-pink-200/50 sticky top-0 z-50 shadow-soft font-rounded">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 shadow-soft-lg mr-4">
              <Instagram className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-2xl font-semibold bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent">Doctor Followers</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Produits Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => handleDropdownToggle('produits')}
                className="flex items-center text-slate-700 hover:text-soft-pink-600 transition-colors font-medium px-4 py-2 rounded-button hover:bg-soft-pink-50"
              >
                <span>Produits</span>
                <ChevronDown className={`w-4 h-4 ml-1.5 transition-transform duration-300 ${activeDropdown === 'produits' ? 'rotate-180' : ''}`} strokeWidth={1.5} />
              </button>

              {activeDropdown === 'produits' && (
                <div className="absolute top-full left-0 mt-3 w-96 bg-white/95 backdrop-blur-sm rounded-card shadow-soft-xl border border-soft-pink-200/50 py-5">
                  <div className="px-5 py-2">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                      Nos Services
                    </h3>
                    <div className="grid grid-cols-2 gap-5">
                      {platforms.map((platform) => (
                        <div key={platform.name} className="space-y-3">
                          <div className="flex items-center space-x-2.5 pb-3 border-b border-soft-pink-100">
                            <div className="text-slate-700">{platform.icon}</div>
                            <span className="font-semibold text-slate-800">{platform.name}</span>
                          </div>
                          <div className="space-y-1.5">
                            {platform.services.map((service) => (
                              <button
                                key={service.id}
                                onClick={() => onNavigate?.(service.id)}
                                className="flex items-center space-x-2.5 px-3 py-2.5 rounded-card-sm hover:bg-gradient-to-r hover:from-soft-pink-50 hover:to-lavender-50 transition-all duration-300 group w-full text-left hover:shadow-soft"
                              >
                                <div className="text-soft-pink-500 group-hover:text-soft-pink-600">{service.icon}</div>
                                <span className="text-sm text-slate-700 group-hover:text-slate-800 font-medium">{service.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Menu Items */}
            <button
              onClick={() => onNavigate?.('tools')}
              className="text-slate-700 hover:text-soft-pink-600 transition-colors font-medium px-4 py-2 rounded-button hover:bg-soft-pink-50"
            >
              Outils
            </button>
            <button
              onClick={() => onNavigate?.('blog')}
              className="text-slate-700 hover:text-soft-pink-600 transition-colors font-medium px-4 py-2 rounded-button hover:bg-soft-pink-50"
            >
              Blog
            </button>
            <button
              onClick={() => onNavigate?.('contact')}
              className="text-slate-700 hover:text-soft-pink-600 transition-colors font-medium px-4 py-2 rounded-button hover:bg-soft-pink-50"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Mobile Cart Icon */}
            <button
              onClick={() => onNavigate?.('cart')}
              className="relative text-slate-700 hover:text-soft-pink-600 transition-colors p-2.5 rounded-full hover:bg-soft-pink-50"
            >
              <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-soft-pink-400 to-lavender-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-soft">
                  {items.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-slate-700 hover:text-soft-pink-600 transition-colors p-2.5 rounded-full hover:bg-soft-pink-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-soft-pink-200/50 shadow-soft-lg">
            <div className="px-6 py-6 space-y-5">
              {/* Mobile Products */}
              <div>
                <h3 className="text-slate-800 font-semibold mb-4 text-base">Produits</h3>
                <div className="space-y-4">
                  {platforms.map((platform) => (
                    <div key={platform.name} className="ml-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-slate-700">{platform.icon}</div>
                        <span className="text-slate-800 font-semibold">{platform.name}</span>
                      </div>
                      <div className="ml-7 space-y-2">
                        {platform.services.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => {
                              onNavigate?.(service.id);
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center space-x-3 text-slate-700 hover:text-soft-pink-600 hover:bg-gradient-to-r hover:from-soft-pink-50 hover:to-lavender-50 transition-all duration-300 w-full text-left px-3 py-2.5 rounded-card-sm"
                          >
                            <div className="text-soft-pink-500">{service.icon}</div>
                            <span className="text-sm font-medium">{service.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Mobile Links */}
              <div className="space-y-2 pt-2 border-t border-soft-pink-100">
                <button
                  onClick={() => {
                    onNavigate?.('tools');
                    setIsMenuOpen(false);
                  }}
                  className="block text-slate-700 hover:text-soft-pink-600 hover:bg-soft-pink-50 transition-all duration-300 w-full text-left px-3 py-2.5 rounded-card-sm font-medium"
                >
                  Outils
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('blog');
                    setIsMenuOpen(false);
                  }}
                  className="block text-slate-700 hover:text-soft-pink-600 hover:bg-soft-pink-50 transition-all duration-300 w-full text-left px-3 py-2.5 rounded-card-sm font-medium"
                >
                  Blog
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('contact');
                    setIsMenuOpen(false);
                  }}
                  className="block text-slate-700 hover:text-soft-pink-600 hover:bg-soft-pink-50 transition-all duration-300 w-full text-left px-3 py-2.5 rounded-card-sm font-medium"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </nav>
  );
}
