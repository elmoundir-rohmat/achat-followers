// Configuration Cardinity
export const CARDINITY_CONFIG = {
  // ⚠️ Les clés Cardinity sont maintenant gérées côté SERVEUR uniquement
  // Elles ne sont JAMAIS exposées au client pour des raisons de sécurité
  
<<<<<<< HEAD
  // Project ID pour Hosted Payment Page (différent du consumer_key)
  projectId: import.meta.env.VITE_CARDINITY_PROJECT_ID || 'test_pr_qv9zu05bvo31crposua7589yrjf8uy',
  projectSecret: import.meta.env.VITE_CARDINITY_PROJECT_SECRET || 'tms6iehwwaa1vb8y8xlz4ymygyxmp1nyt0apeizog9wuqbwh6p',
  
  // URLs de callback pour la production
  successUrl: import.meta.env.VITE_CARDINITY_SUCCESS_URL || 'https://doctorfollowers.com/payment/success.html',
=======
  // URLs de callback (publiques, OK de les exposer)
  successUrl: import.meta.env.VITE_CARDINITY_SUCCESS_URL || 'https://doctorfollowers.com/payment/success',
>>>>>>> version-8e31208
  cancelUrl: import.meta.env.VITE_CARDINITY_CANCEL_URL || 'https://doctorfollowers.com/payment/cancel',
  
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
