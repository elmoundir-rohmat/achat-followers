# 🔧 Modifications des Composants - Guide Détaillé

## 📋 Fichiers à Modifier

3 fichiers principaux doivent être modifiés pour utiliser les services clients sécurisés :

1. ✅ `src/components/CheckoutPage.tsx`
2. ✅ `src/components/TikTokCheckoutPage.tsx`
3. ✅ `src/components/InstagramPostsGrid.tsx`

---

## 1️⃣ CheckoutPage.tsx

### Modification de l'Import

**Ligne 9 - AVANT** :
```typescript
import { smmaService, SMMAOrder } from '../services/smmaService';
```

**Ligne 9 - APRÈS** :
```typescript
import { smmaServiceClient, SMMAOrder } from '../services/smmaServiceClient';
```

### Modification de l'Appel

Cherchez toutes les occurrences de `smmaService.` et remplacez par `smmaServiceClient.`

**Exemple (ligne ~420+)** :

**AVANT** :
```typescript
const response = await smmaService.orderFollowers(order);
```

**APRÈS** :
```typescript
const response = await smmaServiceClient.orderFollowers(order);
```

---

## 2️⃣ TikTokCheckoutPage.tsx

### Modification de l'Import

**Ligne 8 - AVANT** :
```typescript
import { smmaService, SMMAOrder } from '../services/smmaService';
```

**Ligne 8 - APRÈS** :
```typescript
import { smmaServiceClient, SMMAOrder } from '../services/smmaServiceClient';
```

### Modification des Appels

Cherchez toutes les occurrences de `smmaService.` et remplacez par `smmaServiceClient.`

**Exemples** :

**AVANT** :
```typescript
const response = await smmaService.orderTikTokFollowers(order);
const response = await smmaService.orderTikTokLikes(order);
```

**APRÈS** :
```typescript
const response = await smmaServiceClient.orderTikTokFollowers(order);
const response = await smmaServiceClient.orderTikTokLikes(order);
```

---

## 3️⃣ InstagramPostsGrid.tsx

### Modification de l'Import

**Ligne 3 - AVANT** :
```typescript
import { InstagramPost, instagramService } from '../services/instagramService';
```

**Ligne 3 - APRÈS** :
```typescript
import { InstagramPost, instagramServiceClient } from '../services/instagramServiceClient';
```

### Modification des Appels

Cherchez toutes les occurrences de `instagramService.` et remplacez par `instagramServiceClient.`

**Exemples** :

**AVANT** :
```typescript
const response = await instagramService.getUserPosts(username, cursor);
const response = await instagramService.getUserClips(username, count);
```

**APRÈS** :
```typescript
const response = await instagramServiceClient.getUserPosts(username, cursor);
const response = await instagramServiceClient.getUserClips(username, count);
```

---

## ⚡ Méthode Rapide : Search & Replace

Utilisez la fonction "Rechercher et Remplacer" de votre éditeur :

### Pour SMMA Service

1. **Rechercher** : `smmaService`
2. **Remplacer par** : `smmaServiceClient`
3. **Fichiers concernés** :
   - `src/components/CheckoutPage.tsx`
   - `src/components/TikTokCheckoutPage.tsx`

### Pour Instagram Service

1. **Rechercher** : `instagramService`
2. **Remplacer par** : `instagramServiceClient`
3. **Fichiers concernés** :
   - `src/components/InstagramPostsGrid.tsx`

---

## ✅ Vérification

Après les modifications, vérifiez que :

### 1. Aucune Erreur TypeScript

```bash
npm run build
```

Devrait compiler sans erreur.

### 2. Les Imports Sont Corrects

**Vérifiez que vous importez depuis** :
- ✅ `../services/smmaServiceClient` (et non `smmaService`)
- ✅ `../services/instagramServiceClient` (et non `instagramService`)

### 3. Tous les Appels Sont Modifiés

**Cherchez dans le code** :
```bash
# Ne devrait rien trouver
grep -r "smmaService\." src/components/
grep -r "instagramService\." src/components/
```

---

## 📝 Checklist de Modification

- [ ] `CheckoutPage.tsx`
  - [ ] Import changé vers `smmaServiceClient`
  - [ ] Tous les `smmaService.` remplacés par `smmaServiceClient.`
  
- [ ] `TikTokCheckoutPage.tsx`
  - [ ] Import changé vers `smmaServiceClient`
  - [ ] Tous les `smmaService.` remplacés par `smmaServiceClient.`
  
- [ ] `InstagramPostsGrid.tsx`
  - [ ] Import changé vers `instagramServiceClient`
  - [ ] Tous les `instagramService.` remplacés par `instagramServiceClient.`
  
- [ ] Build vérifié : `npm run build` ✅
- [ ] Pas d'erreurs TypeScript
- [ ] Application testée localement

---

## 🚀 Après les Modifications

1. **Commit les changements** :
```bash
git add .
git commit -m "refactor: migrate to secure API routes architecture"
```

2. **Push sur Git** :
```bash
git push origin main
```

3. **Vercel redéploiera automatiquement** 🎉

---

## 🧪 Tests Locaux (Optionnel)

Pour tester localement avec les API routes :

1. **Installer Vercel CLI** :
```bash
npm i -g vercel
```

2. **Lancer en mode dev** :
```bash
vercel dev
```

Cela lance un serveur local avec les API routes fonctionnelles.

---

## 📚 Références

- Types inchangés : `SMMAOrder`, `InstagramPost` restent les mêmes
- Méthodes identiques : `orderFollowers()`, `getUserPosts()`, etc.
- Seul le service change : `*Service` → `*ServiceClient`

---

**✅ Une fois ces 3 fichiers modifiés, votre migration est terminée !**
