/**
 * API Route Vercel : Redirection propre pour les callbacks Cardinity
 * 
 * Cette fonction serverless reçoit les POST de Cardinity et redirige proprement
 * vers les pages React SPA avec les paramètres appropriés.
 */

export default async function handler(req, res) {
  // Accepter uniquement POST (Cardinity utilise POST)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log('🔄 Redirection Cardinity reçue:', {
      body: req.body,
      query: req.query,
      headers: req.headers
    });

    // Récupérer les données de Cardinity
    const { 
      order_id, 
      status, 
      amount, 
      currency, 
      id,
      project_id,
      signature 
    } = req.body;

    // Vérifier si c'est une annulation (via query parameter)
    const isCancel = req.query.cancel === 'true';

    if (isCancel) {
      // Redirection vers la page d'annulation
      console.log('❌ Annulation détectée, redirection vers /payment/cancel');
      
      res.writeHead(302, {
        Location: `/payment/cancel?order=${order_id || ''}&status=${status || ''}&error=${req.body?.error || ''}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end();
      return;
    }

    // Vérifier le statut du paiement
    if (status !== 'approved') {
      console.log('⚠️ Paiement non approuvé:', status);
      
      res.writeHead(302, {
        Location: `/payment/cancel?order=${order_id || ''}&status=${status || ''}&error=payment_not_approved`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end();
      return;
    }

    // Paiement approuvé - redirection vers la page de succès
    console.log('✅ Paiement approuvé, redirection vers /payment/success');
    
    // Construire l'URL de redirection avec tous les paramètres importants
    const params = new URLSearchParams({
      order: order_id || '',
      payment_id: id || '',
      amount: amount || '',
      currency: currency || '',
      status: status || '',
      project_id: project_id || ''
    });

    res.writeHead(302, {
      Location: `/payment/success?${params.toString()}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end();

  } catch (error) {
    console.error('❌ Erreur dans la redirection Cardinity:', error);
    
    // En cas d'erreur, rediriger vers la page d'annulation
    res.writeHead(302, {
      Location: '/payment/cancel?error=redirect_error',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end();
  }
}
