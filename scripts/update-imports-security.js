#!/usr/bin/env node

/**
 * Script pour mettre à jour automatiquement les imports vers les nouveaux services sécurisés
 * 
 * Usage: node scripts/update-imports-security.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src');

// Compteurs
let filesScanned = 0;
let filesUpdated = 0;
let replacements = 0;

// Couleurs console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

console.log(`\n${colors.bold}${colors.blue}🔧 Migration vers les Services Sécurisés${colors.reset}\n`);

/**
 * Parcourir récursivement un dossier
 */
function walkDir(dir, callback) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorer node_modules, dist, etc.
      if (!['node_modules', 'dist', '.git', 'api'].includes(file)) {
        walkDir(filePath, callback);
      }
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      callback(filePath);
    }
  });
}

/**
 * Mettre à jour les imports dans un fichier
 */
function updateFile(filePath) {
  filesScanned++;
  
  let content = readFileSync(filePath, 'utf-8');
  const originalContent = content;
  let fileReplacements = 0;

  // Remplacement 1: smmaService → smmaServiceClient
  const smmaImportRegex = /import\s+{\s*smmaService\s*}\s+from\s+['"](.+?)\/services\/smmaService['"]/g;
  content = content.replace(smmaImportRegex, (match, prefix) => {
    fileReplacements++;
    return `import { smmaServiceClient } from '${prefix}/services/smmaServiceClient'`;
  });

  // Remplacement 2: instagramService → instagramServiceClient
  const instaImportRegex = /import\s+{\s*instagramService\s*}\s+from\s+['"](.+?)\/services\/instagramService['"]/g;
  content = content.replace(instaImportRegex, (match, prefix) => {
    fileReplacements++;
    return `import { instagramServiceClient } from '${prefix}/services/instagramServiceClient'`;
  });

  // Remplacement 3: smmaService. → smmaServiceClient.
  const smmaCallRegex = /smmaService\./g;
  content = content.replace(smmaCallRegex, () => {
    fileReplacements++;
    return 'smmaServiceClient.';
  });

  // Remplacement 4: instagramService. → instagramServiceClient.
  const instaCallRegex = /instagramService\./g;
  content = content.replace(instaCallRegex, () => {
    fileReplacements++;
    return 'instagramServiceClient.';
  });

  // Si des changements ont été faits
  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf-8');
    filesUpdated++;
    replacements += fileReplacements;
    
    const relativePath = filePath.replace(srcDir, 'src');
    console.log(`${colors.green}✓${colors.reset} ${relativePath} (${fileReplacements} changements)`);
  }
}

// Parcourir le dossier src
console.log('Analyse des fichiers...\n');
walkDir(srcDir, updateFile);

// Résumé
console.log(`\n${colors.bold}${'='.repeat(60)}${colors.reset}`);
console.log(`${colors.bold}Résumé${colors.reset}`);
console.log(`${colors.bold}${'='.repeat(60)}${colors.reset}\n`);
console.log(`Fichiers analysés : ${filesScanned}`);
console.log(`${colors.green}Fichiers mis à jour : ${filesUpdated}${colors.reset}`);
console.log(`${colors.yellow}Total remplacements : ${replacements}${colors.reset}\n`);

if (filesUpdated > 0) {
  console.log(`${colors.bold}${colors.green}✅ Migration terminée avec succès !${colors.reset}\n`);
  console.log('Prochaines étapes :');
  console.log('1. Vérifiez les changements : git diff');
  console.log('2. Testez l\'application : npm run build');
  console.log('3. Vérifiez qu\'il n\'y a pas d\'erreurs TypeScript\n');
} else {
  console.log(`${colors.yellow}⚠ Aucun fichier à mettre à jour${colors.reset}\n`);
}

