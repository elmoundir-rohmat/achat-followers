import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route pour tester les services JustAnotherPanel
 * Récupère la liste des services disponibles
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const smmaApiUrl = process.env.SMMA_API_URL;
    const smmaApiKey = process.env.SMMA_API_KEY;

    if (!smmaApiUrl || !smmaApiKey) {
      return res.status(500).json({ 
        error: 'SMMA configuration missing',
        smmaApiUrl: !!smmaApiUrl,
        smmaApiKey: !!smmaApiKey
      });
    }

    console.log('🔍 Test des services JustAnotherPanel...');
    console.log('🌐 URL:', smmaApiUrl);
    console.log('🔑 API Key:', smmaApiKey ? `${smmaApiKey.substring(0, 10)}...` : 'NOT_SET');

    // Récupérer la liste des services
    const params = new URLSearchParams({
      key: smmaApiKey,
      action: 'services'
    });

    console.log('📤 Paramètres envoyés:', params.toString());

    const response = await fetch(smmaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    console.log('📊 Réponse HTTP:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur HTTP:', errorText);
      return res.status(response.status).json({
        error: 'HTTP Error',
        status: response.status,
        message: errorText
      });
    }

    const data = await response.json();
    console.log('📋 Services disponibles:', data);

    // Filtrer les services Instagram et TikTok
    const instagramServices = Array.isArray(data) ? data.filter((service: any) => 
      service.name && (
        service.name.toLowerCase().includes('instagram') ||
        service.name.toLowerCase().includes('followers') ||
        service.name.toLowerCase().includes('likes') ||
        service.name.toLowerCase().includes('comments') ||
        service.name.toLowerCase().includes('views')
      )
    ) : [];

    const tiktokServices = Array.isArray(data) ? data.filter((service: any) => 
      service.name && service.name.toLowerCase().includes('tiktok')
    ) : [];

    return res.status(200).json({
      success: true,
      totalServices: Array.isArray(data) ? data.length : 0,
      instagramServices: instagramServices.slice(0, 20), // Limiter à 20 pour éviter une réponse trop longue
      tiktokServices: tiktokServices.slice(0, 10),
      allServices: data
    });

  } catch (error) {
    console.error('❌ Erreur test services:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
