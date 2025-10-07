import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Gestion des annulations de paiement Cardinity
 * 
 * Cette route reçoit les données POST/GET de Cardinity après une annulation
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
    console.log('❌ Annulation de paiement Cardinity reçue:', {
      method: req.method,
      body: req.body,
      query: req.query,
      headers: req.headers
    });

    // Récupérer les données de Cardinity
    const cancelData = req.method === 'POST' ? req.body : req.query;
    
    const {
      amount,
      country,
      currency,
      description,
      id,
      order_id,
      payment_method,
      project_id,
      signature,
      status,
      type,
      error,
      error_description
    } = cancelData;

    console.log('🚫 Données d\'annulation Cardinity:', {
      id,
      order_id,
      amount,
      currency,
      status,
      error
    });

    // Créer une page HTML qui va rediriger vers la page d'annulation React
    const cancelInfo = {
      paymentId: id,
      orderId: order_id,
      amount: amount ? parseFloat(amount) : null,
      currency,
      status,
      error,
      errorDescription: error_description,
      description
    };

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirection...</title>
</head>
<body>
    <script>
        // Sauvegarder les données d'annulation
        localStorage.setItem('paymentCancel', JSON.stringify(${JSON.stringify(cancelInfo)}));
        
        // Rediriger vers la page d'annulation React
        window.location.href = '/payment/cancel';
    </script>
    <p>Redirection en cours...</p>
</body>
</html>`;

    return res.status(200).send(html);

  } catch (error) {
    console.error('❌ Erreur dans le traitement de l\'annulation:', error);
    
    // En cas d'erreur, rediriger directement vers la page d'annulation
    return res.redirect('/payment/cancel?error=processing_error');
  }
}