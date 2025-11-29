/**
 * API Route Vercel : Gestion des retours de succès de paiement Cardinity
 * 
 * Cette route reçoit les POST de Cardinity et redirige vers la page de succès
 * avec les paramètres appropriés.
 */

export default async function handler(req, res) {
  // Si GET, rediriger vers la page React normale
  if (req.method === 'GET') {
    console.log('📄 GET request reçu avec params:', req.query);
    
    // Rediriger vers la page React (qui gérera les paramètres)
    return res.redirect(302, '/payment/success');
  }

  // Accepter POST (Cardinity utilise POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🎉 POST reçu de Cardinity vers /api/payment/success');
    console.log('📋 Headers:', req.headers);
    console.log('📦 Body complet:', JSON.stringify(req.body, null, 2));
    console.log('🔍 Query params:', req.query);

    // Récupérer toutes les données de Cardinity
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
      type,
      // Autres paramètres possibles
      error,
      error_description
    } = req.body;

    console.log('💳 Données de paiement extraites:', {
      id,
      order_id,
      amount,
      currency,
      status,
      description,
      payment_method,
      created,
      live,
      type,
      signature: signature ? `${signature.substring(0, 10)}...` : 'none'
    });

    // Vérifier le statut du paiement
    if (status !== 'approved') {
      console.log('⚠️ Paiement non approuvé:', status);
      
      // Redirection vers la page d'annulation avec les paramètres
      const cancelParams = new URLSearchParams({
        order: order_id || '',
        payment_id: id || '',
        status: status || '',
        error: error || 'payment_not_approved',
        error_description: error_description || 'Paiement non approuvé'
      });

      res.writeHead(302, {
        Location: `/payment/cancel?${cancelParams.toString()}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end();
      return;
    }

    // Paiement approuvé - loguer les détails
    console.log('✅ Paiement approuvé avec succès !');
    console.log('💰 Montant:', amount, currency);
    console.log('🆔 Order ID:', order_id);
    console.log('💳 Payment ID:', id);
    console.log('📝 Description:', description);

    // Construire les paramètres pour la redirection (sans données sensibles)
    // Le payment_id n'est pas inclus car c'est une information sensible
    const successParams = new URLSearchParams({
      order: order_id || '',
      amount: amount || '',
      currency: currency || '',
      status: status || '',
      description: description || '',
      payment_method: payment_method || '',
      created: created || '',
      live: live || 'false'
    });

    const redirectUrl = `/payment/success?${successParams.toString()}`;
    
    console.log('🔄 Redirection vers:', redirectUrl);

    // Redirection vers la page de succès avec tous les paramètres
    res.writeHead(302, {
      Location: redirectUrl,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end();

  } catch (error) {
    console.error('❌ Erreur dans /api/payment/success:', error);
    console.error('❌ Stack trace:', error.stack);
    
    // En cas d'erreur, rediriger vers la page d'annulation
    res.writeHead(302, {
      Location: '/payment/cancel?error=processing_error&message=' + encodeURIComponent(error.message),
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end();
  }
}
