import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Récupération des reels/clips Instagram
 * 
 * Cette route est exécutée côté serveur uniquement.
 * La clé RapidAPI n'est jamais exposée au client.
 */

interface InstagramClipsRequest {
  username: string;
  count?: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Autoriser uniquement GET et POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Récupérer les paramètres
    const username = req.method === 'GET' 
      ? (req.query.username as string)
      : (req.body as InstagramClipsRequest).username;
      
    const count = req.method === 'GET'
      ? parseInt(req.query.count as string) || 12
      : (req.body as InstagramClipsRequest).count || 12;

    if (!username) {
      return res.status(400).json({ 
        error: 'Missing required parameter: username'
      });
    }

    // Récupérer la configuration StarAPI depuis les variables d'environnement
    const starapiUrl = process.env.VITE_STARAPI_URL || process.env.STARAPI_URL;
    const rapidapiKey = process.env.VITE_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY;

    console.log('🔍 Variables d\'environnement StarAPI:', {
      hasStarapiUrl: !!starapiUrl,
      hasRapidapiKey: !!rapidapiKey,
      starapiUrl: starapiUrl ? starapiUrl.substring(0, 30) + '...' : 'NOT_SET',
      rapidapiKey: rapidapiKey ? rapidapiKey.substring(0, 10) + '...' : 'NOT_SET'
    });

    if (!starapiUrl || !rapidapiKey) {
      console.error('Missing StarAPI configuration');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'StarAPI credentials not configured',
        debug: {
          hasStarapiUrl: !!starapiUrl,
          hasRapidapiKey: !!rapidapiKey
        }
      });
    }

    console.log('🎬 Récupération reels Instagram (serveur):', username);
    console.log('🔍 URL de l\'appel StarAPI:', `${starapiUrl}/instagram/user/get_web_profile_info`);

    // Étape 1: Récupérer l'ID utilisateur
    const userIdResponse = await fetch(`${starapiUrl}/instagram/user/get_web_profile_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify({ username })
    });

    console.log('📡 Réponse get_web_profile_info:', {
      status: userIdResponse.status,
      statusText: userIdResponse.statusText,
      ok: userIdResponse.ok
    });

    if (!userIdResponse.ok) {
      const errorText = await userIdResponse.text();
      console.error('❌ Erreur récupération ID utilisateur:', errorText);
      return res.status(userIdResponse.status).json({
        success: false,
        error: `Failed to get user ID: ${errorText}`
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
        success: false,
        error: `User not found: @${username}`,
        debug: userData
      });
    }

    console.log('✅ ID utilisateur trouvé:', userId);

    // Étape 2: Récupérer les reels/clips
    // Demander plus de clips pour compenser le filtrage (certains n'ont pas d'URLs valides)
    const requestBody = {
      id: parseInt(userId),
      count: Math.max(count * 3, 50) // Demander 3x plus pour avoir assez de reels valides
    };

    const clipsResponse = await fetch(`${starapiUrl}/instagram/user/get_clips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!clipsResponse.ok) {
      const errorText = await clipsResponse.text();
      console.error('❌ Erreur récupération clips:', errorText);
      return res.status(clipsResponse.status).json({
        success: false,
        error: `Failed to get clips: ${errorText}`
      });
    }

    const clipsData = await clipsResponse.json();
    console.log('📦 Réponse StarAPI complète:', JSON.stringify(clipsData, null, 2));

    // FIX TEMPORAIRE: Contourner la vérification de structure et traiter directement
    const clips = clipsData.response?.body?.items || [];
    console.log('✅ Clips récupérés (fix temporaire):', clips.length);

    if (clips.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        next_cursor: null,
        debug: {
          status: clipsData.status,
          hasResponse: !!clipsData.response,
          hasBody: !!clipsData.response?.body,
          hasItems: !!clipsData.response?.body?.items,
          message: 'Aucun clip trouvé - structure de réponse inattendue'
        }
      });
    }
    console.log('✅ Clips récupérés:', clips.length);
    console.log('🔍 Types de médias trouvés:', clips.map((c: any) => c.media_type).filter((v: any, i: any, a: any) => a.indexOf(v) === i));

    // Filtrer uniquement les reels/clips (media_type = 2 ou 8)
    const reelClips = clips.filter((clip: any) => {
      const isReel = clip.media_type === 2 || clip.media_type === 8;
      if (!isReel) {
        console.log(`❌ Clip filtré (media_type: ${clip.media_type}):`, clip.id);
      }
      return isReel;
    });
    
    console.log('🎬 Reels après filtrage media_type:', reelClips.length);

    // Transformer les clips au format attendu
    const transformedClips = reelClips.map((clip: any) => {
      let mediaUrl = '';
      let thumbnailUrl = '';
      
      if (clip.media_type === 2) {
        // Pour les vidéos/reels, essayer plusieurs sources d'images
        mediaUrl = clip.image_versions2?.additional_candidates?.first_frame?.url || 
                  clip.image_versions2?.candidates?.[0]?.url ||
                  clip.image_versions2?.candidates?.[1]?.url || '';
        thumbnailUrl = clip.image_versions2?.candidates?.[0]?.url || 
                      clip.image_versions2?.candidates?.[1]?.url ||
                      clip.image_versions2?.additional_candidates?.first_frame?.url || '';
      } else if (clip.media_type === 8 && clip.carousel_media) {
        // Pour les carousels, chercher la première vidéo
        const firstVideo = clip.carousel_media.find((item: any) => item.media_type === 2);
        if (firstVideo) {
          mediaUrl = firstVideo.image_versions2?.additional_candidates?.first_frame?.url || 
                    firstVideo.image_versions2?.candidates?.[0]?.url ||
                    firstVideo.image_versions2?.candidates?.[1]?.url || '';
          thumbnailUrl = firstVideo.image_versions2?.candidates?.[0]?.url ||
                        firstVideo.image_versions2?.candidates?.[1]?.url ||
                        firstVideo.image_versions2?.additional_candidates?.first_frame?.url || '';
        } else {
          // Si pas de vidéo, prendre le premier élément du carousel
          const firstItem = clip.carousel_media[0];
          if (firstItem) {
            mediaUrl = firstItem.image_versions2?.candidates?.[0]?.url ||
                      firstItem.image_versions2?.candidates?.[1]?.url || '';
            thumbnailUrl = firstItem.image_versions2?.candidates?.[0]?.url ||
                          firstItem.image_versions2?.candidates?.[1]?.url || '';
          }
        }
      }
      
      return {
        id: clip.id,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        caption: clip.caption?.text || '',
        like_count: clip.like_count || 0,
        comment_count: clip.comment_count || 0,
        view_count: clip.view_count || 0,
        media_type: clip.media_type || 2,
        code: clip.code,
        is_reel: true
      };
    }).filter((clip: any) => {
      const hasValidId = clip.id && clip.id.length > 0;
      const hasValidUrl = (clip.media_url && clip.media_url.length > 0) || 
                         (clip.thumbnail_url && clip.thumbnail_url.length > 0);
      
      if (!hasValidUrl) {
        console.log(`⚠️ Clip filtré (pas d'URL valide):`, clip.id);
      }
      
      // Accepter uniquement les reels avec un ID valide ET au moins une URL
      return hasValidId && hasValidUrl;
    }).slice(0, count);

    console.log(`🎬 Clips finaux: ${transformedClips.length}`);

    // Retourner la réponse
    return res.status(200).json({
      success: true,
      data: transformedClips,
      next_cursor: null
    });

  } catch (error) {
    console.error('❌ Erreur serveur Instagram clips:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
