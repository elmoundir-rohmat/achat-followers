# ⚡ Quick Start - Migration Sécurité

## 🎯 En 5 Minutes

Voici les **commandes essentielles** pour finaliser la migration de sécurité.

---

## ✅ Étape 1 : Mise à Jour Automatique des Imports

```bash
npm run security:migrate
```

Ce script va automatiquement :
- Remplacer `smmaService` → `smmaServiceClient`
- Remplacer `instagramService` → `instagramServiceClient`
- Dans tous vos composants

---

## ✅ Étape 2 : Installer les Dépendances

```bash
npm install
```

---

## ✅ Étape 3 : Créer le Fichier .env Local

```bash
cp env.example.secure .env
nano .env
```

Remplissez avec **vos vraies clés** :

```bash
# PUBLIQUES
VITE_CARDINITY_SUCCESS_URL=http://localhost:5173/payment/success
VITE_CARDINITY_CANCEL_URL=http://localhost:5173/payment/cancel

# SERVEUR (vos vraies clés)
CARDINITY_CONSUMER_KEY=ck_live_xxxxx
CARDINITY_CONSUMER_SECRET=cs_live_xxxxx
CARDINITY_SUCCESS_URL=http://localhost:5173/payment/success
CARDINITY_CANCEL_URL=http://localhost:5173/payment/cancel
SMMA_API_URL=https://justanotherpanel.com/api/v2
SMMA_API_KEY=sk_xxxxx
STARAPI_URL=https://starapi1.p.rapidapi.com
RAPIDAPI_KEY=xxxxx
```

---

## ✅ Étape 4 : Tester en Local

```bash
npm run build
npm run preview
```

Testez :
- ✅ Créer un paiement
- ✅ Commander des followers
- ✅ Afficher des posts Instagram

---

## ✅ Étape 5 : Configurer Vercel

### 5.1 - Ajouter 10 Variables

```
Vercel Dashboard → Settings → Environment Variables → Add New
```

**Copy-paste** (remplacez VOTRE-APP et les xxxxx) :

```
VITE_CARDINITY_SUCCESS_URL = https://VOTRE-APP.vercel.app/payment/success
VITE_CARDINITY_CANCEL_URL = https://VOTRE-APP.vercel.app/payment/cancel
CARDINITY_CONSUMER_KEY = ck_live_xxxxx
CARDINITY_CONSUMER_SECRET = cs_live_xxxxx
CARDINITY_SUCCESS_URL = https://VOTRE-APP.vercel.app/payment/success
CARDINITY_CANCEL_URL = https://VOTRE-APP.vercel.app/payment/cancel
SMMA_API_URL = https://justanotherpanel.com/api/v2
SMMA_API_KEY = sk_xxxxx
STARAPI_URL = https://starapi1.p.rapidapi.com
RAPIDAPI_KEY = xxxxx
```

**Pour chaque variable** :
- ✅ Cocher **Production**
- ✅ Cocher **Preview**  
- ✅ Cocher **Development**

### 5.2 - Déployer

```bash
npm run vercel:deploy
```

---

## ✅ Étape 6 : Vérifier

Ouvrez votre app sur Vercel, puis F12 → Console :

```javascript
// ✅ Doit afficher l'URL
console.log(import.meta.env.VITE_CARDINITY_SUCCESS_URL);

// ✅ Doit afficher undefined (sécurité)
console.log(import.meta.env.VITE_CARDINITY_CONSUMER_KEY);
```

---

## 🎯 Checklist Complète

- [ ] `npm run security:migrate` exécuté
- [ ] `npm install` exécuté
- [ ] Fichier `.env` créé et rempli
- [ ] `npm run build` réussi
- [ ] Tests locaux OK
- [ ] 10 variables ajoutées sur Vercel
- [ ] Application redéployée
- [ ] Tests post-déploiement OK

---

## 📚 Documentation Complète

Pour plus de détails :
- **`RESUME_MIGRATION_SECURITE.md`** → Résumé complet
- **`VERCEL_ENV_SECURE.md`** → Guide variables détaillé
- **`MIGRATION_SECURITE_COMPLETE.md`** → Guide migration

---

## 🚀 Commandes Utiles

```bash
# Migration automatique des imports
npm run security:migrate

# Vérifier la configuration
npm run vercel:check

# Build local
npm run build

# Preview local
npm run preview

# Déployer sur Vercel
npm run vercel:deploy
```

---

**🎉 C'est tout ! Votre app est sécurisée en 5 étapes.**

