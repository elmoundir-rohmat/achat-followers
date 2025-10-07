import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Création de paiement Cardinity
 * 
 * Cette route est exécutée côté serveur uniquement.
 * Les clés API Cardinity ne sont jamais exposées au client.
 */

interface PaymentRequest {
  amount: number;
  currency: string;
  order_id: string;
  description: string;
  country: string;
  language: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Autoriser uniquement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      amount,
      currency,
      order_id,
      description,
      country,
      language
    }: PaymentRequest = req.body;

    // Validation des paramètres
    if (!amount || !currency || !order_id || !description) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['amount', 'currency', 'order_id', 'description']
      });
    }

    // Récupérer les clés Cardinity depuis les variables d'environnement SERVEUR
    const consumerKey = process.env.CARDINITY_CONSUMER_KEY;
    const consumerSecret = process.env.CARDINITY_CONSUMER_SECRET;
    const successUrl = process.env.CARDINITY_SUCCESS_URL;
    const cancelUrl = process.env.CARDINITY_CANCEL_URL;

    if (!consumerKey || !consumerSecret || !successUrl || !cancelUrl) {
      console.error('Missing Cardinity configuration');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Cardinity credentials not configured'
      });
    }

    // Créer l'authentification Basic pour Cardinity
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    // Préparer les données de paiement
    const paymentData = {
      amount: amount.toString(),
      currency: currency,
      settle: false,
      description: description,
      order_id: order_id,
      country: country || 'FR',
      payment_method: 'card',
      payment_instrument: {
        pan: '', // Sera rempli par le formulaire Cardinity
        exp_year: 0,
        exp_month: 0,
        cvc: '',
        holder: ''
      },
      threeds2_data: {
        notification_url: successUrl,
        browser_info: {
          accept_header: req.headers.accept || 'text/html',
          browser_language: language || 'fr',
          screen_width: 1920,
          screen_height: 1080,
          challenge_window_size: 'full-screen',
          user_agent: req.headers['user-agent'] || '',
          color_depth: 24,
          time_zone: -60
        }
      }
    };

    console.log('🔐 Création de paiement Cardinity (serveur):', {
      amount,
      currency,
      order_id,
      description
    });

    // Appel API Cardinity
    const cardinityUrl = process.env.CARDINITY_API_URL || 'https://api.cardinity.com/v1/payments';
    
    const response = await fetch(cardinityUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erreur Cardinity:', data);
      return res.status(response.status).json({
        error: 'Payment creation failed',
        details: data
      });
    }

    console.log('✅ Paiement Cardinity créé:', data.id);

    // Retourner la réponse au client (sans exposer les clés)
    return res.status(200).json({
      success: true,
      payment_id: data.id,
      status: data.status,
      authorization_information: data.authorization_information,
      threeds2_data: data.threeds2_data
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
