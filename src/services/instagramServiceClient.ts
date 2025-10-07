// Service Client Instagram - Appelle les API routes Vercel (sécurisé)
// Les clés API ne sont JAMAIS exposées au client

export interface InstagramPost {
  id: string;
  media_type: number;
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  like_count?: number;
  comment_count?: number;
  view_count?: number;
  timestamp?: string;
  permalink?: string;
  code?: string;
  is_reel?: boolean;
}

export interface InstagramPostsResponse {
  success: boolean;
  data?: InstagramPost[];
  error?: string;
  next_cursor?: string;
}

class InstagramServiceClient {
  private postsEndpoint = '/api/instagram/posts';
  private clipsEndpoint = '/api/instagram/clips';

  /**
   * Récupérer les posts Instagram (via API route serveur)
   */
  async getUserPosts(username: string, cursor?: string): Promise<InstagramPostsResponse> {
    try {
      console.log('📸 Récupération des posts Instagram (via API route):', username);

      const params = new URLSearchParams({ username });
      if (cursor) {
        params.append('cursor', cursor);
      }

      const response = await fetch(`${this.postsEndpoint}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erreur lors de la récupération des posts'
        };
      }

      const data = await response.json();
      console.log('✅ Posts récupérés:', data.data?.length || 0);

      return data;

    } catch (error) {
      console.error('❌ Erreur:', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Récupérer les reels/clips Instagram (via API route serveur)
   */
  async getUserClips(username: string, count: number = 12): Promise<InstagramPostsResponse> {
    try {
      console.log('🎬 Récupération des reels (via API route):', username);

      const params = new URLSearchParams({ 
        username,
        count: count.toString()
      });

      const response = await fetch(`${this.clipsEndpoint}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erreur lors de la récupération des reels'
        };
      }

      const data = await response.json();
      console.log('✅ Reels récupérés:', data.data?.length || 0);

      return data;

    } catch (error) {
      console.error('❌ Erreur:', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }
}

// Instance singleton
export const instagramServiceClient = new InstagramServiceClient();

