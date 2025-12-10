# ✅ Configuration Production - Sanity

## 🎉 Ce qui est fait

- ✅ Sanity Studio déployé : https://doctorfollowers.sanity.studio/
- ✅ App ID : `v3jkruawgt1dpe49inuf8tx4`
- ✅ Articles fonctionnent en local

## 📋 Dernières étapes pour la production

### 1. Configurer CORS pour votre domaine de production

**Important** : Votre consultant SEO et les visiteurs doivent pouvoir accéder aux articles depuis votre site en production.

1. Allez sur https://www.sanity.io/manage
2. Sélectionnez votre projet (`jyf2mfzr`)
3. Menu **"API"** → **"CORS origins"**
4. Ajoutez votre domaine de production :
   - `https://doctorfollowers.com` (ou votre vrai domaine)
   - `https://www.doctorfollowers.com` (si vous utilisez www)
5. Cliquez sur **"Save"**

### 2. Variables d'environnement en production (Vercel)

Si vous utilisez un token API (optionnel) :

1. Dashboard Vercel → votre projet
2. **Settings** → **Environment Variables**
3. Ajoutez (si vous avez créé un token) :
   - `VITE_SANITY_API_TOKEN` = votre token

**Note** : Si votre projet Sanity est public, vous n'avez pas besoin de token.

### 3. Déployer votre application

```bash
npm run vercel:deploy
```

Ou poussez sur GitHub (si vous avez le déploiement automatique).

### 4. Tester en production

1. Allez sur votre site en production
2. Testez la page Blog
3. Vérifiez que les articles se chargent

## 🔗 URLs importantes

- **Sanity Studio** : https://doctorfollowers.sanity.studio/
- **Dashboard Sanity** : https://www.sanity.io/manage
- **Votre site** : (votre domaine de production)

## 👥 Donner l'accès à votre consultant SEO

1. Allez sur https://www.sanity.io/manage
2. Sélectionnez votre projet
3. Menu **"Members"**
4. Cliquez sur **"Invite"** ou **"+ Add member"**
5. Entrez l'email de votre consultant SEO
6. Donnez-lui le rôle **"Editor"** (pour qu'il puisse créer/modifier du contenu)
7. Envoyez l'invitation

Votre consultant SEO recevra un email et pourra accéder à :
- https://doctorfollowers.sanity.studio/

## 📚 Documentation pour votre consultant SEO

Donnez-lui le fichier : `GUIDE_SANITY_SEO.md`

Ce guide explique comment :
- Créer des articles
- Modifier du contenu
- Optimiser le SEO
- Publier des articles

## ✅ Checklist finale

- [ ] CORS configuré pour votre domaine de production
- [ ] Variables d'environnement ajoutées sur Vercel (si nécessaire)
- [ ] Application déployée en production
- [ ] Testé que les articles se chargent en production
- [ ] Consultant SEO invité et a accès à Sanity Studio
- [ ] Guide SEO partagé avec le consultant

---

**Félicitations ! Sanity est maintenant en production ! 🚀**

Votre consultant SEO peut maintenant gérer tout le contenu via https://doctorfollowers.sanity.studio/

