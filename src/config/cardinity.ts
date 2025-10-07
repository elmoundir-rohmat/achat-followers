// Configuration Cardinity (côté client - UNIQUEMENT URLs publiques)
export const CARDINITY_CONFIG = {
  // URLs de callback pour la production (variables publiques, préfixe VITE_ conservé)
  successUrl: import.meta.env.VITE_CARDINITY_SUCCESS_URL || window.location.origin + '/payment/success',
  cancelUrl: import.meta.env.VITE_CARDINITY_CANCEL_URL || window.location.origin + '/payment/cancel',
  
  // Configuration par défaut
  currency: 'EUR',
  country: 'FR',
  language: 'fr',
  
  // API Route interne (appelle le serveur Vercel qui a les clés secrètes)
  apiEndpoint: '/api/cardinity/create-payment'
};

// Types pour TypeScript
declare global {
  interface Window {
    Cardinity: any;
  }
}

export interface CardinityPaymentData {
  amount: number;
  currency: string;
  country: string;
  language: string;
  order_id: string;
  description: string;
  success_url: string;
  cancel_url: string;
}
