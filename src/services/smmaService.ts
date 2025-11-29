// Service pour l'intégration avec le fournisseur externe
import { getSMMAServiceId, getServiceDescription, getServiceId } from '../config/smmaMapping';

export interface SMMAOrder {
  username: string;
  followers: number;
  followerType: 'french' | 'international' | 'premium' | 'random' | 'custom'; // Pour les followers (premium pour TikTok, random/custom pour TikTok comments)
  serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_comments'; // Type de service
  orderId: string;
  paymentId: string;
  postId?: string; // Pour les likes/commentaires/vues sur des posts spécifiques
  likesToAdd?: number; // Nombre de likes à ajouter à ce post
  commentsToAdd?: number; // Nombre de commentaires à ajouter à ce post
  viewsToAdd?: number; // Nombre de vues à ajouter à ce post
  runs?: number; // Pour TikTok drip feed
  interval?: number; // Pour TikTok drip feed
  platform?: 'instagram' | 'tiktok'; // Pour identifier la plateforme
  customComments?: string[]; // Pour les commentaires TikTok personnalisés (liste de commentaires)
}

export interface SMMAResponse {
  success: boolean;
  order_id?: string;
  smma_order_id?: string;
  message?: string;
  error?: string;
}

class SMMAService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Configuration depuis les variables d'environnement
    const apiUrl = import.meta.env.VITE_SMMA_API_URL;
    const apiKey = import.meta.env.VITE_SMMA_API_KEY;
    
    if (!apiUrl || !apiKey) {
      throw new Error('API configuration is missing. Please set VITE_SMMA_API_URL and VITE_SMMA_API_KEY environment variables.');
    }
    
    this.baseUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * Commande des followers
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
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          key: this.apiKey,
          action: 'add',
          service: serviceId.toString(),
          link: `https://instagram.com/${order.username}`,
          quantity: order.followers.toString() // Le nombre de followers est passé ici
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.order) {
        return {
          success: true,
          order_id: order.orderId,
          smma_order_id: data.order.toString(),
          message: `Commande #${data.order} créée avec succès pour @${order.username} (${order.followers} ${getServiceDescription(order.followerType)})`
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la création de la commande'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le service'
      };
    }
  }

  /**
   * Commande des likes
   */
  async orderLikes(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      let smmaFollowerType = order.followerType;
      if (order.followerType === 'international') {
        smmaFollowerType = 'likes_international';
      } else if (order.followerType === 'europe') {
        smmaFollowerType = 'likes_europe';
      } else if (order.followerType === 'french') {
        smmaFollowerType = 'likes_french';
      }

      const serviceId = getSMMAServiceId(smmaFollowerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service non trouvé pour les likes ${order.followerType}`
        };
      }
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          key: this.apiKey,
          action: 'add',
          service: serviceId.toString(),
          link: order.postId ? `https://instagram.com/p/${order.postId}` : `https://instagram.com/${order.username}`,
          quantity: (order.likesToAdd || order.followers).toString() // Le nombre de likes est passé ici
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.order) {
        return {
          success: true,
          order_id: order.orderId,
          smma_order_id: data.order.toString(),
          message: `Commande #${data.order} créée avec succès pour ${order.postId ? `post ${order.postId}` : `@${order.username}`} (${order.likesToAdd || order.followers} likes ${getServiceDescription(order.followerType)})`
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la création de la commande (likes)'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le service (likes)'
      };
    }
  }

  /**
   * Commande des commentaires
   */
  async orderComments(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const serviceId = getSMMAServiceId(order.followerType === 'french' ? 'comments_french' : 'comments_international');
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service non trouvé pour les commentaires ${order.followerType}`
        };
      }
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          key: this.apiKey,
          action: 'add',
          service: serviceId.toString(),
          link: order.postId ? `https://instagram.com/p/${order.postId}` : `https://instagram.com/${order.username}`,
          quantity: (order.commentsToAdd || order.followers).toString() // Le nombre de commentaires est passé ici
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.order) {
        return {
          success: true,
          order_id: order.orderId,
          smma_order_id: data.order.toString(),
          message: `Commande #${data.order} créée avec succès pour ${order.postId ? `post ${order.postId}` : `@${order.username}`} (${order.commentsToAdd || order.followers} commentaires ${getServiceDescription(order.followerType)})`
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la création de la commande (commentaires)'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le service (commentaires)'
      };
    }
  }

  /**
   * Commande des vues Instagram
   */
  async orderViews(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      const serviceId = getSMMAServiceId(order.followerType === 'french' ? 'views_french' : 'views_international');
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service non trouvé pour les vues ${order.followerType}`
        };
      }
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          key: this.apiKey,
          action: 'add',
          service: serviceId.toString(),
          link: order.postId ? `https://instagram.com/reel/${order.postId}` : `https://instagram.com/${order.username}`,
          quantity: (order.viewsToAdd || order.followers).toString() // Le nombre de vues est passé ici
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.order) {
        return {
          success: true,
          order_id: order.orderId,
          smma_order_id: data.order.toString(),
          message: `Commande #${data.order} créée avec succès pour ${order.postId ? `reel ${order.postId}` : `@${order.username}`} (${order.viewsToAdd || order.followers} vues ${getServiceDescription(order.followerType)})`
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la création de la commande (vues)'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le service (vues)'
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

      const params: Record<string, string> = {
        key: this.apiKey,
        action: 'add',
        service: serviceId.toString(),
        link: order.username, // URL TikTok complète
        quantity: order.followers.toString() // Quantité totale
      };

      // Ajouter les paramètres de drip feed si disponibles
      if (order.runs && order.runs > 1) {
        params.runs = order.runs.toString();
        if (order.interval) {
          params.interval = order.interval.toString();
        }
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error
        };
      }

      return {
        success: true,
        message: `Commande TikTok créée avec succès (ID: ${data.order})`,
        smma_order_id: data.order.toString()
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le service (TikTok)'
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

      const params: Record<string, string> = {
        key: this.apiKey,
        action: 'add',
        service: serviceId.toString(),
        link: order.username, // URL TikTok complète
        quantity: order.followers.toString() // Quantité totale
      };

      // Ajouter les paramètres de drip feed si disponibles
      if (order.runs && order.runs > 1) {
        params.runs = order.runs.toString();
        if (order.interval) {
          params.interval = order.interval.toString();
        }
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error
        };
      }

      return {
        success: true,
        order_id: order.orderId,
        smma_order_id: data.order.toString(),
        message: `Commande TikTok Likes créée avec succès (ID: ${data.order})`
      };

    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion avec le service (TikTok Likes)'
      };
    }
  }

  /**
   * Vérifier le statut d'une commande
   */
  async checkOrderStatus(smmaOrderId: string): Promise<any> {
    try {

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          key: this.apiKey,
          action: 'status',
          order: smmaOrderId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      throw error;
    }
  }

}

// Instance singleton
export const smmaService = new SMMAService();
