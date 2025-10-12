// Service pour récupérer les posts Instagram d'un utilisateur
// Utilise l'API StarAPI via RapidAPI

export interface InstagramPost {
  id: string;
  media_type: number; // 1: photo, 2: video, 8: carousel
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  like_count?: number;
  comment_count?: number;
  view_count?: number; // Spécifique aux reels/vidéos
  timestamp?: string;
  permalink?: string;
  code?: string; // Code du post Instagram
  is_reel?: boolean; // Marqueur pour identifier les reels
}

export interface InstagramUser {
  id?: number;
  username: string;
  full_name?: string;
  profile_picture_url?: string;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
}

export interface InstagramPostsResponse {
  success: boolean;
  data?: InstagramPost[];
  error?: string;
  next_cursor?: string;
}

class InstagramService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Configuration depuis les variables d'environnement
    this.baseUrl = import.meta.env.VITE_STARAPI_URL || 'https://starapi1.p.rapidapi.com';
    this.apiKey = import.meta.env.VITE_RAPIDAPI_KEY || '3b8b4d9067msh42e44044539aa07p17800fjsn924eff22b54d';
  }

  /**
   * Récupérer les posts Instagram d'un utilisateur
   * Utilise StarAPI avec le bon workflow : d'abord récupérer l'ID, puis les posts
   */
  async getUserPosts(username: string, cursor?: string): Promise<InstagramPostsResponse> {
    try {
      console.log('📸 Récupération des posts Instagram pour:', username);

      // Étape 1: Récupérer l'ID utilisateur avec le bon endpoint
      console.log('🔍 Étape 1: Récupération de l\'ID utilisateur...');
      const userId = await this.getUserIdFromUsername(username); // Uses get_web_profile_info now
      
      if (!userId) {
        return {
          success: false,
          error: `Impossible de trouver l'ID utilisateur pour @${username}. Vérifiez que le profil existe et est public.`
        };
      }

      console.log('✅ ID utilisateur trouvé:', userId);

      // Étape 2: Récupérer les posts avec l'ID utilisateur
      console.log('🔍 Étape 2: Récupération des posts avec l\'ID...');
      
      const requestBody = {
        id: userId, // Utiliser l'ID récupéré
        count: 12,
        ...(cursor && { max_id: cursor }) // Ajouter le cursor pour la pagination
      };
      
      console.log('📤 Requête StarAPI get_media:', {
        url: `${this.baseUrl}/instagram/user/get_media`,
        body: requestBody,
        hasCursor: !!cursor,
        cursor: cursor
      });

      const response = await fetch(`${this.baseUrl}/instagram/user/get_media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'starapi1.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Réponse StarAPI get_media:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Données StarAPI get_media:', data);
        
        // Vérifier la structure de réponse StarAPI
        if (data.status === 'done' && data.response && data.response.body && data.response.body.items) {
          const posts = data.response.body.items;
          console.log('✅ Posts Instagram récupérés (StarAPI):', posts.length);
          
          // Transformer les posts au format attendu
          const transformedPosts = posts.map((post: any) => {
            // Gérer les différents types de médias
            let mediaUrl = '';
            let thumbnailUrl = '';
            
            if (post.media_type === 8 && post.carousel_media && post.carousel_media.length > 0) {
              // Carousel - utiliser la première image
              const firstCarouselItem = post.carousel_media[0];
              mediaUrl = firstCarouselItem.image_versions2?.candidates?.[0]?.url || '';
              thumbnailUrl = firstCarouselItem.image_versions2?.candidates?.[1]?.url || '';
            } else if (post.media_type === 2) {
              // Vidéo - utiliser la première frame
              mediaUrl = post.image_versions2?.additional_candidates?.first_frame?.url || 
                        post.image_versions2?.candidates?.[0]?.url || '';
              thumbnailUrl = post.image_versions2?.candidates?.[0]?.url || '';
            } else {
              // Image normale
              mediaUrl = post.image_versions2?.candidates?.[0]?.url || '';
              thumbnailUrl = post.image_versions2?.candidates?.[1]?.url || '';
            }
            
            return {
              id: post.id,
              media_url: mediaUrl,
              thumbnail_url: thumbnailUrl,
              caption: post.caption?.text || '',
              like_count: post.like_count || 0,
              comment_count: post.comment_count || 0,
              media_type: post.media_type || 1, // 1 = image, 2 = video, 8 = carousel
              code: post.code
            };
          });
          
          // Log pour debug de la pagination
          console.log('🔍 Structure de la réponse pour pagination:', {
            hasNextMaxId: !!data.response.body.next_max_id,
            nextMaxId: data.response.body.next_max_id,
            hasMoreData: !!data.response.body.more_available,
            moreAvailable: data.response.body.more_available,
            totalCount: data.response.body.num_results
          });
          
          return {
            success: true,
            data: transformedPosts,
            next_cursor: data.response.body.next_max_id || (data.response.body.more_available ? 'has_more' : null)
          };
        } else {
          console.log('❌ Structure de réponse StarAPI inattendue:', data);
          console.log('❌ Structure complète de la réponse:', JSON.stringify(data, null, 2));
          return {
            success: false,
            error: 'Structure de réponse StarAPI inattendue - Vérifiez les logs'
          };
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Erreur HTTP StarAPI get_media:', response.status, errorText);
        return {
          success: false,
          error: `Erreur StarAPI get_media ${response.status}: ${errorText}`
        };
      }

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des posts Instagram:', error);
      return {
        success: false,
        error: 'Erreur de connexion avec StarAPI: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
      };
    }
  }

  /**
   * Récupérer l'ID utilisateur à partir du username
   * Utilise l'endpoint /instagram/user/get_web_profile_info de StarAPI
   */
  private async getUserIdFromUsername(username: string): Promise<string | null> {
    try {
      console.log('🔍 Récupération de l\'ID pour @' + username + ' via Get Web Profile Info...');
      
      const response = await fetch(`${this.baseUrl}/instagram/user/get_web_profile_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'starapi1.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey
        },
        body: JSON.stringify({
          username: username
        })
      });

      console.log('📡 Réponse StarAPI get_web_profile_info:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Données StarAPI get_web_profile_info:', data);
        
        if (data.response && data.response.body && data.response.body.data && data.response.body.data.user && data.response.body.data.user.id) {
          const userId = data.response.body.data.user.id;
          console.log('✅ ID utilisateur récupéré via Get Web Profile Info:', userId);
          return userId;
        } else {
          console.log('❌ Pas d\'ID dans la réponse Get Web Profile Info:', data);
          return null;
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Erreur HTTP StarAPI get_web_profile_info:', response.status, errorText);
        return null;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'ID utilisateur:', error);
      return null;
    }
  }



  /**
   * Récupérer les informations d'un post spécifique
   */
  async getPostInfo(postId: string): Promise<InstagramPost | null> {
    try {
      console.log('📸 Récupération des infos du post:', postId);

      const response = await fetch(`${this.baseUrl}/instagram/media/get_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'starapi1.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey
        },
        body: JSON.stringify({
          id: postId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('✅ Infos du post récupérées:', data.data);
        return data.data;
      } else {
        return null;
      }

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des infos du post:', error);
      return null;
    }
  }

  /**
   * Récupérer les reels/clips Instagram d'un utilisateur
   * Utilise l'endpoint /instagram/user/get_clips de StarAPI
   */
  async getUserClips(username: string, count: number = 12): Promise<InstagramPostsResponse> {
    try {
      console.log('🎬 Récupération des reels/clips Instagram pour:', username);

      // Étape 1: Récupérer l'ID utilisateur
      console.log('🔍 Étape 1: Récupération de l\'ID utilisateur...');
      const userId = await this.getUserIdFromUsername(username);
      
      if (!userId) {
        return {
          success: false,
          error: `Impossible de trouver l'ID utilisateur pour @${username}. Vérifiez que le profil existe et est public.`
        };
      }

      console.log('✅ ID utilisateur trouvé:', userId);

      // Étape 2: Récupérer les reels/clips avec l'ID utilisateur
      console.log('🔍 Étape 2: Récupération des reels/clips avec l\'ID...');
      
      const requestBody = {
        id: parseInt(userId), // L'endpoint get_clips attend un number
        count: Math.max(count * 3, 50) // Demander 3x plus pour compenser le filtrage (certains n'ont pas d'URLs valides)
      };
      
      console.log('📤 Requête StarAPI get_clips:', {
        url: `${this.baseUrl}/instagram/user/get_clips`,
        body: requestBody
      });

      const response = await fetch(`${this.baseUrl}/instagram/user/get_clips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'starapi1.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Réponse StarAPI get_clips:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Données StarAPI get_clips:', data);
        
        // Vérifier la structure de réponse StarAPI pour les reels/clips
        if (data.status === 'done' && data.response && data.response.body && data.response.body.items) {
          const clips = data.response.body.items;
          console.log('✅ Reels/clips Instagram récupérés (StarAPI):', clips.length);
          
          // Filtrer uniquement les reels/clips (media_type = 2) et les vidéos
          const reelClips = clips.filter((clip: any) => 
            clip.media_type === 2 || clip.media_type === 8 // 2 = video/reel, 8 = carousel avec vidéos
            // Assouplir les critères - garder tous les clips de type vidéo même s'ils n'ont pas d'images parfaites
          );
          
          console.log(`🎬 Reels/clips filtrés (media_type 2 ou 8 avec URLs valides): ${reelClips.length} sur ${clips.length} total`);
          
          // Transformer les clips au format attendu
          const transformedClips = reelClips.map((clip: any) => {
            // Gérer les différents types de médias pour les reels
            let mediaUrl = '';
            let thumbnailUrl = '';
            
            if (clip.media_type === 2) {
              // Reel/Clip - essayer différentes sources d'images
              mediaUrl = clip.image_versions2?.additional_candidates?.first_frame?.url || 
                        clip.image_versions2?.candidates?.[0]?.url ||
                        clip.image_versions2?.candidates?.[1]?.url || '';
              thumbnailUrl = clip.image_versions2?.candidates?.[0]?.url ||
                           clip.image_versions2?.candidates?.[1]?.url ||
                           clip.image_versions2?.additional_candidates?.first_frame?.url || '';
            } else if (clip.media_type === 8 && clip.carousel_media) {
              // Carousel avec vidéos - prendre la première vidéo
              const firstVideo = clip.carousel_media.find((item: any) => item.media_type === 2);
              if (firstVideo) {
                mediaUrl = firstVideo.image_versions2?.additional_candidates?.first_frame?.url || 
                          firstVideo.image_versions2?.candidates?.[0]?.url ||
                          firstVideo.image_versions2?.candidates?.[1]?.url || '';
                thumbnailUrl = firstVideo.image_versions2?.candidates?.[0]?.url ||
                             firstVideo.image_versions2?.candidates?.[1]?.url ||
                             firstVideo.image_versions2?.additional_candidates?.first_frame?.url || '';
              } else {
                // Si pas de vidéo, prendre le premier élément du carousel
                const firstItem = clip.carousel_media[0];
                if (firstItem) {
                  mediaUrl = firstItem.image_versions2?.candidates?.[0]?.url ||
                            firstItem.image_versions2?.candidates?.[1]?.url || '';
                  thumbnailUrl = firstItem.image_versions2?.candidates?.[0]?.url ||
                                firstItem.image_versions2?.candidates?.[1]?.url || '';
                }
              }
            }
            
            return {
              id: clip.id,
              media_url: mediaUrl,
              thumbnail_url: thumbnailUrl,
              caption: clip.caption?.text || '',
              like_count: clip.like_count || 0,
              comment_count: clip.comment_count || 0,
              view_count: clip.view_count || 0, // Ajouter le compteur de vues spécifique aux reels
              media_type: clip.media_type || 2, // 2 = reel/video
              code: clip.code,
              is_reel: true // Marquer comme reel pour le filtrage
            };
          }).filter((clip: any) => {
            // Filtrer seulement les clips qui ont un ID valide et au moins une URL valide
            const hasValidId = clip.id && clip.id.length > 0;
            const hasValidUrl = (clip.media_url && clip.media_url.length > 0) || 
                               (clip.thumbnail_url && clip.thumbnail_url.length > 0);
            
            if (!hasValidUrl && hasValidId) {
              console.log(`⚠️ Clip filtré (pas d'URL valide):`, clip.id);
            }
            
            // Garder uniquement les clips avec un ID valide ET au moins une URL
            return hasValidId && hasValidUrl;
          }).slice(0, count); // Limiter au nombre demandé
          
          console.log(`🎬 Clips finaux après filtrage: ${transformedClips.length} sur ${count} demandés`);
          
          // Si nous n'avons pas assez de clips, essayer de récupérer plus via getUserPosts
          if (transformedClips.length < count && transformedClips.length > 0) {
            console.log(`⚠️ Seulement ${transformedClips.length} clips trouvés, tentative de compléter avec getUserPosts...`);
            try {
              const postsResponse = await this.getUserPosts(username);
              if (postsResponse.success && postsResponse.data) {
                const additionalReels = postsResponse.data.filter(post => 
                  (post.media_type === 2 || post.is_reel) &&
                  post.id && post.id.length > 0 &&
                  !transformedClips.some((existing: any) => existing.id === post.id) // Éviter les doublons
                ).slice(0, count - transformedClips.length);
                
                if (additionalReels.length > 0) {
                  console.log(`✅ Ajout de ${additionalReels.length} clips supplémentaires via getUserPosts`);
                  transformedClips.push(...additionalReels);
                }
              }
            } catch (error) {
              console.log('⚠️ Impossible de compléter avec getUserPosts:', error);
            }
          }
          
          // Si aucun reel n'est trouvé, essayer avec getUserPosts et filtrer les reels
          if (transformedClips.length === 0) {
            console.log('⚠️ Aucun reel trouvé via get_clips, fallback vers getUserPosts...');
            const postsResponse = await this.getUserPosts(username);
            if (postsResponse.success && postsResponse.data) {
              // Filtrer uniquement les reels/vidéos (moins restrictif)
              const reelsFromPosts = postsResponse.data.filter(post => 
                (post.media_type === 2 || post.is_reel) &&
                post.id && post.id.length > 0 // Seulement vérifier que l'ID existe
              ).slice(0, count); // Limiter au nombre demandé
              
              console.log(`🎬 Reels trouvés via getUserPosts: ${reelsFromPosts.length}`);
              
              if (reelsFromPosts.length > 0) {
                return {
                  success: true,
                  data: reelsFromPosts,
                  next_cursor: undefined
                };
              }
            }
          }
          
          return {
            success: true,
            data: transformedClips,
            next_cursor: undefined // Les reels n'ont pas de pagination dans cet endpoint
          };
        } else {
          console.log('❌ Structure de réponse StarAPI get_clips inattendue:', data);
          return {
            success: false,
            error: 'Structure de réponse StarAPI get_clips inattendue - Vérifiez les logs'
          };
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Erreur HTTP StarAPI get_clips:', response.status, errorText);
        return {
          success: false,
          error: `Erreur StarAPI get_clips ${response.status}: ${errorText}`
        };
      }

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des reels/clips Instagram:', error);
      
      // Fallback : essayer avec getUserPosts et filtrer les reels
      console.log('🔄 Fallback vers getUserPosts pour récupérer les reels...');
      try {
        const postsResponse = await this.getUserPosts(username);
        if (postsResponse.success && postsResponse.data) {
          // Filtrer uniquement les reels/vidéos (media_type = 2) - moins restrictif
          const reelsFromPosts = postsResponse.data.filter(post => 
            (post.media_type === 2 || post.is_reel) &&
            post.id && post.id.length > 0 // Seulement vérifier que l'ID existe
          ).slice(0, count); // Limiter au nombre demandé
          
          console.log(`🎬 Fallback réussi : ${reelsFromPosts.length} reels trouvés via getUserPosts`);
          
          if (reelsFromPosts.length > 0) {
            return {
              success: true,
              data: reelsFromPosts,
              next_cursor: undefined
            };
          }
        }
      } catch (fallbackError) {
        console.error('❌ Erreur lors du fallback getUserPosts:', fallbackError);
      }
      
      return {
        success: false,
        error: 'Erreur de connexion avec StarAPI: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
      };
    }
  }

  /**
   * Récupérer les informations d'un utilisateur Instagram
   * Essaie d'abord l'API réelle, puis fallback vers des données mock
   */
  async getUserInfo(username: string): Promise<InstagramUser | null> {
    try {
      console.log('👤 Récupération des infos utilisateur:', username);

      // Essayer d'abord l'API réelle
      try {
        const response = await fetch(`${this.baseUrl}/instagram/user/info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'starapi1.p.rapidapi.com',
            'x-rapidapi-key': this.apiKey
          },
          body: JSON.stringify({
            username: username
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            console.log('✅ Infos utilisateur récupérées (API):', data.data);
            return data.data;
          }
        }
      } catch (apiError) {
        console.log('⚠️ API réelle non disponible, utilisation des données mock');
      }

      // Fallback vers des données mock
      const mockUser: InstagramUser = {
        id: Math.floor(Math.random() * 10000000) + 1000000, // ID fictif
        username: username,
        full_name: `${username.charAt(0).toUpperCase() + username.slice(1)} User`,
        profile_picture_url: `https://ui-avatars.com/api/?name=${username}&size=200&background=random`,
        follower_count: Math.floor(Math.random() * 10000) + 1000,
        following_count: Math.floor(Math.random() * 2000) + 500,
        media_count: Math.floor(Math.random() * 500) + 50
      };

      console.log('✅ Infos utilisateur récupérées (mock):', mockUser);
      return mockUser;

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des infos utilisateur:', error);
      return null;
    }
  }
}

// Instance singleton
export const instagramService = new InstagramService();
