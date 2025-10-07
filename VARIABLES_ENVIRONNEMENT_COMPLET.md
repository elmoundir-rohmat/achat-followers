# 📋 Inventaire Complet des Variables d'Environnement

## 🔍 Analyse Complète du Projet

---

## 📊 Résumé

| Catégorie | Nombre de Variables | Statut |
|-----------|---------------------|---------|
| **Cardinity (Paiement)** | 4 variables | 🔴 Obligatoires |
| **SMMA Platform** | 2 variables | 🔴 Obligatoires |
| **StarAPI (Instagram)** | 2 variables | 🔴 Obligatoires |
| **Vite (Dev Mode)** | 1 variable | ✅ Auto-détectée |
| **TOTAL** | **9 variables** | - |

---

## 🔐 Variables Obligatoires (8)

### 1️⃣ CARDINITY - Système de Paiement (4 variables)

#### `VITE_CARDINITY_CONSUMER_KEY`
- **Type** : `string`
- **Obligatoire** : ✅ Oui
- **Où** : Vercel Dashboard → Environment Variables
- **Chargement** : `import.meta.env.VITE_CARDINITY_CONSUMER_KEY`
- **Fichier** : `src/config/cardinity.ts:4`
- **Valeur par défaut** : `'your_consumer_key_here'` (ne fonctionne pas en production)
- **Usage** : 
  - Authentification Cardinity
  - Clé consumer pour créer des paiements
  - Détection du mode test si commence par `test_`
- **Exemple** : 
  - Test : `test_xxxxxxxxxxxxxxxx`
  - Production : `ck_live_xxxxxxxxxxxxxxxx`

#### `VITE_CARDINITY_CONSUMER_SECRET`
- **Type** : `string`
- **Obligatoire** : ✅ Oui
- **Où** : Vercel Dashboard → Environment Variables
- **Chargement** : `import.meta.env.VITE_CARDINITY_CONSUMER_SECRET`
- **Fichier** : `src/config/cardinity.ts:5`
- **Valeur par défaut** : `'your_consumer_secret_here'` (ne fonctionne pas en production)
- **Usage** : 
  - Secret consumer Cardinity
  - Signature des requêtes de paiement
- **Exemple** : 
  - Test : `test_secret_xxxxxxxxxxxxxxxx`
  - Production : `cs_live_xxxxxxxxxxxxxxxx`

#### `VITE_CARDINITY_SUCCESS_URL`
- **Type** : `string` (URL)
- **Obligatoire** : ✅ Oui
- **Où** : Vercel Dashboard → Environment Variables
- **Chargement** : `import.meta.env.VITE_CARDINITY_SUCCESS_URL`
- **Fichier** : `src/config/cardinity.ts:8`
- **Valeur par défaut** : `'https://doctorfollowers.com/payment/success'`
- **Usage** : 
  - URL de redirection après paiement réussi
  - Utilisée dans le composant `CardinityPayment`
  - Callback Cardinity
- **Exemple** : `https://votre-domaine.vercel.app/payment/success`
- **⚠️ IMPORTANT** : Doit être mise à jour avec votre vrai domaine Vercel !

#### `VITE_CARDINITY_CANCEL_URL`
- **Type** : `string` (URL)
- **Obligatoire** : ✅ Oui
- **Où** : Vercel Dashboard → Environment Variables
- **Chargement** : `import.meta.env.VITE_CARDINITY_CANCEL_URL`
- **Fichier** : `src/config/cardinity.ts:9`
- **Valeur par défaut** : `'https://doctorfollowers.com/payment/cancel'`
- **Usage** : 
  - URL de redirection après annulation de paiement
  - Callback Cardinity
- **Exemple** : `https://votre-domaine.vercel.app/payment/cancel`
- **⚠️ IMPORTANT** : Doit être mise à jour avec votre vrai domaine Vercel !

---

### 2️⃣ SMMA PLATFORM - Service de Livraison (2 variables)

#### `VITE_SMMA_API_URL`
- **Type** : `string` (URL)
- **Obligatoire** : ✅ Oui
- **Où** : Vercel Dashboard → Environment Variables
- **Chargement** : `import.meta.env.VITE_SMMA_API_URL`
- **Fichier** : `src/services/smmaService.ts:33`
- **Valeur par défaut** : `'https://justanotherpanel.com/api/v2'`
- **Usage** : 
  - Endpoint de l'API SMMA (JustAnotherPanel)
  - Commande de followers Instagram
  - Commande de likes, commentaires, vues
  - Commande de followers/likes TikTok
- **Composants utilisant cette variable** :
  - `CheckoutPage.tsx` → Commande de followers
  - `InstagramLikesPage.tsx` → Commande de likes
  - `InstagramCommentsPage.tsx` → Commande de commentaires
  - `InstagramViewsPage.tsx` → Commande de vues
  - `TikTokCheckoutPage.tsx` → Commande followers TikTok
  - `TikTokLikesPage.tsx` → Commande likes TikTok
- **Valeur recommandée** : `https://justanotherpanel.com/api/v2` (ou votre URL SMMA)

#### `VITE_SMMA_API_KEY`
- **Type** : `string`
- **Obligatoire** : ✅ Oui
- **Où** : Vercel Dashboard → Environment Variables
- **Chargement** : `import.meta.env.VITE_SMMA_API_KEY`
- **Fichier** : `src/services/smmaService.ts:34`
- **Valeur par défaut** : `'your_smma_api_key_here'` (ne fonctionne pas en production)
- **Usage** : 
  - Authentification auprès de l'API SMMA
  - Clé API pour passer des commandes
  - Utilisée dans tous les appels SMMA
- **Méthodes utilisant cette variable** :
  - `orderFollowers()` → Commander followers Instagram
  - `orderLikes()` → Commander likes Instagram
  - `orderComments()` → Commander commentaires Instagram
  - `orderViews()` → Commander vues Instagram
  - `orderTikTokFollowers()` → Commander followers TikTok
  - `orderTikTokLikes()` → Commander likes TikTok
  - `checkOrderStatus()` → Vérifier le statut d'une commande
- **Exemple** : `sk_xxxxxxxxxxxxxxxxxxxxxxxx`

---

### 3️⃣ STARAPI - Instagram API (RapidAPI) (2 variables)

#### `VITE_STARAPI_URL`
- **Type** : `string` (URL)
- **Obligatoire** : ✅ Oui
- **Où** : Vercel Dashboard → Environment Variables
- **Chargement** : `import.meta.env.VITE_STARAPI_URL`
- **Fichier** : `src/services/instagramService.ts:42`
- **Valeur par défaut** : `'https://starapi1.p.rapidapi.com'`
- **Usage** : 
  - URL de base de l'API StarAPI (via RapidAPI)
  - Récupération des posts Instagram
  - Récupération des reels/clips Instagram
  - Récupération des infos utilisateur
- **Endpoints utilisés** :
  - `/instagram/user/get_web_profile_info` → Récupérer l'ID utilisateur
  - `/instagram/user/get_media` → Récupérer les posts
  - `/instagram/user/get_clips` → Récupérer les reels/clips
  - `/instagram/media/get_info` → Infos d'un post spécifique
  - `/instagram/user/info` → Infos utilisateur
- **Valeur recommandée** : `https://starapi1.p.rapidapi.com`

#### `VITE_RAPIDAPI_KEY`
- **Type** : `string`
- **Obligatoire** : ✅ Oui
- **Où** : Vercel Dashboard → Environment Variables
- **Chargement** : `import.meta.env.VITE_RAPIDAPI_KEY`
- **Fichier** : `src/services/instagramService.ts:43`
- **Valeur par défaut** : `'3b8b4d9067msh42e44044539aa07p17800fjsn924eff22b54d'` ⚠️ Clé de test
- **Usage** : 
  - Authentification RapidAPI
  - Header `x-rapidapi-key` dans toutes les requêtes
  - Permet d'accéder à l'API StarAPI
- **Composants utilisant cette variable** :
  - `InstagramLikesPage.tsx` → Afficher les posts pour sélection
  - `InstagramCommentsPage.tsx` → Afficher les posts pour sélection
  - `InstagramViewsPage.tsx` → Afficher les reels pour sélection
- **Exemple** : `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **⚠️ IMPORTANT** : La clé par défaut est une clé de test, vous DEVEZ la remplacer par votre propre clé RapidAPI !

---

## 🔧 Variables Auto-Détectées (1)

### `import.meta.env.DEV`

- **Type** : `boolean`
- **Obligatoire** : ❌ Non (auto-détectée par Vite)
- **Où** : Automatiquement définie par Vite
- **Chargement** : `import.meta.env.DEV`
- **Fichiers** : 
  - `src/components/CheckoutPage.tsx:430`
  - `src/components/TikTokCheckoutPage.tsx:189`
- **Valeur** : 
  - `true` en mode développement (`npm run dev`)
  - `false` en mode production (`npm run build`)
- **Usage** : 
  - Afficher/masquer des fonctionnalités de débogage
  - Activer des paiements de test en développement
  - Logs de débogage
- **Exemple d'utilisation** :
  ```typescript
  {import.meta.env.DEV && (
    <button>Mode de Paiement Test (Dev Only)</button>
  )}
  ```

---

## 📁 Où Sont Définies les Variables ?

### 1. Dans le Code (Valeurs par Défaut)

| Fichier | Variables | Type |
|---------|-----------|------|
| `src/config/cardinity.ts` | 4 variables Cardinity | Fallback (⚠️ ne pas utiliser en prod) |
| `src/services/smmaService.ts` | 2 variables SMMA | Fallback (⚠️ ne pas utiliser en prod) |
| `src/services/instagramService.ts` | 2 variables StarAPI | Fallback (⚠️ ne pas utiliser en prod) |

### 2. Dans `.env` (Local - Développement)

**Fichier** : `.env` (à la racine du projet)

**Statut** : ❌ Non tracké dans Git (`.gitignore`)

**Usage** : Développement local uniquement

**Template** : `env.example`

**Commandes** :
```bash
# Créer le fichier .env
cp env.example .env

# Éditer avec vos vraies clés
nano .env
```

### 3. Sur Vercel (Production)

**Où** : Vercel Dashboard → Project Settings → Environment Variables

**Statut** : ✅ Recommandé pour la production

**Environnements disponibles** :
- ✅ Production
- ✅ Preview (branches)
- ✅ Development (local avec Vercel CLI)

---

## 🔄 Comment Sont Chargées les Variables ?

### Mécanisme de Chargement Vite

Toutes les variables utilisent le système de Vite :

```typescript
import.meta.env.VITE_NOM_VARIABLE
```

### Règles Importantes :

1. **Préfixe `VITE_` obligatoire**
   - ✅ `VITE_CARDINITY_CONSUMER_KEY` → Accessible côté client
   - ❌ `CARDINITY_CONSUMER_KEY` → Non accessible

2. **Variables injectées au BUILD**
   - Les variables sont lues au moment du `npm run build`
   - Si vous modifiez une variable, vous DEVEZ rebuild/redéployer

3. **Variables exposées côté client**
   - ⚠️ Toutes les variables `VITE_` sont **publiques** dans le JavaScript final
   - Ne mettez JAMAIS de secrets ultra-sensibles dans `VITE_`
   - Pour des secrets côté serveur, utilisez Vercel Edge Functions

4. **Fallback** (|| operator)
   ```typescript
   import.meta.env.VITE_SMMA_API_KEY || 'fallback_value'
   ```
   - Si la variable n'est pas définie, utilise la valeur de fallback
   - ⚠️ Les fallbacks sont pour le développement uniquement

---

## 📝 Template `.env` Complet

Créez un fichier `.env` à la racine avec ce contenu :

```bash
# ==========================================
# FICHIER .env - DÉVELOPPEMENT LOCAL
# ⚠️ NE JAMAIS COMMITER CE FICHIER
# ==========================================

# ==========================================
# CARDINITY - Paiement
# ==========================================
VITE_CARDINITY_CONSUMER_KEY=test_xxxxxxxxxxxxxxxx
VITE_CARDINITY_CONSUMER_SECRET=test_secret_xxxxxxxxxxxxxxxx
VITE_CARDINITY_SUCCESS_URL=http://localhost:5173/payment/success
VITE_CARDINITY_CANCEL_URL=http://localhost:5173/payment/cancel

# ==========================================
# SMMA PLATFORM - Livraison de Services
# ==========================================
VITE_SMMA_API_URL=https://justanotherpanel.com/api/v2
VITE_SMMA_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxx

# ==========================================
# STARAPI - Instagram API (RapidAPI)
# ==========================================
VITE_STARAPI_URL=https://starapi1.p.rapidapi.com
VITE_RAPIDAPI_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 📊 Tableau Récapitulatif des 8 Variables

| # | Variable | Service | Obligatoire | Valeur par Défaut | À Remplacer |
|---|----------|---------|-------------|-------------------|-------------|
| 1 | `VITE_CARDINITY_CONSUMER_KEY` | Cardinity | ✅ Oui | `your_consumer_key_here` | ✅ Oui |
| 2 | `VITE_CARDINITY_CONSUMER_SECRET` | Cardinity | ✅ Oui | `your_consumer_secret_here` | ✅ Oui |
| 3 | `VITE_CARDINITY_SUCCESS_URL` | Cardinity | ✅ Oui | `https://doctorfollowers.com/payment/success` | ✅ Oui |
| 4 | `VITE_CARDINITY_CANCEL_URL` | Cardinity | ✅ Oui | `https://doctorfollowers.com/payment/cancel` | ✅ Oui |
| 5 | `VITE_SMMA_API_URL` | SMMA | ✅ Oui | `https://justanotherpanel.com/api/v2` | ⚠️ Optionnel |
| 6 | `VITE_SMMA_API_KEY` | SMMA | ✅ Oui | `your_smma_api_key_here` | ✅ Oui |
| 7 | `VITE_STARAPI_URL` | StarAPI | ✅ Oui | `https://starapi1.p.rapidapi.com` | ⚠️ Optionnel |
| 8 | `VITE_RAPIDAPI_KEY` | StarAPI | ✅ Oui | Clé de test | ✅ Oui |

---

## 🎯 Où Obtenir Vos Clés API ?

### Cardinity
1. Créer un compte sur https://cardinity.com
2. Dashboard → API Keys
3. Copier Consumer Key et Consumer Secret

### SMMA Platform (JustAnotherPanel)
1. Créer un compte sur https://justanotherpanel.com
2. Account → API
3. Copier votre API Key

### RapidAPI (StarAPI)
1. Créer un compte sur https://rapidapi.com
2. S'abonner à StarAPI : https://rapidapi.com/starium.dev/api/starapi1
3. My Apps → Default Application → Security
4. Copier votre Application Key

---

## ✅ Checklist de Configuration

### Développement Local
- [ ] Créer le fichier `.env` à la racine
- [ ] Copier le contenu depuis `env.example`
- [ ] Remplir les 8 variables avec vos vraies clés
- [ ] Vérifier que `.env` est dans `.gitignore`
- [ ] Tester avec `npm run dev`

### Production Vercel
- [ ] Déployer le projet sur Vercel
- [ ] Récupérer l'URL de production (ex: `doctor-followers-xxx.vercel.app`)
- [ ] Aller dans Settings → Environment Variables
- [ ] Ajouter les 8 variables
- [ ] **Mettre à jour** `VITE_CARDINITY_SUCCESS_URL` avec l'URL Vercel
- [ ] **Mettre à jour** `VITE_CARDINITY_CANCEL_URL` avec l'URL Vercel
- [ ] Cocher Production + Preview + Development pour chaque variable
- [ ] Redéployer l'application

---

## 🆘 Troubleshooting

### Variable `undefined` dans le code

**Causes possibles** :
1. Variable sans préfixe `VITE_`
2. Variable non définie dans `.env` ou Vercel
3. Application pas rebuild après ajout de la variable

**Solutions** :
```bash
# En local
npm run build
npm run preview

# Sur Vercel
# Redéployer via Dashboard ou CLI
```

### Clés API ne fonctionnent pas

**Vérifications** :
1. Clés copiées correctement (pas d'espace, pas de guillemets)
2. Clés actives sur les plateformes respectives
3. Quotas API non dépassés (RapidAPI, SMMA)
4. Mode test vs production (Cardinity)

### Paiements échouent

**Vérifications** :
1. `VITE_CARDINITY_SUCCESS_URL` pointe vers le bon domaine
2. `VITE_CARDINITY_CANCEL_URL` pointe vers le bon domaine
3. Clés Cardinity sont en mode live (commencent par `ck_live_`)
4. Callback URLs configurées dans le dashboard Cardinity

---

## 📚 Références

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Cardinity API Docs](https://developers.cardinity.com/)
- [RapidAPI Documentation](https://docs.rapidapi.com/)

---

**✅ Toutes les variables sont maintenant documentées !**

