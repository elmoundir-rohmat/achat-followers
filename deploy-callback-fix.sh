#!/bin/bash

echo "🚀 DÉPLOIEMENT CALLBACK FIX - NETLIFY FUNCTION"
echo "=============================================="

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

if [ ! -f "dist/netlify/functions/payment-callback.js" ]; then
    echo "❌ Netlify Function manquante"
    exit 1
fi

echo "✅ Tous les fichiers sont présents"

# Afficher le contenu du fichier _redirects
echo ""
echo "📋 Contenu du fichier _redirects :"
echo "=================================="
cat dist/_redirects
echo ""

# Afficher la Netlify Function
echo "📋 Contenu de la Netlify Function :"
echo "==================================="
cat dist/netlify/functions/payment-callback.js
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
echo "1. Faites un paiement test avec Cardinity"
echo "2. Cardinity redirigera vers /payment/callback (POST)"
echo "3. La Netlify Function convertira en GET vers /payment/success"
echo "4. L'intégration SMMA se déclenchera automatiquement"
echo ""
echo "✅ Le problème de callback POST sera résolu !"
echo ""
echo "💡 EXPLICATION :"
echo "Cardinity → POST /payment/callback → Netlify Function → GET /payment/success"
echo "La Netlify Function gère le callback POST et le convertit en redirection GET."
