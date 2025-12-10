# 🔍 Vérifier le Dataset Sanity

## Le Problème Possible

Si vous êtes sur un environnement de test, il est possible que :
- Votre article soit dans le dataset **"production"**
- Mais Sanity Studio affiche un autre dataset (comme "development" ou "test")
- Ou vice versa

## Vérification

### 1. Vérifier dans Sanity Studio

Dans Sanity Studio (`localhost:3333`) :

1. **Regardez en haut à droite** de l'écran
2. Vous devriez voir le nom du **dataset** actuel
3. Il devrait être **"production"**

Si vous voyez un autre nom (comme "development", "test", etc.), c'est le problème !

### 2. Changer de Dataset dans Sanity Studio

1. Cliquez sur le nom du dataset (en haut à droite)
2. Sélectionnez **"production"**
3. Vérifiez que votre article est bien là
4. Publiez-le à nouveau

### 3. Vérifier dans le Code

Le code est configuré pour utiliser le dataset **"production"** :
- `sanity/lib/client.ts` : `dataset: 'production'`
- `sanity.config.ts` : `dataset: 'production'`

## Solution : S'assurer que tout utilise "production"

### Option A : Utiliser "production" partout (recommandé)

1. Dans Sanity Studio, sélectionnez le dataset **"production"**
2. Vérifiez que votre article est là
3. Publiez-le

### Option B : Créer un dataset de développement

Si vous voulez un dataset séparé pour le développement :

1. Créez un dataset "development" :
   ```bash
   npx sanity dataset create development
   ```

2. Modifiez `sanity/lib/client.ts` :
   ```typescript
   dataset: 'development', // au lieu de 'production'
   ```

3. Modifiez `sanity.config.ts` :
   ```typescript
   dataset: 'development',
   ```

4. Dans Sanity Studio, sélectionnez "development"
5. Créez/publiez votre article dans "development"

## Vérification Rapide

Dans la console de votre application, vous pouvez voir quel dataset est utilisé dans l'URL de la requête :
- `https://jyf2mfzr.api.sanity.io/v2024-01-01/data/query/production?...` ← dataset "production"
- `https://jyf2mfzr.api.sanity.io/v2024-01-01/data/query/development?...` ← dataset "development"

---

**Dites-moi quel dataset vous voyez dans Sanity Studio en haut à droite !**

