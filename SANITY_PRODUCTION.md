# 🚀 Mettre Sanity en Production

## ✅ Checklist de mise en production

### 1. Déployer Sanity Studio (pour que votre consultant SEO puisse y accéder)

#### Option A : Déployer sur sanity.studio (Recommandé - Gratuit)

```bash
npm run studio:deploy
```

Cela va :
- Déployer Sanity Studio sur `https://votre-projet.sanity.studio`
- Votre consultant SEO pourra y accéder depuis n'importe où
- C'est gratuit et géré par Sanity

#### Option B : Intégrer dans votre application Vite

Si vous voulez que Sanity Studio soit accessible via votre domaine (ex: `https://doctorfollowers.com/studio`), il faut configurer Vite pour servir Sanity Studio.

### 2. Configurer CORS pour votre domaine de production

1. Allez sur https://www.sanity.io/manage
2. Sélectionnez votre projet (`jyf2mfzr`)
3. Menu "API" → "CORS origins"
4. Ajoutez votre domaine de production :
   - `https://doctorfollowers.com` (remplacez par votre vrai domaine)
   - `https://www.doctorfollowers.com` (si vous utilisez www)
5. Cochez "Allow credentials" si disponible
6. Cliquez sur "Save"

### 3. Variables d'environnement en production

#### Sur Vercel (si vous utilisez Vercel)

1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Ajoutez (si vous utilisez un token) :
   - `VITE_SANITY_API_TOKEN` = votre token (optionnel)

**Note** : Si votre projet Sanity est public, vous n'avez pas besoin de token.

#### Sur Netlify ou autre plateforme

Ajoutez les mêmes variables d'environnement dans les paramètres de votre plateforme.

### 4. Vérifier la configuration

Dans votre code, vérifiez que :
- `sanity/lib/client.ts` utilise le bon Project ID (`jyf2mfzr`)
- Le dataset est `'production'` (ou celui que vous utilisez)
- CORS est configuré pour votre domaine

### 5. Tester en production

1. Déployez votre application
2. Testez que les articles se chargent correctement
3. Testez que Sanity Studio est accessible (si déployé)

## 📋 Résumé des actions

- [ ] Déployer Sanity Studio : `npm run studio:deploy`
- [ ] Configurer CORS pour votre domaine de production
- [ ] Ajouter les variables d'environnement en production (si nécessaire)
- [ ] Tester que tout fonctionne
- [ ] Donner l'accès à votre consultant SEO

## 🔗 URLs importantes

- **Sanity Studio** (après déploiement) : `https://votre-projet.sanity.studio`
- **Votre site** : `https://doctorfollowers.com` (ou votre domaine)
- **Dashboard Sanity** : https://www.sanity.io/manage

---

**Une fois tout ça fait, votre consultant SEO pourra gérer le contenu via Sanity Studio !** 🎉

