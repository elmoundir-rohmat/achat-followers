# 🔑 Configuration des clés Cardinity

## 🚨 Problème identifié

L'erreur `"project_id field is invalid"` indique que nous utilisons les mauvaises clés pour la Hosted Payment Page.

## 📋 Clés nécessaires

Cardinity utilise **deux types de clés** :

### 1. **API REST** (pour l'API directe)
- `consumer_key` : `test_fganqfvtqbnrtclixdcvkxpbrnixfh`
- `consumer_secret` : `azlhhkau4w8mh1q8hssxguq6dtzbvww4rfkfi8db4yhxm39ey1`

### 2. **Hosted Payment Page** (pour la page de paiement hébergée)
- `project_id` : **À obtenir dans votre dashboard Cardinity**
- `project_secret` : **À obtenir dans votre dashboard Cardinity**

## 🔍 Comment obtenir les clés Hosted Payment Page

### 1. Se connecter au dashboard Cardinity
- Aller sur https://cardinity.com
- Se connecter avec vos identifiants

### 2. Naviguer vers la section Hosted Payment Page
- Chercher "Hosted Payment Page" ou "Checkout"
- Ou "Projects" dans le menu

### 3. Créer un nouveau projet ou utiliser un existant
- Créer un nouveau projet pour votre site
- Noter le `Project ID` et `Project Secret`

### 4. Configurer les URLs de callback
- `return_url` : `https://doctorfollowers.com/payment/success`
- `cancel_url` : `https://doctorfollowers.com/payment/cancel`

## 🔧 Configuration des variables d'environnement

Une fois les clés obtenues, ajoutez-les à votre `.env` :

```env
# API REST (déjà configuré)
VITE_CARDINITY_CONSUMER_KEY=test_fganqfvtqbnrtclixdcvkxpbrnixfh
VITE_CARDINITY_CONSUMER_SECRET=azlhhkau4w8mh1q8hssxguq6dtzbvww4rfkfi8db4yhxm39ey1

# Hosted Payment Page (configuré)
VITE_CARDINITY_PROJECT_ID=test_pr_qv9zu05bvo31crposua7589yrjf8uy
VITE_CARDINITY_PROJECT_SECRET=tms6iehwwaa1vb8y8xlz4ymygyxmp1nyt0apeizog9wuqbwh6p

# URLs de callback
VITE_CARDINITY_SUCCESS_URL=https://doctorfollowers.com/payment/success
VITE_CARDINITY_CANCEL_URL=https://doctorfollowers.com/payment/cancel
```

## 📞 Support Cardinity

Si vous ne trouvez pas les clés Hosted Payment Page :

### Contact
- Email : support@cardinity.com
- Documentation : https://developers.cardinity.com/

### Informations à fournir
- Votre Consumer Key : `test_fganqfvtqbnrtclixdcvkxpbrnixfh`
- Votre domaine : `doctorfollowers.com`
- Demande : "Comment obtenir les clés Project ID et Project Secret pour Hosted Payment Page ?"

## 🎯 Prochaines étapes

1. **Obtenir les clés** Project ID et Project Secret
2. **Configurer les variables** d'environnement
3. **Tester le paiement** avec les nouvelles clés
4. **Vérifier les callbacks** success/cancel

---

**Une fois les bonnes clés configurées, la Hosted Payment Page fonctionnera parfaitement ! 🚀**
