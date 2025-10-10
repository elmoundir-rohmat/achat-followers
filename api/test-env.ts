import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    console.log('🧪 Test variables d\'environnement');
    
    const starapiUrl = process.env.VITE_STARAPI_URL || process.env.STARAPI_URL;
    const rapidapiKey = process.env.VITE_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY;

    return res.status(200).json({
      success: true,
      environment: {
        hasStarapiUrl: !!starapiUrl,
        hasRapidapiKey: !!rapidapiKey,
        starapiUrl: starapiUrl || 'NOT_SET',
        rapidapiKey: rapidapiKey ? rapidapiKey.substring(0, 10) + '...' : 'NOT_SET',
        allEnvVars: Object.keys(process.env).filter(key => 
          key.includes('STARAPI') || key.includes('RAPIDAPI')
        )
      }
    });

  } catch (error) {
    console.error('❌ Erreur dans test-env:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
