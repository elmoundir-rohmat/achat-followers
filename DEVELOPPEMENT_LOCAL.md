# 🛠️ Guide de Développement Local

## ⚠️ Problème : Routes API en développement

Les routes API Vercel (`/api/*`) **ne fonctionnent PAS** avec `npm run dev` car Vite ne peut pas exécuter les fonctions serverless.

### Erreur typique :
```
Failed to load resource: the server responded with a status of 404 (Not Found)
/api/instagram/clips
```

## ✅ Solution 1 : Utiliser Vercel Dev (RECOMMANDÉ)

Pour tester les routes API en local, utilisez `vercel dev` :

```bash
vercel dev
```

Ou pour spécifier un port :

```bash
vercel dev --listen 3000
```

### Avantages de `vercel dev` :
- ✅ Exécute les fonctions serverless localement
- ✅ Simule l'environnement de production Vercel
- ✅ Charge les variables d'environnement depuis Vercel
- ✅ Hot reload fonctionnel

### Configuration requise :

1. **Installer Vercel CLI** (si pas déjà fait) :
   ```bash
   npm install -g vercel
   ```

2. **Se connecter à Vercel** :
   ```bash
   vercel login
   ```

3. **Lier le projet** (première fois uniquement) :
   ```bash
   vercel link
   ```

4. **Télécharger les variables d'environnement** :
   ```bash
   vercel env pull
   ```

5. **Démarrer le serveur** :
   ```bash
   vercel dev
   ```

## 🔄 Solution 2 : Tester directement en production

Si vous n'avez pas besoin de tester en local, déployez sur Vercel :

```bash
git add .
git commit -m "votre message"
git push origin main
```

Vercel déploiera automatiquement et toutes les routes API fonctionneront.

## 📝 Différences entre npm run dev et vercel dev

| Fonctionnalité | `npm run dev` | `vercel dev` |
|----------------|---------------|--------------|
| Interface React | ✅ | ✅ |
| Hot reload | ✅ | ✅ |
| Routes API `/api/*` | ❌ | ✅ |
| Variables d'environnement | `.env` local | Depuis Vercel |
| Port par défaut | 5173 | 3000 |
| Temps de démarrage | Rapide | Moyen |

## 🎯 Recommandation

### Pour le développement frontend uniquement :
```bash
npm run dev
```

### Pour tester les routes API (Instagram, Paiement, etc.) :
```bash
vercel dev
```

### Pour tester en conditions réelles :
Déployer sur Vercel

## 🐛 Dépannage

### Erreur : "Vercel CLI not installed"
```bash
npm install -g vercel
```

### Erreur : "Not linked to a Vercel project"
```bash
vercel link
```

### Erreur : "Missing environment variables"
```bash
vercel env pull
```

### Port déjà utilisé
```bash
vercel dev --listen 3001  # Utiliser un autre port
```

## 📦 Routes API disponibles

Voici les routes API qui nécessitent `vercel dev` :

- `/api/instagram/clips` - Récupération des reels Instagram
- `/api/instagram/posts` - Récupération des posts Instagram
- `/api/cardinity/create-payment` - Création de paiement Cardinity
- `/api/smma/order` - Création de commande SMMA
- `/api/payment-success` - Callback de paiement réussi

## 🚀 Workflow recommandé

1. **Développement UI/UX** : Utilisez `npm run dev`
2. **Test des API** : Utilisez `vercel dev`
3. **Test final** : Déployez sur Vercel (aperçu ou production)

---

**Note** : Les modifications apportées aux reels Instagram nécessitent `vercel dev` pour être testées en local car elles utilisent la route `/api/instagram/clips`.

