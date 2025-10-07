import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Callback d'annulation de paiement Cardinity
 * 
 * Cette route reçoit les données de retour de Cardinity après une annulation
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Accepter GET et POST (Cardinity peut utiliser les deux)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('❌ Callback d\'annulation de paiement reçu:', {
      method: req.method,
      query: req.query,
      body: req.body,
      headers: req.headers
    });

    // Récupérer les paramètres de retour de Cardinity
    const cancelData = req.method === 'POST' ? req.body : req.query;
    
    const {
      project_id,
      order_id,
      amount,
      currency,
      status,
      error,
      error_description
    } = cancelData;

    console.log('🚫 Données d\'annulation Cardinity:', {
      project_id,
      order_id,
      amount,
      currency,
      status,
      error
    });

    // SOLUTION SPA : Rediriger vers la page d'accueil puis naviguer vers cancel
    // Cela force le rechargement de l'application React
    const redirectUrl = new URL('/', req.headers.origin || 'https://doctorfollowers.com');
    
    // Ajouter un paramètre spécial pour déclencher la navigation SPA
    redirectUrl.searchParams.set('payment_cancel', 'true');
    if (order_id) redirectUrl.searchParams.set('orderId', order_id);
    if (error) redirectUrl.searchParams.set('error', error);
    if (error_description) redirectUrl.searchParams.set('error_description', error_description);
    if (status) redirectUrl.searchParams.set('status', status);
    
    console.log('🔄 Redirection vers accueil avec paramètres d\'annulation:', redirectUrl.toString());
    
    return res.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('❌ Erreur dans le callback d\'annulation:', error);
    
    // En cas d'erreur, rediriger vers la page d'annulation avec un message d'erreur générique
    return res.redirect('/payment/cancel?error=callback_error&message=' + encodeURIComponent(
      error instanceof Error ? error.message : 'Unknown error'
    ));
  }
}
