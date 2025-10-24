import { ArrowLeft, Calendar, User, Clock, Tag, Users, ArrowRight } from 'lucide-react';
import { BlogService, BlogPost } from '../lib/blog';
import { parseMarkdownToHTML, generateTableOfContents } from '../utils/markdownParser';
import { useEffect, useState } from 'react';

interface BlogArticleProps {
  slug: string;
  onBack: () => void;
}

export default function BlogArticle({ slug, onBack }: BlogArticleProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [parsedContent, setParsedContent] = useState<{
    html: string;
    headings: Array<{ level: number; text: string; id: string }>;
    wordCount: number;
    readingTime: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'article
  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        // Forcer le rechargement du cache
        await BlogService.forceReloadMetadata();
        const article = await BlogService.getArticle(slug);
        console.log('Article chargé:', article);
        setPost(article);
      } catch (error) {
        console.error('Error loading article:', error);
        console.error('Slug:', slug);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  // Mise à jour des métadonnées SEO et parsing du contenu
  useEffect(() => {
    if (post) {
      // Mise à jour du titre de la page
      document.title = post.seo.metaTitle;
      
      // Mise à jour de la meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.seo.metaDescription);
      } else {
        const metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        metaDesc.content = post.seo.metaDescription;
        document.head.appendChild(metaDesc);
      }

      // Mise à jour des meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', post.seo.keywords.join(', '));
      } else {
        const metaKw = document.createElement('meta');
        metaKw.name = 'keywords';
        metaKw.content = post.seo.keywords.join(', ');
        document.head.appendChild(metaKw);
      }

      // Mise à jour des meta robots
      const metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      } else {
        const metaR = document.createElement('meta');
        metaR.name = 'robots';
        metaR.content = 'index, follow';
        document.head.appendChild(metaR);
      }

      // Mise à jour de l'URL canonique
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', post.seo.canonicalUrl || `https://doctorfollowers.com/blogs/${post.slug}`);
      } else {
        const linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        linkCanonical.href = post.seo.canonicalUrl || `https://doctorfollowers.com/blogs/${post.slug}`;
        document.head.appendChild(linkCanonical);
      }

      // Open Graph
      if (post.openGraph) {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', post.openGraph.title);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', post.openGraph.description);
        }

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', post.openGraph.image);
        }

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
          ogUrl.setAttribute('content', post.openGraph.url || `https://doctorfollowers.com/blogs/${post.slug}`);
        }
      }

      // Parser le contenu Markdown
      if (post.content) {
        const parsed = parseMarkdownToHTML(post.content);
        setParsedContent(parsed);
      }
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-8">L'article que vous recherchez n'existe pas.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au blog
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Retourner la chaîne originale en cas d'erreur
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au blog
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span>{post.author || 'Auteur inconnu'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>{post.readTime} min de lecture</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={post.image}
            alt={post.seo.imageAlt || post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          {/* Excerpt */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Table of Contents */}
          {parsedContent && parsedContent.headings.length > 0 && (
            <div dangerouslySetInnerHTML={{ 
              __html: generateTableOfContents(parsedContent.headings)
            }} />
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {parsedContent ? (
              <div>
                <div dangerouslySetInnerHTML={{ 
                  __html: parsedContent.html
                }} />
                
                {/* CTA Button pour tous les articles */}
                <div className="text-center my-8">
                  <button
                    onClick={() => window.open('https://doctorfollowers.com/instagram-followers', '_blank')}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg flex items-center justify-center mx-auto"
                  >
                    <Users className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                    Acheter des Followers Instagram
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-sm text-gray-600 mt-2 italic">
                    Service français • Livraison rapide • Abonnés réels
                  </p>
                </div>
              </div>
            ) : (
              <p>Contenu de l'article en cours de chargement...</p>
            )}
          </div>

          {/* Article Stats */}
          {parsedContent && (
            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <div className="flex flex-wrap gap-4">
                <span>{parsedContent.wordCount} mots</span>
                <span>•</span>
                <span>{parsedContent.readingTime} min de lecture</span>
                <span>•</span>
                <span>{parsedContent.headings.length} sections</span>
              </div>
            </div>
          )}
        </article>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mt-12">
          <h3 className="text-2xl font-bold mb-4">
            Prêt à booster votre présence Instagram ?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Découvrez nos services de croissance organique pour Instagram, TikTok et YouTube.
          </p>
          <button
            onClick={() => onBack()}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Découvrir nos services
          </button>
        </div>
      </article>
    </div>
  );
}