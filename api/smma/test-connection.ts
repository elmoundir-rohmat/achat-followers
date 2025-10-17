import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route de test pour vérifier la connexion avec l'API SMMA
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vérifier les variables d'environnement
    const smmaApiUrl = process.env.SMMA_API_URL;
    const smmaApiKey = process.env.SMMA_API_KEY;

    console.log('🔍 Variables d\'environnement:');
    console.log('SMMA_API_URL:', smmaApiUrl ? 'SET' : 'NOT_SET');
    console.log('SMMA_API_KEY:', smmaApiKey ? 'SET (length: ' + smmaApiKey.length + ')' : 'NOT_SET');

    if (!smmaApiUrl || !smmaApiKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing SMMA configuration',
        details: {
          SMMA_API_URL: smmaApiUrl ? 'SET' : 'NOT_SET',
          SMMA_API_KEY: smmaApiKey ? 'SET' : 'NOT_SET'
        }
      });
    }

    // Test simple de l'API SMMA - récupérer les services disponibles
    console.log('🧪 Test de connexion à l\'API SMMA...');
    
    const testResponse = await fetch(smmaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: smmaApiKey,
        action: 'services'
      })
    });

    if (!testResponse.ok) {
      console.error('❌ Erreur HTTP lors du test:', testResponse.status);
      return res.status(500).json({
        success: false,
        error: 'SMMA API connection failed',
        status: testResponse.status,
        statusText: testResponse.statusText
      });
    }

    const testData = await testResponse.json();
    console.log('✅ Connexion SMMA réussie');
    console.log('📊 Réponse test:', testData);

    // Vérifier si le service 7118 existe
    const service7118 = testData.find((service: any) => service.service === '7118');
    
    return res.status(200).json({
      success: true,
      message: 'SMMA connection successful',
      details: {
        apiUrl: smmaApiUrl,
        apiKeyLength: smmaApiKey.length,
        servicesCount: Array.isArray(testData) ? testData.length : 'Not an array',
        service7118Exists: !!service7118,
        service7118Details: service7118 || 'Not found'
      },
      rawResponse: testData
    });

  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:', error);
    return res.status(500).json({
      success: false,
      error: 'Connection test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
