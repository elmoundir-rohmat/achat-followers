# Où voir le dataset dans Sanity Studio

## 📍 Méthode 1 : Dans l'en-tête de Sanity Studio

Dans l'en-tête en haut à droite de Sanity Studio, vous devriez voir :
- Un sélecteur avec "Published" ou "Draft" (perspective)
- **Juste à côté ou en dessous**, il peut y avoir le nom du dataset

Si vous ne le voyez pas, cliquez sur le menu déroulant à côté de "Published" - le dataset peut être affiché là.

## 📍 Méthode 2 : Dans l'URL

Regardez l'URL de votre navigateur :
- Si vous voyez quelque chose comme : `localhost:3333/studio/structure/?dataset=production`
- Le dataset est dans l'URL : `dataset=production`

## 📍 Méthode 3 : Dans les paramètres du projet

1. Cliquez sur le logo "DF" ou "Doctor Followers CMS" en haut à gauche
2. Cherchez "Settings" ou "Paramètres"
3. Le dataset devrait être affiché dans les paramètres du projet

## 📍 Méthode 4 : Vérifier dans le fichier de configuration

Le dataset utilisé par Sanity Studio est défini dans `sanity.config.ts` :

```typescript
dataset: process.env.SANITY_DATASET || 'production',
```

Par défaut, c'est `production` si la variable d'environnement `SANITY_DATASET` n'est pas définie.

## 🔍 Comment vérifier quel dataset est utilisé par le code

Le code de votre application utilise le dataset défini dans `sanity/lib/client.ts` :

```typescript
dataset: 'production',
```

**Important** : Le dataset utilisé par Sanity Studio (local) et celui utilisé par votre code doivent correspondre.

## ✅ Solution rapide

Si vous n'arrivez pas à voir le dataset dans l'interface :

1. **Vérifiez le fichier `.env`** (s'il existe) :
   ```bash
   cat .env | grep SANITY_DATASET
   ```

2. **Par défaut, Sanity Studio utilise `production`** si rien n'est configuré

3. **Pour être sûr**, créez le document "Page Instagram Commentaires" dans Sanity Studio et vérifiez qu'il apparaît bien sur votre site

## 🚨 Si le dataset ne correspond pas

Si Sanity Studio utilise un dataset différent de `production` :

**Option 1** : Créer le document dans le dataset `production`
- Allez sur https://www.sanity.io/manage
- Sélectionnez votre projet
- Créez le document dans le dataset `production`

**Option 2** : Changer le dataset dans le code
- Modifiez `sanity/lib/client.ts` pour utiliser le même dataset que Sanity Studio local

