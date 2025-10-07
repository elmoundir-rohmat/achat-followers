# 🔐 Variables d'Environnement pour Vercel

## Configuration des Variables

Allez sur **Vercel Dashboard > Votre Projet > Settings > Environment Variables**

---

## 📋 Liste Complète des Variables

### 1️⃣ CARDINITY - Paiement

```bash
# Clé consumer Cardinity
VITE_CARDINITY_CONSUMER_KEY
Valeur: your_consumer_key_here
Environnements: ✅ Production ✅ Preview ✅ Development

# Secret consumer Cardinity
VITE_CARDINITY_CONSUMER_SECRET
Valeur: your_consumer_secret_here
Environnements: ✅ Production ✅ Preview ✅ Development

# URL de succès après paiement
VITE_CARDINITY_SUCCESS_URL
Valeur: https://votre-domaine.vercel.app/payment/success
Environnements: ✅ Production ✅ Preview ✅ Development

# URL d'annulation de paiement
VITE_CARDINITY_CANCEL_URL
Valeur: https://votre-domaine.vercel.app/payment/cancel
Environnements: ✅ Production ✅ Preview ✅ Development
```

---

### 2️⃣ SMMA PLATFORM - Services Sociaux

```bash
# URL de l'API SMMA
VITE_SMMA_API_URL
Valeur: https://api.smma-platform.com
Environnements: ✅ Production ✅ Preview ✅ Development

# Clé API SMMA
VITE_SMMA_API_KEY
Valeur: your_smma_api_key_here
Environnements: ✅ Production ✅ Preview ✅ Development
```

---

### 3️⃣ STARAPI - Instagram API (RapidAPI)

```bash
# URL StarAPI
VITE_STARAPI_URL
Valeur: https://starapi1.p.rapidapi.com
Environnements: ✅ Production ✅ Preview ✅ Development

# Clé RapidAPI
VITE_RAPIDAPI_KEY
Valeur: your_rapidapi_key_here
Environnements: ✅ Production ✅ Preview ✅ Development
```

---

## 🎯 Instructions Étape par Étape

### Via l'Interface Web Vercel

1. **Accéder aux paramètres**
   - Allez sur https://vercel.com/dashboard
   - Sélectionnez votre projet
   - Cliquez sur **Settings** (⚙️)
   - Puis **Environment Variables**

2. **Ajouter une variable**
   - Cliquez sur **Add New**
   - Entrez le **Name** (ex: `VITE_CARDINITY_CONSUMER_KEY`)
   - Entrez la **Value** (votre vraie clé)
   - Cochez **Production**, **Preview**, et **Development**
   - Cliquez sur **Save**

3. **Répéter pour toutes les variables**
   - Vous devriez avoir **8 variables** au total

4. **Redéployer**
   - Allez dans l'onglet **Deployments**
   - Cliquez sur les 3 points (...) du dernier déploiement
   - Cliquez sur **Redeploy**

---

### Via Vercel CLI

```bash
# Se connecter à Vercel
vercel login

# Lier le projet (première fois uniquement)
vercel link

# Ajouter des variables (une par une)
vercel env add VITE_CARDINITY_CONSUMER_KEY

# Vous serez invité à :
# 1. Entrer la valeur
# 2. Choisir les environnements (production, preview, development)

# Répéter pour chaque variable
vercel env add VITE_CARDINITY_CONSUMER_SECRET
vercel env add VITE_CARDINITY_SUCCESS_URL
vercel env add VITE_CARDINITY_CANCEL_URL
vercel env add VITE_SMMA_API_URL
vercel env add VITE_SMMA_API_KEY
vercel env add VITE_STARAPI_URL
vercel env add VITE_RAPIDAPI_KEY

# Lister toutes les variables configurées
vercel env ls

# Redéployer avec les nouvelles variables
vercel --prod
```

---

## 📝 Template de Configuration Rapide

Copiez-collez ce template et remplacez les valeurs :

```bash
VITE_CARDINITY_CONSUMER_KEY=ck_live_xxxxxxxxxxxxx
VITE_CARDINITY_CONSUMER_SECRET=cs_live_xxxxxxxxxxxxx
VITE_CARDINITY_SUCCESS_URL=https://votre-app.vercel.app/payment/success
VITE_CARDINITY_CANCEL_URL=https://votre-app.vercel.app/payment/cancel
VITE_SMMA_API_URL=https://api.smma-platform.com
VITE_SMMA_API_KEY=sk_xxxxxxxxxxxxx
VITE_STARAPI_URL=https://starapi1.p.rapidapi.com
VITE_RAPIDAPI_KEY=xxxxxxxxxxxxx
```

---

## ⚠️ Avertissements de Sécurité

### ✅ À FAIRE
- Utiliser le préfixe `VITE_` pour les variables côté client
- Configurer les variables directement dans Vercel Dashboard
- Garder une copie sécurisée de vos clés (gestionnaire de mots de passe)
- Utiliser des clés différentes pour Development/Preview/Production

### ❌ NE PAS FAIRE
- ❌ Commiter les fichiers `.env` dans Git
- ❌ Partager vos clés API publiquement
- ❌ Utiliser les mêmes clés en dev et en production
- ❌ Inclure des secrets sensibles dans les variables `VITE_` (elles sont publiques dans le JS)

---

## 🔄 Variables Automatiques de Vercel

Vercel injecte automatiquement certaines variables :

```bash
VERCEL=1                          # Toujours "1" sur Vercel
VERCEL_ENV=production             # production, preview, ou development
VERCEL_URL=votre-app.vercel.app   # URL du déploiement
VERCEL_GIT_COMMIT_SHA=abc123      # SHA du commit Git
VERCEL_GIT_COMMIT_REF=main        # Branche Git
```

Vous pouvez les utiliser dans votre code :

```typescript
const isProduction = import.meta.env.VERCEL_ENV === 'production';
const deploymentUrl = import.meta.env.VERCEL_URL;
```

---

## 🧪 Test des Variables en Local

1. **Créer un fichier .env à la racine**
   ```bash
   touch .env
   ```

2. **Copier les variables** (depuis ce document)

3. **Lancer le serveur de dev**
   ```bash
   npm run dev
   ```

4. **Vérifier dans la console**
   ```javascript
   console.log('SMMA URL:', import.meta.env.VITE_SMMA_API_URL);
   console.log('Cardinity Key:', import.meta.env.VITE_CARDINITY_CONSUMER_KEY);
   ```

---

## 🔍 Vérification Post-Déploiement

Après avoir configuré les variables et redéployé :

1. **Ouvrir la console du navigateur** sur votre site Vercel

2. **Tester une variable**
   ```javascript
   console.log(import.meta.env.VITE_SMMA_API_URL)
   ```

3. **Devrait afficher** : `https://api.smma-platform.com`

4. **Si undefined** :
   - Vérifiez que la variable est bien ajoutée sur Vercel
   - Vérifiez le préfixe `VITE_`
   - Redéployez l'application

---

## 📊 Checklist de Configuration

- [ ] 8 variables ajoutées sur Vercel Dashboard
- [ ] Environnements sélectionnés (Production + Preview + Development)
- [ ] Application redéployée
- [ ] Variables testées dans la console du navigateur
- [ ] URLs de callback mises à jour avec le domaine Vercel
- [ ] Fichier `.env` local créé pour le développement
- [ ] `.env` ajouté au `.gitignore` (déjà fait)

---

**✅ Une fois toutes les variables configurées, votre application sera pleinement fonctionnelle sur Vercel !**

