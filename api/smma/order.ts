import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Commander des services SMMA
 * 
 * Cette route gère toutes les commandes SMMA (followers, likes, commentaires, vues)
 * Les clés SMMA ne sont JAMAIS exposées au client.
 */

type ServiceType = 
  | 'instagram_followers' 
  | 'instagram_likes' 
  | 'instagram_comments' 
  | 'instagram_views'
  | 'tiktok_followers'
  | 'tiktok_likes';

interface OrderRequest {
  serviceType: ServiceType;
  serviceId: number;
  link: string;
  quantity: number;
  runs?: number;
  interval?: number;
  orderId: string;
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
    const { serviceType, serviceId, link, quantity, runs, interval, orderId } = req.body as OrderRequest;

    // Validation
    if (!serviceType || !serviceId || !link || !quantity || !orderId) {
      return res.status(400).json({ 
        error: 'Missing required fields: serviceType, serviceId, link, quantity, orderId' 
      });
    }

    // Récupérer les variables d'environnement serveur
    const smmaApiUrl = process.env.SMMA_API_URL || 'https://justanotherpanel.com/api/v2';
    const smmaApiKey = process.env.SMMA_API_KEY;

    if (!smmaApiKey) {
      console.error('Missing SMMA API key');
      return res.status(500).json({ 
        error: 'Server configuration error. Please contact support.' 
      });
    }

    console.log('Creating SMMA order:', {
      serviceType,
      serviceId,
      quantity,
      orderId,
      link: link.substring(0, 30) + '...'
    });

    // Préparer les paramètres
    const params: Record<string, string> = {
      key: smmaApiKey,
      action: 'add',
      service: serviceId.toString(),
      link: link,
      quantity: quantity.toString()
    };

    // Ajouter les paramètres de drip feed si disponibles (TikTok)
    if (runs && runs > 1) {
      params.runs = runs.toString();
      if (interval) {
        params.interval = interval.toString();
      }
    }

    // Appel à l'API SMMA
    const smmaResponse = await fetch(smmaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params)
    });

    if (!smmaResponse.ok) {
      console.error('SMMA API error:', smmaResponse.status, smmaResponse.statusText);
      return res.status(smmaResponse.status).json({
        error: 'SMMA order failed',
        status: smmaResponse.status
      });
    }

    const smmaResult = await smmaResponse.json();

    // Vérifier les erreurs SMMA
    if (smmaResult.error) {
      console.error('SMMA API returned error:', smmaResult.error);
      return res.status(400).json({
        success: false,
        error: smmaResult.error
      });
    }

    console.log('SMMA order created:', {
      orderId: orderId,
      smmaOrderId: smmaResult.order
    });

    // Retourner le résultat au client
    return res.status(200).json({
      success: true,
      orderId: orderId,
      smmaOrderId: smmaResult.order?.toString(),
      message: `Order created successfully (SMMA ID: ${smmaResult.order})`
    });

  } catch (error) {
    console.error('Error creating SMMA order:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

