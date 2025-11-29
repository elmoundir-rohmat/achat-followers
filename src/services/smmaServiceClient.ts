/**
 * Service Client - Appelle l'API Route Vercel
 * 
 * Ce service côté client appelle l'API route /api/smma/order
 * au lieu d'appeler directement l'API externe.
 * La clé API reste côté serveur et n'est jamais exposée.
 */

export interface SMMAOrder {
  username: string;
  followers: number;
  followerType: 'french' | 'international' | 'premium' | 'random' | 'custom'; // Pour les followers (premium pour TikTok, random/custom pour TikTok comments)
  serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_comments' | 'tiktok_views'; // Type de service
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

import { getSMMAServiceId, getServiceDescription, getServiceId } from '../config/smmaMapping';

class SMMAServiceClient {
  /**
   * Commande des followers via API Route sécurisée
   */
  async orderFollowers(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const serviceId = getSMMAServiceId(order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service non trouvé pour le type: ${order.followerType}`
        };
      }

      const cleanUsername = order.username.replace('@', '');
      
      const requestData = {
        action: 'followers',
        service_id: serviceId.toString(),
        link: `https://instagram.com/${cleanUsername}`,
        quantity: order.followers,
        order_id: order.orderId
      };

      // Appel à l'API route Vercel (sécurisée)
      const response = await fetch('/api/smma/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();

      return {
        success: data.success,
        order_id: data.order_id,
        smma_order_id: data.smma_order_id,
        message: data.message || `Commande créée avec succès pour @${order.username} (${order.followers} ${getServiceDescription(order.followerType)})`
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des likes
   */
  async orderLikes(order: SMMAOrder): Promise<SMMAResponse> {
    try {

      // Utiliser la nouvelle méthode avec serviceType et followerType séparés
      const serviceId = getServiceId(order.serviceType, order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service non trouvé pour les likes ${order.followerType}`
        };
      }

      const response = await fetch('/api/smma/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'likes',
          service_id: serviceId.toString(),
          link: order.postId ? `https://instagram.com/p/${order.postId}` : `https://instagram.com/${order.username.replace('@', '')}`,
          quantity: order.likesToAdd || order.followers,
          order_id: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        order_id: data.order_id,
        smma_order_id: data.smma_order_id,
        message: data.message
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des commentaires
   */
  async orderComments(order: SMMAOrder): Promise<SMMAResponse> {
    try {

      // Utiliser la nouvelle méthode avec serviceType et followerType séparés
      const serviceId = getServiceId(order.serviceType, order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service non trouvé pour les commentaires ${order.followerType}`
        };
      }

      const response = await fetch('/api/smma/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'comments',
          service_id: serviceId.toString(),
          link: order.postId ? `https://instagram.com/p/${order.postId}` : `https://instagram.com/${order.username.replace('@', '')}`,
          quantity: order.commentsToAdd || order.followers,
          order_id: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        order_id: data.order_id,
        smma_order_id: data.smma_order_id,
        message: data.message
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des vues Instagram
   */
  async orderViews(order: SMMAOrder): Promise<SMMAResponse> {
    try {

      // Utiliser la nouvelle méthode avec serviceType et followerType séparés
      const serviceId = getServiceId(order.serviceType, order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service non trouvé pour les vues ${order.followerType}`
        };
      }

      const response = await fetch('/api/smma/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'views',
          service_id: serviceId.toString(),
          link: order.postId ? `https://instagram.com/reel/${order.postId}` : `https://instagram.com/${order.username.replace('@', '')}`,
          quantity: order.viewsToAdd || order.followers,
          order_id: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        order_id: data.order_id,
        smma_order_id: data.smma_order_id,
        message: data.message
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commander des followers TikTok
   */
  async orderTikTokFollowers(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const followerTypeForService = order.followerType === 'premium' ? 'international' : order.followerType;
      const serviceId = getServiceId('tiktok_followers', followerTypeForService as 'french' | 'international');
      
      if (!serviceId) {
        return { success: false, error: `Service non trouvé pour le type: tiktok_followers ${order.followerType}` };
      }

      const response = await fetch('/api/smma/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'tiktok_followers',
          service_id: serviceId.toString(),
          link: order.username, // URL complète du profil TikTok (ex: https://tiktok.com/@username)
          quantity: order.followers,
          runs: order.runs,
          interval: order.interval,
          order_id: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        order_id: data.order_id,
        smma_order_id: data.smma_order_id,
        message: data.message
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des vues TikTok
   */
  async orderTikTokViews(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const followerTypeForService = order.followerType === 'premium' ? 'international' : order.followerType;
      const serviceId = getServiceId('tiktok_views', followerTypeForService as 'french' | 'international');
      if (!serviceId) {
        return { success: false, error: `Service non trouvé pour le type: tiktok_views ${order.followerType}` };
      }

      const response = await fetch('/api/smma/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'tiktok_views',
          service_id: serviceId.toString(),
          link: order.username, // URL complète de la vidéo TikTok (ex: https://tiktok.com/@user/video/123456)
          quantity: order.viewsToAdd || order.followers, // ✅ Utiliser viewsToAdd pour TikTok Views
          runs: order.runs,
          interval: order.interval,
          order_id: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        order_id: data.order_id,
        smma_order_id: data.smma_order_id,
        message: data.message
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des likes TikTok
   */
  async orderTikTokLikes(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const followerTypeForService = order.followerType === 'premium' ? 'international' : order.followerType;
      const serviceId = getServiceId('tiktok_likes', followerTypeForService as 'french' | 'international');
      if (!serviceId) {
        return { success: false, error: `Service non trouvé pour le type: tiktok_likes ${order.followerType}` };
      }

      const response = await fetch('/api/smma/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'tiktok_likes',
          service_id: serviceId.toString(),
          link: order.username, // URL complète de la vidéo TikTok (ex: https://tiktok.com/@user/video/123456)
          quantity: order.likesToAdd || order.followers,
          runs: order.runs,
          interval: order.interval,
          order_id: order.orderId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        order_id: data.order_id,
        smma_order_id: data.smma_order_id,
        message: data.message
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }

  /**
   * Commande des commentaires TikTok
   */
  async orderTikTokComments(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const followerTypeForService = order.followerType === 'random' ? 'random' : 
                                      order.followerType === 'custom' ? 'custom' : 
                                      (order.followerType === 'french' ? 'custom' : 'random');
      const serviceId = getServiceId('tiktok_comments', followerTypeForService as 'random' | 'custom');
      if (!serviceId) {
        return { success: false, error: `Service non trouvé pour le type: tiktok_comments ${order.followerType}` };
      }

      // Pour les commentaires TikTok, pas de drip feed (pas de runs/interval)
      const requestBody: any = {
        action: 'tiktok_comments',
        service_id: serviceId.toString(),
        link: order.username, // URL complète de la vidéo TikTok
        order_id: order.orderId
      };
      
      const isCustomComments = order.followerType === 'custom' && 
                                order.customComments && 
                                Array.isArray(order.customComments) &&
                                order.customComments.length > 0;
      
      if (isCustomComments) {
        requestBody.comments = order.customComments;
        delete requestBody.quantity;
      } else {
        const finalQuantity = order.commentsToAdd || order.followers;
        requestBody.quantity = finalQuantity;
        delete requestBody.comments;
      }

      const response = await fetch('/api/smma/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: data.success,
        order_id: data.order_id,
        smma_order_id: data.smma_order_id,
        message: data.message
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }
}

// Instance singleton
export const smmaServiceClient = new SMMAServiceClient();
