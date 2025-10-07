# ✅ Checklist de Déploiement Vercel

> **Utilisez cette checklist pour déployer votre application pas à pas**

---

## 🎯 Avant de Commencer

### Prérequis
- [ ] Compte Vercel créé (https://vercel.com/signup)
- [ ] Repository Git configuré (GitHub, GitLab, ou Bitbucket)
- [ ] Node.js installé (v16 ou supérieur)
- [ ] Les 8 variables d'environnement à portée de main

---

## 📋 Étape 1 : Vérification de la Configuration

### Actions
```bash
# Vérifier que tout est en place
npm run vercel:check
```

### Résultat Attendu
```
✅ Configuration Vercel Parfaite !

Vous pouvez déployer sur Vercel :
  npm run vercel:preview  (preview)
  npm run vercel:deploy   (production)
```

### Si Erreurs
- [ ] Vérifier que `vercel.json` existe à la racine
- [ ] Vérifier que `.vercelignore` existe
- [ ] Vérifier les scripts dans `package.json`

---

## 📋 Étape 2 : Build Local (Recommandé)

### Actions
```bash
# Tester le build en local
npm run build

# Si succès, tester le preview
npm run preview
```

### Résultat Attendu
```
✓ built in 1-2s
dist/index.html           7.35 kB
dist/assets/index.css    50.19 kB
dist/assets/index.js    509.52 kB
```

### Navigation dans le Preview
- [ ] Page d'accueil charge correctement
- [ ] Navigation entre pages fonctionne
- [ ] Pas d'erreurs dans la console du navigateur

### Si Erreurs
- [ ] Corriger les erreurs TypeScript
- [ ] Vérifier les imports manquants
- [ ] Relire les logs de build

---

## 📋 Étape 3 : Déploiement sur Vercel

### Option A : Via Interface Web (Recommandé)

#### 3.1 Connexion à Vercel
- [ ] Aller sur https://vercel.com/new
- [ ] Se connecter avec GitHub/GitLab/Bitbucket
- [ ] Autoriser Vercel à accéder à vos repositories

#### 3.2 Import du Projet
- [ ] Cliquer sur "Import Project"
- [ ] Sélectionner votre repository
- [ ] Cliquer sur "Import"

#### 3.3 Configuration du Projet
Vercel devrait auto-détecter :
- [ ] **Framework Preset** : `Vite` ✅
- [ ] **Build Command** : `npm run build` ✅
- [ ] **Output Directory** : `dist` ✅
- [ ] **Install Command** : `npm install` ✅

Si ce n'est pas le cas, entrez manuellement ces valeurs.

#### 3.4 Déploiement Initial
- [ ] Cliquer sur "Deploy"
- [ ] Attendre la fin du build (1-3 minutes)
- [ ] Noter l'URL de déploiement : `https://votre-projet.vercel.app`

#### 3.5 Vérification du Déploiement
- [ ] L'app se charge (peut avoir des erreurs API, c'est normal)
- [ ] Les routes statiques fonctionnent
- [ ] Pas d'erreur 404 lors de la navigation

---

### Option B : Via CLI

#### 3.1 Installation de Vercel CLI
```bash
# Installer Vercel CLI globalement
npm i -g vercel

# Ou utiliser le script d'aide
./.vercel-commands.sh install-cli
```

#### 3.2 Login
```bash
# Se connecter à Vercel
vercel login

# Ou utiliser le script
./.vercel-commands.sh login
```

#### 3.3 Déploiement Preview
```bash
# Déployer en preview (pour tester)
npm run vercel:preview

# Ou utiliser le script
./.vercel-commands.sh deploy-preview
```

#### 3.4 Déploiement Production
```bash
# Déployer en production
npm run vercel:deploy

# Ou utiliser le script
./.vercel-commands.sh deploy-prod
```

---

## 📋 Étape 4 : Configuration des Variables d'Environnement

### 4.1 Accéder aux Paramètres
- [ ] Aller sur Vercel Dashboard
- [ ] Sélectionner votre projet
- [ ] Cliquer sur **Settings** (⚙️)
- [ ] Puis **Environment Variables**

### 4.2 Ajouter les Variables

Pour **chaque variable** ci-dessous :

#### Variable 1 : VITE_CARDINITY_CONSUMER_KEY
- [ ] Name : `VITE_CARDINITY_CONSUMER_KEY`
- [ ] Value : `[votre clé consumer]`
- [ ] Environments : ✅ Production ✅ Preview ✅ Development
- [ ] Cliquer sur **Save**

#### Variable 2 : VITE_CARDINITY_CONSUMER_SECRET
- [ ] Name : `VITE_CARDINITY_CONSUMER_SECRET`
- [ ] Value : `[votre secret consumer]`
- [ ] Environments : ✅ Production ✅ Preview ✅ Development
- [ ] Cliquer sur **Save**

#### Variable 3 : VITE_CARDINITY_SUCCESS_URL
- [ ] Name : `VITE_CARDINITY_SUCCESS_URL`
- [ ] Value : `https://votre-app.vercel.app/payment/success`
- [ ] Environments : ✅ Production ✅ Preview ✅ Development
- [ ] Cliquer sur **Save**

#### Variable 4 : VITE_CARDINITY_CANCEL_URL
- [ ] Name : `VITE_CARDINITY_CANCEL_URL`
- [ ] Value : `https://votre-app.vercel.app/payment/cancel`
- [ ] Environments : ✅ Production ✅ Preview ✅ Development
- [ ] Cliquer sur **Save**

#### Variable 5 : VITE_SMMA_API_URL
- [ ] Name : `VITE_SMMA_API_URL`
- [ ] Value : `https://api.smma-platform.com`
- [ ] Environments : ✅ Production ✅ Preview ✅ Development
- [ ] Cliquer sur **Save**

#### Variable 6 : VITE_SMMA_API_KEY
- [ ] Name : `VITE_SMMA_API_KEY`
- [ ] Value : `[votre clé SMMA]`
- [ ] Environments : ✅ Production ✅ Preview ✅ Development
- [ ] Cliquer sur **Save**

#### Variable 7 : VITE_STARAPI_URL
- [ ] Name : `VITE_STARAPI_URL`
- [ ] Value : `https://starapi1.p.rapidapi.com`
- [ ] Environments : ✅ Production ✅ Preview ✅ Development
- [ ] Cliquer sur **Save**

#### Variable 8 : VITE_RAPIDAPI_KEY
- [ ] Name : `VITE_RAPIDAPI_KEY`
- [ ] Value : `[votre clé RapidAPI]`
- [ ] Environments : ✅ Production ✅ Preview ✅ Development
- [ ] Cliquer sur **Save**

### 4.3 Vérification
- [ ] Total de 8 variables configurées
- [ ] Toutes avec les 3 environnements cochés

---

## 📋 Étape 5 : Redéploiement

### 5.1 Redéployer l'Application
Après avoir ajouté les variables d'environnement :

#### Via Interface Web
- [ ] Aller dans **Deployments**
- [ ] Cliquer sur les 3 points (...) du dernier déploiement
- [ ] Cliquer sur **Redeploy**
- [ ] Attendre la fin du build

#### Via CLI
```bash
npm run vercel:deploy
```

### 5.2 Attendre le Nouveau Build
- [ ] Build terminé avec succès
- [ ] Nouvelle URL de production disponible

---

## 📋 Étape 6 : Tests Complets

### 6.1 Routes Principales
Testez ces URLs sur votre app déployée :

- [ ] `https://votre-app.vercel.app/` → Page d'accueil
- [ ] `https://votre-app.vercel.app/about` → Page À propos
- [ ] `https://votre-app.vercel.app/blog` → Page Blog
- [ ] `https://votre-app.vercel.app/contact` → Page Contact

### 6.2 Rechargement de Page (Test SPA)
- [ ] Aller sur une route (ex: `/about`)
- [ ] Appuyer sur **F5** pour recharger
- [ ] ✅ La page se charge correctement (pas de 404)
- [ ] Répéter pour 3-4 routes différentes

### 6.3 Fichiers Statiques
- [ ] `https://votre-app.vercel.app/sitemap.xml` → Affiche le XML
- [ ] `https://votre-app.vercel.app/robots.txt` → Affiche le contenu texte
- [ ] `https://votre-app.vercel.app/favicon-32x32.svg` → Affiche le favicon

### 6.4 Variables d'Environnement
- [ ] Ouvrir la console du navigateur (F12)
- [ ] Taper : `console.log(import.meta.env.VITE_SMMA_API_URL)`
- [ ] Résultat attendu : `https://api.smma-platform.com`
- [ ] Si `undefined`, les variables ne sont pas chargées

### 6.5 Fonctionnalités Métier
- [ ] Tester un flux de paiement Cardinity
- [ ] Tester les appels API SMMA
- [ ] Tester les appels API StarAPI (Instagram)
- [ ] Vérifier que les images se chargent
- [ ] Vérifier les formulaires

### 6.6 Performance
- [ ] Ouvrir DevTools → Lighthouse
- [ ] Lancer un audit Performance
- [ ] Score attendu : 80+ (idéalement 90+)

---

## 📋 Étape 7 : Configuration du Domaine (Optionnel)

### 7.1 Ajouter un Domaine
- [ ] Aller dans **Settings** → **Domains**
- [ ] Cliquer sur **Add Domain**
- [ ] Entrer votre domaine : `www.votre-domaine.com`

### 7.2 Configurer les DNS
Selon votre registrar, configurer :

#### Option A : CNAME Record
- [ ] Type : `CNAME`
- [ ] Name : `www`
- [ ] Value : `cname.vercel-dns.com`

#### Option B : A Record
- [ ] Type : `A`
- [ ] Name : `@` ou `www`
- [ ] Value : IP fournie par Vercel

### 7.3 Vérification
- [ ] Attendre la propagation DNS (5-60 minutes)
- [ ] Vérifier que le domaine est actif sur Vercel
- [ ] Tester `https://www.votre-domaine.com`

### 7.4 Mise à Jour des Variables
- [ ] Mettre à jour `VITE_CARDINITY_SUCCESS_URL`
- [ ] Mettre à jour `VITE_CARDINITY_CANCEL_URL`
- [ ] Redéployer l'application

---

## 📋 Étape 8 : Nettoyage Netlify (Optionnel)

### 8.1 Supprimer les Fichiers
```bash
# Supprimer les fichiers Netlify
rm netlify.toml
rm public/_redirects
rm dist/_redirects

# Ou utiliser le script
./.vercel-commands.sh cleanup
```

### 8.2 Commit et Push
```bash
git add .
git commit -m "chore: complete migration to Vercel - remove Netlify files"
git push origin main
```

### 8.3 Désactiver le Site Netlify
- [ ] Aller sur https://app.netlify.com/
- [ ] Sélectionner le site
- [ ] Site Settings → General → Danger zone
- [ ] Cliquer sur "Delete this site"
- [ ] Confirmer la suppression

---

## 📋 Étape 9 : Optimisations Post-Déploiement

### 9.1 Analytics
- [ ] Aller dans **Settings** → **Analytics**
- [ ] Cliquer sur **Enable Analytics**
- [ ] Choisir le plan (gratuit disponible)

### 9.2 Security Headers
Les headers de sécurité sont déjà configurés dans `vercel.json` :
- [x] X-Frame-Options
- [x] X-Content-Type-Options
- [x] X-XSS-Protection

### 9.3 HTTPS
- [x] Automatique avec Vercel (déjà actif)

### 9.4 Preview Deployments
- [x] Automatique pour chaque branche Git

---

## 📋 Étape 10 : Documentation Finale

### 10.1 Mettre à Jour le README
- [ ] Remplacer le badge Netlify par Vercel
- [ ] Mettre à jour les URLs de déploiement
- [ ] Ajouter les instructions de déploiement

### 10.2 Sauvegarder la Configuration
- [ ] Sauvegarder les variables d'environnement dans un gestionnaire de mots de passe
- [ ] Documenter les URLs de production et preview
- [ ] Archiver ce guide pour référence future

---

## ✅ Checklist Complète de Validation

### Configuration
- [ ] `vercel.json` créé et testé
- [ ] `.vercelignore` créé
- [ ] Scripts npm fonctionnels
- [ ] Build local réussi

### Déploiement
- [ ] Application déployée sur Vercel
- [ ] 8 variables d'environnement configurées
- [ ] Application redéployée après ajout des variables
- [ ] URL de production accessible

### Tests
- [ ] Routes principales fonctionnelles
- [ ] Rechargement de page fonctionne (pas de 404)
- [ ] Fichiers statiques accessibles
- [ ] Variables d'environnement chargées
- [ ] Paiements Cardinity testés
- [ ] APIs SMMA et StarAPI fonctionnelles

### Finalisation
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Analytics activé (optionnel)
- [ ] Fichiers Netlify supprimés
- [ ] Documentation mise à jour

---

## 🎉 Félicitations !

Votre application est maintenant **déployée avec succès sur Vercel** !

### Prochaines Étapes
1. 📊 Surveiller les performances avec Vercel Analytics
2. 🔍 Configurer le monitoring des erreurs (Sentry, LogRocket)
3. 🚀 Optimiser les performances (code splitting, lazy loading)
4. 📈 Mettre en place des tests E2E
5. 🔄 Configurer les CI/CD avancés

---

## 📚 Ressources Complémentaires

- [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md) - Démarrage rapide
- [VERCEL_MIGRATION_GUIDE.md](./VERCEL_MIGRATION_GUIDE.md) - Guide complet
- [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md) - Variables détaillées
- [CLEANUP_NETLIFY.md](./CLEANUP_NETLIFY.md) - Nettoyage Netlify

---

**🚀 Bon déploiement sur Vercel !**

