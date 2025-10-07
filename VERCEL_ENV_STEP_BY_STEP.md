# 🔐 Configuration des Variables d'Environnement sur Vercel
## Guide Pas à Pas

---

## 📋 Liste des 8 Variables à Configurer

### Cardinity (Paiement)
1. `VITE_CARDINITY_CONSUMER_KEY`
2. `VITE_CARDINITY_CONSUMER_SECRET`
3. `VITE_CARDINITY_SUCCESS_URL`
4. `VITE_CARDINITY_CANCEL_URL`

### SMMA Platform
5. `VITE_SMMA_API_URL`
6. `VITE_SMMA_API_KEY`

### StarAPI (Instagram)
7. `VITE_STARAPI_URL`
8. `VITE_RAPIDAPI_KEY`

---

## 🎯 Où les Ajouter ?

### Sur Vercel Dashboard (Après le déploiement)

```
1. https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Settings (⚙️)
4. Environment Variables (menu de gauche)
5. Add New (bouton en haut à droite)
```

---

## 📝 Configuration Détaillée

### Variable 1 : VITE_CARDINITY_CONSUMER_KEY

```
┌─────────────────────────────────────────────┐
│ Add Environment Variable                    │
├─────────────────────────────────────────────┤
│                                             │
│ Name (required)                             │
│ ┌─────────────────────────────────────────┐ │
│ │ VITE_CARDINITY_CONSUMER_KEY             │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Value (required)                            │
│ ┌─────────────────────────────────────────┐ │
│ │ ck_live_xxxxxxxxxxxxxxxxxxxxx           │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Environments                                │
│ ☑ Production                                │
│ ☑ Preview                                   │
│ ☑ Development                               │
│                                             │
│         [Cancel]          [Save]            │
└─────────────────────────────────────────────┘
```

**Cliquez sur Save**

---

### Variable 2 : VITE_CARDINITY_CONSUMER_SECRET

```
Name: VITE_CARDINITY_CONSUMER_SECRET
Value: cs_live_xxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ✅ Development
```

**Cliquez sur Save**

---

### Variable 3 : VITE_CARDINITY_SUCCESS_URL

```
Name: VITE_CARDINITY_SUCCESS_URL
Value: https://votre-app.vercel.app/payment/success
Environments: ✅ Production ✅ Preview ✅ Development
```

⚠️ **IMPORTANT** : Remplacez `votre-app` par votre vrai nom de domaine Vercel !

**Cliquez sur Save**

---

### Variable 4 : VITE_CARDINITY_CANCEL_URL

```
Name: VITE_CARDINITY_CANCEL_URL
Value: https://votre-app.vercel.app/payment/cancel
Environments: ✅ Production ✅ Preview ✅ Development
```

⚠️ **IMPORTANT** : Remplacez `votre-app` par votre vrai nom de domaine Vercel !

**Cliquez sur Save**

---

### Variable 5 : VITE_SMMA_API_URL

```
Name: VITE_SMMA_API_URL
Value: https://api.smma-platform.com
Environments: ✅ Production ✅ Preview ✅ Development
```

**Cliquez sur Save**

---

### Variable 6 : VITE_SMMA_API_KEY

```
Name: VITE_SMMA_API_KEY
Value: sk_xxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ✅ Development
```

**Cliquez sur Save**

---

### Variable 7 : VITE_STARAPI_URL

```
Name: VITE_STARAPI_URL
Value: https://starapi1.p.rapidapi.com
Environments: ✅ Production ✅ Preview ✅ Development
```

**Cliquez sur Save**

---

### Variable 8 : VITE_RAPIDAPI_KEY

```
Name: VITE_RAPIDAPI_KEY
Value: xxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ✅ Development
```

**Cliquez sur Save**

---

## ✅ Vérification

Après avoir ajouté les 8 variables, vous devriez voir :

```
Environment Variables (8)

Production | Preview | Development | Name
─────────────────────────────────────────────────────────
    ●      |    ●    |      ●      | VITE_CARDINITY_CONSUMER_KEY
    ●      |    ●    |      ●      | VITE_CARDINITY_CONSUMER_SECRET
    ●      |    ●    |      ●      | VITE_CARDINITY_SUCCESS_URL
    ●      |    ●    |      ●      | VITE_CARDINITY_CANCEL_URL
    ●      |    ●    |      ●      | VITE_SMMA_API_URL
    ●      |    ●    |      ●      | VITE_SMMA_API_KEY
    ●      |    ●    |      ●      | VITE_STARAPI_URL
    ●      |    ●    |      ●      | VITE_RAPIDAPI_KEY
```

---

## 🔄 Redéployer l'Application

⚠️ **IMPORTANT** : Les variables d'environnement ne sont appliquées qu'au prochain déploiement !

### Option 1 : Via l'Interface Vercel

```
1. Allez dans l'onglet "Deployments"
2. Cliquez sur les 3 points (...) du dernier déploiement
3. Cliquez sur "Redeploy"
4. Attendez la fin du build (1-2 min)
```

### Option 2 : Via CLI

```bash
npm run vercel:deploy
```

### Option 3 : Via Git Push

```bash
git commit --allow-empty -m "chore: trigger redeploy with env vars"
git push
```

---

## 🧪 Test des Variables

Après le redéploiement, vérifiez que les variables sont bien chargées :

### 1. Ouvrez votre app déployée
```
https://votre-app.vercel.app
```

### 2. Ouvrez la Console du Navigateur
```
F12 → Console
```

### 3. Testez une variable
```javascript
console.log(import.meta.env.VITE_SMMA_API_URL)
// Devrait afficher: https://api.smma-platform.com
```

### 4. Si undefined
- Les variables ne sont pas configurées correctement
- Ou vous n'avez pas redéployé après les avoir ajoutées

---

## 📊 Récapitulatif

### Checklist Complète

- [ ] 8 variables ajoutées sur Vercel Dashboard
- [ ] Toutes avec les 3 environnements cochés (Production, Preview, Development)
- [ ] Application redéployée
- [ ] Variables testées dans la console du navigateur
- [ ] URLs de callback mises à jour avec le vrai domaine Vercel

---

## 🔐 Où Trouver Vos Clés API ?

### Cardinity
```
https://cardinity.com → Dashboard → API Keys
```

### SMMA Platform
```
Votre plateforme SMMA → Settings → API Keys
```

### RapidAPI (StarAPI)
```
https://rapidapi.com → My Apps → Default Application → Security
```

---

## ⚠️ Sécurité

### À FAIRE ✅
- Utiliser des clés différentes pour dev/preview/production (recommandé)
- Sauvegarder vos clés dans un gestionnaire de mots de passe
- Ne jamais commiter les clés dans Git

### À NE PAS FAIRE ❌
- Partager vos clés API publiquement
- Commiter le fichier `.env` dans Git
- Utiliser les mêmes clés en dev et prod (risqué)

---

## 💡 Astuce : Variables par Environnement

Vous pouvez configurer des valeurs différentes pour chaque environnement :

### Exemple : URLs de callback différentes

**Production**
```
VITE_CARDINITY_SUCCESS_URL = https://www.monsite.com/payment/success
```

**Preview**
```
VITE_CARDINITY_SUCCESS_URL = https://preview.monsite.com/payment/success
```

**Development**
```
VITE_CARDINITY_SUCCESS_URL = http://localhost:5173/payment/success
```

Pour cela, ajoutez la variable 3 fois avec des valeurs différentes et cochez l'environnement correspondant pour chacune.

---

## 🆘 Problèmes Courants

### Problème 1 : Variable `undefined` dans le navigateur

**Causes possibles** :
- Variable sans préfixe `VITE_`
- Variable non configurée sur Vercel
- Application pas redéployée après ajout des variables

**Solutions** :
1. Vérifier que toutes les variables commencent par `VITE_`
2. Vérifier sur Vercel Dashboard que les 8 variables sont présentes
3. Redéployer l'application

---

### Problème 2 : Erreur "Environment variable not found"

**Solution** :
- Vérifier l'orthographe exacte du nom de la variable
- Vérifier que l'environnement approprié est coché

---

### Problème 3 : Les modifications ne sont pas prises en compte

**Solution** :
- Les variables sont injectées au moment du build
- Vous DEVEZ redéployer pour que les changements soient appliqués

---

## 📚 Ressources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**✅ Une fois les 8 variables configurées et l'app redéployée, votre application sera pleinement fonctionnelle !**

