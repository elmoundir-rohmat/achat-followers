/**
 * API Route Vercel : Gestion des annulations de paiement Cardinity
 * 
 * Cette route reçoit les POST/GET de Cardinity pour les annulations
 * et redirige vers la page d'annulation.
 */

export default async function handler(req, res) {
  // Si GET, rediriger vers la page React normale
  if (req.method === 'GET') {
    console.log('📄 GET request reçu avec params:', req.query);
    
    // Rediriger vers la page React (qui gérera les paramètres)
    return res.redirect(302, '/payment/cancel');
  }

  // Accepter POST et GET (Cardinity peut utiliser les deux)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('❌ Annulation reçue de Cardinity vers /api/payment/cancel');
    console.log('📋 Method:', req.method);
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    console.log('🔍 Query:', req.query);

    // Récupérer les données (POST = body, GET = query)
    const data = req.method === 'POST' ? req.body : req.query;
    
    const {
      order_id,
      payment_id,
      amount,
      currency,
      status,
      error,
      error_description,
      project_id,
      signature
    } = data;

    console.log('🚫 Données d\'annulation:', {
      order_id,
      payment_id,
      amount,
      currency,
      status,
      error,
      error_description,
      project_id
    });

    // Construire les paramètres pour la redirection
    const cancelParams = new URLSearchParams({
      order: order_id || '',
      payment_id: payment_id || '',
      amount: amount || '',
      currency: currency || '',
      status: status || '',
      error: error || 'payment_cancelled',
      error_description: error_description || 'Paiement annulé par l\'utilisateur'
    });

    const redirectUrl = `/payment/cancel?${cancelParams.toString()}`;
    
    console.log('🔄 Redirection vers:', redirectUrl);

    // Redirection vers la page d'annulation
    res.writeHead(302, {
      Location: redirectUrl,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end();

  } catch (error) {
    console.error('❌ Erreur dans /api/payment/cancel:', error);
    
    // En cas d'erreur, rediriger vers la page d'annulation avec erreur générique
    res.writeHead(302, {
      Location: '/payment/cancel?error=processing_error',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end();
  }
}
