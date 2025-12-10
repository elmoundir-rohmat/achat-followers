# 🚀 Déploiement sur Vercel

## ✅ Vercel CLI installé

Vercel est maintenant installé dans votre projet. Vous pouvez déployer avec :

```bash
npm run vercel:deploy
```

## 📋 Étapes de déploiement

### 1. Déployer sur Vercel

```bash
npm run vercel:deploy
```

La première fois, Vercel vous demandera :
- De vous connecter (si ce n'est pas déjà fait)
- De lier votre projet à un projet Vercel existant ou d'en créer un nouveau
- De confirmer les paramètres de build

### 2. Variables d'environnement

Si vous utilisez un token Sanity, ajoutez-le dans Vercel :

1. Dashboard Vercel → votre projet
2. **Settings** → **Environment Variables**
3. Ajoutez :
   - `VITE_SANITY_API_TOKEN` = votre token (si vous en avez un)

### 3. Vérifier le déploiement

Une fois déployé, Vercel vous donnera l'URL de votre site.

## 🔗 URLs importantes

- **Votre site en production** : (URL fournie par Vercel)
- **Sanity Studio** : https://doctorfollowers.sanity.studio/

## ⚠️ Important : Configurer CORS

N'oubliez pas de configurer CORS dans Sanity pour votre domaine de production :

1. https://www.sanity.io/manage
2. Projet `jyf2mfzr` → **API** → **CORS origins**
3. Ajoutez votre domaine Vercel (ex: `https://votre-projet.vercel.app`)

---

**Prêt à déployer ! Lancez `npm run vercel:deploy`** 🚀

