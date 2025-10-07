# Instructions de déploiement - Correction problème 404 sur /payment/success

## 🎯 Problème identifié et résolu

Les pages de paiement (`/payment/success`, `/payment/cancel`, `/pay`) retournaient une erreur 404 après paiement Cardinity, mais fonctionnaient après refresh.

## ✅ Solutions appliquées (7 octobre 2025)

### 1. Redirections Netlify (SPA routing)
- ✅ `public/_redirects` - Redirections pour routes de paiement
- ✅ `netlify.toml` - Configuration Netlify avec redirections explicites

### 2. Corrections critiques (NOUVELLES)
- ✅ **`payment-callback.js`** - Changement 303 → 302 + URL absolue
- ✅ **`index.html`** - Ajout d'un loader avant rendu React
- ✅ **`cardinity.ts`** - Correction successUrl par défaut

**📄 Voir détails complets dans : `PAYMENT_REDIRECT_FIX.md`**

## 🚀 Prochaines étapes

### 1. **Vérifier les variables d'environnement Netlify**
```
Dashboard Netlify → Site Settings → Environment Variables
```
Variables requises :
```env
VITE_CARDINITY_SUCCESS_URL=https://doctorfollowers.com/payment/success
VITE_CARDINITY_CANCEL_URL=https://doctorfollowers.com/payment/cancel
```
*(Les autres clés Cardinity doivent déjà être configurées)*

### 2. **Déployer sur Netlify**
```bash
# Option A : Push vers Git (déploiement automatique)
git add .
git commit -m "fix: résolution problème redirection 404 après paiement Cardinity"
git push origin main

# Option B : Déploiement manuel dans Netlify Dashboard
# Netlify → Deploys → Trigger deploy → Clear cache and deploy site
```

### 3. **Tester le flux complet**
1. Ouvrir en mode incognito : `https://doctorfollowers.com`
2. Ajouter un produit au panier
3. Procéder au paiement
4. Utiliser carte de test : `4111111111111111` (12/25, CVV: 123)
5. ✅ **Vérifier qu'on arrive sur /payment/success SANS 404**

## Comment déployer
Si vous utilisez Netlify :
1. Connectez-vous à votre dashboard Netlify
2. Allez sur votre site
3. Cliquez sur "Deploys"
4. Faites glisser le dossier `dist` ou connectez votre repository Git
5. Netlify redéploiera automatiquement avec les nouvelles redirections

## Vérification
Après déploiement, les URLs de paiement devraient :
- ✅ Ne plus retourner 404
- ✅ Charger l'application React
- ✅ Déclencher l'intégration SMMA correctement

## Notes importantes
- Les redirections pointent vers `/index.html` qui charge l'application React
- L'application React gère ensuite le routage côté client
- L'intégration SMMA sera déclenchée automatiquement sur `/payment/success`
