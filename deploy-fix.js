// Script pour forcer le redéploiement et corriger le problème 404
const fs = require('fs');
const path = require('path');

console.log('🚀 Correction du problème 404 - Déploiement forcé');

// 1. Vérifier que les pages de paiement existent
const paymentSuccessPage = path.join(__dirname, 'src/components/PaymentSuccessPageFixed.tsx');
const paymentCancelPage = path.join(__dirname, 'src/components/PaymentCancelPage.tsx');
const paymentPage = path.join(__dirname, 'src/components/PaymentPage.tsx');

if (fs.existsSync(paymentSuccessPage)) {
  console.log('✅ PaymentSuccessPageFixed.tsx existe');
} else {
  console.log('❌ PaymentSuccessPageFixed.tsx manquant');
}

if (fs.existsSync(paymentCancelPage)) {
  console.log('✅ PaymentCancelPage.tsx existe');
} else {
  console.log('❌ PaymentCancelPage.tsx manquant');
}

if (fs.existsSync(paymentPage)) {
  console.log('✅ PaymentPage.tsx existe');
} else {
  console.log('❌ PaymentPage.tsx manquant');
}

// 2. Vérifier la configuration App.tsx
const appTsx = path.join(__dirname, 'src/App.tsx');
if (fs.existsSync(appTsx)) {
  const content = fs.readFileSync(appTsx, 'utf8');
  if (content.includes('payment-success')) {
    console.log('✅ Routes de paiement configurées dans App.tsx');
  } else {
    console.log('❌ Routes de paiement manquantes dans App.tsx');
  }
} else {
  console.log('❌ App.tsx manquant');
}

// 3. Vérifier le fichier _redirects
const redirectsFile = path.join(__dirname, 'public/_redirects');
if (fs.existsSync(redirectsFile)) {
  const content = fs.readFileSync(redirectsFile, 'utf8');
  if (content.includes('/*')) {
    console.log('✅ Fichier _redirects configuré');
  } else {
    console.log('❌ Fichier _redirects mal configuré');
  }
} else {
  console.log('❌ Fichier _redirects manquant');
}

// 4. Créer un fichier de timestamp pour forcer le déploiement
const timestamp = new Date().toISOString();
const deployFile = path.join(__dirname, 'DEPLOY_TIMESTAMP.txt');
fs.writeFileSync(deployFile, `Déploiement forcé: ${timestamp}`);

console.log('📝 Fichier de timestamp créé pour forcer le déploiement');
console.log('🎯 Prochaines étapes:');
console.log('1. Pousser ce commit sur GitHub');
console.log('2. Vérifier que Netlify redéploie automatiquement');
console.log('3. Tester les URLs de paiement');

console.log('✅ Script terminé');
