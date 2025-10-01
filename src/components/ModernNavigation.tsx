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
      icon: <Instagram className="w-5 h-5" />,
      services: [
        { id: 'instagram-followers', name: 'Followers', icon: <Users className="w-4 h-4" />, href: '' },
        { id: 'instagram-likes', name: 'Likes', icon: <Heart className="w-4 h-4" />, href: '' },
        { id: 'instagram-comments', name: 'Commentaires', icon: <MessageCircle className="w-4 h-4" />, href: '' },
        { id: 'instagram-views', name: 'Vues', icon: <Eye className="w-4 h-4" />, href: '' }
      ]
    },
    {
      name: 'TikTok',
      icon: <div className="w-5 h-5 bg-black text-white rounded flex items-center justify-center font-bold text-xs">TT</div>,
      services: [
        { id: 'tiktok-followers', name: 'Followers', icon: <Users className="w-4 h-4" />, href: '' },
        { id: 'tiktok-likes', name: 'Likes', icon: <Heart className="w-4 h-4" />, href: '' },
        { id: 'tiktok-comments', name: 'Commentaires', icon: <MessageCircle className="w-4 h-4" />, href: '' },
        { id: 'tiktok-views', name: 'Vues', icon: <Eye className="w-4 h-4" />, href: '' }
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
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Instagram className="w-8 h-8 text-blue-400 mr-3" />
            <span className="text-2xl font-bold text-white">Doctor Followers</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Produits Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => handleDropdownToggle('produits')}
                className="flex items-center text-white hover:text-blue-300 transition-colors"
              >
                <span className="font-medium">Produits</span>
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${activeDropdown === 'produits' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'produits' && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-4">
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Nos Services
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {platforms.map((platform) => (
                        <div key={platform.name} className="space-y-2">
                          <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                            <div className="text-gray-700">{platform.icon}</div>
                            <span className="font-medium text-gray-900">{platform.name}</span>
                          </div>
                          <div className="space-y-1">
                            {platform.services.map((service) => (
                              <button
                                key={service.id}
                                onClick={() => onNavigate?.(service.id)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group w-full text-left"
                              >
                                <div className="text-gray-500 group-hover:text-gray-700">{service.icon}</div>
                                <span className="text-sm text-gray-700 group-hover:text-gray-900">{service.name}</span>
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
              onClick={() => onNavigate?.('outils')}
              className="text-white hover:text-blue-300 transition-colors font-medium"
            >
              Outils
            </button>
            <button
              onClick={() => onNavigate?.('blog')}
              className="text-white hover:text-blue-300 transition-colors font-medium"
            >
              Blog
            </button>
            <button
              onClick={() => onNavigate?.('contact')}
              className="text-white hover:text-blue-300 transition-colors font-medium"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Mobile Cart Icon */}
            <button
              onClick={() => onNavigate?.('cart')}
              className="relative text-white hover:text-blue-300 transition-colors p-2"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-blue-300 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Products */}
              <div>
                <h3 className="text-white font-medium mb-3">Produits</h3>
                <div className="space-y-3">
                  {platforms.map((platform) => (
                    <div key={platform.name} className="ml-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="text-white">{platform.icon}</div>
                        <span className="text-white font-medium">{platform.name}</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {platform.services.map((service) => (
                          <a
                            key={service.id}
                            href={service.href}
                            className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
                          >
                            <div>{service.icon}</div>
                            <span className="text-sm">{service.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Mobile Links */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onNavigate?.('outils');
                    setIsMenuOpen(false);
                  }}
                  className="block text-white hover:text-blue-300 transition-colors w-full text-left"
                >
                  Outils
                </button>
                <button
                  onClick={() => {
                    onNavigate?.('blog');
                    setIsMenuOpen(false);
                  }}
                  className="block text-white hover:text-blue-300 transition-colors w-full text-left"
                >
                  Blog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </nav>
  );
}
