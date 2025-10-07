# 🔒 Variables d'Environnement Vercel - SÉCURISÉES

## ✅ Migration de Sécurité Complétée

Votre projet utilise maintenant une architecture sécurisée :
- ❌ **Aucune clé API n'est exposée au navigateur**
- ✅ **Toutes les clés sont côté serveur (API routes Vercel)**
- ✅ **Frontend appelle uniquement des API routes internes**

---

## 📊 Architecture de Sécurité

```
┌─────────────────────────────────────────────────────────┐
│ NAVIGATEUR (Frontend React)                             │
│                                                          │
│  ✅ Variables VITE_ (publiques seulement)               │
│     - VITE_CARDINITY_SUCCESS_URL                        │
│     - VITE_CARDINITY_CANCEL_URL                         │
│                                                          │
│  ⬇️  Appelle API routes internes (/api/*)               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ API ROUTES VERCEL (Serverless Functions)                │
│                                                          │
│  🔒 Variables SERVEUR (privées)                         │
│     - CARDINITY_CONSUMER_KEY      (secret)              │
│     - CARDINITY_CONSUMER_SECRET   (secret)              │
│     - SMMA_API_KEY                (secret)              │
│     - RAPIDAPI_KEY                (secret)              │
│                                                          │
│  ⬇️  Appelle APIs externes                              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ APIs EXTERNES                                            │
│  - Cardinity API                                         │
│  - SMMA Platform API (JustAnotherPanel)                 │
│  - StarAPI (RapidAPI)                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Liste Complète des Variables pour Vercel

### 🔓 Variables PUBLIQUES (2 variables)

Ces variables sont accessibles côté client. Elles ne contiennent AUCUN secret.

| Variable | Type | Valeur Exemple | Environnements |
|----------|------|----------------|----------------|
| `VITE_CARDINITY_SUCCESS_URL` | URL publique | `https://votre-app.vercel.app/payment/success` | ✅ Prod ✅ Preview ✅ Dev |
| `VITE_CARDINITY_CANCEL_URL` | URL publique | `https://votre-app.vercel.app/payment/cancel` | ✅ Prod ✅ Preview ✅ Dev |

---

### 🔒 Variables SERVEUR UNIQUEMENT (8 variables)

Ces variables sont utilisées UNIQUEMENT dans les API routes. JAMAIS exposées au navigateur.

| Variable | Service | Type | Valeur Exemple | Environnements |
|----------|---------|------|----------------|----------------|
| `CARDINITY_CONSUMER_KEY` | Cardinity | Secret | `ck_live_xxxxx` | ✅ Prod ✅ Preview ✅ Dev |
| `CARDINITY_CONSUMER_SECRET` | Cardinity | Secret | `cs_live_xxxxx` | ✅ Prod ✅ Preview ✅ Dev |
| `CARDINITY_SUCCESS_URL` | Cardinity | URL | `https://votre-app.vercel.app/payment/success` | ✅ Prod ✅ Preview ✅ Dev |
| `CARDINITY_CANCEL_URL` | Cardinity | URL | `https://votre-app.vercel.app/payment/cancel` | ✅ Prod ✅ Preview ✅ Dev |
| `SMMA_API_URL` | SMMA | URL | `https://justanotherpanel.com/api/v2` | ✅ Prod ✅ Preview ✅ Dev |
| `SMMA_API_KEY` | SMMA | Secret | `sk_xxxxx` | ✅ Prod ✅ Preview ✅ Dev |
| `STARAPI_URL` | StarAPI | URL | `https://starapi1.p.rapidapi.com` | ✅ Prod ✅ Preview ✅ Dev |
| `RAPIDAPI_KEY` | StarAPI | Secret | `xxxxxx` | ✅ Prod ✅ Preview ✅ Dev |

---

## 🎯 Configuration sur Vercel Dashboard

### Étape 1 : Accéder aux Variables

```
1. Vercel Dashboard → Votre Projet
2. Settings → Environment Variables
```

### Étape 2 : Ajouter les Variables (10 au total)

#### 🔓 Variables PUBLIQUES (Frontend)

```
Name: VITE_CARDINITY_SUCCESS_URL
Value: https://votre-app.vercel.app/payment/success
Environments: ✅ Production ✅ Preview ✅ Development
→ Save

Name: VITE_CARDINITY_CANCEL_URL
Value: https://votre-app.vercel.app/payment/cancel
Environments: ✅ Production ✅ Preview ✅ Development
→ Save
```

#### 🔒 Variables SERVEUR (Backend - API Routes)

```
Name: CARDINITY_CONSUMER_KEY
Value: ck_live_xxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ✅ Development
→ Save

Name: CARDINITY_CONSUMER_SECRET
Value: cs_live_xxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ✅ Development
→ Save

Name: CARDINITY_SUCCESS_URL
Value: https://votre-app.vercel.app/payment/success
Environments: ✅ Production ✅ Preview ✅ Development
→ Save

Name: CARDINITY_CANCEL_URL
Value: https://votre-app.vercel.app/payment/cancel
Environments: ✅ Production ✅ Preview ✅ Development
→ Save

Name: SMMA_API_URL
Value: https://justanotherpanel.com/api/v2
Environments: ✅ Production ✅ Preview ✅ Development
→ Save

Name: SMMA_API_KEY
Value: sk_xxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ✅ Development
→ Save

Name: STARAPI_URL
Value: https://starapi1.p.rapidapi.com
Environments: ✅ Production ✅ Preview ✅ Development
→ Save

Name: RAPIDAPI_KEY
Value: xxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ✅ Development
→ Save
```

---

## 📝 Template de Configuration Rapide

### Copy-Paste pour Vercel (avec vos vraies valeurs)

```bash
# ==========================================
# PUBLIQUES (Frontend - Préfixe VITE_)
# ==========================================
VITE_CARDINITY_SUCCESS_URL=https://VOTRE-APP.vercel.app/payment/success
VITE_CARDINITY_CANCEL_URL=https://VOTRE-APP.vercel.app/payment/cancel

# ==========================================
# SERVEUR (Backend - SANS préfixe VITE_)
# ==========================================
CARDINITY_CONSUMER_KEY=ck_live_xxxxxxxxxxxxxxxxxxxxx
CARDINITY_CONSUMER_SECRET=cs_live_xxxxxxxxxxxxxxxxxxxxx
CARDINITY_SUCCESS_URL=https://VOTRE-APP.vercel.app/payment/success
CARDINITY_CANCEL_URL=https://VOTRE-APP.vercel.app/payment/cancel

SMMA_API_URL=https://justanotherpanel.com/api/v2
SMMA_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxx

STARAPI_URL=https://starapi1.p.rapidapi.com
RAPIDAPI_KEY=xxxxxxxxxxxxxxxxxxxxx
```

---

## 🔐 Pourquoi Certaines Variables Existent en Double ?

### Exemple : `VITE_CARDINITY_SUCCESS_URL` vs `CARDINITY_SUCCESS_URL`

```typescript
// Frontend (React) - Variable publique
const successUrl = import.meta.env.VITE_CARDINITY_SUCCESS_URL;
// Utilisée pour afficher l'URL à l'utilisateur
// Accessible dans le navigateur

// Backend (API Route) - Variable serveur
const successUrl = process.env.CARDINITY_SUCCESS_URL;
// Utilisée pour créer le paiement Cardinity
// JAMAIS accessible dans le navigateur
```

**Pourquoi ?**
- Frontend a besoin de l'URL pour rediriger l'utilisateur
- Backend a besoin de l'URL pour configurer Cardinity
- Les deux utilisent la même valeur, mais dans des contextes différents

---

## 🚀 API Routes Créées

Votre projet utilise maintenant ces API routes Vercel (serverless) :

| Route | Méthode | Description | Variables Utilisées |
|-------|---------|-------------|---------------------|
| `/api/cardinity/create-payment` | POST | Créer un paiement Cardinity | `CARDINITY_*` (4 vars) |
| `/api/smma/order` | POST | Commander des services SMMA | `SMMA_*` (2 vars) |
| `/api/instagram/posts` | GET/POST | Récupérer posts Instagram | `STARAPI_URL`, `RAPIDAPI_KEY` |
| `/api/instagram/clips` | GET/POST | Récupérer reels Instagram | `STARAPI_URL`, `RAPIDAPI_KEY` |

---

## 🔍 Comment Vérifier que Tout Fonctionne ?

### 1. Variables Publiques (Frontend)

Ouvrez la console du navigateur (F12) :

```javascript
// Ces variables doivent être définies
console.log(import.meta.env.VITE_CARDINITY_SUCCESS_URL);
// Devrait afficher : https://votre-app.vercel.app/payment/success

console.log(import.meta.env.VITE_CARDINITY_CANCEL_URL);
// Devrait afficher : https://votre-app.vercel.app/payment/cancel

// Ces variables NE DOIVENT PAS être accessibles (sécurité)
console.log(import.meta.env.VITE_CARDINITY_CONSUMER_KEY);
// Devrait afficher : undefined ✅

console.log(import.meta.env.CARDINITY_CONSUMER_KEY);
// Devrait afficher : undefined ✅
```

### 2. Variables Serveur (Backend)

Les variables serveur ne sont PAS testables depuis le navigateur.

Pour les tester :
1. Vérifiez les logs de déploiement Vercel
2. Testez un paiement complet
3. Testez une commande SMMA
4. Testez la récupération de posts Instagram

---

## ⚠️ Points de Sécurité Critiques

### ✅ CORRECT - Architecture Sécurisée

```typescript
// ✅ Frontend appelle API route interne
const response = await fetch('/api/cardinity/create-payment', {
  method: 'POST',
  body: JSON.stringify({ amount, currency, orderId })
});

// ✅ API route utilise les clés serveur
// Dans /api/cardinity/create-payment.ts
const consumerKey = process.env.CARDINITY_CONSUMER_KEY; // SERVEUR
```

### ❌ INCORRECT - NE JAMAIS FAIRE

```typescript
// ❌ DANGEREUX : Clé API exposée au navigateur
const apiKey = import.meta.env.VITE_SMMA_API_KEY; // NE JAMAIS FAIRE !

// ❌ DANGEREUX : Appel direct depuis le frontend
await fetch('https://api.cardinity.com/v1/payments', {
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_SECRET_KEY}` // DANGER !
  }
});
```

---

## 📊 Checklist de Configuration

### Avant le Déploiement
- [ ] 10 variables ajoutées sur Vercel Dashboard
- [ ] Variables VITE_* utilisées UNIQUEMENT pour des valeurs publiques
- [ ] Variables serveur (sans VITE_) utilisées pour tous les secrets
- [ ] Toutes les variables cochées sur les 3 environnements
- [ ] Vraies valeurs API (pas de placeholders)

### Après le Déploiement
- [ ] Application redéployée
- [ ] Console navigateur : `VITE_CARDINITY_SUCCESS_URL` définie ✅
- [ ] Console navigateur : `VITE_CARDINITY_CONSUMER_KEY` undefined ✅
- [ ] Test paiement Cardinity fonctionne
- [ ] Test commande SMMA fonctionne
- [ ] Test récupération posts Instagram fonctionne

---

## 🆘 Troubleshooting

### Erreur : "Server configuration error"

**Cause** : Variables serveur manquantes ou mal nommées

**Solution** :
1. Vérifiez que les variables SANS préfixe `VITE_` sont bien sur Vercel
2. Vérifiez l'orthographe exacte (sensible à la casse)
3. Redéployez l'application

### Variables publiques undefined dans le navigateur

**Cause** : Variables avec préfixe `VITE_` manquantes

**Solution** :
1. Ajoutez `VITE_CARDINITY_SUCCESS_URL` et `VITE_CARDINITY_CANCEL_URL`
2. Vérifiez le préfixe `VITE_`
3. Rebuild l'application

### API Routes retournent 500

**Cause** : Variables serveur manquantes

**Solution** :
1. Consultez les logs Vercel : Dashboard → Deployments → View Function Logs
2. Recherchez les erreurs "Missing [NOM_VARIABLE]"
3. Ajoutez la variable manquante sur Vercel

---

## 📚 Différences avec l'Ancien Système

### ❌ Ancien Système (INSÉCURE)

```typescript
// TOUTES les variables étaient VITE_*
VITE_CARDINITY_CONSUMER_KEY=xxx      // ❌ Exposé au navigateur !
VITE_CARDINITY_CONSUMER_SECRET=xxx   // ❌ Exposé au navigateur !
VITE_SMMA_API_KEY=xxx                // ❌ Exposé au navigateur !
VITE_RAPIDAPI_KEY=xxx                // ❌ Exposé au navigateur !

// Les clés étaient dans le bundle JavaScript final
// N'importe qui pouvait les voir dans le code source !
```

### ✅ Nouveau Système (SÉCURISÉ)

```typescript
// Variables PUBLIQUES (2 variables seulement)
VITE_CARDINITY_SUCCESS_URL=xxx  // ✅ OK, c'est une URL publique
VITE_CARDINITY_CANCEL_URL=xxx   // ✅ OK, c'est une URL publique

// Variables SERVEUR (8 variables - protégées)
CARDINITY_CONSUMER_KEY=xxx      // ✅ Serveur uniquement
CARDINITY_CONSUMER_SECRET=xxx   // ✅ Serveur uniquement
SMMA_API_KEY=xxx                // ✅ Serveur uniquement
RAPIDAPI_KEY=xxx                // ✅ Serveur uniquement

// Les clés ne sont JAMAIS dans le bundle JavaScript
// Seules les API routes Vercel y ont accès
```

---

## 🎉 Conclusion

Votre application est maintenant **100% sécurisée** :

✅ Aucune clé API n'est exposée au navigateur  
✅ Toutes les clés sont côté serveur (API routes)  
✅ Architecture conforme aux meilleures pratiques  
✅ Prêt pour le déploiement en production  

**Total : 10 variables à configurer sur Vercel**
- 2 publiques (préfixe VITE_)
- 8 serveur (sans préfixe VITE_)

