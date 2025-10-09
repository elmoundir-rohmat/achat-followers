import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route pour tester une commande JustAnotherPanel
 * Test avec des données fictives
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const smmaApiUrl = process.env.SMMA_API_URL;
    const smmaApiKey = process.env.SMMA_API_KEY;

    if (!smmaApiUrl || !smmaApiKey) {
      return res.status(500).json({ 
        error: 'SMMA configuration missing'
      });
    }

    const { username, serviceId, quantity, linkFormat } = req.body;

    console.log('🧪 Test commande SMMA:', {
      username,
      serviceId,
      quantity,
      linkFormat
    });

    // Tester différents formats de liens
    let link = '';
    switch (linkFormat) {
      case 'instagram':
        link = `https://instagram.com/${username}`;
        break;
      case 'www_instagram':
        link = `https://www.instagram.com/${username}`;
        break;
      case 'instagram_com':
        link = `https://instagram.com/${username}/`;
        break;
      case 'www_instagram_com':
        link = `https://www.instagram.com/${username}/`;
        break;
      default:
        link = `https://instagram.com/${username}`;
    }

    // Préparer les paramètres de la requête SMMA
    const params: Record<string, string> = {
      key: smmaApiKey,
      action: 'add',
      service: serviceId.toString(),
      link: link,
      quantity: quantity.toString()
    };

    console.log('📦 Paramètres de test envoyés à JustAnotherPanel:', {
      ...params,
      key: smmaApiKey ? `${smmaApiKey.substring(0, 10)}...` : 'NOT_SET'
    });

    // Appel API SMMA
    const response = await fetch(smmaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params)
    });

    console.log('📊 Réponse HTTP:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur HTTP:', errorText);
      return res.status(response.status).json({
        error: 'HTTP Error',
        status: response.status,
        message: errorText,
        params: {
          ...params,
          key: 'HIDDEN'
        }
      });
    }

    const data = await response.json();
    console.log('📋 Réponse SMMA:', data);

    // Vérifier les erreurs dans la réponse
    if (data.error) {
      console.error('❌ Erreur SMMA:', data.error);
      return res.status(400).json({
        success: false,
        error: data.error,
        params: {
          ...params,
          key: 'HIDDEN'
        }
      });
    }

    // Vérifier que la commande a bien été créée
    if (!data.order) {
      console.error('❌ Pas de numéro de commande SMMA');
      return res.status(400).json({
        success: false,
        error: 'No order ID returned from SMMA',
        response: data,
        params: {
          ...params,
          key: 'HIDDEN'
        }
      });
    }

    console.log(`✅ Commande SMMA de test créée: #${data.order}`);

    return res.status(200).json({
      success: true,
      order_id: data.order.toString(),
      message: `Test order created successfully (SMMA ID: ${data.order})`,
      params: {
        ...params,
        key: 'HIDDEN'
      },
      response: data
    });

  } catch (error) {
    console.error('❌ Erreur test commande:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
