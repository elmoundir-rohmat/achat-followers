/**
 * Service Client Instagram - Appelle les API Routes Vercel
 * 
 * Ce service côté client appelle les API routes Vercel
 * au lieu d'appeler directement l'API StarAPI/RapidAPI.
 * La clé RapidAPI reste côté serveur et n'est jamais exposée.
 */

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
  /**
   * Récupérer les posts Instagram d'un utilisateur via API Route sécurisée
   */
  async getUserPosts(username: string, cursor?: string): Promise<InstagramPostsResponse> {
    try {
      console.log('📸 Récupération des posts Instagram (client → serveur):', username);

      // Appel à l'API route Vercel (sécurisée)
      const response = await fetch('/api/instagram/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          cursor
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API route:', errorData);
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      console.log('✅ Posts récupérés via API route:', data.data?.length || 0);

      return {
        success: data.success,
        data: data.data,
        next_cursor: data.next_cursor
      };

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel API route (posts):', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
      };
    }
  }

  /**
   * Récupérer les reels/clips Instagram d'un utilisateur via API Route sécurisée
   */
  async getUserClips(username: string, count: number = 12): Promise<InstagramPostsResponse> {
    try {
      console.log('🎬 Récupération des reels Instagram (client → serveur):', username);

      // Appel à l'API route Vercel (sécurisée)
      const response = await fetch('/api/instagram/clips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          count
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API route:', errorData);
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      console.log('✅ Reels récupérés via API route:', data.data?.length || 0);

      return {
        success: data.success,
        data: data.data,
        next_cursor: data.next_cursor
      };

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel API route (clips):', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
      };
    }
  }
}

// Instance singleton
export const instagramServiceClient = new InstagramServiceClient();
