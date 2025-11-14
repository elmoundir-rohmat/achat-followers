import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Commande SMMA (Followers, Likes, Comments, Views)
 * 
 * Cette route est exécutée côté serveur uniquement.
 * La clé API SMMA n'est jamais exposée au client.
 */

interface SMMAOrderRequest {
  action: 'followers' | 'likes' | 'comments' | 'views' | 'tiktok_followers' | 'tiktok_likes' | 'tiktok_comments' | 'tiktok_views';
  service_id: string;
  link: string;
  quantity?: number; // Optionnel pour les commentaires personnalisés
  comments?: string[]; // Pour les commentaires TikTok personnalisés (liste de commentaires)
  runs?: number;
  interval?: number;
  order_id: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Autoriser uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log du body reçu pour debug
    console.log('🔍 Body reçu:', JSON.stringify(req.body, null, 2));
    
    const {
      action,
      service_id,
      link,
      quantity,
      comments, // Pour les commentaires personnalisés
      runs,
      interval,
      order_id
    }: SMMAOrderRequest = req.body;
    
    // Log des paramètres extraits
    console.log('🔍 Paramètres extraits:', {
      action,
      service_id,
      link: link ? link.substring(0, 50) + '...' : 'UNDEFINED',
      quantity,
      quantity_type: typeof quantity,
      quantity_value: quantity,
      comments: comments ? `${comments.length} commentaires` : 'undefined',
      comments_preview: comments ? comments.slice(0, 2) : 'undefined',
      runs,
      interval,
      order_id
    });
    
    // ✅ DEBUG SPÉCIAL : Vérifier la quantité pour TikTok Comments
    if (action === 'tiktok_comments') {
      console.log('🔍 DEBUG TikTok Comments - quantity:', quantity);
      console.log('🔍 DEBUG TikTok Comments - quantity type:', typeof quantity);
      console.log('🔍 DEBUG TikTok Comments - quantity === 10:', quantity === 10);
      console.log('🔍 DEBUG TikTok Comments - quantity >= 10:', quantity >= 10);
    }

    // Validation des paramètres
    // Pour les commentaires personnalisés (service 7118), on accepte soit quantity soit comments
    const isCustomComments = action === 'tiktok_comments' && comments && comments.length > 0;
    
    if (!action || !service_id || !link || !order_id) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['action', 'service_id', 'link', 'order_id']
      });
    }
    
    // Pour les commentaires personnalisés, on doit avoir la liste des commentaires
    // Pour les autres services, on doit avoir la quantité
    if (isCustomComments) {
      if (!comments || comments.length === 0) {
        return res.status(400).json({ 
          error: 'Missing required parameter: comments (array of custom comments)',
          required: ['action', 'service_id', 'link', 'comments', 'order_id']
        });
      }
    } else {
      if (!quantity) {
        return res.status(400).json({ 
          error: 'Missing required parameter: quantity',
          required: ['action', 'service_id', 'link', 'quantity', 'order_id']
        });
      }
    }

    // Récupérer la configuration SMMA depuis les variables d'environnement
    const smmaApiUrl = process.env.SMMA_API_URL;
    const smmaApiKey = process.env.SMMA_API_KEY;

    if (!smmaApiUrl || !smmaApiKey) {
      console.error('Missing SMMA configuration');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'SMMA credentials not configured'
      });
    }

    console.log(`🚀 Commande SMMA (${action}) serveur:`, {
      action,
      service_id,
      quantity,
      link: link.substring(0, 50) + '...',
      order_id,
      runs,
      interval
    });

    // Préparer les paramètres de la requête SMMA
    const params: Record<string, string> = {
      key: smmaApiKey,
      action: 'add',
      service: service_id,
      link: link
    };
    
    // Pour les commentaires personnalisés, envoyer la liste des commentaires (1 par ligne)
    // Le SMMA compte automatiquement le nombre de commentaires
    // IMPORTANT: Ne pas envoyer 'quantity' quand on envoie 'comments' (selon la doc PHP)
    if (isCustomComments && comments) {
      // Nettoyer et joindre les commentaires avec des retours à la ligne
      // Le SMMA attend les commentaires comme une chaîne avec \n (ex: "good pic\ngreat photo\n:)")
      const cleanedComments = comments
        .map(comment => comment.trim())
        .filter(comment => comment !== '');
      
      params.comments = cleanedComments.join('\n');
      console.log('📝 Envoi de commentaires personnalisés:', cleanedComments.length, 'commentaires');
      console.log('📝 Commentaires formatés:', params.comments);
      console.log('📝 Commentaires (array):', cleanedComments);
      
      // IMPORTANT: Ne pas envoyer quantity pour les commentaires personnalisés
      // Le SMMA compte automatiquement le nombre de lignes dans comments
    } else if (quantity !== undefined) {
      // Pour les autres services ou commentaires aléatoires, envoyer la quantité
      params.quantity = quantity.toString();
    }
    
    // ✅ DEBUG SPÉCIAL : Vérifier la conversion pour TikTok Comments
    if (action === 'tiktok_comments') {
      if (isCustomComments) {
        console.log('🔍 DEBUG API Route - Commentaires personnalisés:', comments?.length, 'commentaires');
        console.log('🔍 DEBUG API Route - params.comments:', params.comments);
      } else {
        console.log('🔍 DEBUG API Route - quantity avant conversion:', quantity);
        console.log('🔍 DEBUG API Route - quantity.toString():', quantity?.toString());
        console.log('🔍 DEBUG API Route - params.quantity:', params.quantity);
      }
    }

    // Ajouter les paramètres optionnels (drip feed pour TikTok)
    if (runs && runs > 1) {
      params.runs = runs.toString();
      if (interval) {
        params.interval = interval.toString();
      }
    }

    console.log('📦 Paramètres finaux envoyés à JustAnotherPanel:', {
      ...params,
      key: smmaApiKey ? `${smmaApiKey.substring(0, 10)}...` : 'NOT_SET'
    });
    
    // ✅ DEBUG SPÉCIAL : Vérifier les paramètres finaux pour TikTok Comments
    if (action === 'tiktok_comments') {
      console.log('🔍 DEBUG API Route - Paramètres finaux TikTok Comments:');
      console.log('🔍 DEBUG API Route - service:', params.service);
      if (isCustomComments) {
        console.log('🔍 DEBUG API Route - comments (personnalisés):', params.comments);
        console.log('🔍 DEBUG API Route - comments length:', params.comments?.split('\n').length);
        console.log('🔍 DEBUG API Route - quantity (ne doit PAS être présent):', params.quantity);
      } else {
        console.log('🔍 DEBUG API Route - quantity (aléatoires):', params.quantity);
        console.log('🔍 DEBUG API Route - comments (ne doit PAS être présent):', params.comments);
      }
      console.log('🔍 DEBUG API Route - link:', params.link);
      console.log('🔍 DEBUG API Route - action:', params.action);
    }

    // Appel API SMMA
    console.log('🌐 URL JustAnotherPanel:', smmaApiUrl);
    
    // Pour debug : afficher le body avant encodage
    const bodyString = new URLSearchParams(params).toString();
    console.log('📤 Body envoyé à JustAnotherPanel (string):', bodyString);
    console.log('📤 Body envoyé à JustAnotherPanel (params object):', params);
    
    // Vérification spéciale pour les commentaires personnalisés
    if (isCustomComments && params.comments) {
      console.log('🔍 Vérification commentaires personnalisés:');
      console.log('  - Service ID:', params.service);
      console.log('  - Link:', params.link);
      console.log('  - Comments (raw):', params.comments);
      console.log('  - Comments (split):', params.comments.split('\n'));
      console.log('  - Comments count:', params.comments.split('\n').length);
      console.log('  - Quantity présent?', params.quantity ? 'OUI (ERREUR!)' : 'NON (correct)');
    }
    
    const response = await fetch(smmaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params)
    });

    if (!response.ok) {
      console.error('❌ Erreur HTTP SMMA:', response.status);
      return res.status(response.status).json({
        error: 'SMMA API request failed',
        status: response.status
      });
    }

    const data = await response.json();
    console.log('📊 Réponse SMMA:', data);

    // Vérifier les erreurs dans la réponse
    if (data.error) {
      console.error('❌ Erreur SMMA:', data.error);
      return res.status(400).json({
        success: false,
        error: data.error
      });
    }

    // Vérifier que la commande a bien été créée
    if (!data.order) {
      console.error('❌ Pas de numéro de commande SMMA');
      return res.status(400).json({
        success: false,
        error: 'No order ID returned from SMMA'
      });
    }

    console.log(`✅ Commande SMMA créée: #${data.order}`);

    // Retourner la réponse au client
    return res.status(200).json({
      success: true,
      order_id: order_id,
      smma_order_id: data.order.toString(),
      message: `Order created successfully (SMMA ID: ${data.order})`
    });

  } catch (error) {
    console.error('❌ Erreur serveur SMMA:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error constructor:', error?.constructor?.name);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error?.constructor?.name || typeof error
    });
  }
}
