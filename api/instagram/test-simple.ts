import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route de test ultra-simple pour diagnostiquer le problème
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ 
        error: 'Missing username parameter'
      });
    }

    // Configuration StarAPI
    const starapiUrl = process.env.VITE_STARAPI_URL || process.env.STARAPI_URL;
    const rapidapiKey = process.env.VITE_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY;

    console.log('🔍 TEST SIMPLE - Configuration:', {
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
    console.log('🔍 TEST SIMPLE - Étape 1: Récupération ID pour @' + username);
    
    const userIdResponse = await fetch(`${starapiUrl}/instagram/user/get_web_profile_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify({ username })
    });

    console.log('🔍 TEST SIMPLE - Réponse get_web_profile_info:', {
      status: userIdResponse.status,
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
    const userId = userData.response?.body?.data?.user?.id;

    console.log('🔍 TEST SIMPLE - ID utilisateur:', userId);

    if (!userId) {
      return res.status(404).json({
        success: false,
        error: `User not found: @${username}`,
        step: 'user_id_lookup',
        debug: userData
      });
    }

    // Test 2: Récupérer les clips
    console.log('🔍 TEST SIMPLE - Étape 2: Récupération clips pour ID:', userId);
    
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

    console.log('🔍 TEST SIMPLE - Réponse get_clips:', {
      status: clipsResponse.status,
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
    const clips = clipsData.response?.body?.items || [];

    console.log('🔍 TEST SIMPLE - Clips bruts:', {
      totalClips: clips.length,
      mediaTypes: clips.map((c: any) => c.media_type).filter((v: any, i: any, a: any) => a.indexOf(v) === i),
      firstClip: clips[0] ? {
        id: clips[0].id,
        media_type: clips[0].media_type,
        hasImageVersions: !!clips[0].image_versions2
      } : null
    });

    // Test 3: Filtrer les reels
    const reelClips = clips.filter((clip: any) => clip.media_type === 2 || clip.media_type === 8);
    
    console.log('🔍 TEST SIMPLE - Reels filtrés:', {
      reelCount: reelClips.length,
      firstReel: reelClips[0] ? {
        id: reelClips[0].id,
        media_type: reelClips[0].media_type
      } : null
    });

    // Test 4: Transformer (sans filtrage strict)
    const transformedClips = reelClips.map((clip: any) => ({
      id: clip.id,
      media_url: clip.image_versions2?.candidates?.[0]?.url || '',
      thumbnail_url: clip.image_versions2?.candidates?.[1]?.url || '',
      caption: clip.caption?.text || '',
      like_count: clip.like_count || 0,
      comment_count: clip.comment_count || 0,
      view_count: clip.view_count || 0,
      media_type: clip.media_type || 2,
      code: clip.code,
      is_reel: true
    }));

    console.log('🔍 TEST SIMPLE - Clips transformés:', {
      transformedCount: transformedClips.length,
      firstTransformed: transformedClips[0] ? {
        id: transformedClips[0].id,
        hasMediaUrl: !!transformedClips[0].media_url,
        hasThumbnailUrl: !!transformedClips[0].thumbnail_url
      } : null
    });

    // Retourner TOUS les reels transformés, même sans URLs
    return res.status(200).json({
      success: true,
      data: transformedClips,
      next_cursor: null,
      debug: {
        username,
        userId,
        totalClips: clips.length,
        mediaTypes: clips.map((c: any) => c.media_type).filter((v: any, i: any, a: any) => a.indexOf(v) === i),
        reelClips: reelClips.length,
        transformedClips: transformedClips.length,
        configuration: {
          hasStarapiUrl: !!starapiUrl,
          hasRapidapiKey: !!rapidapiKey
        }
      }
    });

  } catch (error) {
    console.error('❌ TEST SIMPLE - Erreur:', error);
    return res.status(500).json({
      success: false,
      error: 'Test error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      step: 'general_error'
    });
  }
}
