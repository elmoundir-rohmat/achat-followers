import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import { InstagramPost, instagramService } from '../services/instagramService';

interface InstagramPostsGridProps {
  username: string;
  onPostsSelect: (selectedPosts: InstagramPost[], pricePerPost: number) => void;
  totalLikes: number;
  isComments?: boolean;
  isViews?: boolean;
  pricePerPost?: number;
}

export default function InstagramPostsGrid({ username, onPostsSelect, totalLikes, isComments = false, isViews = false, pricePerPost = 0 }: InstagramPostsGridProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [lastUsername, setLastUsername] = useState<string>('');
  const loadingRef = useRef(false);

  const loadPosts = useCallback(async (cursor?: string) => {
    // Éviter les appels multiples simultanés
    if (loadingRef.current) {
      console.log('🔄 Chargement déjà en cours, ignoré');
      return;
    }

    loadingRef.current = true;
    try {
      if (cursor) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      // Utiliser getUserClips pour les vues (reels), sinon getUserPosts
      const response = isViews 
        ? await instagramService.getUserClips(username, 12) 
        : await instagramService.getUserPosts(username, cursor);
      
      if (response.success && response.data) {
        if (cursor) {
          setPosts(prev => [...prev, ...response.data!]);
        } else {
          setPosts(response.data);
        }
        setNextCursor(response.next_cursor);
        setHasMore(!!response.next_cursor);
      } else {
        setError(response.error || 'Erreur lors du chargement des posts');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [username, isViews]); // Dépendances pour useCallback

  useEffect(() => {
    // Ne recharger que si le username a vraiment changé
    if (username && username !== lastUsername) {
      console.log('🔄 Username changé, rechargement des posts:', username);
      setLastUsername(username);
      setPosts([]); // Vider les posts précédents
      setSelectedPosts([]); // Vider la sélection
      setError(null);
      loadPosts();
    }
  }, [username, lastUsername, loadPosts]);

  const handlePostSelect = (post: InstagramPost) => {
    setSelectedPosts(prev => {
      const isSelected = prev.some(p => p.id === post.id);
      if (isSelected) {
        return prev.filter(p => p.id !== post.id);
      } else {
        return [...prev, post];
      }
    });
  };

  const handleConfirmSelection = () => {
    if (selectedPosts.length === 0) {
      alert(`Veuillez sélectionner au moins un ${isViews ? 'reel' : 'post'}`);
      return;
    }

    if (isViews || isComments) {
      // Pour les vues et commentaires, on passe le prix par post (qui sera multiplié par le nombre de posts)
      onPostsSelect(selectedPosts, pricePerPost);
    } else {
      // Pour les likes, on divise le nombre total sur les posts sélectionnés
      const likesPerPost = Math.floor(totalLikes / selectedPosts.length);
      const remainingLikes = totalLikes % selectedPosts.length;

      // Répartir les likes restants sur les premiers posts
      const postsWithLikes = selectedPosts.map((post, index) => ({
        ...post,
        likesToAdd: likesPerPost + (index < remainingLikes ? 1 : 0)
      }));

      onPostsSelect(postsWithLikes, likesPerPost);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && !loadingRef.current && hasMore) {
      console.log('📄 Chargement de plus de posts...');
      // Essayer de charger plus de posts même sans cursor
      // Utiliser l'ID du dernier post comme cursor alternatif
      const lastPostId = posts.length > 0 ? posts[posts.length - 1].id : null;
      loadPosts(nextCursor || lastPostId || 'load_more');
    }
  }, [loadingMore, hasMore, nextCursor, posts.length, loadPosts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        <span className="ml-3 text-gray-600">Chargement des {isViews ? 'reels' : 'posts'}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">❌ {error}</div>
        <button
          onClick={() => {
            if (!loadingRef.current) {
              loadPosts();
            }
          }}
          disabled={loadingRef.current}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingRef.current ? 'Chargement...' : 'Réessayer'}
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">Aucun {isViews ? 'reel' : 'post'} trouvé pour @{username}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec informations */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{isViews ? 'Reels' : 'Posts'} de @{username}</h3>
            <p className="text-sm text-gray-600">
              {selectedPosts.length} {isViews ? 'reel' : 'post'}{selectedPosts.length > 1 ? 's' : ''} sélectionné{selectedPosts.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            {isViews ? (
              <>
                <div className="text-sm text-gray-600">{totalLikes.toLocaleString()} vues par reel</div>
                <div className="text-lg font-bold text-purple-600">{pricePerPost.toFixed(2)}€/reel</div>
                {selectedPosts.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Total: {(pricePerPost * selectedPosts.length).toFixed(2)}€
                  </div>
                )}
              </>
            ) : isComments ? (
              <>
                <div className="text-sm text-gray-600">{totalLikes.toLocaleString()} commentaires par post</div>
                <div className="text-lg font-bold text-blue-600">{pricePerPost.toFixed(2)}€/post</div>
                {selectedPosts.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Total: {(pricePerPost * selectedPosts.length).toFixed(2)}€
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-sm text-gray-600">Total likes à répartir:</div>
                <div className="text-lg font-bold text-pink-600">{totalLikes.toLocaleString()}</div>
                {selectedPosts.length > 0 && (
                  <div className="text-xs text-gray-500">
                    ~{Math.floor(totalLikes / selectedPosts.length)} likes/post
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grille des posts */}
      <div className="grid grid-cols-4 gap-3">
        {posts.map((post, index) => {
          const isSelected = selectedPosts.some(p => p.id === post.id);
          const likesPerPost = selectedPosts.length > 0 ? Math.floor(totalLikes / selectedPosts.length) : 0;
          
          return (
            <div
              key={`${post.id}_${index}`}
              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-4 ring-pink-500 shadow-lg scale-105' 
                  : 'hover:shadow-md hover:scale-102'
              }`}
              onClick={() => handlePostSelect(post)}
            >
              {/* Image du post */}
              <img
                src={post.media_url ? `https://images.weserv.nl/?url=${encodeURIComponent(post.media_url)}&w=400&h=400&fit=cover` : 
                     post.thumbnail_url ? `https://images.weserv.nl/?url=${encodeURIComponent(post.thumbnail_url)}&w=400&h=400&fit=cover` : 
                     '/placeholder-post.jpg'}
                alt="Post Instagram"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log('❌ Erreur de chargement d\'image:', target.src);
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
                onLoad={() => {
                  console.log('✅ Image chargée avec proxy');
                }}
              />

              {/* Overlay de sélection */}
              {isSelected && (
                <div className={`absolute inset-0 ${isViews ? 'bg-purple-500' : isComments ? 'bg-blue-500' : 'bg-pink-500'} bg-opacity-20 flex items-center justify-center`}>
                  <div className={`${isViews ? 'bg-purple-500' : isComments ? 'bg-blue-500' : 'bg-pink-500'} text-white rounded-full p-2`}>
                    {isViews ? (
                      <div className="w-6 h-6 text-white text-center leading-6">👁️</div>
                    ) : isComments ? (
                      <MessageCircle className="w-6 h-6 fill-current" />
                    ) : (
                      <Heart className="w-6 h-6 fill-current" />
                    )}
                  </div>
                </div>
              )}

              {/* Indicateur de sélection */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className={`${isViews ? 'bg-purple-500' : isComments ? 'bg-blue-500' : 'bg-pink-500'} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold`}>
                    ✓
                  </div>
                </div>
              )}

              {/* Informations du post */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-3 h-3" />
                    <span>{post.like_count?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-3 h-3" />
                    <span>{post.comment_count?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>

              {/* Badge pour les likes/vues/commentaires à ajouter */}
              {isSelected && (
                <div className="absolute top-2 left-2">
                  <div className={`${isViews ? 'bg-purple-500' : isComments ? 'bg-blue-500' : 'bg-pink-500'} text-white px-2 py-1 rounded text-xs font-bold`}>
                    +{isViews || isComments ? totalLikes : likesPerPost}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bouton "Voir plus" */}
      {(hasMore || (posts.length >= 12 && !nextCursor)) && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Chargement...
              </>
            ) : (
              'Voir plus (12 suivants)'
            )}
          </button>
        </div>
      )}

      {/* Bouton de confirmation */}
      {selectedPosts.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleConfirmSelection}
            className={`bg-gradient-to-r ${isViews ? 'from-purple-600 to-pink-600' : isComments ? 'from-blue-600 to-indigo-600' : 'from-pink-600 to-red-600'} text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          >
            {isViews ? (
              <div className="w-5 h-5 inline mr-2 text-center leading-5">👁️</div>
            ) : isComments ? (
              <MessageCircle className="w-5 h-5 inline mr-2" />
            ) : (
              <Heart className="w-5 h-5 inline mr-2" />
            )}
            Confirmer la sélection ({selectedPosts.length} {isViews ? 'reels' : 'posts'})
          </button>
        </div>
      )}
    </div>
  );
}

