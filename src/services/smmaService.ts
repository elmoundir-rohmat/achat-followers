// Service pour l'intégration avec la plateforme SMMA (JustAnotherPanel)
import { getSMMAServiceId, getServiceDescription } from '../config/smmaMapping';

export interface SMMAOrder {
  username: string;
  followers: number;
  followerType: 'french' | 'international'; // SEULEMENT pour les followers
  serviceType: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes'; // Type de service
  orderId: string;
  paymentId: string;
  postId?: string; // Pour les likes/commentaires/vues sur des posts spécifiques
  likesToAdd?: number; // Nombre de likes à ajouter à ce post
  commentsToAdd?: number; // Nombre de commentaires à ajouter à ce post
  viewsToAdd?: number; // Nombre de vues à ajouter à ce post
  runs?: number; // Pour TikTok drip feed
  interval?: number; // Pour TikTok drip feed
  platform?: 'instagram' | 'tiktok'; // Pour identifier la plateforme
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
    this.baseUrl = import.meta.env.VITE_SMMA_API_URL || 'https://justanotherpanel.com/api/v2';
    this.apiKey = import.meta.env.VITE_SMMA_API_KEY || 'your_smma_api_key_here';
  }

  /**
   * Commande des followers sur la plateforme SMMA
   */
  async orderFollowers(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande SMMA:', order);

      // Obtenir l'ID du service SMMA pour ce type de followers
      const serviceId = getSMMAServiceId(order.followerType);
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour le type: ${order.followerType}`
        };
      }

      console.log(`📦 Utilisation du service SMMA ID: ${serviceId} pour ${order.followers} followers ${order.followerType}`);

      // Appel API réel vers JustAnotherPanel
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
        console.log('✅ Commande SMMA créée:', data);
        return {
          success: true,
          order_id: order.orderId,
          smma_order_id: data.order.toString(),
          message: `Commande SMMA #${data.order} créée avec succès pour @${order.username} (${order.followers} ${getServiceDescription(order.followerType)})`
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la création de la commande SMMA'
        };
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel SMMA:', error);
      return {
        success: false,
        error: 'Erreur de connexion avec la plateforme SMMA'
      };
    }
  }

  /**
   * Commande des likes sur la plateforme SMMA
   */
  async orderLikes(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande SMMA (likes):', order);

      // Mapper le followerType pour les likes Instagram
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
          error: `Service SMMA non trouvé pour les likes ${order.followerType}`
        };
      }

      console.log(`📦 Utilisation du service SMMA ID: ${serviceId} pour ${order.followers} likes ${order.followerType}`);

      // Appel API réel vers JustAnotherPanel
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
        console.log('✅ Commande SMMA (likes) créée:', data);
        return {
          success: true,
          order_id: order.orderId,
          smma_order_id: data.order.toString(),
          message: `Commande SMMA #${data.order} créée avec succès pour ${order.postId ? `post ${order.postId}` : `@${order.username}`} (${order.likesToAdd || order.followers} likes ${getServiceDescription(order.followerType)})`
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la création de la commande SMMA (likes)'
        };
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel SMMA (likes):', error);
      return {
        success: false,
        error: 'Erreur de connexion avec la plateforme SMMA (likes)'
      };
    }
  }

  /**
   * Commande des commentaires sur la plateforme SMMA
   */
  async orderComments(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande SMMA (commentaires):', order);

      // Pour les commentaires, nous utilisons un service différent
      const serviceId = getSMMAServiceId(order.followerType === 'french' ? 'comments_french' : 'comments_international');
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour les commentaires ${order.followerType}`
        };
      }

      console.log(`📦 Utilisation du service SMMA ID: ${serviceId} pour ${order.commentsToAdd || order.followers} commentaires ${order.followerType}`);

      // Appel API réel vers JustAnotherPanel
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
        console.log('✅ Commande SMMA (commentaires) créée:', data);
        return {
          success: true,
          order_id: order.orderId,
          smma_order_id: data.order.toString(),
          message: `Commande SMMA #${data.order} créée avec succès pour ${order.postId ? `post ${order.postId}` : `@${order.username}`} (${order.commentsToAdd || order.followers} commentaires ${getServiceDescription(order.followerType)})`
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la création de la commande SMMA (commentaires)'
        };
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel SMMA (commentaires):', error);
      return {
        success: false,
        error: 'Erreur de connexion avec la plateforme SMMA (commentaires)'
      };
    }
  }

  /**
   * Commande des vues Instagram sur la plateforme SMMA
   */
  async orderViews(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande SMMA (vues):', order);

      // Pour les vues, nous utilisons un service différent
      const serviceId = getSMMAServiceId(order.followerType === 'french' ? 'views_french' : 'views_international');
      
      if (!serviceId) {
        return {
          success: false,
          error: `Service SMMA non trouvé pour les vues ${order.followerType}`
        };
      }

      console.log(`📦 Utilisation du service SMMA ID: ${serviceId} pour ${order.viewsToAdd || order.followers} vues ${order.followerType}`);

      // Appel API réel vers JustAnotherPanel
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
        console.log('✅ Commande SMMA (vues) créée:', data);
        return {
          success: true,
          order_id: order.orderId,
          smma_order_id: data.order.toString(),
          message: `Commande SMMA #${data.order} créée avec succès pour ${order.postId ? `reel ${order.postId}` : `@${order.username}`} (${order.viewsToAdd || order.followers} vues ${getServiceDescription(order.followerType)})`
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la création de la commande SMMA (vues)'
        };
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel SMMA (vues):', error);
      return {
        success: false,
        error: 'Erreur de connexion avec la plateforme SMMA (vues)'
      };
    }
  }

  /**
   * Commander des followers TikTok via SMMA
   */
  async orderTikTokFollowers(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande SMMA TikTok:', order);
      
      const serviceId = getSMMAServiceId(order.followerType);
      if (!serviceId) {
        return { success: false, error: `Service SMMA non trouvé pour le type: ${order.followerType}` };
      }
      
      console.log(`📦 Utilisation du service SMMA ID: ${serviceId} pour ${order.followers} followers TikTok ${order.followerType}`);

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

      console.log('📤 Paramètres SMMA TikTok:', params);

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
      console.log('📊 Réponse SMMA TikTok:', data);

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
      console.error('❌ Erreur lors de l\'appel SMMA (TikTok):', error);
      return {
        success: false,
        error: 'Erreur de connexion avec la plateforme SMMA (TikTok)'
      };
    }
  }

  /**
   * Commande des likes TikTok sur la plateforme SMMA
   */
  async orderTikTokLikes(order: SMMAOrder): Promise<SMMAResponse> {
    try {
      console.log('🚀 Envoi de la commande SMMA TikTok Likes:', order);
      
      const serviceId = getSMMAServiceId(order.followerType);
      if (!serviceId) {
        return { success: false, error: `Service SMMA non trouvé pour le type: ${order.followerType}` };
      }
      
      console.log(`📦 Utilisation du service SMMA ID: ${serviceId} pour ${order.followers} likes TikTok ${order.followerType}`);

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

      console.log('📤 Paramètres SMMA TikTok Likes:', params);

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
      console.log('📊 Réponse SMMA TikTok Likes:', data);

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
      console.error('❌ Erreur lors de l\'appel SMMA (TikTok Likes):', error);
      return {
        success: false,
        error: 'Erreur de connexion avec la plateforme SMMA (TikTok Likes)'
      };
    }
  }

  /**
   * Vérifier le statut d'une commande SMMA
   */
  async checkOrderStatus(smmaOrderId: string): Promise<any> {
    try {
      console.log('🔍 Vérification du statut SMMA:', smmaOrderId);

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
      console.log('📊 Statut de la commande:', data);
      return data;

    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error);
      throw error;
    }
  }

}

// Instance singleton
export const smmaService = new SMMAService();
