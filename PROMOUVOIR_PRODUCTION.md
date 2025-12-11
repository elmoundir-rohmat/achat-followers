# 🚀 Promouvoir Sanity en Production

## 📊 Situation Actuelle

D'après votre capture d'écran Vercel :
- ✅ Les déploiements `sanity_CMS` fonctionnent
- ✅ Le dernier déploiement contient "Migration vers Sanity CMS"
- ⚠️ **MAIS** : Les déploiements sont en "Preview", pas en "Production"

## 🎯 Solution : Promouvoir un Déploiement en Production

### Option 1 : Promouvoir via l'Interface Vercel (Recommandé)

1. **Allez sur votre déploiement le plus récent** (celui avec "Migration vers Sanity CMS")
2. **Cliquez sur les 3 points** (⋯) à droite du déploiement
3. **Sélectionnez "Promote to Production"**
4. **Confirmez**

→ Votre domaine de production pointera vers ce déploiement avec Sanity !

---

### Option 2 : Configurer la Branche de Production

Si vous voulez que tous les futurs push sur `sanity_CMS` se déploient automatiquement en production :

1. **Dashboard Vercel** → Votre projet
2. **Settings** → **Git**
3. **Production Branch** → Changez de `main` à `sanity_CMS`
4. **Save**

→ Les futurs push sur `sanity_CMS` créeront des déploiements de production automatiquement.

---

## 🔍 Vérification

Après avoir promu le déploiement :

1. Attendez 1-2 minutes
2. Allez sur votre site de production
3. Videz le cache (Ctrl+Shift+Delete)
4. Testez la page Blog
5. Vous devriez voir votre article Sanity ✅

---

## ⚠️ Important : CORS

N'oubliez pas de configurer CORS dans Sanity pour votre domaine de production :

1. https://www.sanity.io/manage
2. Projet `jyf2mfzr` → **API** → **CORS origins**
3. Ajoutez votre domaine : `https://doctorfollowers.com`
4. **Save**

---

**Promouvez le déploiement maintenant et dites-moi si ça fonctionne !** 🎯

