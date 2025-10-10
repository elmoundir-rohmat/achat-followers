import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    console.log('🧪 Test StarAPI endpoint');
    
    // Récupérer la configuration StarAPI
    const starapiUrl = process.env.VITE_STARAPI_URL || process.env.STARAPI_URL;
    const rapidapiKey = process.env.VITE_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY;

    console.log('🔍 Variables d\'environnement:', {
      hasStarapiUrl: !!starapiUrl,
      hasRapidapiKey: !!rapidapiKey,
      starapiUrl: starapiUrl ? starapiUrl.substring(0, 30) + '...' : 'NOT_SET',
      rapidapiKey: rapidapiKey ? rapidapiKey.substring(0, 10) + '...' : 'NOT_SET'
    });

    if (!starapiUrl || !rapidapiKey) {
      return res.status(500).json({
        error: 'Missing StarAPI configuration',
        hasStarapiUrl: !!starapiUrl,
        hasRapidapiKey: !!rapidapiKey
      });
    }

    // Test 1: Récupérer l'ID utilisateur pour therock
    console.log('🔍 Test 1: Récupération ID utilisateur pour therock...');
    
    const userIdResponse = await fetch(`${starapiUrl}/instagram/user/get_web_profile_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify({ username: 'therock' })
    });

    console.log('📡 Réponse get_web_profile_info:', {
      status: userIdResponse.status,
      statusText: userIdResponse.statusText,
      ok: userIdResponse.ok
    });

    if (!userIdResponse.ok) {
      const errorText = await userIdResponse.text();
      console.error('❌ Erreur get_web_profile_info:', errorText);
      return res.status(500).json({
        error: 'Failed to get user ID',
        status: userIdResponse.status,
        errorText: errorText.substring(0, 200)
      });
    }

    const userData = await userIdResponse.json();
    console.log('📦 Données utilisateur reçues:', {
      status: userData.status,
      hasResponse: !!userData.response,
      hasBody: !!userData.response?.body,
      hasData: !!userData.response?.body?.data,
      hasUser: !!userData.response?.body?.data?.user,
      userId: userData.response?.body?.data?.user?.id
    });

    const userId = userData.response?.body?.data?.user?.id;
    if (!userId) {
      return res.status(404).json({
        error: 'User not found',
        userData: userData
      });
    }

    // Test 2: Récupérer les clips avec l'ID
    console.log('🔍 Test 2: Récupération clips avec ID:', userId);
    
    const clipsResponse = await fetch(`${starapiUrl}/instagram/user/get_clips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify({
        id: parseInt(userId),
        count: 12
      })
    });

    console.log('📡 Réponse get_clips:', {
      status: clipsResponse.status,
      statusText: clipsResponse.statusText,
      ok: clipsResponse.ok
    });

    if (!clipsResponse.ok) {
      const errorText = await clipsResponse.text();
      console.error('❌ Erreur get_clips:', errorText);
      return res.status(500).json({
        error: 'Failed to get clips',
        status: clipsResponse.status,
        errorText: errorText.substring(0, 200)
      });
    }

    const clipsData = await clipsResponse.json();
    console.log('📦 Données clips reçues:', {
      status: clipsData.status,
      hasResponse: !!clipsData.response,
      hasBody: !!clipsData.response?.body,
      hasItems: !!clipsData.response?.body?.items,
      itemsLength: clipsData.response?.body?.items?.length || 0
    });

    const clips = clipsData.response?.body?.items || [];
    console.log('🎬 Clips trouvés:', clips.length);
    
    if (clips.length > 0) {
      console.log('🔍 Premier clip:', {
        id: clips[0].id,
        media_type: clips[0].media_type,
        like_count: clips[0].like_count,
        view_count: clips[0].view_count
      });
    }

    return res.status(200).json({
      success: true,
      userId: userId,
      clipsCount: clips.length,
      clips: clips.slice(0, 3), // Retourner les 3 premiers clips
      debug: {
        userDataStatus: userData.status,
        clipsDataStatus: clipsData.status,
        hasUserResponse: !!userData.response,
        hasClipsResponse: !!clipsData.response
      }
    });

  } catch (error) {
    console.error('❌ Erreur dans test StarAPI:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
