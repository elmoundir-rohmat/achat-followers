import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Callback de succès de paiement Cardinity
 * 
 * Cette route reçoit les données de retour de Cardinity après un paiement réussi
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
    console.log('🎉 Callback de succès de paiement reçu:', {
      method: req.method,
      query: req.query,
      body: req.body,
      headers: req.headers
    });

    // Récupérer les paramètres de retour de Cardinity
    const paymentData = req.method === 'POST' ? req.body : req.query;
    
    const {
      project_id,
      order_id,
      amount,
      currency,
      status,
      authorization_information,
      threeds2_data
    } = paymentData;

    console.log('💳 Données de paiement Cardinity:', {
      project_id,
      order_id,
      amount,
      currency,
      status
    });

    // Valider que c'est bien un paiement réussi
    if (status !== 'approved') {
      console.warn('⚠️ Paiement non approuvé:', status);
      return res.redirect('/payment/cancel?error=payment_not_approved&status=' + encodeURIComponent(status));
    }

    // SOLUTION SPA : Rediriger vers la page d'accueil puis naviguer vers success
    // Cela force le rechargement de l'application React
    const redirectUrl = new URL('/', req.headers.origin || 'https://doctorfollowers.com');
    
    // Ajouter un paramètre spécial pour déclencher la navigation SPA
    redirectUrl.searchParams.set('payment_success', 'true');
    if (order_id) redirectUrl.searchParams.set('orderId', order_id);
    if (amount) redirectUrl.searchParams.set('amount', amount);
    if (currency) redirectUrl.searchParams.set('currency', currency);
    if (status) redirectUrl.searchParams.set('status', status);
    
    console.log('✅ Redirection vers accueil avec paramètres de succès:', redirectUrl.toString());
    
    return res.redirect(redirectUrl.toString());

  } catch (error) {
    console.error('❌ Erreur dans le callback de succès:', error);
    
    // En cas d'erreur, rediriger vers la page d'annulation
    return res.redirect('/payment/cancel?error=callback_error&message=' + encodeURIComponent(
      error instanceof Error ? error.message : 'Unknown error'
    ));
  }
}
