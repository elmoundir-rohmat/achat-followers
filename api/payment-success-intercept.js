/**
 * API Route pour intercepter les POST de Cardinity vers /payment/success
 * 
 * Cette route sera appelée quand Cardinity POST vers /payment/success
 * au lieu de /api/payment/success
 */

export default async function handler(req, res) {
  console.log('🚨 INTERCEPTION: Requête reçue vers /payment/success');
  console.log('📋 Method:', req.method);
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 Query:', req.query);

  // Si GET avec des paramètres, c'est une redirection réussie - aller vers la page de succès
  if (req.method === 'GET' && Object.keys(req.query).length > 0) {
    console.log('📄 GET avec params - Redirection réussie, aller vers page de succès');
    // Construire l'URL avec tous les paramètres pour la page de succès
    const params = new URLSearchParams(req.query);
    const successUrl = `/payment/success?${params.toString()}`;
    console.log('🎯 Redirection vers:', successUrl);
    return res.redirect(302, successUrl);
  }

  // Si GET sans paramètres, rediriger vers la page React
  if (req.method === 'GET') {
    console.log('📄 GET sans params - Rediriger vers page React');
    return res.redirect(302, '/payment/success');
  }

  try {
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
      error,
      error_description
    } = req.body;

    console.log('💳 Données Cardinity interceptées:', {
      id,
      order_id,
      amount,
      currency,
      status,
      description
    });

    // Vérifier le statut du paiement
    if (status !== 'approved') {
      console.log('⚠️ Paiement non approuvé:', status);
      
      const cancelParams = new URLSearchParams({
        order: order_id || '',
        payment_id: id || '',
        status: status || '',
        error: error || 'payment_not_approved',
        error_description: error_description || 'Paiement non approuvé'
      });

      return res.redirect(302, `/payment/cancel?${cancelParams.toString()}`);
    }

    console.log('✅ Paiement approuvé avec succès !');

    // Construire les paramètres pour la redirection
    const successParams = new URLSearchParams({
      order_id: order_id || '',
      id: id || '',
      amount: amount || '',
      currency: currency || '',
      status: status || '',
      description: description || '',
      payment_method: payment_method || '',
      project_id: project_id || '',
      created: created || '',
      live: live || 'false'
    });

    const redirectUrl = `/payment/success?${successParams.toString()}`;
    
    console.log('🔄 Redirection vers page de succès:', redirectUrl);

    // Redirection vers la page de succès avec tous les paramètres
    res.writeHead(302, {
      Location: redirectUrl,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end();

  } catch (error) {
    console.error('❌ Erreur dans l\'interception:', error);
    
    res.writeHead(302, {
      Location: '/payment/cancel?error=processing_error&message=' + encodeURIComponent(error.message),
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end();
  }
}
