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
  timestamp?: string;
  permalink?: string;
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
   * Fallback vers des posts fictifs pour la démonstration
   */
  private async getMockUserPosts(username: string, cursor?: string): Promise<InstagramPostsResponse> {
    try {
      console.log('🎭 Génération des posts mock pour:', username);
      
      const mockPosts: InstagramPost[] = this.generateMockPosts(username, cursor);
      
      // Simuler un délai d'API réaliste
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('✅ Posts Instagram récupérés (mock):', mockPosts.length);
      return {
        success: true,
        data: mockPosts,
        next_cursor: mockPosts.length >= 12 ? 'next_page_cursor' : undefined
      };
    } catch (error) {
      console.error('❌ Erreur dans la génération des posts mock:', error);
      // En dernier recours, retourner des posts basiques
      return {
        success: true,
        data: [{
          id: `${username}_fallback_post`,
          media_type: 1,
          media_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
          thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
          caption: `Post de démonstration pour @${username}`,
          like_count: 150,
          comment_count: 25,
          timestamp: new Date().toISOString(),
          permalink: `https://instagram.com/p/fallback_${username}`
        }],
        next_cursor: undefined
      };
    }
  }

  /**
   * Générer des posts fictifs pour la démonstration
   */
  private generateMockPosts(username: string, cursor?: string): InstagramPost[] {
    const posts: InstagramPost[] = [];
    const startIndex = cursor ? 12 : 0; // Simuler la pagination
    
    // Images de démonstration plus réalistes
    const demoImages = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop'
    ];
    
    const captions = [
      `Beautiful sunset from my window 🌅 #${username}`,
      `Coffee time ☕ #coffee #${username}`,
      `Weekend vibes 🎉 #weekend #${username}`,
      `New adventure begins! 🚀 #adventure #${username}`,
      `Foodie moment 🍕 #food #${username}`,
      `Nature walk 🌿 #nature #${username}`,
      `City lights ✨ #city #${username}`,
      `Morning routine 🌅 #morning #${username}`,
      `Travel memories ✈️ #travel #${username}`,
      `Work from home setup 💻 #work #${username}`,
      `Gym session 💪 #fitness #${username}`,
      `Evening chill 🌆 #evening #${username}`
    ];
    
    for (let i = 0; i < 12; i++) {
      const postIndex = startIndex + i;
      const imageIndex = postIndex % demoImages.length;
      
      posts.push({
        id: `${username}_post_${postIndex}`,
        media_type: Math.random() > 0.3 ? 1 : 2, // 70% photos, 30% vidéos
        media_url: demoImages[imageIndex],
        thumbnail_url: demoImages[imageIndex],
        caption: captions[imageIndex] || `Post ${postIndex + 1} de @${username}`,
        like_count: Math.floor(Math.random() * 1500) + 100,
        comment_count: Math.floor(Math.random() * 150) + 10,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        permalink: `https://instagram.com/p/mock_post_${postIndex}`
      });
    }
    
    return posts;
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
