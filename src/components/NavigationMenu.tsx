import React from 'react';
import { Users, Heart, Instagram } from 'lucide-react';

interface NavigationMenuProps {
  currentPage: 'followers' | 'likes';
  onPageChange: (page: 'followers' | 'likes') => void;
}

export default function NavigationMenu({ currentPage, onPageChange }: NavigationMenuProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Instagram className="w-8 h-8 text-pink-500 mr-3" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FollowBoost
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onPageChange('followers')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentPage === 'followers'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Followers
            </button>
            <button
              onClick={() => onPageChange('likes')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentPage === 'likes'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4 mr-2" />
              Likes
            </button>
          </nav>

          {/* Features */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">🚀 Livraison rapide</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">🔒 100% Sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
