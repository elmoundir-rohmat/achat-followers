# 🌐 Configurer votre Domaine de Production sur Vercel

## Le Problème

Votre site Vercel fonctionne avec Sanity, mais votre domaine de production (ex: `doctorfollowers.com`) pointe encore vers l'ancien déploiement qui utilise les fichiers Markdown.

## Solution : Configurer le Domaine sur Vercel

### Étape 1 : Ajouter votre domaine dans Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **"doctor-followers"**
3. Allez dans **Settings** → **Domains**
4. Cliquez sur **"Add Domain"** ou **"Add"**
5. Entrez votre domaine de production :
   - `doctorfollowers.com` (sans www)
   - `www.doctorfollowers.com` (avec www)
6. Cliquez sur **"Add"**

### Étape 2 : Configurer les DNS

Vercel vous donnera des instructions pour configurer vos DNS. Vous avez deux options :

#### Option A : Configuration CNAME (Recommandé)

1. Allez dans votre gestionnaire de DNS (où vous avez acheté votre domaine)
2. Ajoutez/modifiez ces enregistrements :

**Pour www.doctorfollowers.com :**
- Type : `CNAME`
- Name : `www`
- Value : `cname.vercel-dns.com` (ou la valeur fournie par Vercel)

**Pour doctorfollowers.com (racine) :**
- Type : `A`
- Name : `@` (ou laissez vide selon votre fournisseur)
- Value : `76.76.21.21` (ou l'IP fournie par Vercel)

#### Option B : Utiliser les Nameservers Vercel

1. Vercel vous donnera des nameservers
2. Remplacez les nameservers de votre domaine par ceux de Vercel

### Étape 3 : Attendre la propagation DNS

- La propagation DNS peut prendre **5 minutes à 48 heures**
- En général, c'est fait en **15-30 minutes**
- Vercel vous notifiera quand c'est prêt

### Étape 4 : Vérifier

Une fois la propagation terminée :
1. Allez sur votre domaine (ex: `https://doctorfollowers.com`)
2. Testez la page Blog
3. Vous devriez voir votre article Sanity (pas les anciens articles Markdown)

## ⚠️ Important : Configurer CORS

N'oubliez pas de configurer CORS dans Sanity pour votre domaine :

1. https://www.sanity.io/manage
2. Projet `jyf2mfzr` → **API** → **CORS origins**
3. Ajoutez :
   - `https://doctorfollowers.com`
   - `https://www.doctorfollowers.com`
4. Cliquez sur **"Save"**

## 🔄 Si vous avez un ancien déploiement (Netlify, etc.)

Si votre domaine pointe vers Netlify ou une autre plateforme :

### Option 1 : Rediriger vers Vercel (Recommandé)

1. Dans votre ancienne plateforme, configurez une redirection permanente (301) vers votre nouveau site Vercel
2. Ou changez directement les DNS pour pointer vers Vercel

### Option 2 : Désactiver l'ancien déploiement

Une fois que Vercel fonctionne, vous pouvez désactiver l'ancien déploiement pour éviter la confusion.

---

**Une fois le domaine configuré, votre site de production utilisera Sanity !** 🎉

