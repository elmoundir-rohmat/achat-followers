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
      id: parseInt(userId), // L'API attend un number, pas une string
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

    // NE PAS retourner si clips.length === 0, continuer le traitement
    // car même avec 0 clips, on doit essayer de les transformer
    console.log('🔍 Types de médias trouvés:', clips.map((c: any) => c.media_type).filter((v: any, i: any, a: any) => a.indexOf(v) === i));

    // Filtrer les reels/clips - accepter media_type = 2, 8, ou null (car l'API StarAPI retourne null)
    const reelClips = clips.filter((clip: any) => {
      const isReel = clip.media_type === 2 || clip.media_type === 8 || clip.media_type === null || clip.media_type === undefined;
      if (!isReel) {
        console.log(`❌ Clip filtré (media_type: ${clip.media_type}):`, clip.id);
      } else {
        console.log(`✅ Clip accepté (media_type: ${clip.media_type}):`, clip.id);
      }
      return isReel;
    });
    
    console.log('🎬 Reels après filtrage media_type:', reelClips.length);
    console.log('🔍 Exemple de reel:', reelClips[0] ? {
      id: reelClips[0].id,
      media_type: reelClips[0].media_type,
      hasImageVersions: !!reelClips[0].image_versions2
    } : 'Aucun reel trouvé');

    // Transformer les clips au format attendu avec extraction robuste des URLs
    const transformedClips = reelClips.map((clip: any) => {
      let mediaUrl = '';
      let thumbnailUrl = '';
      
      // Pour TOUS les types (2, 8, null, undefined), essayer TOUTES les sources possibles
      // Prioriser les candidats standards car ils fonctionnent mieux
      if (clip.image_versions2) {
        // Essayer d'abord les candidates (le plus fiable)
        if (clip.image_versions2.candidates && clip.image_versions2.candidates.length > 0) {
          mediaUrl = clip.image_versions2.candidates[0]?.url || '';
          thumbnailUrl = clip.image_versions2.candidates[0]?.url || 
                        clip.image_versions2.candidates[1]?.url || '';
        }
        
        // Si pas de candidates, essayer first_frame
        if (!mediaUrl && clip.image_versions2.additional_candidates?.first_frame?.url) {
          mediaUrl = clip.image_versions2.additional_candidates.first_frame.url;
          thumbnailUrl = clip.image_versions2.additional_candidates.first_frame.url;
        }
      }
      
      // Pour les carousels (media_type = 8), essayer aussi carousel_media
      if (!mediaUrl && clip.media_type === 8 && clip.carousel_media && clip.carousel_media.length > 0) {
        const firstItem = clip.carousel_media[0];
        if (firstItem?.image_versions2?.candidates?.[0]?.url) {
          mediaUrl = firstItem.image_versions2.candidates[0].url;
          thumbnailUrl = firstItem.image_versions2.candidates[0].url;
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
        media_type: clip.media_type !== null && clip.media_type !== undefined ? clip.media_type : 2,
        code: clip.code,
        is_reel: true
      };
    }).filter((clip: any) => {
      // Accepter uniquement les clips avec ID valide ET au moins une URL
      const hasValidId = clip.id && clip.id.length > 0;
      const hasValidUrl = (clip.media_url && clip.media_url.length > 0) || 
                         (clip.thumbnail_url && clip.thumbnail_url.length > 0);
      
      if (!hasValidId) {
        console.log(`❌ Clip rejeté (pas d'ID):`, clip.id);
        return false;
      }
      
      if (!hasValidUrl) {
        console.log(`❌ Clip rejeté (pas d'URL):`, clip.id);
        return false;
      }
      
      console.log(`✅ Reel accepté:`, clip.id);
      return true;
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
