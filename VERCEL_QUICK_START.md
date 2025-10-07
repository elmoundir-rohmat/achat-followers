# ⚡ Quick Start - Déploiement Vercel

## 🚀 Déploiement en 5 Minutes

Votre projet est **100% prêt** pour Vercel ! Suivez ces étapes :

---

## Étape 1️⃣ : Vérifier la Configuration ✅

```bash
npm run vercel:check
```

Ce script vérifie que tout est en place. Vous devriez voir :
```
✅ Configuration Vercel Parfaite !
```

---

## Étape 2️⃣ : Déployer sur Vercel 🌐

### Option A : Via Interface Web (Recommandé pour la première fois)

1. **Aller sur Vercel**
   👉 https://vercel.com/new

2. **Importer votre repository**
   - Connectez GitHub/GitLab/Bitbucket
   - Sélectionnez ce projet

3. **Configuration Auto-Détectée**
   ```
   ✅ Framework Preset: Vite
   ✅ Build Command: npm run build
   ✅ Output Directory: dist
   ```
   
   > Vérifiez que ces valeurs sont correctes, puis cliquez sur **Deploy**

4. **Attendez le Build** (1-2 minutes)

5. **🎉 C'est en ligne !**
   - URL de preview : `https://votre-projet.vercel.app`

---

### Option B : Via CLI (Pour les développeurs expérimentés)

```bash
# Installer Vercel CLI globalement
npm i -g vercel

# Login
vercel login

# Déployer en preview
npm run vercel:preview

# Déployer en production
npm run vercel:deploy
```

---

## Étape 3️⃣ : Configurer les Variables d'Environnement 🔐

**IMPORTANT** : Sans ces variables, l'app ne fonctionnera pas correctement !

### Via Vercel Dashboard :

1. Aller sur votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajouter ces 8 variables :

```bash
VITE_CARDINITY_CONSUMER_KEY          = [votre clé]
VITE_CARDINITY_CONSUMER_SECRET       = [votre secret]
VITE_CARDINITY_SUCCESS_URL           = https://votre-app.vercel.app/payment/success
VITE_CARDINITY_CANCEL_URL            = https://votre-app.vercel.app/payment/cancel
VITE_SMMA_API_URL                    = https://api.smma-platform.com
VITE_SMMA_API_KEY                    = [votre clé]
VITE_STARAPI_URL                     = https://starapi1.p.rapidapi.com
VITE_RAPIDAPI_KEY                    = [votre clé]
```

4. Pour chaque variable, cochez :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Redéployer** l'application après avoir ajouté les variables

📖 **Voir le guide détaillé** : `VERCEL_ENV_VARIABLES.md`

---

## Étape 4️⃣ : Vérifier le Déploiement ✅

Testez ces URLs sur votre app déployée :

### Routes Principales
- ✅ `https://votre-app.vercel.app/`
- ✅ `https://votre-app.vercel.app/about`
- ✅ `https://votre-app.vercel.app/blog`
- ✅ `https://votre-app.vercel.app/contact`

### Fichiers Statiques
- ✅ `https://votre-app.vercel.app/sitemap.xml`
- ✅ `https://votre-app.vercel.app/robots.txt`

### Test Important : Rechargement de Page
1. Allez sur une route (ex: `/about`)
2. Appuyez sur **F5** pour recharger
3. ✅ La page doit se charger correctement (pas de 404)

---

## Étape 5️⃣ : Domaine Personnalisé (Optionnel) 🌍

1. **Vercel Dashboard** → **Settings** → **Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine : `www.votre-domaine.com`
4. Configurez vos DNS selon les instructions Vercel
5. Attendez la propagation (5-60 min)

---

## 📋 Checklist Complète

- [ ] ✅ Configuration vérifiée avec `npm run vercel:check`
- [ ] 🌐 Application déployée sur Vercel
- [ ] 🔐 8 variables d'environnement configurées
- [ ] 🔄 Application redéployée après ajout des variables
- [ ] ✅ Routes testées (pas d'erreur 404)
- [ ] 📄 `sitemap.xml` et `robots.txt` accessibles
- [ ] 🔍 Variables testées dans la console du navigateur
- [ ] 🌍 Domaine personnalisé configuré (si applicable)
- [ ] 🗑️ Fichiers Netlify supprimés (voir `CLEANUP_NETLIFY.md`)

---

## 🎯 Commandes Utiles

```bash
# Vérifier la configuration
npm run vercel:check

# Build local
npm run build

# Preview local
npm run preview

# Déploiement preview sur Vercel
npm run vercel:preview

# Déploiement production sur Vercel
npm run vercel:deploy

# Générer le sitemap
npm run generate-sitemap
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

| Fichier | Description |
|---------|-------------|
| `VERCEL_MIGRATION_GUIDE.md` | Guide complet de migration |
| `VERCEL_ENV_VARIABLES.md` | Configuration des variables d'environnement |
| `CLEANUP_NETLIFY.md` | Suppression des fichiers Netlify |
| `vercel.json` | Configuration Vercel (avec commentaires) |

---

## 🆘 Problèmes Courants

### ❌ Erreur 404 sur les routes

**Cause** : Rewrites non configurés  
**Solution** : Vérifiez que `vercel.json` contient bien la section `rewrites`

### ❌ Variables d'environnement undefined

**Cause** : Variables non configurées ou sans le préfixe `VITE_`  
**Solution** : 
1. Ajoutez les variables sur Vercel Dashboard
2. Vérifiez le préfixe `VITE_`
3. Redéployez l'app

### ❌ sitemap.xml renvoie du HTML

**Cause** : Routes non configurées correctement  
**Solution** : Vérifiez la section `routes` dans `vercel.json`

### ❌ Build échoue

**Cause** : Dépendances manquantes ou erreurs TypeScript  
**Solution** :
```bash
# Tester en local
npm install
npm run build

# Vérifier les logs sur Vercel Dashboard
```

---

## 💡 Conseils Pro

1. **Preview Deployments** : Chaque branche a son URL de preview automatiquement
2. **Rollback** : Vous pouvez revenir à un déploiement précédent en 1 clic
3. **Analytics** : Activez Vercel Analytics pour suivre les performances
4. **Edge Functions** : Explorez les Edge Functions pour des fonctionnalités avancées

---

## 🎉 Prochaines Étapes

Une fois déployé avec succès :

1. ✅ Partagez l'URL avec votre équipe
2. 📊 Activez Vercel Analytics
3. 🔒 Configurez SSL (automatique avec Vercel)
4. 🌍 Ajoutez votre domaine personnalisé
5. 🗑️ Nettoyez les fichiers Netlify
6. 📈 Surveillez les performances

---

**🚀 Bon déploiement sur Vercel !**

Des questions ? Consultez la [documentation Vercel](https://vercel.com/docs) ou le guide complet `VERCEL_MIGRATION_GUIDE.md`.

