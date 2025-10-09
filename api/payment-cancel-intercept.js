/**
 * API Route pour intercepter les POST/GET de Cardinity vers /payment/cancel
 */

export default async function handler(req, res) {
  console.log('🚨 INTERCEPTION: Requête reçue vers /payment/cancel');
  console.log('📋 Method:', req.method);
  console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 Query:', req.query);

  // Si GET, rediriger vers la page React normale
  if (req.method === 'GET') {
    return res.redirect(302, '/payment/cancel');
  }

  // Si POST, traiter l'annulation
  if (req.method === 'POST') {
    try {
      const data = req.body;
      
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

      console.log('🚫 Données d\'annulation interceptées:', {
        order_id,
        payment_id,
        amount,
        currency,
        status,
        error,
        error_description
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
      
      console.log('🔄 Redirection vers page d\'annulation:', redirectUrl);

      // Redirection vers la page d'annulation
      res.writeHead(302, {
        Location: redirectUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end();
      return;

    } catch (error) {
      console.error('❌ Erreur dans l\'interception cancel:', error);
      
      res.writeHead(302, {
        Location: '/payment/cancel?error=processing_error',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end();
      return;
    }
  }

  // Autres méthodes
  res.status(405).json({ error: 'Method not allowed' });
}
