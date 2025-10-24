#!/usr/bin/env node

/**
 * Script de Vérification de la Configuration Vercel
 * 
 * Ce script vérifie que tous les fichiers nécessaires pour Vercel sont présents
 * et correctement configurés.
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

const { green, red, yellow, blue, bold, reset } = colors;

console.log(`\n${bold}${blue}🔍 Vérification de la Configuration Vercel${reset}\n`);

let hasErrors = false;
let hasWarnings = false;

/**
 * Vérifie qu'un fichier existe
 */
function checkFileExists(filePath, displayName) {
  const fullPath = join(rootDir, filePath);
  if (existsSync(fullPath)) {
    console.log(`${green}✓${reset} ${displayName} existe`);
    return true;
  } else {
    console.log(`${red}✗${reset} ${displayName} manquant (${filePath})`);
    hasErrors = true;
    return false;
  }
}

/**
 * Vérifie le contenu d'un fichier JSON
 */
function checkJsonFile(filePath, checks) {
  const fullPath = join(rootDir, filePath);
  
  if (!existsSync(fullPath)) {
    console.log(`${red}✗${reset} ${filePath} n'existe pas`);
    hasErrors = true;
    return;
  }

  try {
    const content = readFileSync(fullPath, 'utf-8');
    const json = JSON.parse(content);
    
    checks.forEach(({ path, expected, message }) => {
      const value = path.split('.').reduce((obj, key) => obj?.[key], json);
      
      if (expected === undefined) {
        // Juste vérifier l'existence
        if (value !== undefined) {
          console.log(`${green}✓${reset} ${message}`);
        } else {
          console.log(`${yellow}⚠${reset} ${message} manquant`);
          hasWarnings = true;
        }
      } else {
        // Vérifier la valeur
        if (value === expected) {
          console.log(`${green}✓${reset} ${message}`);
        } else {
          console.log(`${yellow}⚠${reset} ${message}: attendu "${expected}", trouvé "${value}"`);
          hasWarnings = true;
        }
      }
    });
  } catch (error) {
    console.log(`${red}✗${reset} Erreur lors de la lecture de ${filePath}: ${error.message}`);
    hasErrors = true;
  }
}

// ============================================
// 1. Vérification des Fichiers de Configuration
// ============================================
console.log(`${bold}1. Fichiers de Configuration${reset}`);
checkFileExists('vercel.json', 'vercel.json');
checkFileExists('.vercelignore', '.vercelignore');
checkFileExists('package.json', 'package.json');
checkFileExists('vite.config.ts', 'vite.config.ts');

// ============================================
// 2. Vérification de vercel.json
// ============================================
console.log(`\n${bold}2. Configuration vercel.json${reset}`);
checkJsonFile('vercel.json', [
  { path: 'buildCommand', message: 'Build command configurée' },
  { path: 'outputDirectory', expected: 'dist', message: 'Output directory = "dist"' },
  { path: 'framework', expected: 'vite', message: 'Framework = "vite"' },
  { path: 'rewrites', message: 'Rewrites SPA configurés' },
  { path: 'headers', message: 'Headers HTTP configurés' },
]);

// ============================================
// 3. Vérification de package.json
// ============================================
console.log(`\n${bold}3. Scripts package.json${reset}`);
checkJsonFile('package.json', [
  { path: 'scripts.build', expected: 'vite build', message: 'Script "build"' },
  { path: 'scripts.vercel:deploy', message: 'Script "vercel:deploy"' },
  { path: 'scripts.vercel:preview', message: 'Script "vercel:preview"' },
]);

// ============================================
// 4. Vérification des Fichiers Statiques
// ============================================
console.log(`\n${bold}4. Fichiers Statiques${reset}`);
checkFileExists('public/sitemap.xml', 'sitemap.xml');
checkFileExists('public/robots.txt', 'robots.txt');
checkFileExists('public/favicon-32x32.svg', 'favicon');

// ============================================
// 5. Vérification des Fichiers de Documentation
// ============================================
console.log(`\n${bold}5. Documentation${reset}`);
checkFileExists('VERCEL_MIGRATION_GUIDE.md', 'Guide de migration');
checkFileExists('VERCEL_ENV_VARIABLES.md', 'Documentation des variables d\'env');
checkFileExists('CLEANUP_NETLIFY.md', 'Guide de nettoyage Netlify');

// ============================================
// 6. Avertissement sur les Fichiers Netlify
// ============================================
console.log(`\n${bold}6. Fichiers Netlify (à supprimer après migration)${reset}`);

const netlifyFiles = [
  'netlify.toml',
  'public/_redirects',
  'dist/_redirects',
];

netlifyFiles.forEach(file => {
  const fullPath = join(rootDir, file);
  if (existsSync(fullPath)) {
    console.log(`${yellow}⚠${reset} ${file} existe encore (pensez à le supprimer après migration)`);
    hasWarnings = true;
  } else {
    console.log(`${green}✓${reset} ${file} supprimé`);
  }
});

// ============================================
// 7. Vérification des Variables d'Environnement (fichier .env local)
// ============================================
console.log(`\n${bold}7. Variables d'Environnement (local)${reset}`);

const envFile = join(rootDir, '.env');
if (existsSync(envFile)) {
  const envContent = readFileSync(envFile, 'utf-8');
  
  const requiredVars = [
    'VITE_CARDINITY_CONSUMER_KEY',
    'VITE_CARDINITY_CONSUMER_SECRET',
    'VITE_SMMA_API_KEY',
    'VITE_RAPIDAPI_KEY',
  ];

  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`${green}✓${reset} ${varName} présent dans .env`);
    } else {
      console.log(`${yellow}⚠${reset} ${varName} manquant dans .env`);
      hasWarnings = true;
    }
  });

  console.log(`\n${blue}ℹ${reset} N'oubliez pas de configurer ces variables sur Vercel Dashboard !`);
} else {
  console.log(`${yellow}⚠${reset} Fichier .env non trouvé (utilisez env.example comme template)`);
  hasWarnings = true;
}

// ============================================
// RÉSUMÉ
// ============================================
console.log(`\n${bold}${'='.repeat(60)}${reset}`);

if (!hasErrors && !hasWarnings) {
  console.log(`${green}${bold}✅ Configuration Vercel Parfaite !${reset}`);
  console.log(`\nVous pouvez déployer sur Vercel :`);
  console.log(`  ${blue}npm run vercel:preview${reset}  (preview)`);
  console.log(`  ${blue}npm run vercel:deploy${reset}   (production)`);
} else if (!hasErrors && hasWarnings) {
  console.log(`${yellow}${bold}⚠ Configuration Vercel OK avec Avertissements${reset}`);
  console.log(`\nVous pouvez déployer, mais vérifiez les avertissements ci-dessus.`);
} else {
  console.log(`${red}${bold}✗ Erreurs de Configuration Détectées${reset}`);
  console.log(`\nCorrigez les erreurs avant de déployer sur Vercel.`);
  process.exit(1);
}

console.log(`${bold}${'='.repeat(60)}${reset}\n`);

