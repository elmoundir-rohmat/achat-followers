// Configuration Cardinity
export const CARDINITY_CONFIG = {
  // Clés Cardinity depuis les variables d'environnement
  consumerKey: import.meta.env.VITE_CARDINITY_CONSUMER_KEY || 'your_consumer_key_here',
  consumerSecret: import.meta.env.VITE_CARDINITY_CONSUMER_SECRET || 'your_consumer_secret_here',
  
  // Project ID pour Hosted Payment Page (différent du consumer_key)
  projectId: import.meta.env.VITE_CARDINITY_PROJECT_ID || 'test_pr_qv9zu05bvo31crposua7589yrjf8uy',
  projectSecret: import.meta.env.VITE_CARDINITY_PROJECT_SECRET || 'tms6iehwwaa1vb8y8xlz4ymygyxmp1nyt0apeizog9wuqbwh6p',
  
  // URLs de callback pour la production
  successUrl: import.meta.env.VITE_CARDINITY_SUCCESS_URL || 'https://doctorfollowers.com/payment/success',
  cancelUrl: import.meta.env.VITE_CARDINITY_CANCEL_URL || 'https://doctorfollowers.com/payment/cancel',
  
  // Configuration par défaut
  currency: 'EUR',
  country: 'FR',
  language: 'fr',
  
  // Mode de test (true pour les clés test, false pour les clés live)
  isTestMode: import.meta.env.VITE_CARDINITY_CONSUMER_KEY?.startsWith('test_') || false
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
