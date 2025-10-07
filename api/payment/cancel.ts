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

    // Rediriger vers la page d'annulation avec les paramètres
    const cancelUrl = new URL('/payment/cancel', req.headers.origin || 'https://doctorfollowers.com');
    
    // Ajouter les paramètres d'annulation
    if (order_id) cancelUrl.searchParams.set('orderId', order_id);
    if (error) cancelUrl.searchParams.set('error', error);
    if (error_description) cancelUrl.searchParams.set('error_description', error_description);
    if (status) cancelUrl.searchParams.set('status', status);
    
    console.log('🔄 Redirection vers page d\'annulation:', cancelUrl.toString());
    
    return res.redirect(cancelUrl.toString());

  } catch (error) {
    console.error('❌ Erreur dans le callback d\'annulation:', error);
    
    // En cas d'erreur, rediriger vers la page d'annulation avec un message d'erreur générique
    return res.redirect('/payment/cancel?error=callback_error&message=' + encodeURIComponent(
      error instanceof Error ? error.message : 'Unknown error'
    ));
  }
}
