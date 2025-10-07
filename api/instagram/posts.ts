import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Récupérer les posts Instagram
 * 
 * Cette route utilise StarAPI (RapidAPI) côté serveur.
 * La clé RapidAPI n'est JAMAIS exposée au client.
 */

interface PostsRequest {
  username: string;
  cursor?: string;
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
      : (req.body as PostsRequest).username;
    
    const cursor = req.method === 'GET'
      ? (req.query.cursor as string | undefined)
      : (req.body as PostsRequest).cursor;

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

    console.log('Fetching Instagram posts for:', username);

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

    // Étape 2: Récupérer les posts
    const requestBody: any = {
      id: userId,
      count: 12
    };

    if (cursor) {
      requestBody.max_id = cursor;
    }

    const postsResponse = await fetch(`${starApiUrl}/instagram/user/get_media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidApiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!postsResponse.ok) {
      return res.status(postsResponse.status).json({
        success: false,
        error: 'Failed to fetch posts'
      });
    }

    const postsData = await postsResponse.json();

    // Vérifier la structure de la réponse
    if (postsData.status === 'done' && postsData.response?.body?.items) {
      const posts = postsData.response.body.items;

      // Transformer les posts au format attendu
      const transformedPosts = posts.map((post: any) => {
        let mediaUrl = '';
        let thumbnailUrl = '';

        if (post.media_type === 8 && post.carousel_media?.length > 0) {
          const firstItem = post.carousel_media[0];
          mediaUrl = firstItem.image_versions2?.candidates?.[0]?.url || '';
          thumbnailUrl = firstItem.image_versions2?.candidates?.[1]?.url || '';
        } else if (post.media_type === 2) {
          mediaUrl = post.image_versions2?.additional_candidates?.first_frame?.url || 
                    post.image_versions2?.candidates?.[0]?.url || '';
          thumbnailUrl = post.image_versions2?.candidates?.[0]?.url || '';
        } else {
          mediaUrl = post.image_versions2?.candidates?.[0]?.url || '';
          thumbnailUrl = post.image_versions2?.candidates?.[1]?.url || '';
        }

        return {
          id: post.id,
          media_url: mediaUrl,
          thumbnail_url: thumbnailUrl,
          caption: post.caption?.text || '',
          like_count: post.like_count || 0,
          comment_count: post.comment_count || 0,
          media_type: post.media_type || 1,
          code: post.code
        };
      });

      return res.status(200).json({
        success: true,
        data: transformedPosts,
        next_cursor: postsData.response.body.next_max_id || null
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Unexpected API response structure'
    });

  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

