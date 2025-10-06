# 🔧 Dépannage Cardinity - Guide de résolution

## 🚨 Problème : "Système de paiement Cardinity non disponible"

### Causes possibles et solutions

## 1. 🔍 Vérifications de base

### Ouvrir la console du navigateur (F12)
Vérifiez ces messages :
- ✅ `"Cardinity SDK chargé avec succès"` → SDK OK
- ❌ `"Erreur de chargement du SDK Cardinity"` → Problème de réseau
- ❌ `"Timeout: Cardinity SDK non chargé"` → SDK ne se charge pas

### Vérifier les variables d'environnement
```javascript
// Dans la console du navigateur
console.log('Consumer Key:', import.meta.env.VITE_CARDINITY_CONSUMER_KEY);
console.log('Success URL:', import.meta.env.VITE_CARDINITY_SUCCESS_URL);
```

## 2. 🌐 Problèmes de réseau/DNS

### Vérifier l'accès à l'API Cardinity
```bash
# Tester l'accès au SDK
curl -I https://cdn.cardinity.com/js/cardinity.js
```

### Solutions :
- ✅ Vérifier la connexion internet
- ✅ Désactiver les bloqueurs de publicité
- ✅ Vérifier les paramètres de sécurité du navigateur

## 3. 🔑 Problèmes de configuration

### Vérifier les clés Cardinity
```env
# Doit commencer par "test_" pour les clés de test
VITE_CARDINITY_CONSUMER_KEY=test_fganqfvtqbnrtclixdcvkxpbrnixfh
VITE_CARDINITY_CONSUMER_SECRET=azlhhkau4w8mh1q8hssxguq6dtzbvww4rfkfi8db4yhxm39ey1
```

### Vérifier les URLs de callback
```env
# Doivent être accessibles publiquement
VITE_CARDINITY_SUCCESS_URL=https://doctorfollowers.com/payment/success
VITE_CARDINITY_CANCEL_URL=https://doctorfollowers.com/payment/cancel
```

## 4. 🏠 Problèmes de domaine

### Vérifier le whitelist chez Cardinity
- ✅ Le domaine `doctorfollowers.com` doit être whitelisté
- ✅ Les URLs de callback doivent être autorisées
- ✅ Le certificat SSL doit être valide

### Tester les URLs de callback
```bash
# Tester l'accessibilité
curl -I https://doctorfollowers.com/payment/success
curl -I https://doctorfollowers.com/payment/cancel
```

## 5. 🔧 Solutions de dépannage

### Solution 1 : Recharger la page
- Cliquer sur le bouton "Actualiser" dans l'erreur
- Ou actualiser manuellement (F5)

### Solution 2 : Vider le cache
- Ctrl+Shift+R (rechargement forcé)
- Ou vider le cache du navigateur

### Solution 3 : Tester dans un autre navigateur
- Chrome, Firefox, Safari
- Mode incognito/privé

### Solution 4 : Vérifier les logs Cardinity
- Se connecter au dashboard Cardinity
- Vérifier les logs de paiement
- Vérifier les erreurs d'API

## 6. 🧪 Test de diagnostic

### Script de test dans la console
```javascript
// Tester la disponibilité du SDK
console.log('Cardinity disponible:', typeof window.Cardinity !== 'undefined');

// Tester la configuration
console.log('Consumer Key:', import.meta.env.VITE_CARDINITY_CONSUMER_KEY);
console.log('Success URL:', import.meta.env.VITE_CARDINITY_SUCCESS_URL);

// Tester la création d'un paiement
if (window.Cardinity) {
  console.log('SDK Cardinity OK');
} else {
  console.log('SDK Cardinity manquant');
}
```

## 7. 📞 Support Cardinity

### Informations à fournir
- URL du site : `https://doctorfollowers.com`
- Consumer Key : `test_fganqfvtqbnrtclixdcvkxpbrnixfh`
- Messages d'erreur de la console
- Logs du navigateur

### Contact
- Email : support@cardinity.com
- Documentation : https://developers.cardinity.com/

## 8. ✅ Checklist de vérification

- [ ] SDK Cardinity se charge (console)
- [ ] Variables d'environnement définies
- [ ] URLs de callback accessibles
- [ ] Domaine whitelisté chez Cardinity
- [ ] Certificat SSL valide
- [ ] Pas de bloqueurs de publicité
- [ ] Connexion internet stable

---

**🎯 Si le problème persiste, contactez le support Cardinity avec ces informations.**
