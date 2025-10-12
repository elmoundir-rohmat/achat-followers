import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Récupération des reels/clips Instagram
 * 
 * CORRECTION: Utilise get_clips (endpoint original) avec la bonne structure
 * Les données sont dans items[].media.media_type (et non items[].media_type)
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

    console.log('🎬 Récupération reels Instagram via get_clips:', username);

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

    // Étape 2: Récupérer les CLIPS via get_clips (endpoint dédié aux reels)
    const requestBody = {
      id: parseInt(userId), // get_clips attend un nombre
      count: count
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

    if (clipsData.status !== 'done' || !clipsData.response?.body?.items) {
      console.error('❌ Structure de réponse invalide');
      return res.status(500).json({
        success: false,
        error: 'Invalid response structure from StarAPI'
      });
    }

    const items = clipsData.response.body.items;
    console.log('✅ Items récupérés:', items.length);

    // IMPORTANT: La structure est items[].media (et non items[] directement)
    const transformedReels = items
      .map((item: any) => {
        const clip = item.media; // Les données sont dans .media !
        
        if (!clip) {
          console.log('❌ Item sans media');
          return null;
        }

        // Vérifier que c'est bien un reel (media_type = 2)
        if (clip.media_type !== 2) {
          console.log(`⚠️ Media type incorrect: ${clip.media_type} (attendu: 2)`);
          return null;
        }

        let mediaUrl = '';
        let thumbnailUrl = '';
        
        // Extraire les URLs des images (thumbnail du reel)
        if (clip.image_versions2) {
          if (clip.image_versions2.candidates && clip.image_versions2.candidates.length > 0) {
            mediaUrl = clip.image_versions2.candidates[0]?.url || '';
            thumbnailUrl = clip.image_versions2.candidates[0]?.url || 
                          clip.image_versions2.candidates[1]?.url || '';
          }
          
          if (!mediaUrl && clip.image_versions2.additional_candidates?.first_frame?.url) {
            mediaUrl = clip.image_versions2.additional_candidates.first_frame.url;
            thumbnailUrl = clip.image_versions2.additional_candidates.first_frame.url;
          }
        }
        
        return {
          id: clip.id,
          media_url: mediaUrl,
          thumbnail_url: thumbnailUrl,
          caption: clip.caption?.text || '',
          like_count: clip.like_count || 0,
          comment_count: clip.comment_count || 0,
          view_count: clip.view_count || clip.play_count || 0,
          media_type: clip.media_type, // Devrait être 2
          code: clip.code,
          is_reel: true
        };
      })
      .filter((reel: any) => {
        if (!reel) return false;
        
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
        
        console.log(`✅ Reel accepté: ${reel.id} (media_type: ${reel.media_type})`);
        return true;
      })
      .slice(0, count);

    console.log(`🎬 Reels finaux: ${transformedReels.length}`);

    return res.status(200).json({
      success: true,
      data: transformedReels,
      next_cursor: clipsData.response?.body?.paging_info?.max_id || null
    });

  } catch (error) {
    console.error('❌ Erreur serveur Instagram clips:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
