import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route Vercel : Créer un paiement Cardinity
 * 
 * Cette route est appelée côté serveur uniquement.
 * Les clés Cardinity ne sont JAMAIS exposées au client.
 */

interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
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
    const { amount, currency, orderId, description } = req.body as PaymentRequest;

    // Validation
    if (!amount || !currency || !orderId || !description) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, currency, orderId, description' 
      });
    }

    // Récupérer les variables d'environnement serveur (SANS préfixe VITE_)
    const consumerKey = process.env.CARDINITY_CONSUMER_KEY;
    const consumerSecret = process.env.CARDINITY_CONSUMER_SECRET;
    const successUrl = process.env.CARDINITY_SUCCESS_URL;
    const cancelUrl = process.env.CARDINITY_CANCEL_URL;

    if (!consumerKey || !consumerSecret || !successUrl || !cancelUrl) {
      console.error('Missing Cardinity credentials');
      return res.status(500).json({ 
        error: 'Server configuration error. Please contact support.' 
      });
    }

    // Créer le paiement avec l'API Cardinity
    // Note: Cardinity nécessite OAuth 1.0, ce qui est complexe
    // Pour une implémentation complète, utilisez une bibliothèque OAuth ou le SDK Cardinity
    
    const paymentData = {
      amount: amount,
      currency: currency,
      settle: false,
      description: description,
      order_id: orderId,
      country: 'FR',
      payment_method: 'card',
      payment_instrument: {
        payment_card: 'card'
      },
      threeds2_data: {
        notification_url: `${successUrl}?order_id=${orderId}`,
        browser_info: {
          accept_header: req.headers.accept || '*/*',
          browser_language: req.headers['accept-language']?.split(',')[0] || 'fr-FR',
          screen_width: 1920,
          screen_height: 1080,
          challenge_window_size: '05',
          user_agent: req.headers['user-agent'] || '',
          color_depth: 24,
          time_zone: -60
        }
      }
    };

    console.log('Creating Cardinity payment:', {
      amount,
      currency,
      orderId,
      consumerKey: consumerKey.substring(0, 10) + '...' // Log partiel pour debug
    });

    // Appel à l'API Cardinity
    const cardinityResponse = await fetch('https://api.cardinity.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // OAuth 1.0 signature (simplifiée ici, utilisez une lib en production)
        'Authorization': `OAuth oauth_consumer_key="${consumerKey}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${Math.floor(Date.now() / 1000)}", oauth_nonce="${Math.random().toString(36)}", oauth_version="1.0"`
      },
      body: JSON.stringify(paymentData)
    });

    if (!cardinityResponse.ok) {
      const errorData = await cardinityResponse.json();
      console.error('Cardinity API error:', errorData);
      return res.status(cardinityResponse.status).json({
        error: 'Payment creation failed',
        details: errorData
      });
    }

    const paymentResult = await cardinityResponse.json();

    console.log('Cardinity payment created:', {
      paymentId: paymentResult.id,
      status: paymentResult.status
    });

    // Retourner l'URL de redirection au client
    return res.status(200).json({
      success: true,
      paymentId: paymentResult.id,
      redirectUrl: paymentResult.authorization_information?.url || null,
      status: paymentResult.status
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

