/**
 * API Route pour gérer les POST de Cardinity vers /payment/success
 */

export default async function handler(req, res) {
  console.log('🚨 POST reçu vers /payment/success');
  console.log('📋 Method:', req.method);
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 Query:', req.query);

  // Si POST, traiter le callback Cardinity
  if (req.method === 'POST') {
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

      console.log('💳 Données Cardinity:', {
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

        return res.redirect(302, `/?${cancelParams.toString()}`);
      }

      console.log('✅ Paiement approuvé avec succès !');

      // Construire les paramètres pour la redirection vers la page d'accueil
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

      const redirectUrl = `/?${successParams.toString()}`;
      
      console.log('🔄 Redirection vers page d\'accueil avec paramètres:', redirectUrl);

      // Redirection vers la page d'accueil avec tous les paramètres
      res.writeHead(302, {
        Location: redirectUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end();

    } catch (error) {
      console.error('❌ Erreur dans le traitement:', error);
      
      res.writeHead(302, {
        Location: '/?error=processing_error&message=' + encodeURIComponent(error.message),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end();
    }
  }

  // Si GET, rediriger vers la page React
  if (req.method === 'GET') {
    return res.redirect(302, '/payment/success');
  }

  // Autres méthodes
  return res.status(405).json({ error: 'Method not allowed' });
}
