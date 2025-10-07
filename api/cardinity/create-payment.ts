import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

/**
 * API Route Vercel : Création de paiement Cardinity
 * 
 * Cette route est exécutée côté serveur uniquement.
 * Les clés API Cardinity ne sont jamais exposées au client.
 */

interface PaymentRequest {
  amount: number;
  orderId: string;
  description: string;
  currency: string;
  country: string;
  language: string;
  returnUrl: string;
  cancelUrl: string;
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
      orderId,
      description,
      currency,
      country,
      language,
      returnUrl,
      cancelUrl
    }: PaymentRequest = req.body;

    // Validation des paramètres
    if (!amount || !currency || !orderId || !description) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        required: ['amount', 'currency', 'orderId', 'description']
      });
    }

    // Configuration pour Hosted Payment Page
    const projectId = process.env.CARDINITY_PROJECT_ID;
    const projectSecret = process.env.CARDINITY_PROJECT_SECRET;
    const successUrlFinal = returnUrl || process.env.CARDINITY_SUCCESS_URL;
    const cancelUrlFinal = cancelUrl || process.env.CARDINITY_CANCEL_URL;

    if (!projectId || !projectSecret) {
      console.error('Missing Cardinity Hosted Payment Page configuration');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Cardinity Hosted Payment Page credentials not configured'
      });
    }

    // Paramètres pour la Hosted Payment Page Cardinity
    const params = {
      amount: amount.toFixed(2),
      currency: currency,
      country: country || 'FR',
      language: language || 'fr',
      order_id: orderId,
      description: description,
      project_id: projectId,
      return_url: successUrlFinal,
      cancel_url: cancelUrlFinal,
      // Ajouter des paramètres optionnels pour une meilleure compatibilité
      payment_method: 'card'
    };

    // Générer la signature HMAC-SHA256
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => key + params[key])
      .join('');
    
    const signature = crypto
      .createHmac('sha256', projectSecret)
      .update(sortedParams)
      .digest('hex');

    console.log('🔐 Création de paiement Hosted Payment Page:', {
      amount,
      currency,
      orderId,
      description
    });

    // Retourner les paramètres signés pour le formulaire
    return res.status(200).json({
      ...params,
      signature: signature
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
