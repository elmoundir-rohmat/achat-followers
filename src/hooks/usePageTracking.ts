import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = "G-NQQTB4E4ZZ";

// Fonction pour initialiser Google Analytics
export function initializeGA() {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

// Fonction pour tracker les changements de page
export function trackPageView(page: string, title?: string) {
  ReactGA.send({ 
    hitType: "pageview", 
    page: page,
    title: title || page 
  });
}

// Hook pour l'initialisation (appelé une seule fois)
export function usePageTracking() {
  useEffect(() => {
    // Initialiser Google Analytics au chargement de l'app
    initializeGA();
    
    // Envoyer le premier pageview
    trackPageView(window.location.pathname, document.title);
  }, []);
}

// Fonction utilitaire pour tracker les événements
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  ReactGA.event({
    action,
    category,
    label,
    value
  });
};

// Fonction utilitaire pour tracker les conversions
export const trackPurchase = (transactionId: string, value: number, currency: string = 'EUR') => {
  ReactGA.event({
    action: 'purchase',
    category: 'ecommerce',
    transaction_id: transactionId,
    value,
    currency
  });
};
