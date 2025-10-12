import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route pour comparer les media_types et identifier les différences
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

    if (!starapiUrl || !rapidapiKey) {
      return res.status(500).json({ 
        error: 'StarAPI configuration missing'
      });
    }

    // Récupérer l'ID utilisateur
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
        error: `get_web_profile_info failed: ${errorText}`
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

    // Récupérer les clips
    const clipsResponse = await fetch(`${starapiUrl}/instagram/user/get_clips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify({
        id: parseInt(userId),
        count: 10
      })
    });

    if (!clipsResponse.ok) {
      const errorText = await clipsResponse.text();
      return res.status(clipsResponse.status).json({
        success: false,
        error: `get_clips failed: ${errorText}`
      });
    }

    const clipsData = await clipsResponse.json();
    const clips = clipsData.response?.body?.items || [];

    // Analyser chaque clip en détail
    const detailedAnalysis = clips.map((clip: any, index: number) => {
      const mediaType = clip.media_type;
      const mediaTypeString = mediaType === null ? 'null' : 
                             mediaType === undefined ? 'undefined' : 
                             mediaType === 1 ? 'photo' :
                             mediaType === 2 ? 'video/reel' :
                             mediaType === 8 ? 'carousel' :
                             `unknown(${mediaType})`;

      return {
        index,
        id: clip.id,
        media_type: mediaType,
        media_type_string: mediaTypeString,
        has_image_versions2: !!clip.image_versions2,
        has_candidates: !!clip.image_versions2?.candidates,
        candidates_count: clip.image_versions2?.candidates?.length || 0,
        has_additional_candidates: !!clip.image_versions2?.additional_candidates,
        has_first_frame: !!clip.image_versions2?.additional_candidates?.first_frame,
        caption_preview: clip.caption?.text?.substring(0, 50) || 'No caption',
        like_count: clip.like_count,
        comment_count: clip.comment_count,
        view_count: clip.view_count,
        is_reel: mediaType === 2 || mediaType === 8 || mediaType === null || mediaType === undefined
      };
    });

    // Statistiques globales
    const stats = {
      total_clips: clips.length,
      media_type_distribution: clips.reduce((acc: any, clip: any) => {
        const type = clip.media_type === null ? 'null' : 
                    clip.media_type === undefined ? 'undefined' : 
                    clip.media_type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}),
      potential_reels: clips.filter((clip: any) => 
        clip.media_type === 2 || clip.media_type === 8 || 
        clip.media_type === null || clip.media_type === undefined
      ).length,
      clips_with_urls: clips.filter((clip: any) => {
        const hasCandidates = clip.image_versions2?.candidates?.length > 0;
        const hasFirstFrame = !!clip.image_versions2?.additional_candidates?.first_frame;
        return hasCandidates || hasFirstFrame;
      }).length
    };

    return res.status(200).json({
      success: true,
      username,
      userId,
      stats,
      detailed_analysis: detailedAnalysis,
      raw_first_clip: clips[0] || null,
      environment: {
        starapi_url: starapiUrl,
        has_rapidapi_key: !!rapidapiKey,
        node_version: process.version,
        platform: process.platform
      }
    });

  } catch (error) {
    console.error('❌ COMPARE MEDIA TYPES - Erreur:', error);
    return res.status(500).json({
      success: false,
      error: 'Compare error: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
}
