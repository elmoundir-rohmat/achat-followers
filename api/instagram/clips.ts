import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Récupérer les reels/clips Instagram
 * 
 * Cette route utilise StarAPI (RapidAPI) côté serveur.
 * La clé RapidAPI n'est JAMAIS exposée au client.
 */

interface ClipsRequest {
  username: string;
  count?: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Autoriser GET et POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Récupérer les paramètres
    const username = req.method === 'GET' 
      ? (req.query.username as string)
      : (req.body as ClipsRequest).username;
    
    const count = req.method === 'GET'
      ? parseInt(req.query.count as string || '12')
      : ((req.body as ClipsRequest).count || 12);

    // Validation
    if (!username) {
      return res.status(400).json({ 
        error: 'Missing required parameter: username' 
      });
    }

    // Récupérer les variables d'environnement serveur
    const starApiUrl = process.env.STARAPI_URL || 'https://starapi1.p.rapidapi.com';
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!rapidApiKey) {
      console.error('Missing RapidAPI key');
      return res.status(500).json({ 
        error: 'Server configuration error. Please contact support.' 
      });
    }

    console.log('Fetching Instagram reels for:', username);

    // Étape 1: Récupérer l'ID utilisateur
    const userIdResponse = await fetch(`${starApiUrl}/instagram/user/get_web_profile_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidApiKey
      },
      body: JSON.stringify({ username })
    });

    if (!userIdResponse.ok) {
      return res.status(userIdResponse.status).json({
        success: false,
        error: 'Failed to fetch user profile'
      });
    }

    const userIdData = await userIdResponse.json();
    const userId = userIdData.response?.body?.data?.user?.id;

    if (!userId) {
      return res.status(404).json({
        success: false,
        error: `User @${username} not found or profile is private`
      });
    }

    // Étape 2: Récupérer les reels/clips
    const clipsResponse = await fetch(`${starApiUrl}/instagram/user/get_clips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidApiKey
      },
      body: JSON.stringify({
        id: parseInt(userId),
        count: Math.max(count * 2, 24)
      })
    });

    if (!clipsResponse.ok) {
      return res.status(clipsResponse.status).json({
        success: false,
        error: 'Failed to fetch clips'
      });
    }

    const clipsData = await clipsResponse.json();

    // Vérifier la structure de la réponse
    if (clipsData.status === 'done' && clipsData.response?.body?.items) {
      const clips = clipsData.response.body.items;

      // Filtrer les reels/vidéos
      const reelClips = clips.filter((clip: any) => 
        clip.media_type === 2 || clip.media_type === 8
      );

      // Transformer les clips
      const transformedClips = reelClips.map((clip: any) => {
        let mediaUrl = '';
        let thumbnailUrl = '';

        if (clip.media_type === 2) {
          mediaUrl = clip.image_versions2?.additional_candidates?.first_frame?.url || 
                    clip.image_versions2?.candidates?.[0]?.url || '';
          thumbnailUrl = clip.image_versions2?.candidates?.[0]?.url || '';
        } else if (clip.media_type === 8 && clip.carousel_media) {
          const firstVideo = clip.carousel_media.find((item: any) => item.media_type === 2);
          if (firstVideo) {
            mediaUrl = firstVideo.image_versions2?.additional_candidates?.first_frame?.url || 
                      firstVideo.image_versions2?.candidates?.[0]?.url || '';
            thumbnailUrl = firstVideo.image_versions2?.candidates?.[0]?.url || '';
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
        const hasEngagement = clip.like_count > 0 || clip.comment_count > 0 || clip.view_count > 0;
        return hasValidId && (hasEngagement || clip.media_url || clip.thumbnail_url);
      }).slice(0, count);

      return res.status(200).json({
        success: true,
        data: transformedClips
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Unexpected API response structure'
    });

  } catch (error) {
    console.error('Error fetching Instagram clips:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

