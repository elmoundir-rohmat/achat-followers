# 🚀 Guide de Migration vers Vercel

## ✅ Migration Complétée

Votre application est maintenant prête pour Vercel ! Tous les fichiers de configuration ont été créés.

---

## 📁 Fichiers Créés/Modifiés

### ✨ Nouveaux fichiers :
- `vercel.json` - Configuration complète de Vercel
- `.vercelignore` - Fichiers à ignorer lors du déploiement
- `VERCEL_MIGRATION_GUIDE.md` - Ce guide

### 📝 Fichiers modifiés :
- `package.json` - Ajout des scripts `vercel:deploy` et `vercel:preview`

### 🗑️ Fichiers Netlify (à garder ou supprimer selon votre choix) :
- `netlify.toml` - Peut être supprimé après migration complète
- `public/_redirects` - Peut être supprimé après migration complète
- `dist/_redirects` - Peut être supprimé après migration complète

---

## 🔧 Configuration Vercel.json

Le fichier `vercel.json` inclut :

### 1. **Configuration de Build**
```json
"buildCommand": "npm run build",
"outputDirectory": "dist",
"framework": "vite"
```

### 2. **Headers HTTP Personnalisés**
- Headers de sécurité (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Cache-Control pour sitemap.xml et robots.txt
- Content-Type appropriés pour les fichiers statiques

### 3. **Redirections SPA (Single Page Application)**
- Tous les chemins sont redirigés vers `index.html`
- **Exceptions importantes** :
  - `/sitemap.xml`
  - `/robots.txt`
  - Tous les fichiers statiques (`.svg`, `.css`, `.js`, images, fonts, etc.)

### 4. **Routes Statiques**
- Routes explicites pour `sitemap.xml` et `robots.txt`

---

## 🌐 Déploiement sur Vercel

### Option 1 : Déploiement via Interface Web (Recommandé)

1. **Accéder à Vercel**
   ```
   https://vercel.com/new
   ```

2. **Connecter votre Repository**
   - Cliquez sur "Import Git Repository"
   - Sélectionnez votre compte GitHub/GitLab/Bitbucket
   - Choisissez le repository de votre projet

3. **Configuration du Projet**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
   
   > ✅ Vercel devrait détecter automatiquement ces paramètres grâce au `vercel.json`

4. **Variables d'Environnement** (Voir section suivante)

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez la fin du build (1-3 minutes)
   - Votre app sera disponible sur `https://votre-projet.vercel.app`

---

### Option 2 : Déploiement via CLI

1. **Installer Vercel CLI** (si pas déjà fait)
   ```bash
   npm i -g vercel
   ```

2. **Login sur Vercel**
   ```bash
   vercel login
   ```

3. **Déploiement en Preview**
   ```bash
   npm run vercel:preview
   ```
   ou
   ```bash
   vercel
   ```

4. **Déploiement en Production**
   ```bash
   npm run vercel:deploy
   ```
   ou
   ```bash
   vercel --prod
   ```

---

## 🔐 Configuration des Variables d'Environnement

### Variables à Configurer sur Vercel :

Allez dans **Project Settings > Environment Variables** et ajoutez :

#### 1. Cardinity (Paiement)
```
VITE_CARDINITY_CONSUMER_KEY = your_consumer_key_here
VITE_CARDINITY_CONSUMER_SECRET = your_consumer_secret_here
VITE_CARDINITY_SUCCESS_URL = https://votre-domaine.com/payment/success
VITE_CARDINITY_CANCEL_URL = https://votre-domaine.com/payment/cancel
```

#### 2. SMMA Platform
```
VITE_SMMA_API_URL = https://api.smma-platform.com
VITE_SMMA_API_KEY = your_smma_api_key_here
```

#### 3. StarAPI (Instagram)
```
VITE_STARAPI_URL = https://starapi1.p.rapidapi.com
VITE_RAPIDAPI_KEY = your_rapidapi_key_here
```

### 📌 Important :
- Sélectionnez **Production**, **Preview**, et **Development** pour chaque variable
- Les variables préfixées par `VITE_` sont accessibles côté client
- Ne commitez JAMAIS vos vraies clés API dans le code

---

## ✅ Vérifications Post-Déploiement

### 1. **Test du Routing SPA**
Vérifiez que ces URLs fonctionnent sans erreur 404 :
- `https://votre-app.vercel.app/`
- `https://votre-app.vercel.app/about`
- `https://votre-app.vercel.app/blog`
- `https://votre-app.vercel.app/contact`

Rechargez la page (F5) sur chaque route pour vérifier le fallback.

### 2. **Fichiers Statiques**
Vérifiez l'accessibilité de :
- `https://votre-app.vercel.app/sitemap.xml` ✅
- `https://votre-app.vercel.app/robots.txt` ✅
- `https://votre-app.vercel.app/favicon-32x32.svg` ✅

### 3. **Headers HTTP**
Utilisez les DevTools (onglet Network) pour vérifier :
- Content-Type correct pour sitemap.xml (`application/xml`)
- Content-Type correct pour robots.txt (`text/plain`)
- Headers de sécurité présents

### 4. **Variables d'Environnement**
Vérifiez dans la console du navigateur que vos variables sont bien chargées :
```javascript
console.log(import.meta.env.VITE_SMMA_API_URL)
```

---

## 🌍 Configuration du Domaine Personnalisé

1. Allez dans **Project Settings > Domains**
2. Cliquez sur **Add Domain**
3. Entrez votre domaine (ex: `www.doctor-followers.com`)
4. Suivez les instructions pour configurer les DNS :
   - Type: `A` Record
   - Name: `@` ou `www`
   - Value: IP fournie par Vercel
   
   **OU**
   
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

5. Attendez la propagation DNS (5-60 minutes)

---

## 🔄 Déploiements Automatiques

Vercel déploie automatiquement :
- **Production** : À chaque push sur la branche `main` ou `master`
- **Preview** : À chaque push sur les autres branches
- **Pull Requests** : Crée un déploiement de preview pour chaque PR

---

## 🧹 Nettoyage Post-Migration

Une fois la migration validée sur Vercel, vous pouvez :

1. **Supprimer les fichiers Netlify**
   ```bash
   rm netlify.toml
   rm public/_redirects
   rm dist/_redirects
   ```

2. **Désactiver le projet Netlify**
   - Allez sur Netlify Dashboard
   - Project Settings > General > Delete Site

3. **Mettre à jour le README**
   - Remplacez le badge Netlify par Vercel
   - Mettez à jour les URLs de déploiement

---

## 📊 Différences Clés Netlify vs Vercel

| Fonctionnalité | Netlify | Vercel |
|---------------|---------|---------|
| Configuration | `netlify.toml` + `_redirects` | `vercel.json` |
| Détection Framework | Automatique | Automatique (amélioré) |
| Edge Functions | Netlify Functions | Vercel Edge Functions |
| Build Time | ~2-3 min | ~1-2 min |
| CDN | Oui | Oui (plus rapide) |
| Déploiements Preview | Oui | Oui (sur toutes les branches) |

---

## 🆘 Troubleshooting

### Problème : Erreur 404 sur les routes dynamiques
**Solution** : Vérifiez que le `vercel.json` contient bien la section `rewrites`

### Problème : Variables d'environnement non chargées
**Solution** : 
1. Vérifiez le préfixe `VITE_`
2. Redéployez après avoir ajouté les variables
3. Effacez le cache du build

### Problème : sitemap.xml ou robots.txt renvoie du HTML
**Solution** : Vérifiez la section `routes` dans `vercel.json`

### Problème : Build échoue
**Solution** :
1. Testez en local : `npm run build`
2. Vérifiez les logs de build sur Vercel
3. Vérifiez que toutes les dépendances sont dans `package.json`

---

## 📚 Ressources Utiles

- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
- [vercel.json Reference](https://vercel.com/docs/projects/project-configuration)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✨ Prochaines Étapes

1. ✅ Déployer sur Vercel
2. ✅ Configurer les variables d'environnement
3. ✅ Tester toutes les routes
4. ✅ Configurer le domaine personnalisé
5. ✅ Supprimer les fichiers Netlify (optionnel)
6. ✅ Mettre à jour la documentation

---

**🎉 Félicitations ! Votre application est maintenant prête pour Vercel !**

