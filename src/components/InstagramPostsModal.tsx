import React, { useState } from 'react';
import { X, Heart, CheckCircle, ArrowLeft } from 'lucide-react';
import InstagramPostsGrid from './InstagramPostsGrid';
import { InstagramPost } from '../services/instagramService';

interface InstagramPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  totalLikes: number;
  onPostsSelected: (selectedPosts: InstagramPost[], likesPerPost: number) => void;
}

export default function InstagramPostsModal({ 
  isOpen, 
  onClose, 
  username, 
  totalLikes, 
  onPostsSelected 
}: InstagramPostsModalProps) {
  const [step, setStep] = useState<'selection' | 'confirmation'>('selection');
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>([]);
  const [likesPerPost, setLikesPerPost] = useState(0);

  const handlePostsSelect = (posts: InstagramPost[], likesPerPost: number) => {
    setSelectedPosts(posts);
    setLikesPerPost(likesPerPost);
    setStep('confirmation');
  };

  const handleConfirm = () => {
    onPostsSelected(selectedPosts, likesPerPost);
    onClose();
    // Reset state
    setStep('selection');
    setSelectedPosts([]);
    setLikesPerPost(0);
  };

  const handleBack = () => {
    setStep('selection');
    setSelectedPosts([]);
    setLikesPerPost(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-pink-50 to-red-50">
          <div className="flex items-center">
            {step === 'confirmation' && (
              <button
                onClick={handleBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <Heart className="w-6 h-6 text-pink-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 'selection' ? 'Sélectionnez vos posts' : 'Confirmez votre sélection'}
              </h2>
              <p className="text-sm text-gray-600">
                {step === 'selection' 
                  ? `Choisissez les posts de @${username} pour recevoir ${totalLikes.toLocaleString()} likes`
                  : `${selectedPosts.length} posts sélectionnés`
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'selection' ? (
            <InstagramPostsGrid
              username={username}
              onPostsSelect={handlePostsSelect}
              totalLikes={totalLikes}
            />
          ) : (
            <div className="space-y-6">
              {/* Résumé de la sélection */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Résumé de votre sélection
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{totalLikes.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{selectedPosts.length}</div>
                    <div className="text-sm text-gray-600">Posts sélectionnés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{likesPerPost}</div>
                    <div className="text-sm text-gray-600">Likes par post</div>
                  </div>
                </div>

                {totalLikes % selectedPosts.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Les {totalLikes % selectedPosts.length} likes restants seront répartis sur les premiers posts sélectionnés.
                    </p>
                  </div>
                )}
              </div>

              {/* Liste des posts sélectionnés */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Posts sélectionnés
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedPosts.map((post, index) => {
                    const likesForThisPost = likesPerPost + (index < (totalLikes % selectedPosts.length) ? 1 : 0);
                    
                    return (
                      <div key={post.id} className="relative">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={post.media_url || post.thumbnail_url || '/placeholder-post.jpg'}
                            alt="Post Instagram"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                        </div>
                        
                        {/* Badge avec le nombre de likes */}
                        <div className="absolute top-2 right-2">
                          <div className="bg-pink-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            +{likesForThisPost}
                          </div>
                        </div>

                        {/* Indicateur de sélection */}
                        <div className="absolute top-2 left-2">
                          <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">ℹ️ Informations importantes</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Les likes seront ajoutés progressivement sur une période de 24-72h</li>
                  <li>• Tous les likes proviennent de comptes réels et actifs</li>
                  <li>• Garantie de remplacement si les likes ne sont pas livrés</li>
                  <li>• Aucun risque pour votre compte Instagram</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'confirmation' && (
          <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50">
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Modifier la sélection
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-lg hover:from-pink-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Heart className="w-5 h-5 inline mr-2" />
              Confirmer et continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

