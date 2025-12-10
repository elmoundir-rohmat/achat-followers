# 🔄 Redéployer en Production avec Sanity

## Le Problème

Votre domaine est déjà configuré sur Vercel, mais le site de production montre encore les anciens articles (Markdown) au lieu des articles Sanity.

## Cause Probable

Le dernier déploiement sur Vercel n'inclut pas les modifications Sanity. Il faut redéployer.

## Solution : Redéployer sur Vercel

### Option 1 : Redéployer via CLI (Rapide)

```bash
npm run vercel:deploy
```

Cela va créer un nouveau déploiement avec le code actuel (incluant Sanity).

### Option 2 : Push sur GitHub (Si vous avez le déploiement automatique)

1. Commitez vos changements :
   ```bash
   git add .
   git commit -m "Migration vers Sanity CMS"
   git push
   ```

2. Vercel déploiera automatiquement

### Option 3 : Redéployer depuis le Dashboard Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **"Deployments"**
4. Trouvez le dernier déploiement qui fonctionne
5. Cliquez sur les **3 points** (⋯) → **"Redeploy"**

## ⚠️ Important : Vérifier que le code est bien commité

Avant de redéployer, assurez-vous que tous les fichiers Sanity sont bien dans votre repository :

```bash
git status
```

Si vous voyez des fichiers non commités, ajoutez-les :
```bash
git add .
git commit -m "Ajout de Sanity CMS"
git push
```

## 🔍 Vérification après redéploiement

1. Attendez que le déploiement soit terminé (1-2 minutes)
2. Allez sur votre site de production
3. Videz le cache du navigateur (Ctrl+Shift+Delete)
4. Testez la page Blog
5. Vous devriez voir votre article Sanity (pas les anciens articles)

## 📋 Checklist

- [ ] Code Sanity commité dans Git
- [ ] Redéployé sur Vercel
- [ ] CORS configuré pour votre domaine de production
- [ ] Testé que les articles Sanity apparaissent

---

**Redéployez maintenant et dites-moi si ça fonctionne !** 🚀

