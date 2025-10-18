# 📋 RÉFÉRENCE DES SERVICE IDS SMMA

## 🎯 Service IDs par Plateforme

### Instagram

| Service | Service ID | Fonction |
|---------|-----------|----------|
| **Followers** | `3510` | `orderFollowers()` |
| **Likes** | `4343` | `orderLikes()` |
| **Comments** | `9564` | `orderComments()` |
| **Views (Reels)** | `519` | `orderViews()` |

### TikTok

| Service | Service ID | Fonction |
|---------|-----------|----------|
| **Followers** | `9583` | `orderTikTokFollowers()` |
| **Likes** | `4174` | `orderTikTokLikes()` |

---

## 🔍 Comment Vérifier le Service ID dans les Logs

### 1. Console Logs

Cherchez ces lignes dans la console (F12) :

```javascript
// Pour TikTok Followers
✅ Service ID TikTok Followers: 9583

// Pour Instagram Followers  
✅ Service ID Instagram Followers: 3510
```

### 2. Requête API

Cherchez cette ligne :

```javascript
📤 Données envoyées à l'API route: 
{
  action: 'tiktok_followers',  // ou 'followers'
  service_id: '9583',           // ✅ DOIT ÊTRE 9583 pour TikTok
  link: 'https://tiktok.com/@username',
  quantity: 25,
  order_id: 'ORDER-...'
}
```

---

## 🎯 Mapping Complet (smmaMapping.ts)

```typescript
// Instagram
{ followerType: 'international', smmaServiceId: 3510 }   // Followers
{ followerType: 'french', smmaServiceId: 6777 }         // Followers FR
{ followerType: 'likes_international', smmaServiceId: 4343 }  // Likes
{ followerType: 'comments_international', smmaServiceId: 9564 }  // Comments
{ followerType: 'views_international', smmaServiceId: 519 }  // Views

// TikTok
{ followerType: 'tiktok_international', smmaServiceId: 9583 }  // Followers
{ followerType: 'tiktok_french', smmaServiceId: 9583 }  // Followers FR
{ followerType: 'tiktok_likes_international', smmaServiceId: 4174 }  // Likes
{ followerType: 'tiktok_likes_french', smmaServiceId: 4174 }  // Likes FR
```

---

## 🔧 Fonction getServiceId()

```typescript
getServiceId('tiktok_followers', 'international')
// Construit: 'tiktok_international'
// Retourne: 9583 ✅

getServiceId('followers', 'international')  
// Construit: 'international'
// Retourne: 3510 ✅

getServiceId('tiktok_likes', 'international')
// Construit: 'tiktok_likes_international'
// Retourne: 4174 ✅
```

---

## 🧪 Tests de Validation

### Test 1: TikTok Followers
```javascript
const serviceId = getServiceId('tiktok_followers', 'international');
console.log(serviceId); // DOIT afficher: 9583
```

### Test 2: Instagram Followers
```javascript
const serviceId = getServiceId('followers', 'international');
console.log(serviceId); // DOIT afficher: 3510
```

### Test 3: TikTok Likes
```javascript
const serviceId = getServiceId('tiktok_likes', 'international');
console.log(serviceId); // DOIT afficher: 4174
```

---

## ❌ Erreurs Courantes

### Erreur 1: Service ID 720 pour TikTok
```javascript
// ❌ MAUVAIS
getServiceId('followers', 'international')  // → 3510

// ✅ CORRECT
getServiceId('tiktok_followers', 'international')  // → 9583
```

### Erreur 2: Mauvais followerType
```javascript
// ❌ MAUVAIS
getServiceId('tiktok_followers', 'tiktok_international')  
// Cherche 'tiktok_tiktok_international' → null

// ✅ CORRECT
getServiceId('tiktok_followers', 'international')
// Cherche 'tiktok_international' → 9583
```

---

## 🔍 Débogage

### Si vous voyez Service ID 3510 au lieu de 9583:

1. **Vérifiez `platform` dans le panier:**
   ```javascript
   console.log('Platform:', item.platform);
   // DOIT afficher: 'TikTok' pour TikTok
   ```

2. **Vérifiez `serviceType` calculé:**
   ```javascript
   const serviceType = item.platform === 'TikTok' ? 'tiktok_followers' : 'followers';
   console.log('ServiceType:', serviceType);
   // DOIT afficher: 'tiktok_followers' pour TikTok
   ```

3. **Vérifiez le Service ID retourné:**
   ```javascript
   const serviceId = getServiceId(serviceType, followerType);
   console.log('Service ID:', serviceId);
   // DOIT afficher: 9583 pour TikTok
   ```

4. **Vérifiez la méthode appelée:**
   ```javascript
   if (order.serviceType === 'tiktok_followers') {
     return smmaServiceClient.orderTikTokFollowers(order);  // ✅
   } else {
     return smmaServiceClient.orderFollowers(order);  // ❌ pour TikTok
   }
   ```

---

## 📊 Flow Complet: TikTok Followers

```
1. TikTokFollowersPage
   └─> addToCart({ platform: 'TikTok', ... })

2. CheckoutPage
   └─> orderDetails = { platform: 'TikTok', items: [...] }
   └─> localStorage.setItem('pendingOrder', orderDetails)

3. PaymentSuccessPage
   └─> pendingOrder = localStorage.getItem('pendingOrder')
   └─> platform = pendingOrder.platform  // 'TikTok'
   └─> serviceType = platform === 'TikTok' ? 'tiktok_followers' : 'followers'
   └─> serviceType = 'tiktok_followers' ✅

4. smmaServiceClient.orderTikTokFollowers()
   └─> serviceId = getServiceId('tiktok_followers', 'international')
   └─> serviceId = 9583 ✅

5. API /api/smma/order
   └─> { service_id: '9583', action: 'tiktok_followers' } ✅
```

---

## 🎉 Vérification Finale

Après un achat TikTok Followers, vous DEVEZ voir dans SMMA Panel:

- ✅ **Service ID:** 9583
- ✅ **Service Name:** TikTok Followers
- ✅ **Link:** URL TikTok complète (https://tiktok.com/@username)
- ✅ **Quantity:** Nombre de followers commandés

**Si vous voyez Service ID 3510, c'est que le cache n'a pas été vidé !**

---

**Date:** 13 octobre 2025  
**Fichier de référence:** `smmaMapping.ts`

