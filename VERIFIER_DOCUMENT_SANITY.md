# Vérification du document Sanity - Page Instagram Comments

## ✅ Vérifications à faire dans Sanity Studio

### 1. Vérifier l'ID du document
Dans Sanity Studio, ouvrez "Page Instagram Commentaires" et vérifiez l'URL :
- L'URL devrait être : `localhost:3333/studio/structure/pageInstagramCommentaires?perspective=published`
- L'ID du document doit être : `instagramCommentsPage`

### 2. Vérifier le dataset
En haut à droite de Sanity Studio, vérifiez quel dataset est sélectionné :
- Doit être : **`production`** (pour correspondre au code)
- Si c'est `development`, changez-le ou créez le document dans `production`

### 3. Vérifier que les champs sont remplis
Dans le document "Page Instagram Commentaires", vérifiez :

**Section Hero - SEO :**
- ✅ Titre Principal (H1) : doit contenir du texte (ex: "Commentaires Instagram")
- ✅ Description : doit contenir du texte

**Titres des Sections (H2) :**
- ✅ Titre "Avis des clients"
- ✅ Titre "Sécurité"  
- ✅ Titre "Pourquoi acheter"

### 4. Vérifier la publication
- ✅ Checkbox "Publié" doit être cochée
- ✅ Bouton "Publish" doit avoir été cliqué
- ✅ Vous devriez voir "Published" en vert en haut du document

## 🔍 Test rapide dans la console du navigateur

Ouvrez la page Instagram Comments sur `http://localhost:5173` et dans la console (F12), exécutez :

```javascript
// Test direct de la requête Sanity
fetch('https://jyf2mfzr.api.sanity.io/v2021-10-21/data/query/production?query=' + encodeURIComponent('*[_type == "instagramCommentsPage" && published == true][0] { _id, hero { title, description } }'))
  .then(r => r.json())
  .then(data => {
    console.log('📄 Document trouvé:', data.result);
    if (data.result) {
      console.log('✅ Hero Title:', data.result.hero?.title);
      console.log('✅ Hero Description:', data.result.hero?.description);
    } else {
      console.log('❌ Aucun document trouvé');
    }
  });
```

## 🚨 Solutions si ça ne marche pas

### Solution 1 : Vérifier le dataset
Si Sanity Studio utilise `development` mais le code utilise `production` :
1. Créez le document dans le dataset `production`
2. Ou changez le dataset dans `sanity/lib/client.ts` vers `development`

### Solution 2 : Forcer la création avec l'ID correct
1. Dans Sanity Studio, supprimez le document existant
2. Créez un nouveau document "Page Instagram Commentaires"
3. L'ID devrait automatiquement être `instagramCommentsPage`
4. Remplissez les champs et publiez

### Solution 3 : Vérifier CORS
Assurez-vous que `http://localhost:5173` est dans les CORS origins :
1. Allez sur https://www.sanity.io/manage
2. Projet → API → CORS origins
3. Ajoutez `http://localhost:5173` si absent

