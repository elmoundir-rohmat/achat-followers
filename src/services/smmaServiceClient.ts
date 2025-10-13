/**
 * Service Client SMMA - Appelle l'API Route Vercel
 * 
 * Ce service côté client appelle l'API route /api/smma/order
 * au lieu d'appeler directement l'API SMMA.
 * La clé API reste côté serveur et n'est jamais exposée.
 */

export interface SMMAOrder {
  username: string;
  followers: number;
  followerType: 'french' | 'international'; // SEULEMENT pour les followers
  serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes'; // Type de service
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
   * Commande des followers sur la plateforme SMMA via API Route sécurisée
   */
  async orderFollowers(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande SMMA (client → serveur):', order);

      const serviceId = getSMMAServiceId(order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour le type: ${order.followerType}`
        };
      }

        // Nettoyer le username (enlever le @ s'il est présent)
        const cleanUsername = order.username.replace('@', '');
        
        const requestData = {
          action: 'followers',
          service_id: serviceId.toString(),
          link: `https://instagram.com/${cleanUsername}`,
          quantity: order.followers,
          order_id: order.orderId
        };

      console.log('📤 Données envoyées à l\'API route:', requestData);

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
        console.error('❌ Erreur API route:', errorData);
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`
        };
      }

      const data = await response.json();
      console.log('✅ Réponse API route:', data);

      return {
        success: data.success,
        order_id: data.order_id,
        smma_order_id: data.smma_order_id,
        message: data.message || `Commande créée avec succès pour @${order.username} (${order.followers} ${getServiceDescription(order.followerType)})`
      };

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel API route:', error);
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
      console.log('🚀 Envoi de la commande SMMA likes (client → serveur):', order);

      // Utiliser la nouvelle méthode avec serviceType et followerType séparés
      const serviceId = getServiceId(order.serviceType, order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour les likes ${order.followerType}`
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
      console.error('❌ Erreur lors de l\'appel API route (likes):', error);
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
      console.log('🚀 Envoi de la commande SMMA commentaires (client → serveur):', order);

      // Utiliser la nouvelle méthode avec serviceType et followerType séparés
      const serviceId = getServiceId(order.serviceType, order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour les commentaires ${order.followerType}`
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
      console.error('❌ Erreur lors de l\'appel API route (commentaires):', error);
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
      console.log('🚀 Envoi de la commande SMMA vues (client → serveur):', order);

      // Utiliser la nouvelle méthode avec serviceType et followerType séparés
      const serviceId = getServiceId(order.serviceType, order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour les vues ${order.followerType}`
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
      console.error('❌ Erreur lors de l\'appel API route (vues):', error);
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
      console.log('🚀 Envoi de la commande SMMA TikTok (client → serveur):', order);
      console.log('🔍 DEBUG order.followerType:', order.followerType);
      
      // Utiliser getServiceId avec 'tiktok_followers' pour obtenir le bon service ID (9583)
      const serviceId = getServiceId('tiktok_followers', order.followerType);
      console.log('🔍 DEBUG serviceId retourné:', serviceId);
      
      if (!serviceId) {
        console.error('❌ Service SMMA non trouvé !');
        return { success: false, error: `Service SMMA non trouvé pour le type: tiktok_followers ${order.followerType}` };
      }

      console.log('✅ Service ID TikTok Followers:', serviceId);
      
      if (serviceId !== 9583) {
        console.error('❌❌❌ ERREUR: Service ID incorrect !', serviceId, 'au lieu de 9583');
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
      console.error('❌ Erreur lors de l\'appel API route (TikTok):', error);
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
      console.log('🚀 Envoi de la commande SMMA TikTok Likes (client → serveur):', order);
      
      // Utiliser getServiceId avec 'tiktok_likes' pour obtenir le bon service ID (4174)
      const serviceId = getServiceId('tiktok_likes', order.followerType);
      if (!serviceId) {
        return { success: false, error: `Service SMMA non trouvé pour le type: tiktok_likes ${order.followerType}` };
      }

      console.log('✅ Service ID TikTok Likes:', serviceId);

      const response = await fetch('/api/smma/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'tiktok_likes',
          service_id: serviceId.toString(),
          link: order.username, // URL complète de la vidéo TikTok (ex: https://tiktok.com/@user/video/123456)
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
      console.error('❌ Erreur lors de l\'appel API route (TikTok Likes):', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }
}

// Instance singleton
export const smmaServiceClient = new SMMAServiceClient();
