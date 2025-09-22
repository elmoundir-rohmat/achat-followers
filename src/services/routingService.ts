import { getServicePageBySlug, generateServicePageMeta } from '../config/serviceSlugs';

// Service de routage pour gérer les slugs et le SEO
export class RoutingService {
  /**
   * Applique les métadonnées SEO d'une page de service
   */
  static applyServicePageSEO(pageSlug: string): void {
    const page = getServicePageBySlug(pageSlug);
    if (!page) {
      console.warn(`Page de service non trouvée pour le slug: ${pageSlug}`);
      return;
    }

    const meta = generateServicePageMeta(page);

    // Mise à jour du titre de la page
    document.title = meta.title;

    // Mise à jour de la meta description
    this.updateMetaTag('name', 'description', meta.description);

    // Mise à jour des meta keywords
    this.updateMetaTag('name', 'keywords', meta.keywords);

    // Mise à jour de l'URL canonique
    this.updateCanonicalUrl(meta.canonical);

    // Open Graph
    this.updateMetaTag('property', 'og:title', meta.openGraph.title);
    this.updateMetaTag('property', 'og:description', meta.openGraph.description);
    this.updateMetaTag('property', 'og:type', meta.openGraph.type);
    this.updateMetaTag('property', 'og:url', meta.openGraph.url);
    this.updateMetaTag('property', 'og:site_name', meta.openGraph.siteName);

    // Twitter Card
    this.updateMetaTag('name', 'twitter:card', meta.twitter.card);
    this.updateMetaTag('name', 'twitter:title', meta.twitter.title);
    this.updateMetaTag('name', 'twitter:description', meta.twitter.description);

    // Mise à jour de l'URL dans l'historique
    this.updateHistoryUrl(meta.canonical);
  }

  /**
   * Met à jour une balise meta
   */
  private static updateMetaTag(attribute: string, name: string, content: string): void {
    const existingTag = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (existingTag) {
      existingTag.setAttribute('content', content);
    } else {
      const metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, name);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    }
  }

  /**
   * Met à jour l'URL canonique
   */
  private static updateCanonicalUrl(url: string): void {
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    
    if (existingCanonical) {
      existingCanonical.setAttribute('href', url);
    } else {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = url;
      document.head.appendChild(canonical);
    }
  }

  /**
   * Met à jour l'URL dans l'historique du navigateur
   */
  private static updateHistoryUrl(url: string): void {
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
  }

  /**
   * Génère un sitemap XML pour le SEO
   */
  static generateSitemap(): string {
    const baseUrl = window.location.origin;
    const servicePages = [
      '/instagram-followers',
      '/instagram-likes',
      '/instagram-views',
      '/instagram-comments',
      '/tiktok-followers',
      '/tiktok-likes',
      '/tiktok-views',
      '/tiktok-comments',
      '/blog'
    ];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Page d'accueil
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/</loc>\n`;
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>1.0</priority>\n';
    sitemap += '  </url>\n';

    // Pages de services
    servicePages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page}</loc>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';
    return sitemap;
  }

  /**
   * Génère un robots.txt pour le SEO
   */
  static generateRobotsTxt(): string {
    const baseUrl = window.location.origin;
    return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
  }
}

// Export des fonctions utilitaires
export const applyServicePageSEO = RoutingService.applyServicePageSEO;
export const generateSitemap = RoutingService.generateSitemap;
export const generateRobotsTxt = RoutingService.generateRobotsTxt;

// Re-export des fonctions du config
export { getServicePageBySlug } from '../config/serviceSlugs';
