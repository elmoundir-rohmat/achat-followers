# 🔧 Fix CORS Error - Sanity

## Problème

L'erreur `403 Forbidden` et `CORS policy` signifie que Sanity bloque les requêtes depuis `localhost:5173`.

## Solution : Configurer CORS dans Sanity

### Étape 1 : Accéder aux paramètres Sanity

1. Allez sur https://www.sanity.io/manage
2. Connectez-vous avec votre compte
3. Sélectionnez votre projet (Project ID: `jyf2mfzr`)

### Étape 2 : Configurer les CORS

1. Dans le menu de gauche, cliquez sur **"API"** ou **"Settings"**
2. Trouvez la section **"CORS origins"** ou **"Allowed origins"**
3. Cliquez sur **"Add origin"** ou **"Add CORS origin"**
4. Ajoutez ces URLs :
   - `http://localhost:5173` (pour le développement local)
   - `http://localhost:3000` (si vous utilisez un autre port)
   - `http://127.0.0.1:5173` (alternative)
5. Cochez **"Allow credentials"** si disponible
6. Cliquez sur **"Save"**

### Étape 3 : Vérifier

1. Attendez quelques secondes (les changements peuvent prendre du temps)
2. Rafraîchissez votre application
3. Les articles devraient maintenant se charger

## Solution Alternative : Utiliser l'API sans CDN (temporaire)

Si vous ne pouvez pas accéder aux paramètres CORS, modifiez temporairement le client :

```typescript
// Dans sanity/lib/client.ts
export const client = createClient({
  projectId: 'jyf2mfzr',
  dataset: 'production',
  useCdn: false, // Désactiver le CDN pour le développement
  apiVersion: '2024-01-01',
})
```

⚠️ **Note** : Cette solution est temporaire. Il est préférable de configurer CORS correctement.

## Vérification

Après avoir configuré CORS, vérifiez dans la console :
- ✅ Plus d'erreur CORS
- ✅ Plus d'erreur 403
- ✅ Les articles se chargent correctement

---

**Si le problème persiste**, vérifiez que :
1. Le Project ID est correct (`jyf2mfzr`)
2. Le dataset existe (`production`)
3. Vous avez bien ajouté `http://localhost:5173` dans les CORS origins

