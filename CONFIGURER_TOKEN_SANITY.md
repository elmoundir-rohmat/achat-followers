# 🔑 Configurer un Token API Sanity

## Pourquoi un token ?

Pour accéder à l'API Sanity depuis votre application, vous pouvez avoir besoin d'un token d'API, surtout si votre projet a des restrictions d'accès.

## Étape 1 : Créer un token dans Sanity

1. Allez sur https://www.sanity.io/manage
2. Connectez-vous et sélectionnez votre projet (`jyf2mfzr`)
3. Dans le menu de gauche, cliquez sur **"API"**
4. Cliquez sur **"Tokens"** dans le sous-menu
5. Cliquez sur **"+ Add API token"** ou **"Create token"**
6. Configurez le token :
   - **Name** : "Doctor Followers Website" (ou un nom descriptif)
   - **Permissions** : Sélectionnez **"Viewer"** (lecture seule) - c'est suffisant pour afficher les articles
   - Cliquez sur **"Save"** ou **"Create"**
7. **IMPORTANT** : Copiez le token immédiatement (vous ne pourrez plus le voir après)

## Étape 2 : Ajouter le token au projet

### Option A : Variable d'environnement (recommandé)

1. Créez ou modifiez le fichier `.env` à la racine du projet
2. Ajoutez :
   ```
   VITE_SANITY_API_TOKEN=votre_token_ici
   ```
3. Redémarrez votre serveur de développement (`npm run dev`)

### Option B : Directement dans le code (pour test uniquement)

⚠️ **Attention** : Ne faites cela que pour tester. En production, utilisez une variable d'environnement.

## Étape 3 : Utiliser le token dans le client

Le token sera automatiquement utilisé si vous l'ajoutez dans le client Sanity.

## Vérification

Après avoir ajouté le token :
1. Redémarrez votre application
2. Rafraîchissez la page
3. Les articles devraient maintenant se charger

---

**Note** : Si votre projet Sanity est configuré en mode "public" (sans restrictions), vous n'avez peut-être pas besoin de token. Mais si vous obtenez des erreurs 403, le token est nécessaire.

