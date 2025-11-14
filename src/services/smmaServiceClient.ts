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
   * Commande des followers sur la plateforme SMMA via API Route sécurisée
   */
  async orderFollowers(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande (client → serveur):', order);

      const serviceId = getSMMAServiceId(order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service non trouvé pour le type: ${order.followerType}`
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
      console.log('🚀 Envoi de la commande likes (client → serveur):', order);

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
      console.log('🚀 Envoi de la commande commentaires (client → serveur):', order);

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
      console.log('🚀 Envoi de la commande vues (client → serveur):', order);

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
      console.log('🚀 Envoi de la commande TikTok (client → serveur):', order);
      console.log('🔍 DEBUG order.followerType:', order.followerType);
      
      // Utiliser getServiceId avec 'tiktok_followers' pour obtenir le bon service ID (8200)
      // Pour Premium Followers, on utilise toujours 'international' comme fallback
      const followerTypeForService = order.followerType === 'premium' ? 'international' : order.followerType;
      const serviceId = getServiceId('tiktok_followers', followerTypeForService as 'french' | 'international');
      console.log('🔍 DEBUG serviceId retourné:', serviceId);
      
      if (!serviceId) {
        console.error('❌ Service non trouvé !');
        return { success: false, error: `Service non trouvé pour le type: tiktok_followers ${order.followerType}` };
      }

      console.log('✅ Service ID TikTok Followers Premium:', serviceId);
      
      if (serviceId !== 8200) {
        console.error('❌❌❌ ERREUR: Service ID incorrect !', serviceId, 'au lieu de 8200');
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
   * Commande des vues TikTok
   */
  async orderTikTokViews(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande TikTok Views (client → serveur):', order);
      
      // Utiliser getServiceId avec 'tiktok_views' pour obtenir le bon service ID (3365)
      // Pour Premium Vues, on utilise toujours 'international' comme fallback
      const followerTypeForService = order.followerType === 'premium' ? 'international' : order.followerType;
      const serviceId = getServiceId('tiktok_views', followerTypeForService as 'french' | 'international');
      if (!serviceId) {
        return { success: false, error: `Service non trouvé pour le type: tiktok_views ${order.followerType}` };
      }

      console.log('✅ Service ID TikTok Views Premium:', serviceId);
      
      if (serviceId !== 3365) {
        console.error('❌❌❌ ERREUR: Service ID incorrect !', serviceId, 'au lieu de 3365');
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
      console.error('❌ Erreur lors de l\'appel API route (TikTok Views):', error);
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
      console.log('🚀 Envoi de la commande TikTok Likes (client → serveur):', order);
      
      // Utiliser getServiceId avec 'tiktok_likes' pour obtenir le bon service ID (3850)
      // Pour Premium Likes, on utilise toujours 'international' comme fallback
      const followerTypeForService = order.followerType === 'premium' ? 'international' : order.followerType;
      const serviceId = getServiceId('tiktok_likes', followerTypeForService as 'french' | 'international');
      if (!serviceId) {
        return { success: false, error: `Service non trouvé pour le type: tiktok_likes ${order.followerType}` };
      }

      console.log('✅ Service ID TikTok Likes Premium:', serviceId);
      
      if (serviceId !== 3850) {
        console.error('❌❌❌ ERREUR: Service ID incorrect !', serviceId, 'au lieu de 3850');
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
      console.error('❌ Erreur lors de l\'appel API route (TikTok Likes):', error);
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
      console.log('🚀 Envoi de la commande TikTok Comments (client → serveur):', order);
      
      // ✅ DEBUG DÉTAILLÉ : Vérifier les valeurs exactes
      console.log('🔍 DEBUG orderTikTokComments - order complet:', order);
      console.log('🔍 DEBUG order.commentsToAdd:', order.commentsToAdd);
      console.log('🔍 DEBUG order.followers:', order.followers);
      console.log('🔍 DEBUG order.followerType:', order.followerType);
      console.log('🔍 DEBUG order.customComments:', order.customComments);
      console.log('🔍 DEBUG order.customComments?.length:', order.customComments?.length);
      
      // Utiliser getServiceId avec 'tiktok_comments' pour obtenir le bon service ID
      // Pour tiktok_comments, on utilise 'random' ou 'custom' directement
      const followerTypeForService = order.followerType === 'random' ? 'random' : 
                                      order.followerType === 'custom' ? 'custom' : 
                                      (order.followerType === 'french' ? 'custom' : 'random'); // Fallback pour compatibilité
      const serviceId = getServiceId('tiktok_comments', followerTypeForService as 'random' | 'custom');
      if (!serviceId) {
        return { success: false, error: `Service non trouvé pour le type: tiktok_comments ${order.followerType}` };
      }

      console.log('✅ Service ID TikTok Comments:', serviceId);
      const expectedServiceId = followerTypeForService === 'random' ? 7054 : 7118;
      if (serviceId !== expectedServiceId) {
        console.error(`❌❌❌ ERREUR: Service ID incorrect ! ${serviceId} au lieu de ${expectedServiceId}`);
      }

      // Pour les commentaires TikTok, pas de drip feed (pas de runs/interval)
      const requestBody: any = {
        action: 'tiktok_comments',
        service_id: serviceId.toString(),
        link: order.username, // URL complète de la vidéo TikTok
        order_id: order.orderId
      };
      
      // Pour les commentaires personnalisés (service 7118), envoyer la liste des commentaires
      // Le SMMA compte le nombre de commentaires dans la liste pour facturer
      // Vérifier si c'est bien des commentaires personnalisés
      const isCustomComments = serviceId === 7118 && 
                                order.followerType === 'custom' && 
                                order.customComments && 
                                Array.isArray(order.customComments) &&
                                order.customComments.length > 0;
      
      console.log('🔍 DEBUG isCustomComments:', isCustomComments);
      console.log('🔍 DEBUG conditions:', {
        serviceId: serviceId,
        serviceIdIs7118: serviceId === 7118,
        followerType: order.followerType,
        followerTypeIsCustom: order.followerType === 'custom',
        hasCustomComments: !!order.customComments,
        isArray: Array.isArray(order.customComments),
        customCommentsLength: order.customComments?.length || 0,
        customCommentsValue: order.customComments
      });
      
      if (isCustomComments) {
        // Envoyer les commentaires comme un tableau (sera converti en chaîne côté serveur)
        requestBody.comments = order.customComments;
        // Le SMMA compte automatiquement le nombre de commentaires
        console.log('✅ Envoi de commentaires personnalisés:', order.customComments.length, 'commentaires');
        console.log('✅ Commentaires à envoyer:', order.customComments);
        // IMPORTANT: Ne PAS envoyer quantity pour les commentaires personnalisés
        delete requestBody.quantity;
      } else {
        // Pour les commentaires aléatoires, envoyer juste la quantité
        const finalQuantity = order.commentsToAdd || order.followers;
        requestBody.quantity = finalQuantity;
        console.log('✅ Envoi de commentaires aléatoires, quantity:', finalQuantity);
        // IMPORTANT: Ne PAS envoyer comments pour les commentaires aléatoires
        delete requestBody.comments;
      }
      
      // Ne pas ajouter runs et interval pour les commentaires TikTok (pas de drip feed)
      
      console.log('📤 Body envoyé à l\'API route:', requestBody);

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
      console.error('❌ Erreur lors de l\'appel API route (TikTok Comments):', error);
      return {
        success: false,
        error: 'Erreur de connexion avec le serveur'
      };
    }
  }
}

// Instance singleton
export const smmaServiceClient = new SMMAServiceClient();
