#!/bin/bash

echo "🚀 DÉPLOIEMENT SPA FIX - SOLUTION NETLIFY"
echo "========================================="

# Vérifier que tous les fichiers sont présents
echo "🔍 Vérification des fichiers..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html manquant"
    exit 1
fi

if [ ! -f "dist/_redirects" ]; then
    echo "❌ _redirects manquant"
    exit 1
fi

echo "✅ Tous les fichiers sont présents"

# Afficher le contenu du fichier _redirects
echo ""
echo "📋 Contenu du fichier _redirects :"
echo "=================================="
cat dist/_redirects
echo ""

# Ouvrir le dossier dist
echo "📂 Ouverture du dossier dist..."
open dist

echo ""
echo "🎯 ÉTAPES DE DÉPLOIEMENT :"
echo "=========================="
echo ""
echo "1. Le dossier 'dist' va s'ouvrir dans le Finder"
echo "2. Sélectionnez TOUT le contenu du dossier dist"
echo "3. Allez sur https://app.netlify.com/"
echo "4. Trouvez votre site 'doctorfollowers'"
echo "5. Cliquez sur 'Deploys'"
echo "6. Glissez-déposez le contenu du dossier dist"
echo ""
echo "🧪 APRÈS DÉPLOIEMENT, TESTEZ :"
echo "https://doctorfollowers.com/payment/success"
echo "https://doctorfollowers.com/payment/cancel"
echo "https://doctorfollowers.com/pay"
echo ""
echo "✅ Cette fois, le problème SPA sera résolu !"
echo ""
echo "💡 EXPLICATION :"
echo "Le fichier _redirects indique à Netlify de servir"
echo "index.html pour toutes les routes, permettant au"
echo "routage côté client de fonctionner correctement."
