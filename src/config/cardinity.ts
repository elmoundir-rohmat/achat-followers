// Configuration Cardinity
export const CARDINITY_CONFIG = {
  // ⚠️ Les clés Cardinity sont maintenant gérées côté SERVEUR uniquement
  // Elles ne sont JAMAIS exposées au client pour des raisons de sécurité
  
  // URLs de callback (publiques, OK de les exposer)
  // SOLUTION PROPRE: Fonction serverless avec redirection 302
  successUrl: import.meta.env.VITE_CARDINITY_SUCCESS_URL || 'https://doctorfollowers.com/api/cardinity-redirect',
  cancelUrl: import.meta.env.VITE_CARDINITY_CANCEL_URL || 'https://doctorfollowers.com/api/cardinity-redirect?cancel=true',
  
  // Configuration par défaut
  currency: 'EUR',
  country: 'FR',
  language: 'fr',
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
