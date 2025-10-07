import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Récupération des posts Instagram
 * 
 * Cette route est exécutée côté serveur uniquement.
 * La clé RapidAPI n'est jamais exposée au client.
 */

interface InstagramPostsRequest {
  username: string;
  cursor?: string;
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
      : (req.body as InstagramPostsRequest).username;
      
    const cursor = req.method === 'GET'
      ? (req.query.cursor as string)
      : (req.body as InstagramPostsRequest).cursor;

    if (!username) {
      return res.status(400).json({ 
        error: 'Missing required parameter: username'
      });
    }

    // Récupérer la configuration StarAPI depuis les variables d'environnement
    const starapiUrl = process.env.STARAPI_URL;
    const rapidapiKey = process.env.RAPIDAPI_KEY;

    if (!starapiUrl || !rapidapiKey) {
      console.error('Missing StarAPI configuration');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'StarAPI credentials not configured'
      });
    }

    console.log('📸 Récupération posts Instagram (serveur):', username);

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
      console.error('❌ Erreur récupération ID utilisateur:', errorText);
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

    // Étape 2: Récupérer les posts
    const requestBody = {
      id: userId,
      count: 12,
      ...(cursor && { max_id: cursor })
    };

    const postsResponse = await fetch(`${starapiUrl}/instagram/user/get_media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'starapi1.p.rapidapi.com',
        'x-rapidapi-key': rapidapiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!postsResponse.ok) {
      const errorText = await postsResponse.text();
      console.error('❌ Erreur récupération posts:', errorText);
      return res.status(postsResponse.status).json({
        success: false,
        error: `Failed to get posts: ${errorText}`
      });
    }

    const postsData = await postsResponse.json();

    // Vérifier la structure de réponse
    if (postsData.status !== 'done' || !postsData.response?.body?.items) {
      console.error('❌ Structure de réponse invalide');
      return res.status(500).json({
        success: false,
        error: 'Invalid response structure from StarAPI'
      });
    }

    const posts = postsData.response.body.items;
    console.log('✅ Posts récupérés:', posts.length);

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

    // Retourner la réponse
    return res.status(200).json({
      success: true,
      data: transformedPosts,
      next_cursor: postsData.response.body.next_max_id || null
    });

  } catch (error) {
    console.error('❌ Erreur serveur Instagram posts:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
