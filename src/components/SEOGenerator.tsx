import { useEffect } from 'react';
import { generateSitemap, generateRobotsTxt } from '../services/routingService';

// Composant pour générer automatiquement les fichiers SEO
export default function SEOGenerator() {
  useEffect(() => {
    // Générer le sitemap
    const sitemap = generateSitemap();
    
    // Créer un lien pour télécharger le sitemap
    const sitemapBlob = new Blob([sitemap], { type: 'application/xml' });
    const sitemapUrl = URL.createObjectURL(sitemapBlob);
    
    // Générer le robots.txt
    const robotsTxt = generateRobotsTxt();
    
    // Créer un lien pour télécharger le robots.txt
    const robotsBlob = new Blob([robotsTxt], { type: 'text/plain' });
    const robotsUrl = URL.createObjectURL(robotsBlob);

    // Stocker les URLs dans le localStorage pour accès ultérieur
    localStorage.setItem('sitemap-url', sitemapUrl);
    localStorage.setItem('robots-url', robotsUrl);

    // Nettoyer les URLs après 5 minutes
    setTimeout(() => {
      URL.revokeObjectURL(sitemapUrl);
      URL.revokeObjectURL(robotsUrl);
    }, 300000);

    return () => {
      URL.revokeObjectURL(sitemapUrl);
      URL.revokeObjectURL(robotsUrl);
    };
  }, []);

  const downloadSitemap = () => {
    const sitemapUrl = localStorage.getItem('sitemap-url');
    if (sitemapUrl) {
      const link = document.createElement('a');
      link.href = sitemapUrl;
      link.download = 'sitemap.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadRobotsTxt = () => {
    const robotsUrl = localStorage.getItem('robots-url');
    if (robotsUrl) {
      const link = document.createElement('a');
      link.href = robotsUrl;
      link.download = 'robots.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 border">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">SEO Tools</h3>
        <div className="space-y-2">
          <button
            onClick={downloadSitemap}
            className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
          >
            📄 Télécharger sitemap.xml
          </button>
          <button
            onClick={downloadRobotsTxt}
            className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
          >
            🤖 Télécharger robots.txt
          </button>
        </div>
      </div>
    </div>
  );
}
