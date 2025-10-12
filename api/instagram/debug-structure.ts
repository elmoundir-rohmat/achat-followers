import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route pour déboguer la structure exacte de la réponse StarAPI
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
        count: 5 // Seulement 5 pour voir la structure
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

    // Retourner la structure complète pour analyse
    return res.status(200).json({
      success: true,
      username,
      userId,
      rawResponse: clipsData,
      clipsStructure: {
        hasResponse: !!clipsData.response,
        hasBody: !!clipsData.response?.body,
        hasItems: !!clipsData.response?.body?.items,
        itemsLength: clipsData.response?.body?.items?.length || 0,
        firstItem: clipsData.response?.body?.items?.[0] ? {
          id: clipsData.response.body.items[0].id,
          media_type: clipsData.response.body.items[0].media_type,
          hasImageVersions: !!clipsData.response.body.items[0].image_versions2,
          imageVersionsStructure: clipsData.response.body.items[0].image_versions2 ? {
            hasCandidates: !!clipsData.response.body.items[0].image_versions2.candidates,
            candidatesLength: clipsData.response.body.items[0].image_versions2.candidates?.length || 0,
            hasAdditionalCandidates: !!clipsData.response.body.items[0].image_versions2.additional_candidates
          } : null
        } : null
      }
    });

  } catch (error) {
    console.error('❌ DEBUG STRUCTURE - Erreur:', error);
    return res.status(500).json({
      success: false,
      error: 'Debug error: ' + (error instanceof Error ? error.message : 'Unknown error')
    });
  }
}
