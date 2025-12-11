# 🔀 Merger Sanity dans Main pour Production

## 📊 Situation Actuelle

- ✅ Code Sanity sur la branche `sanity_CMS`
- ✅ Code commité et poussé sur GitHub
- ✅ Déploiement manuel via CLI effectué
- ⚠️ **Mais** : Si Vercel déploie automatiquement depuis `main`, il faut merger

## 🎯 Deux Options

### Option 1 : Déploiement Manuel (Déjà fait) ✅

Vous venez de déployer manuellement avec `npm run vercel:deploy`. 
**Cela fonctionne MAINTENANT**, mais vous devrez redéployer manuellement à chaque changement.

### Option 2 : Déploiement Automatique (Recommandé) ⭐

Si vous voulez que Vercel déploie automatiquement à chaque push sur `main`, il faut merger.

---

## 🔀 Comment Merger dans Main

### Étape 1 : Vérifier que tout est commité

```bash
git status
```

Si vous voyez des fichiers non commités, ajoutez-les :
```bash
git add .
git commit -m "Vos changements"
```

### Étape 2 : Passer sur main

```bash
git checkout main
```

### Étape 3 : Merger sanity_CMS dans main

```bash
git merge sanity_CMS
```

### Étape 4 : Pousser sur GitHub

```bash
git push origin main
```

### Étape 5 : Vercel déploiera automatiquement

Si Vercel est configuré pour déployer depuis `main`, le déploiement se lancera automatiquement (1-2 minutes).

---

## ⚠️ Important : Vérifier la Configuration Vercel

Pour savoir si Vercel déploie automatiquement depuis `main` :

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. **Settings** → **Git**
4. Vérifiez la branche de production :
   - Si c'est `main` → Merger dans `main` ✅
   - Si c'est `sanity_CMS` → Rien à faire, c'est déjà bon ✅

---

## 🚀 Résumé

**Pour l'instant** : Le déploiement manuel que vous venez de faire fonctionne.

**Pour l'avenir** : Si vous voulez des déploiements automatiques, merger dans `main`.

**Voulez-vous que je vous aide à merger maintenant ?** 🎯

