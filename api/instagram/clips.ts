import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Récupération des reels/clips Instagram
 * 
 * CORRECTION: Utilise get_media au lieu de get_clips pour obtenir
 * les reels avec le bon media_type = 2
 */

interface InstagramClipsRequest {
  username: string;
  count?: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    const starapiUrl = process.env.VITE_STARAPI_URL || process.env.STARAPI_URL;
    const rapidapiKey = process.env.VITE_RAPIDAPI_KEY || process.env.RAPIDAPI_KEY;

    if (!starapiUrl || !rapidapiKey) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'StarAPI credentials not configured'
      });
    }

    console.log('🎬 Récupération reels Instagram via get_media:', username);

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

    if (!userIdResponse.ok) {
      const errorText = await userIdResponse.text();
      return res.status(userIdResponse.status).json({
        success: false,
        error: `Failed to get user ID: ${errorText}`
      });
    }

    const userData = await userIdResponse.json();
    const userId = userData.response?.body?.data?.user?.id;

    if (!userId) {
      return res.status(404).json({
        success: false,
        error: `User not found: @${username}`
      });
    }

    console.log('✅ ID utilisateur trouvé:', userId);

    // Étape 2: Récupérer TOUS les médias via get_media (même endpoint que les posts)
    const requestBody = {
      id: userId, // STRING comme pour les posts, pas parseInt()
      count: Math.max(count * 3, 50) // Demander plus pour compenser le filtrage
    };

    const mediaResponse = await fetch(`${starapiUrl}/instagram/user/get_media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!mediaResponse.ok) {
      const errorText = await mediaResponse.text();
      console.error('❌ Erreur récupération media:', errorText);
      return res.status(mediaResponse.status).json({
        success: false,
        error: `Failed to get media: ${errorText}`
      });
    }

    const mediaData = await mediaResponse.json();

    if (mediaData.status !== 'done' || !mediaData.response?.body?.items) {
      console.error('❌ Structure de réponse invalide');
      return res.status(500).json({
        success: false,
        error: 'Invalid response structure from StarAPI'
      });
    }

    const allMedia = mediaData.response.body.items;
    console.log('✅ Médias récupérés:', allMedia.length);

    // Filtrer UNIQUEMENT les reels/vidéos (media_type = 2)
    const reels = allMedia.filter((media: any) => media.media_type === 2);
    console.log('🎬 Reels filtrés (media_type = 2):', reels.length);

    // Transformer les reels au format attendu
    const transformedReels = reels.map((reel: any) => {
      let mediaUrl = '';
      let thumbnailUrl = '';
      
      // Pour les vidéos/reels (media_type = 2)
      if (reel.image_versions2) {
        // Essayer d'abord les candidates (le plus fiable)
        if (reel.image_versions2.candidates && reel.image_versions2.candidates.length > 0) {
          mediaUrl = reel.image_versions2.candidates[0]?.url || '';
          thumbnailUrl = reel.image_versions2.candidates[0]?.url || 
                        reel.image_versions2.candidates[1]?.url || '';
        }
        
        // Si pas de candidates, essayer first_frame
        if (!mediaUrl && reel.image_versions2.additional_candidates?.first_frame?.url) {
          mediaUrl = reel.image_versions2.additional_candidates.first_frame.url;
          thumbnailUrl = reel.image_versions2.additional_candidates.first_frame.url;
        }
      }
      
      return {
        id: reel.id,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        caption: reel.caption?.text || '',
        like_count: reel.like_count || 0,
        comment_count: reel.comment_count || 0,
        view_count: reel.view_count || 0,
        media_type: 2, // Toujours 2 pour les reels
        code: reel.code,
        is_reel: true
      };
    }).filter((reel: any) => {
      // Accepter uniquement les reels avec ID valide ET au moins une URL
      const hasValidId = reel.id && reel.id.length > 0;
      const hasValidUrl = (reel.media_url && reel.media_url.length > 0) || 
                         (reel.thumbnail_url && reel.thumbnail_url.length > 0);
      
      if (!hasValidId) {
        console.log(`❌ Reel rejeté (pas d'ID):`, reel.id);
        return false;
      }
      
      if (!hasValidUrl) {
        console.log(`❌ Reel rejeté (pas d'URL):`, reel.id);
        return false;
      }
      
      console.log(`✅ Reel accepté:`, reel.id);
      return true;
    }).slice(0, count); // Limiter au nombre demandé

    console.log(`🎬 Reels finaux: ${transformedReels.length}`);

    return res.status(200).json({
      success: true,
      data: transformedReels,
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
