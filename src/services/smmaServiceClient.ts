// Service Client SMMA - Appelle les API routes Vercel (sécurisé)
// Les clés API ne sont JAMAIS exposées au client

import { getSMMAServiceId } from '../config/smmaMapping';

export interface SMMAOrder {
  username: string;
  followers: number;
  followerType: 'french' | 'international' | 'likes_french' | 'likes_international' | 'comments_french' | 'comments_international' | 'views_french' | 'views_international' | 'tiktok_french' | 'tiktok_international';
  orderId: string;
  paymentId: string;
  postId?: string;
  likesToAdd?: number;
  commentsToAdd?: number;
  viewsToAdd?: number;
  runs?: number;
  interval?: number;
  platform?: 'instagram' | 'tiktok';
}

export interface SMMAResponse {
  success: boolean;
  order_id?: string;
  smma_order_id?: string;
  message?: string;
  error?: string;
}

class SMMAServiceClient {
  private apiEndpoint = '/api/smma/order';

  /**
   * Commande des followers sur la plateforme SMMA (via API route serveur)
   */
  async orderFollowers(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande SMMA (via API route):', order);

      const serviceId = getSMMAServiceId(order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour le type: ${order.followerType}`
        };
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: 'instagram_followers',
          serviceId: serviceId,
          link: `https://instagram.com/${order.username}`,
          quantity: order.followers,
          orderId: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erreur lors de la commande'
        };
      }

      const data = await response.json();
      console.log('✅ Réponse API route:', data);

      return data;

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel API route:', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des likes (via API route serveur)
   */
  async orderLikes(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const serviceId = getSMMAServiceId(order.followerType === 'french' ? 'likes_french' : 'likes_international');
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour les likes ${order.followerType}`
        };
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: 'instagram_likes',
          serviceId: serviceId,
          link: order.postId ? `https://instagram.com/p/${order.postId}` : `https://instagram.com/${order.username}`,
          quantity: order.likesToAdd || order.followers,
          orderId: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erreur lors de la commande'
        };
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Erreur:', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des commentaires (via API route serveur)
   */
  async orderComments(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const serviceId = getSMMAServiceId(order.followerType === 'french' ? 'comments_french' : 'comments_international');
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour les commentaires ${order.followerType}`
        };
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: 'instagram_comments',
          serviceId: serviceId,
          link: order.postId ? `https://instagram.com/p/${order.postId}` : `https://instagram.com/${order.username}`,
          quantity: order.commentsToAdd || order.followers,
          orderId: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erreur lors de la commande'
        };
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Erreur:', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des vues (via API route serveur)
   */
  async orderViews(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const serviceId = getSMMAServiceId(order.followerType === 'french' ? 'views_french' : 'views_international');
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour les vues ${order.followerType}`
        };
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: 'instagram_views',
          serviceId: serviceId,
          link: order.postId ? `https://instagram.com/reel/${order.postId}` : `https://instagram.com/${order.username}`,
          quantity: order.viewsToAdd || order.followers,
          orderId: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erreur lors de la commande'
        };
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Erreur:', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commander des followers TikTok (via API route serveur)
   */
  async orderTikTokFollowers(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const serviceId = getSMMAServiceId(order.followerType);
      if (!serviceId) {
        return { success: false, error: `Service SMMA non trouvé pour le type: ${order.followerType}` };
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: 'tiktok_followers',
          serviceId: serviceId,
          link: order.username,
          quantity: order.followers,
          runs: order.runs,
          interval: order.interval,
          orderId: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erreur lors de la commande'
        };
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Erreur:', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des likes TikTok (via API route serveur)
   */
  async orderTikTokLikes(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const serviceId = getSMMAServiceId(order.followerType);
      if (!serviceId) {
        return { success: false, error: `Service SMMA non trouvé pour le type: ${order.followerType}` };
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: 'tiktok_likes',
          serviceId: serviceId,
          link: order.username,
          quantity: order.followers,
          runs: order.runs,
          interval: order.interval,
          orderId: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Erreur lors de la commande'
        };
      }

      return await response.json();

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
export const smmaServiceClient = new SMMAServiceClient();

