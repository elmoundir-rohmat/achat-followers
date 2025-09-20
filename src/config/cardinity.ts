// Configuration Cardinity
export const CARDINITY_CONFIG = {
  // Clés Cardinity depuis les variables d'environnement
  consumerKey: import.meta.env.VITE_CARDINITY_CONSUMER_KEY || 'your_consumer_key_here',
  consumerSecret: import.meta.env.VITE_CARDINITY_CONSUMER_SECRET || 'your_consumer_secret_here',
  
  // URLs de callback depuis les variables d'environnement
  successUrl: import.meta.env.VITE_CARDINITY_SUCCESS_URL || 'https://your-domain.com/success',
  cancelUrl: import.meta.env.VITE_CARDINITY_CANCEL_URL || 'https://your-domain.com/cancel',
  
  // Configuration par défaut
  currency: 'EUR',
  country: 'FR',
  language: 'fr'
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
