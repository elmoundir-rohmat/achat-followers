#!/usr/bin/env node

/**
 * Script pour générer automatiquement le sitemap.xml
 * Usage: npm run generate-sitemap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import des données - version simplifiée pour éviter les problèmes d'import
const blogPosts = [
  {
    slug: "6-conseils-pour-augmenter-les-abonnes-instagram",
    date: "2025-01-25"
  }
];

function generateSitemap() {
  const baseUrl = 'https://doctorfollowers.com';
  const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Page d'accueil
  sitemap += '  <url>\n';
  sitemap += `    <loc>${baseUrl}/</loc>\n`;
  sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
  sitemap += '    <changefreq>daily</changefreq>\n';
  sitemap += '    <priority>1.0</priority>\n';
  sitemap += '  </url>\n';

  // Pages de services Instagram
  const instagramServices = [
    { url: '/products/acheter-followers-instagram', priority: '0.9' },
    { url: '/products/acheter-des-likes-instagram', priority: '0.9' },
    { url: '/products/acheter-des-vues-instagram', priority: '0.9' },
    { url: '/products/acheter-des-commentaires-instagram', priority: '0.9' }
  ];

  instagramServices.forEach(service => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${service.url}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += `    <priority>${service.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  // Pages de services TikTok
  const tiktokServices = [
    { url: '/products/tiktok/acheter-des-abonnes-tiktok', priority: '0.9' },
    { url: '/products/tiktok/acheter-des-likes-tiktok', priority: '0.9' },
    { url: '/products/tiktok/acheter-vues-tiktok', priority: '0.9' },
    { url: '/products/tiktok/acheter-des-commentaires-tiktok', priority: '0.9' }
  ];

  tiktokServices.forEach(service => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${service.url}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += `    <priority>${service.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  // Page Blog
  sitemap += '  <url>\n';
  sitemap += `    <loc>${baseUrl}/blog</loc>\n`;
  sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
  sitemap += '    <changefreq>daily</changefreq>\n';
  sitemap += '    <priority>0.8</priority>\n';
  sitemap += '  </url>\n';

  // Articles de blog
  blogPosts.forEach(post => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.7</priority>\n';
    sitemap += '  </url>\n';
  });

  // Page légale
  sitemap += '  <url>\n';
  sitemap += `    <loc>${baseUrl}/legal</loc>\n`;
  sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
  sitemap += '    <changefreq>monthly</changefreq>\n';
  sitemap += '    <priority>0.3</priority>\n';
  sitemap += '  </url>\n';

  sitemap += '</urlset>';
  return sitemap;
}

// Générer et sauvegarder le sitemap
try {
  const sitemapContent = generateSitemap();
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemapContent, 'utf8');
  
  console.log('✅ Sitemap généré avec succès !');
  console.log(`📁 Fichier créé: ${outputPath}`);
  console.log(`🔗 URL: https://doctorfollowers.com/sitemap.xml`);
  console.log(`📊 Nombre d'URLs: ${sitemapContent.split('<url>').length - 1}`);
  
} catch (error) {
  console.error('❌ Erreur lors de la génération du sitemap:', error);
  process.exit(1);
}
