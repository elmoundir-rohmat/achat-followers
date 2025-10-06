#!/bin/bash

echo "🚀 DÉPLOIEMENT IMMÉDIAT - CORRECTION DU PROBLÈME 404"
echo "=================================================="

# 1. Construire l'application
echo "📦 Construction de l'application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la construction"
    exit 1
fi

echo "✅ Application construite avec succès"

# 2. Vérifier que les fichiers existent
echo "🔍 Vérification des fichiers..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ Fichier index.html manquant dans dist/"
    exit 1
fi

if [ ! -f "dist/_redirects" ]; then
    echo "❌ Fichier _redirects manquant dans dist/"
    exit 1
fi

echo "✅ Tous les fichiers sont présents"

# 3. Afficher les instructions de déploiement
echo ""
echo "🎯 INSTRUCTIONS DE DÉPLOIEMENT :"
echo "================================"
echo ""
echo "OPTION 1 - Déploiement manuel :"
echo "1. Allez sur https://app.netlify.com/"
echo "2. Connectez-vous à votre compte"
echo "3. Trouvez votre site 'doctorfollowers'"
echo "4. Cliquez sur 'Deploys'"
echo "5. Glissez-déposez le dossier 'dist' dans la zone de déploiement"
echo ""
echo "OPTION 2 - Si vous avez Netlify CLI :"
echo "netlify deploy --prod --dir=dist"
echo ""
echo "OPTION 3 - Si vous utilisez Git :"
echo "1. git add ."
echo "2. git commit -m 'Fix: Correction du problème 404 pour les routes de paiement'"
echo "3. git push origin main"
echo ""
echo "🧪 APRÈS DÉPLOIEMENT, TESTEZ CES URLs :"
echo "https://doctorfollowers.com/payment/success"
echo "https://doctorfollowers.com/payment/cancel"
echo "https://doctorfollowers.com/pay"
echo ""
echo "✅ Le problème 404 devrait être résolu !"
