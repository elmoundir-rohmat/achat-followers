# 🎨 Guide : Formatage du Contenu dans Sanity

## ✅ Oui, c'est possible !

Vous pouvez maintenant formater le contenu dans Sanity avec :
- **Gras** (bold)
- *Italique* (italic)
- <u>Souligné</u> (underline)
- [Liens hypertexte](#) (links)
- Listes à puces
- Listes numérotées
- Citations

---

## 📝 Comment ça fonctionne

### 1. Dans Sanity Studio

Pour les champs qui supportent le formatage, vous verrez deux options :

#### Option A : Texte Simple (actuel)
- Champ "Description (Texte simple)"
- Texte brut, pas de formatage
- ✅ Fonctionne immédiatement

#### Option B : Description Formatée (nouveau)
- Champ "Description Formatée (Optionnel)"
- Éditeur riche avec barre d'outils
- ✅ Supporte le formatage complet

**Important** : Si vous remplissez le champ "Description Formatée", il **remplace** automatiquement le texte simple.

---

## 🎯 Champs qui supportent le formatage

Actuellement activé pour :
- ✅ **Hero Description** (toutes les pages)
- ✅ **Descriptions des sections Sécurité & Garanties** (toutes les pages)
- ✅ **Descriptions "Pourquoi acheter"** (toutes les pages)

---

## 📖 Comment utiliser dans Sanity Studio

### Étape 1 : Ouvrir un document
1. Allez dans Sanity Studio
2. Sélectionnez une page (ex: "Page Instagram Views")
3. Ouvrez le document

### Étape 2 : Utiliser le formatage

#### Pour mettre en gras :
1. Sélectionnez le texte
2. Cliquez sur **B** (ou `Cmd/Ctrl + B`)

#### Pour mettre en italique :
1. Sélectionnez le texte
2. Cliquez sur **I** (ou `Cmd/Ctrl + I`)

#### Pour souligner :
1. Sélectionnez le texte
2. Cliquez sur **U** (ou `Cmd/Ctrl + U`)

#### Pour ajouter un lien :
1. Sélectionnez le texte
2. Cliquez sur l'icône **🔗** (lien)
3. Entrez l'URL
4. Choisissez "Nouvelle fenêtre" si c'est un lien externe

#### Pour créer une liste :
1. Cliquez sur l'icône **•** (liste à puces) ou **1.** (liste numérotée)
2. Tapez votre texte
3. Appuyez sur `Entrée` pour un nouvel élément

---

## 💡 Exemples d'utilisation

### Exemple 1 : Description Hero avec lien

**Texte simple :**
```
Boostez vos reels avec des vues authentiques
```

**Texte formaté :**
```
Boostez vos reels avec des **vues authentiques** pour maximiser votre portée. 
Découvrez nos [packs de vues Instagram](https://doctorfollowers.com/products/acheter-des-vues-instagram).
```

### Exemple 2 : Section Sécurité avec formatage

**Texte simple :**
```
Bien que les incidents soient rares, notre Service client est disponible...
```

**Texte formaté :**
```
Bien que les incidents soient rares, notre **Service client** est disponible 
par e-mail du lundi au dimanche, 24 heures sur 24. 
Si vous avez une demande spécifique, nous pouvons également vous contacter 
par [téléphone](tel:+33123456789).
```

---

## 🔄 Migration depuis le texte simple

### Si vous avez déjà du contenu :

1. **Option 1** : Garder le texte simple
   - Rien à faire, ça continue de fonctionner
   - Le formatage n'est pas obligatoire

2. **Option 2** : Migrer vers le formatage
   - Copiez le texte du champ "Description (Texte simple)"
   - Collez-le dans "Description Formatée"
   - Ajoutez le formatage souhaité
   - Le texte formaté remplacera automatiquement le texte simple

---

## ⚠️ Notes importantes

1. **Priorité** : Si "Description Formatée" est rempli, il remplace le texte simple
2. **SEO** : Le formatage n'affecte pas le SEO, c'est juste visuel
3. **Compatibilité** : Les anciens contenus (texte simple) continuent de fonctionner
4. **Performance** : Le formatage n'affecte pas les performances

---

## 🚀 Prochaines étapes

Pour activer le formatage sur d'autres champs, il suffit de :
1. Ajouter le champ `descriptionRich` dans le schéma Sanity
2. Mettre à jour la requête GROQ
3. Mettre à jour le composant React pour utiliser `<PortableText>`

**Besoin d'aide ?** Demandez-moi d'activer le formatage sur d'autres champs spécifiques !

