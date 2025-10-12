import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route de diagnostic pour les reels Instagram
 * Permet de tester directement l'API StarAPI et voir les erreurs
 */

interface DebugRequest {
  username: string;
  test_mode?: boolean;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, test_mode = false }: DebugRequest = req.body;

    if (!username) {
      return res.status(400).json({ 
        error: 'Missing required parameter: username'
      });
    }

    // Configuration StarAPI
    const starapiUrl = process.env.VITE_STARAPI_URL || process.env.STARAPI_URL;
    const rapidapiKey = process.env.VITE_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY;

    console.log('🔍 DIAGNOSTIC - Configuration StarAPI:', {
      hasStarapiUrl: !!starapiUrl,
      hasRapidapiKey: !!rapidapiKey,
      starapiUrl: starapiUrl ? starapiUrl.substring(0, 30) + '...' : 'NOT_SET',
      rapidapiKey: rapidapiKey ? rapidapiKey.substring(0, 10) + '...' : 'NOT_SET'
    });

    if (!starapiUrl || !rapidapiKey) {
      return res.status(500).json({ 
        error: 'StarAPI configuration missing',
        debug: {
          hasStarapiUrl: !!starapiUrl,
          hasRapidapiKey: !!rapidapiKey
        }
      });
    }

    // Test 1: Récupérer l'ID utilisateur
    console.log('🔍 DIAGNOSTIC - Test 1: Récupération ID utilisateur pour @' + username);
    
    const userIdResponse = await fetch(`${starapiUrl}/instagram/user/get_web_profile_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify({ username })
    });

    console.log('🔍 DIAGNOSTIC - Réponse get_web_profile_info:', {
      status: userIdResponse.status,
      statusText: userIdResponse.statusText,
      ok: userIdResponse.ok
    });

    if (!userIdResponse.ok) {
      const errorText = await userIdResponse.text();
      return res.status(userIdResponse.status).json({
        success: false,
        error: `get_web_profile_info failed: ${errorText}`,
        step: 'user_id_lookup'
      });
    }

    const userData = await userIdResponse.json();
    console.log('🔍 DIAGNOSTIC - Données utilisateur:', {
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
        success: false,
        error: `User not found: @${username}`,
        step: 'user_id_lookup',
        debug: userData
      });
    }

    // Test 2: Récupérer les clips
    console.log('🔍 DIAGNOSTIC - Test 2: Récupération clips pour ID:', userId);
    
    const clipsResponse = await fetch(`${starapiUrl}/instagram/user/get_clips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify({
        id: parseInt(userId),
        count: 50
      })
    });

    console.log('🔍 DIAGNOSTIC - Réponse get_clips:', {
      status: clipsResponse.status,
      statusText: clipsResponse.statusText,
      ok: clipsResponse.ok
    });

    if (!clipsResponse.ok) {
      const errorText = await clipsResponse.text();
      return res.status(clipsResponse.status).json({
        success: false,
        error: `get_clips failed: ${errorText}`,
        step: 'clips_lookup',
        userId: userId
      });
    }

    const clipsData = await clipsResponse.json();
    console.log('🔍 DIAGNOSTIC - Données clips brutes:', {
      status: clipsData.status,
      hasResponse: !!clipsData.response,
      hasBody: !!clipsData.response?.body,
      hasItems: !!clipsData.response?.body?.items,
      itemsCount: clipsData.response?.body?.items?.length || 0
    });

    // Test 3: Analyser la structure des clips
    const clips = clipsData.response?.body?.items || [];
    console.log('🔍 DIAGNOSTIC - Analyse des clips:', {
      totalClips: clips.length,
      mediaTypes: clips.map((c: any) => c.media_type).filter((v: any, i: any, a: any) => a.indexOf(v) === i),
      clipsWithImages: clips.filter((c: any) => c.image_versions2?.candidates?.length > 0).length,
      clipsWithFirstFrame: clips.filter((c: any) => c.image_versions2?.additional_candidates?.first_frame?.url).length
    });

    // Test 4: Filtrer les reels (media_type = 2 ou 8)
    const reelClips = clips.filter((clip: any) => clip.media_type === 2 || clip.media_type === 8);
    console.log('🔍 DIAGNOSTIC - Reels filtrés:', {
      reelCount: reelClips.length,
      reelIds: reelClips.slice(0, 5).map((c: any) => c.id),
      reelMediaTypes: reelClips.map((c: any) => c.media_type)
    });

    // Test 5: Vérifier les URLs d'images
    const reelsWithUrls = reelClips.filter((clip: any) => {
      let hasUrl = false;
      
      if (clip.media_type === 2) {
        hasUrl = !!(clip.image_versions2?.additional_candidates?.first_frame?.url ||
                   clip.image_versions2?.candidates?.[0]?.url ||
                   clip.image_versions2?.candidates?.[1]?.url);
      } else if (clip.media_type === 8 && clip.carousel_media) {
        const firstVideo = clip.carousel_media.find((item: any) => item.media_type === 2);
        if (firstVideo) {
          hasUrl = !!(firstVideo.image_versions2?.additional_candidates?.first_frame?.url ||
                     firstVideo.image_versions2?.candidates?.[0]?.url ||
                     firstVideo.image_versions2?.candidates?.[1]?.url);
        }
      }
      
      return hasUrl;
    });

    console.log('🔍 DIAGNOSTIC - Reels avec URLs:', {
      reelsWithUrlsCount: reelsWithUrls.length,
      sampleReels: reelsWithUrls.slice(0, 3).map((c: any) => ({
        id: c.id,
        media_type: c.media_type,
        hasFirstFrame: !!c.image_versions2?.additional_candidates?.first_frame?.url,
        hasCandidates: c.image_versions2?.candidates?.length > 0
      }))
    });

    // Retourner le diagnostic complet
    return res.status(200).json({
      success: true,
      diagnostic: {
        username,
        userId,
        totalClips: clips.length,
        reelClips: reelClips.length,
        reelsWithUrls: reelsWithUrls.length,
        mediaTypes: clips.map((c: any) => c.media_type).filter((v: any, i: any, a: any) => a.indexOf(v) === i),
        sampleReel: reelsWithUrls[0] ? {
          id: reelsWithUrls[0].id,
          media_type: reelsWithUrls[0].media_type,
          hasImage: true
        } : null,
        rawData: test_mode ? clipsData : undefined
      }
    });

  } catch (error) {
    console.error('❌ DIAGNOSTIC - Erreur:', error);
    return res.status(500).json({
      success: false,
      error: 'Diagnostic error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      step: 'general_error'
    });
  }
}
