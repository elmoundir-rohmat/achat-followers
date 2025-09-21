// Service pour l'intégration avec la plateforme SMMA (JustAnotherPanel)
import { getSMMAServiceId, getServiceDescription } from '../config/smmaMapping';

export interface SMMAOrder {
  username: string;
  followers: number;
  followerType: 'french' | 'international';
  orderId: string;
  paymentId: string;
  postId?: string; // Pour les likes sur des posts spécifiques
  likesToAdd?: number; // Nombre de likes à ajouter à ce post
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

      // Pour les likes, nous utilisons un service différent
      // Vous pouvez adapter l'ID du service selon votre configuration SMMA
      const serviceId = getSMMAServiceId(order.followerType === 'french' ? 'likes_french' : 'likes_international');
      
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
