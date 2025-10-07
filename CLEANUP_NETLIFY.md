# 🧹 Nettoyage des Fichiers Netlify

## 📋 Fichiers à Supprimer (Après Migration Validée)

Une fois que votre application fonctionne correctement sur Vercel, vous pouvez supprimer les fichiers spécifiques à Netlify.

---

## 🗑️ Fichiers Netlify à Supprimer

### 1. Configuration Netlify
```bash
# Fichier de configuration principal Netlify
netlify.toml
```

### 2. Redirections Netlify
```bash
# Redirections dans le dossier public
public/_redirects

# Redirections dans le dossier de build (si existant)
dist/_redirects
```

---

## ⚡ Commandes de Nettoyage

### Option 1 : Suppression Manuelle (Recommandé)

Vérifiez d'abord que tout fonctionne sur Vercel, puis exécutez :

```bash
# Supprimer le fichier de configuration Netlify
rm netlify.toml

# Supprimer les redirections Netlify
rm public/_redirects

# Supprimer les redirections dans dist (si présent)
rm -f dist/_redirects
```

### Option 2 : Tout en Une Commande

```bash
rm netlify.toml public/_redirects dist/_redirects 2>/dev/null
```

---

## 📝 Fichiers à Conserver

Ces fichiers sont utiles pour les deux plateformes :

- ✅ `package.json`
- ✅ `vite.config.ts`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.js`
- ✅ `postcss.config.js`
- ✅ `eslint.config.js`
- ✅ Tous les fichiers dans `src/`
- ✅ Tous les fichiers dans `public/` (sauf `_redirects`)

---

## 🔄 Mise à Jour du .gitignore

Ajoutez ces lignes à votre `.gitignore` pour ignorer les fichiers Vercel locaux :

```bash
# Vercel
.vercel
```

---

## 📊 Checklist de Nettoyage

Avant de supprimer les fichiers Netlify :

- [ ] ✅ Application déployée avec succès sur Vercel
- [ ] ✅ Toutes les routes fonctionnent (pas d'erreur 404)
- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ Paiements testés (Cardinity)
- [ ] ✅ API externes fonctionnelles (SMMA, StarAPI)
- [ ] ✅ SEO vérifié (sitemap.xml, robots.txt)
- [ ] ✅ Domaine personnalisé configuré (si applicable)

Après validation complète :

- [ ] 🗑️ Supprimer `netlify.toml`
- [ ] 🗑️ Supprimer `public/_redirects`
- [ ] 🗑️ Supprimer `dist/_redirects`
- [ ] 📝 Commit et push des changements
- [ ] 🔴 Désactiver le site sur Netlify Dashboard

---

## 🎯 Désactivation du Site Netlify

1. **Accéder à Netlify Dashboard**
   - https://app.netlify.com/

2. **Sélectionner votre site**
   - Cliquez sur le site concerné

3. **Supprimer le site**
   - Site Settings > General > Danger zone
   - Cliquez sur "Delete this site"
   - Tapez le nom du site pour confirmer

---

## 📁 Comparaison Avant/Après

### AVANT (avec Netlify)
```
├── netlify.toml                 ← À SUPPRIMER
├── public/
│   ├── _redirects               ← À SUPPRIMER
│   ├── sitemap.xml              ✅ Conserver
│   └── robots.txt               ✅ Conserver
└── dist/
    └── _redirects               ← À SUPPRIMER
```

### APRÈS (avec Vercel)
```
├── vercel.json                  ✅ NOUVEAU
├── .vercelignore                ✅ NOUVEAU
├── VERCEL_MIGRATION_GUIDE.md    ✅ NOUVEAU
├── public/
│   ├── sitemap.xml              ✅ Conserver
│   └── robots.txt               ✅ Conserver
└── package.json (scripts mis à jour) ✅ Modifié
```

---

## ⚠️ Points d'Attention

### Variables d'Environnement
Si vous avez des variables spécifiques à Netlify dans votre fichier `.env` local, vérifiez qu'elles sont aussi configurées sur Vercel.

### Fonctions Serverless
Si vous utilisiez Netlify Functions, vous devrez les migrer vers Vercel Serverless Functions ou Edge Functions.

### Formulaires Netlify
Si vous utilisiez Netlify Forms, vous devrez trouver une alternative (ex: Formspree, Basin).

### Plugins Netlify
Tous les plugins Netlify devront être remplacés par des équivalents Vercel ou d'autres solutions.

---

## 🔄 Git Commit Recommandé

Après le nettoyage :

```bash
# Ajouter les nouveaux fichiers
git add vercel.json .vercelignore *.md package.json

# Supprimer les fichiers Netlify du tracking Git
git rm netlify.toml public/_redirects

# Commit
git commit -m "chore: migrate from Netlify to Vercel

- Add vercel.json configuration
- Add .vercelignore
- Remove netlify.toml and _redirects files
- Add Vercel deployment scripts to package.json
- Add migration documentation"

# Push
git push origin main
```

Vercel redéploiera automatiquement après le push.

---

**✅ Migration Complète ! Votre projet est maintenant 100% Vercel.**

