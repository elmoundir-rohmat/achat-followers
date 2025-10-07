import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Gestion des retours de succès de paiement Cardinity
 * 
 * Cette route reçoit les données POST de Cardinity après un paiement réussi
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Accepter GET et POST (Cardinity utilise POST)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🎉 Retour de paiement Cardinity reçu:', {
      method: req.method,
      body: req.body,
      query: req.query,
      headers: req.headers
    });

    // Récupérer les données de Cardinity
    const paymentData = req.method === 'POST' ? req.body : req.query;
    
    const {
      amount,
      country,
      created,
      currency,
      description,
      id,
      live,
      order_id,
      payment_method,
      project_id,
      signature,
      status,
      type
    } = paymentData;

    console.log('💳 Données de paiement Cardinity:', {
      id,
      order_id,
      amount,
      currency,
      status,
      description,
      project_id
    });

    // Vérifier que le paiement est approuvé
    if (status !== 'approved') {
      console.warn('⚠️ Paiement non approuvé:', status);
      // Rediriger vers la page d'annulation
      return res.redirect('/payment/cancel?error=payment_not_approved&status=' + encodeURIComponent(status));
    }

    // Sauvegarder les détails du paiement dans localStorage côté client
    // On va rediriger vers une page qui pourra récupérer ces données
    const successData = {
      paymentId: id,
      orderId: order_id,
      amount: parseFloat(amount),
      currency,
      status,
      description,
      paymentMethod: payment_method,
      createdAt: created,
      live: live === 'true'
    };

    // Créer une page HTML qui va rediriger vers la page de succès React
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirection...</title>
</head>
<body>
    <script>
        // Sauvegarder les données de paiement
        localStorage.setItem('paymentSuccess', JSON.stringify(${JSON.stringify(successData)}));
        
        // Rediriger vers la page de succès React
        window.location.href = '/payment/success';
    </script>
    <p>Redirection en cours...</p>
</body>
</html>`;

    return res.status(200).send(html);

  } catch (error) {
    console.error('❌ Erreur dans le traitement du retour de paiement:', error);
    
    // En cas d'erreur, rediriger vers la page d'annulation
    return res.redirect('/payment/cancel?error=processing_error&message=' + encodeURIComponent(
      error instanceof Error ? error.message : 'Unknown error'
    ));
  }
}