/**
 * Route de test pour simuler un callback Cardinity
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧪 Test de paiement simulé');
    
    // Simuler les données de Cardinity
    const mockCardinityData = {
      amount: "0.99",
      country: "FR",
      created: new Date().toISOString(),
      currency: "EUR",
      description: "25 followers Instagram",
      id: "test-payment-" + Date.now(),
      live: "false",
      order_id: req.body.orderId || "TEST-ORDER-123",
      payment_method: "card",
      project_id: "test_pr_qv9zu05bvo31crposua7589yrjf8uy",
      signature: "test-signature",
      status: "approved", // Simuler un paiement approuvé
      type: "purchase"
    };

    console.log('📦 Données simulées:', mockCardinityData);

    // Appeler notre API de succès avec les données simulées
    const response = await fetch('https://www.doctorfollowers.com/api/payment/success', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(mockCardinityData)
    });

    console.log('📡 Réponse de l\'API:', response.status, response.statusText);

    if (response.status === 302) {
      const location = response.headers.get('location');
      console.log('🔄 Redirection vers:', location);
      
      res.writeHead(302, {
        Location: location
      });
      res.end();
    } else {
      res.status(500).json({ 
        error: 'API de succès n\'a pas retourné 302',
        status: response.status,
        response: await response.text()
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans le test:', error);
    res.status(500).json({ error: error.message });
  }
}
