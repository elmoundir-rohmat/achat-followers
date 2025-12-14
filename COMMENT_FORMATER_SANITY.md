# 🎨 Comment Formater le Texte dans Sanity

## ⚠️ Important : Sanity n'utilise PAS la syntaxe Markdown

**❌ Ne fonctionne PAS :**
```
**Instagram** (pour mettre en gras)
*texte* (pour italique)
```

**✅ Fonctionne :**
Utilisez l'éditeur riche avec les boutons de la barre d'outils

---

## 📝 Comment Mettre en Gras dans Sanity

### Méthode 1 : Avec la barre d'outils

1. **Sélectionnez le texte** que vous voulez mettre en gras (ex: "Instagram")
2. **Cliquez sur le bouton B** (Bold) dans la barre d'outils
3. ✅ Le texte devient gras automatiquement

### Méthode 2 : Avec le raccourci clavier

1. **Sélectionnez le texte**
2. **Appuyez sur `Cmd + B`** (Mac) ou **`Ctrl + B`** (Windows/Linux)
3. ✅ Le texte devient gras

---

## 🔍 Où Trouver le Champ "Description Formatée" ?

### Pour la section "Améliorer votre crédibilité" :

1. Ouvrez Sanity Studio
2. Allez dans **"Page Instagram Followers"**
3. Ouvrez le document
4. Déroulez **"Section 'Pourquoi acheter des followers' - SEO"**
5. Déroulez **"Améliorer votre crédibilité"**
6. Vous verrez :
   - **"Description (Texte simple)"** ← Ancien champ (texte brut)
   - **"Description Formatée (Optionnel)"** ← Nouveau champ (éditeur riche) ⭐

---

## 💡 Exemple Concret

### Ce que vous voyez dans l'image :
```
Sur Instagram, la crédibilité d'un compte repose sur deux éléments : 
le nombre d'abonnés et l'engagement. Que vous soyez créateur de contenu,
entrepreneur ou influenceur, un faible nombre de followers nuit à votre image. 
Acheter des abonnés **Instagram** permet de franchir ce cap.
```

### ❌ Problème :
Vous avez tapé `**Instagram**` mais ça ne fonctionne pas car :
- Le champ "Description (Texte simple)" ne supporte pas le formatage
- Sanity n'utilise pas la syntaxe Markdown

### ✅ Solution :

1. **Utilisez le champ "Description Formatée"** (pas "Description")
2. **Tapez votre texte normalement** :
   ```
   Sur Instagram, la crédibilité d'un compte repose sur deux éléments : 
   le nombre d'abonnés et l'engagement. Que vous soyez créateur de contenu,
   entrepreneur ou influenceur, un faible nombre de followers nuit à votre image. 
   Acheter des abonnés Instagram permet de franchir ce cap.
   ```

3. **Sélectionnez "Instagram"** dans le texte

4. **Cliquez sur le bouton B** (ou `Cmd/Ctrl + B`)

5. ✅ "Instagram" devient **gras** automatiquement

---

## 🎯 Autres Formatages Disponibles

### Italique
- Sélectionnez le texte → Cliquez sur **I** (ou `Cmd/Ctrl + I`)

### Souligné
- Sélectionnez le texte → Cliquez sur **U** (ou `Cmd/Ctrl + U`)

### Lien hypertexte
- Sélectionnez le texte → Cliquez sur **🔗** (lien)
- Entrez l'URL
- Choisissez "Nouvelle fenêtre" si externe

### Liste à puces
- Cliquez sur **•** (liste)
- Tapez vos éléments

---

## ⚙️ Comment ça Fonctionne Techniquement

1. **Dans Sanity** : Vous utilisez l'éditeur riche (WYSIWYG)
2. **Sanity sauvegarde** : Le formatage en JSON structuré
3. **Votre site React** : Utilise `PortableText` pour convertir en HTML
4. **Résultat** : Le texte formaté s'affiche correctement

---

## 🚨 Points Importants

1. **Utilisez "Description Formatée"** (pas "Description")
2. **Pas de syntaxe Markdown** (`**texte**` ne fonctionne pas)
3. **Utilisez les boutons** de la barre d'outils
4. **Si "Description Formatée" est rempli**, il remplace automatiquement "Description"

---

## 📸 Capture d'Écran (à venir)

Quand vous ouvrez le champ "Description Formatée", vous verrez :
- Une barre d'outils en haut avec : **B** (gras), **I** (italique), **U** (souligné), **🔗** (lien)
- Un éditeur de texte normal en dessous
- Le formatage s'applique visuellement dans l'éditeur

---

**Besoin d'aide ?** Si vous ne voyez pas le champ "Description Formatée", c'est que les schémas n'ont pas encore été déployés. Exécutez :
```bash
npm run studio:deploy
```

