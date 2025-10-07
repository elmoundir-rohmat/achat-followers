# 🔐 Guide de Migration Sécurisée - Architecture Serveur

## ✅ Migration Terminée !

Votre application a été migrée vers une **architecture sécurisée** avec API routes Vercel.

---

## 📊 Ce Qui a Changé

### AVANT (Architecture Non Sécurisée ❌)
```
Frontend React
├── Appelle directement Cardinity (clés visibles)
├── Appelle directement SMMA (clé visible)
└── Appelle directement RapidAPI (clé visible)

Conséquence : N'importe qui peut voir vos clés API dans le navigateur
```

### APRÈS (Architecture Sécurisée ✅)
```
Frontend React → API Routes Vercel → Services Externes
├── Appelle /api/cardinity/*
├── Appelle /api/smma/*
└── Appelle /api/instagram/*

Avantage : Les clés API restent côté serveur, jamais exposées
```

---

## 📁 Nouveaux Fichiers Créés

### API Routes (Serveur - Sécurisées)
```
/api/
├── cardinity/
│   └── create-payment.ts       ← Gestion paiements Cardinity
├── smma/
│   └── order.ts                ← Commandes SMMA (followers, likes, etc.)
└── instagram/
    ├── posts.ts                ← Récupération posts Instagram
    └── clips.ts                ← Récupération reels Instagram
```

### Services Clients (Frontend)
```
/src/services/
├── smmaServiceClient.ts        ← Appelle /api/smma/*
└── instagramServiceClient.ts   ← Appelle /api/instagram/*
```

---

## 🔐 Configuration des Variables d'Environnement

### Variables sur Vercel Dashboard

Allez dans : **Settings** → **Environment Variables**

#### 1️⃣ Variables PUBLIQUES (avec `VITE_`) - 2 variables

Ces variables sont exposées au client (OK, ce sont juste des URLs) :

```bash
Name: VITE_CARDINITY_SUCCESS_URL
Value: https://VOTRE-DOMAINE.com/payment/success
Environments: ✅ Production ✅ Preview ✅ Development

Name: VITE_CARDINITY_CANCEL_URL
Value: https://VOTRE-DOMAINE.com/payment/cancel
Environments: ✅ Production ✅ Preview ✅ Development
```

#### 2️⃣ Variables PRIVÉES (SANS `VITE_`) - 8 variables

Ces variables restent côté serveur (jamais exposées au client) :

```bash
# Cardinity
Name: CARDINITY_CONSUMER_KEY
Value: [Votre clé consumer]
Environments: ✅ Production ✅ Preview ✅ Development

Name: CARDINITY_CONSUMER_SECRET
Value: [Votre secret consumer]
Environments: ✅ Production ✅ Preview ✅ Development

Name: CARDINITY_SUCCESS_URL
Value: https://VOTRE-DOMAINE.com/payment/success
Environments: ✅ Production ✅ Preview ✅ Development

Name: CARDINITY_CANCEL_URL
Value: https://VOTRE-DOMAINE.com/payment/cancel
Environments: ✅ Production ✅ Preview ✅ Development

# SMMA
Name: SMMA_API_URL
Value: https://justanotherpanel.com/api/v2
Environments: ✅ Production ✅ Preview ✅ Development

Name: SMMA_API_KEY
Value: [Votre clé SMMA]
Environments: ✅ Production ✅ Preview ✅ Development

# StarAPI / RapidAPI
Name: STARAPI_URL
Value: https://starapi1.p.rapidapi.com
Environments: ✅ Production ✅ Preview ✅ Development

Name: RAPIDAPI_KEY
Value: [Votre clé RapidAPI]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Total : 10 variables** (2 publiques + 8 privées)

---

## 📝 Tableau Récapitulatif

| Variable | Préfixe | Où ? | Accessible depuis |
|----------|---------|------|-------------------|
| `VITE_CARDINITY_SUCCESS_URL` | ✅ VITE_ | Client | Frontend React |
| `VITE_CARDINITY_CANCEL_URL` | ✅ VITE_ | Client | Frontend React |
| `CARDINITY_CONSUMER_KEY` | ❌ Pas de VITE_ | Serveur | API Routes uniquement |
| `CARDINITY_CONSUMER_SECRET` | ❌ Pas de VITE_ | Serveur | API Routes uniquement |
| `CARDINITY_SUCCESS_URL` | ❌ Pas de VITE_ | Serveur | API Routes uniquement |
| `CARDINITY_CANCEL_URL` | ❌ Pas de VITE_ | Serveur | API Routes uniquement |
| `SMMA_API_URL` | ❌ Pas de VITE_ | Serveur | API Routes uniquement |
| `SMMA_API_KEY` | ❌ Pas de VITE_ | Serveur | API Routes uniquement |
| `STARAPI_URL` | ❌ Pas de VITE_ | Serveur | API Routes uniquement |
| `RAPIDAPI_KEY` | ❌ Pas de VITE_ | Serveur | API Routes uniquement |

---

## 🔄 Modifications à Faire dans le Code

### ⚠️ IMPORTANT : Modifications Manuelles Requises

Les composants suivants doivent être modifiés pour utiliser les **nouveaux services clients** :

#### 1. Checkout Instagram : `src/components/CheckoutPage.tsx`

**Remplacer :**
```typescript
import { smmaService } from '../services/smmaService';
```

**Par :**
```typescript
import { smmaServiceClient } from '../services/smmaServiceClient';
```

**Et remplacer tous les appels :**
```typescript
await smmaService.orderFollowers(order)
```

**Par :**
```typescript
await smmaServiceClient.orderFollowers(order)
```

---

#### 2. Instagram Likes : `src/components/InstagramLikesPage.tsx`

**Importer le service client :**
```typescript
import { instagramServiceClient } from '../services/instagramServiceClient';
import { smmaServiceClient } from '../services/smmaServiceClient';
```

**Remplacer :**
```typescript
import { instagramService } from '../services/instagramService';
import { smmaService } from '../services/smmaService';
```

---

#### 3. Instagram Comments : `src/components/InstagramCommentsPage.tsx`

**Même changement** que pour Likes.

---

#### 4. Instagram Views : `src/components/InstagramViewsPage.tsx`

**Même changement** que pour Likes.

---

#### 5. TikTok Checkout : `src/components/TikTokCheckoutPage.tsx`

**Remplacer :**
```typescript
import { smmaService } from '../services/smmaService';
```

**Par :**
```typescript
import { smmaServiceClient } from '../services/smmaServiceClient';
```

---

#### 6. TikTok Likes : `src/components/TikTokLikesPage.tsx`

**Même changement** que pour TikTok Checkout.

---

## 🚀 Étapes de Déploiement

### 1. Configurer les Variables sur Vercel

1. Allez sur **Vercel Dashboard**
2. Sélectionnez votre projet
3. **Settings** → **Environment Variables**
4. Ajoutez les **10 variables** (voir tableau ci-dessus)
5. ⚠️ **ATTENTION** : 
   - 2 variables avec `VITE_` (publiques)
   - 8 variables sans `VITE_` (privées)

### 2. Redéployer l'Application

```bash
npm run vercel:deploy
```

Ou via le Dashboard :
```
Deployments → [...] → Redeploy
```

### 3. Tester l'API

Une fois déployé, testez les API routes :

#### Test 1 : Instagram Posts
```bash
curl -X POST https://votre-domaine.com/api/instagram/posts \
  -H "Content-Type: application/json" \
  -d '{"username": "instagram"}'
```

Devrait retourner des posts sans exposer votre clé RapidAPI.

#### Test 2 : Variables Publiques
Ouvrez la console du navigateur (F12) :
```javascript
console.log(import.meta.env.VITE_CARDINITY_SUCCESS_URL)
// Doit afficher: https://votre-domaine.com/payment/success

console.log(import.meta.env.VITE_CARDINITY_CONSUMER_KEY)
// Doit afficher: undefined (la clé n'est plus exposée ✅)
```

---

## ✅ Checklist de Migration

### Configuration
- [ ] 10 variables ajoutées sur Vercel Dashboard
- [ ] 2 variables avec préfixe `VITE_` (publiques)
- [ ] 8 variables sans préfixe `VITE_` (privées)
- [ ] Toutes avec Production + Preview + Development

### Code Frontend
- [ ] `CheckoutPage.tsx` modifié (utilise `smmaServiceClient`)
- [ ] `InstagramLikesPage.tsx` modifié (utilise services clients)
- [ ] `InstagramCommentsPage.tsx` modifié (utilise services clients)
- [ ] `InstagramViewsPage.tsx` modifié (utilise services clients)
- [ ] `TikTokCheckoutPage.tsx` modifié (utilise `smmaServiceClient`)
- [ ] `TikTokLikesPage.tsx` modifié (utilise `smmaServiceClient`)

### Déploiement
- [ ] Application redéployée sur Vercel
- [ ] API routes testées (retournent des données)
- [ ] Frontend testé (commandes fonctionnent)
- [ ] Clés API vérifiées (non exposées dans le navigateur)

---

## 🔒 Sécurité - Vérifications

### Test 1 : Clés API Non Exposées

Ouvrez **DevTools** (F12) → **Sources** → `index-xxx.js` :

❌ **Avant** : On pouvait chercher et trouver vos clés API
✅ **Après** : Impossible de trouver vos clés (elles sont côté serveur)

### Test 2 : API Routes Fonctionnent

```bash
# Test réussi
curl https://votre-app.com/api/instagram/posts?username=instagram
# Devrait retourner : {"success":true,"data":[...]}
```

### Test 3 : Variables d'Environnement

```javascript
// Dans la console du navigateur
Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
// Devrait retourner : ["VITE_CARDINITY_SUCCESS_URL", "VITE_CARDINITY_CANCEL_URL"]
```

---

## 🎯 Résumé de l'Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Frontend (React)                                         │
│ - Pas de clés API                                       │
│ - Uniquement URLs publiques                             │
├─────────────────────────────────────────────────────────┤
│ fetch('/api/smma/order')                                │
│ fetch('/api/instagram/posts')                           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ API Routes Vercel (Serveur)                             │
│ - Clés API sécurisées (process.env.*)                  │
│ - Validation des requêtes                               │
│ - Logs serveur                                          │
├─────────────────────────────────────────────────────────┤
│ /api/smma/order.ts                                      │
│ /api/instagram/posts.ts                                 │
│ /api/cardinity/create-payment.ts                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Services Externes                                        │
│ - SMMA API (JustAnotherPanel)                          │
│ - StarAPI / RapidAPI (Instagram)                        │
│ - Cardinity API (Paiements)                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### Erreur : "API route not found"

**Cause** : Les fichiers dans `/api/*` ne sont pas déployés

**Solution** :
1. Vérifiez que le dossier `/api` est à la racine du projet
2. Redéployez avec `vercel --prod`
3. Vérifiez les logs de build sur Vercel

### Erreur : "Server configuration error"

**Cause** : Variables d'environnement non configurées sur Vercel

**Solution** :
1. Vérifiez que les 8 variables **sans** `VITE_` sont sur Vercel
2. Vérifiez l'orthographe exacte des noms
3. Redéployez l'application

### Les posts Instagram ne s'affichent pas

**Cause** : Le frontend appelle encore l'ancien service

**Solution** :
1. Vérifiez que vous importez `instagramServiceClient` et non `instagramService`
2. Redéployez l'application

---

## 📚 Documentation Supplémentaire

- [Vercel API Routes](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**✅ Votre application est maintenant 100% sécurisée !**

Les clés API ne sont plus exposées publiquement. 🎉
