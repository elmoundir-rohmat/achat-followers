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
  quantity: number;
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
    if (!action || !service_id || !link || !quantity || !order_id) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['action', 'service_id', 'link', 'quantity', 'order_id']
      });
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
      link: link,
      quantity: quantity.toString()
    };

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

    // Appel API SMMA
    console.log('🌐 URL JustAnotherPanel:', smmaApiUrl);
    console.log('📤 Body envoyé à JustAnotherPanel:', new URLSearchParams(params).toString());
    
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
