# 🚀 Migration Cardinity : Test → Production

## 📋 Vue d'ensemble

Ce guide vous explique **étape par étape** comment passer de l'environnement de **test** Cardinity à l'environnement de **production**.

---

## ⚠️ IMPORTANT : Différences Test vs Production

### Environnement TEST (actuel)
- ✅ Clés commencent par `test_` (ex: `test_fganqfvtqbnrtclixdcvkxpbrnixfh`)
- ✅ Project ID commence par `test_pr_` (ex: `test_pr_qv9zu05bvo31crposua7589yrjf8uy`)
- ✅ Permet d'utiliser des cartes de test
- ✅ Aucun paiement réel n'est effectué

### Environnement PRODUCTION
- ⚠️ Clés **sans** préfixe `test_` (ex: `ck_live_xxxxxxxxxxxxx`)
- ⚠️ Project ID **sans** préfixe `test_pr_` (ex: `pr_live_xxxxxxxxxxxxx`)
- ⚠️ **Paiements réels** - Les transactions sont définitives
- ⚠️ Nécessite un compte Cardinity validé et approuvé

---

## 📝 Étape 1 : Obtenir les clés de production

### 1.1 Se connecter au dashboard Cardinity

1. Aller sur **https://cardinity.com**
2. Se connecter avec vos identifiants
3. Naviguer vers **Settings** → **API Keys** ou **Projects**

### 1.2 Obtenir les clés nécessaires

Vous devez obtenir **4 clés** :

#### A. API REST Keys (pour l'API directe)
- `Consumer Key` (production) - Format : `ck_live_xxxxxxxxxxxxx`
- `Consumer Secret` (production) - Format : `cs_live_xxxxxxxxxxxxx`

#### B. Hosted Payment Page Keys (pour la page de paiement)
- `Project ID` (production) - Format : `pr_live_xxxxxxxxxxxxx`
- `Project Secret` (production) - Format : `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 1.3 Vérifier que votre compte est approuvé

⚠️ **IMPORTANT** : Assurez-vous que :
- ✅ Votre compte Cardinity est **approuvé pour la production**
- ✅ Votre entreprise est **vérifiée**
- ✅ Tous les documents requis sont **soumis et validés**

**Si votre compte n'est pas encore approuvé**, contactez le support Cardinity :
- Email : **support@cardinity.com**
- Documentation : **https://developers.cardinity.com/**

---

## 🔧 Étape 2 : Configurer les variables d'environnement

### 2.1 Variables côté CLIENT (Vercel - avec préfixe `VITE_`)

Ces variables sont accessibles dans le code frontend :

```env
# Cardinity Configuration - PRODUCTION
VITE_CARDINITY_SUCCESS_URL=https://www.doctorfollowers.com/payment/success
VITE_CARDINITY_CANCEL_URL=https://www.doctorfollowers.com/payment/cancel
```

⚠️ **Note** : Les clés API ne doivent **PAS** être dans les variables `VITE_` pour des raisons de sécurité.

### 2.2 Variables côté SERVEUR (Vercel - SANS préfixe `VITE_`)

Ces variables sont **uniquement** accessibles dans les API routes (`/api/*`) :

```env
# Hosted Payment Page - PRODUCTION
CARDINITY_PROJECT_ID=pr_live_xxxxxxxxxxxxx
CARDINITY_PROJECT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URLs de callback - PRODUCTION
CARDINITY_SUCCESS_URL=https://www.doctorfollowers.com/payment/success
CARDINITY_CANCEL_URL=https://www.doctorfollowers.com/payment/cancel
```

### 2.3 Configuration sur Vercel

#### Option A : Via l'interface Vercel

1. Aller sur **https://vercel.com** → Votre projet
2. **Settings** → **Environment Variables**
3. Pour chaque variable :

   **Variables CLIENT (Production)** :
   - Name : `VITE_CARDINITY_SUCCESS_URL`
   - Value : `https://www.doctorfollowers.com/payment/success`
   - Environment : ✅ Production
   
   - Name : `VITE_CARDINITY_CANCEL_URL`
   - Value : `https://www.doctorfollowers.com/payment/cancel`
   - Environment : ✅ Production

   **Variables SERVEUR (Production)** :
   - Name : `CARDINITY_PROJECT_ID`
   - Value : `pr_live_xxxxxxxxxxxxx` (votre clé de production)
   - Environment : ✅ Production
   
   - Name : `CARDINITY_PROJECT_SECRET`
   - Value : `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (votre secret de production)
   - Environment : ✅ Production
   
   - Name : `CARDINITY_SUCCESS_URL`
   - Value : `https://www.doctorfollowers.com/payment/success`
   - Environment : ✅ Production
   
   - Name : `CARDINITY_CANCEL_URL`
   - Value : `https://www.doctorfollowers.com/payment/cancel`
   - Environment : ✅ Production

#### Option B : Via la CLI Vercel

```bash
# Variables CLIENT
vercel env add VITE_CARDINITY_SUCCESS_URL production
# Entrer : https://www.doctorfollowers.com/payment/success

vercel env add VITE_CARDINITY_CANCEL_URL production
# Entrer : https://www.doctorfollowers.com/payment/cancel

# Variables SERVEUR
vercel env add CARDINITY_PROJECT_ID production
# Entrer : pr_live_xxxxxxxxxxxxx (votre clé)

vercel env add CARDINITY_PROJECT_SECRET production
# Entrer : xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (votre secret)

vercel env add CARDINITY_SUCCESS_URL production
# Entrer : https://www.doctorfollowers.com/payment/success

vercel env add CARDINITY_CANCEL_URL production
# Entrer : https://www.doctorfollowers.com/payment/cancel
```

---

## 🌐 Étape 3 : Configurer les URLs de callback chez Cardinity

### 3.1 Dans le dashboard Cardinity

1. Aller dans **Projects** → Votre projet de production
2. Configurer les **Return URLs** :
   - **Success URL** : `https://www.doctorfollowers.com/payment/success`
   - **Cancel URL** : `https://www.doctorfollowers.com/payment/cancel`

### 3.2 Whitelist du domaine

Assurez-vous que votre domaine est **whitelisté** chez Cardinity :
- ✅ `doctorfollowers.com`
- ✅ `www.doctorfollowers.com`

**Si nécessaire**, contactez le support Cardinity pour whitelister votre domaine.

---

## ✅ Étape 4 : Vérifications avant le déploiement

### Checklist de vérification

- [ ] ✅ Compte Cardinity approuvé pour la production
- [ ] ✅ Clés de production obtenues (Project ID + Secret)
- [ ] ✅ Variables d'environnement configurées sur Vercel
- [ ] ✅ URLs de callback configurées chez Cardinity
- [ ] ✅ Domaine whitelisté chez Cardinity
- [ ] ✅ Certificat SSL valide sur votre domaine
- [ ] ✅ URLs de callback accessibles publiquement

### Test des URLs de callback

```bash
# Tester que les URLs sont accessibles
curl -I https://www.doctorfollowers.com/payment/success
curl -I https://www.doctorfollowers.com/payment/cancel
```

Les deux doivent retourner un **status 200** ou **302** (redirection).

---

## 🚀 Étape 5 : Déploiement

### 5.1 Redéployer sur Vercel

Une fois les variables d'environnement configurées :

1. **Option A** : Redéployer manuellement
   - Aller sur Vercel → Votre projet
   - Cliquer sur **"Redeploy"** sur le dernier déploiement
   - Ou pousser un commit pour déclencher un nouveau déploiement

2. **Option B** : Via Git
   ```bash
   git commit --allow-empty -m "Switch to Cardinity production"
   git push origin main
   ```

### 5.2 Vérifier le déploiement

1. Attendre que le déploiement soit terminé
2. Vérifier les logs Vercel pour s'assurer qu'il n'y a pas d'erreurs
3. Tester une transaction de test (si possible)

---

## 🧪 Étape 6 : Tests en production

### ⚠️ ATTENTION : Tests en production

En production, **tous les paiements sont réels**. Il n'y a **pas de cartes de test**.

### 6.1 Test avec un petit montant

1. Effectuer un paiement avec un **très petit montant** (ex: 1€)
2. Utiliser une **vraie carte bancaire**
3. Vérifier que :
   - ✅ Le paiement est traité
   - ✅ La redirection vers `/payment/success` fonctionne
   - ✅ La commande SMMA est déclenchée
   - ✅ Les emails de confirmation sont envoyés

### 6.2 Vérifier les logs

- **Vercel Logs** : Vérifier qu'il n'y a pas d'erreurs
- **Cardinity Dashboard** : Vérifier que la transaction apparaît
- **Console navigateur** : Vérifier qu'il n'y a pas d'erreurs JavaScript

---

## 🔄 Étape 7 : Rollback (si nécessaire)

Si vous devez revenir en arrière vers l'environnement de test :

### 7.1 Reconfigurer les variables

Sur Vercel, remettre les variables de test :

```env
# Variables SERVEUR (Test)
CARDINITY_PROJECT_ID=test_pr_qv9zu05bvo31crposua7589yrjf8uy
CARDINITY_PROJECT_SECRET=tms6iehwwaa1vb8y8xlz4ymygyxmp1nyt0apeizog9wuqbwh6p
```

### 7.2 Redéployer

Redéployer l'application pour appliquer les changements.

---

## 📊 Résumé des changements

### Variables à modifier

| Variable | Test (actuel) | Production (à configurer) |
|----------|---------------|---------------------------|
| `CARDINITY_PROJECT_ID` | `test_pr_qv9zu05bvo31crposua7589yrjf8uy` | `pr_live_xxxxxxxxxxxxx` |
| `CARDINITY_PROJECT_SECRET` | `tms6iehwwaa1vb8y8xlz4ymygyxmp1nyt0apeizog9wuqbwh6p` | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `CARDINITY_SUCCESS_URL` | `https://www.doctorfollowers.com/payment/success` | ✅ Même (ou adapter) |
| `CARDINITY_CANCEL_URL` | `https://www.doctorfollowers.com/payment/cancel` | ✅ Même (ou adapter) |

### Code à vérifier

Le code actuel détecte automatiquement le mode test/production en vérifiant si les clés commencent par `test_`. Aucune modification de code n'est nécessaire.

---

## 🆘 Support et dépannage

### En cas de problème

1. **Vérifier les logs Vercel** : Vérifier les erreurs dans les logs de déploiement
2. **Vérifier la console navigateur** : Ouvrir F12 et vérifier les erreurs JavaScript
3. **Vérifier le dashboard Cardinity** : Vérifier les transactions et erreurs
4. **Contacter le support Cardinity** :
   - Email : **support@cardinity.com**
   - Documentation : **https://developers.cardinity.com/**

### Informations à fournir au support

- URL du site : `https://www.doctorfollowers.com`
- Project ID de production : `pr_live_xxxxxxxxxxxxx`
- Messages d'erreur de la console
- Logs Vercel
- Timestamp de l'erreur

---

## ✅ Checklist finale

Avant de passer en production, assurez-vous que :

- [ ] ✅ Compte Cardinity approuvé pour la production
- [ ] ✅ Clés de production obtenues et testées
- [ ] ✅ Variables d'environnement configurées sur Vercel (Production)
- [ ] ✅ URLs de callback configurées chez Cardinity
- [ ] ✅ Domaine whitelisté chez Cardinity
- [ ] ✅ Certificat SSL valide
- [ ] ✅ Test effectué avec un petit montant
- [ ] ✅ Redirection success/cancel fonctionne
- [ ] ✅ Intégration SMMA fonctionne après paiement
- [ ] ✅ Emails de confirmation envoyés

---

**🎉 Une fois toutes ces étapes complétées, vous serez en production avec Cardinity !**

