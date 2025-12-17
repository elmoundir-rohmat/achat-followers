import { ArrowLeft, Calendar, User, Clock, Tag, Users, ArrowRight } from 'lucide-react';
import { BlogPost } from '../lib/blog';
import { BlogServiceSanity } from '../lib/blog/blogServiceSanity';
import { parseMarkdownToHTML, generateTableOfContents } from '../utils/markdownParser';
import PortableText from './PortableText';
import { useEffect, useState } from 'react';

interface BlogArticleProps {
  slug: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export default function BlogArticle({ slug, onBack, onNavigate }: BlogArticleProps) {
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
        // Charger l'article depuis Sanity
        await BlogServiceSanity.forceReloadMetadata();
        const article = await BlogServiceSanity.getArticle(slug);
        setPost(article);
      } catch (error) {
        console.error('Error loading article:', error);
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

      // Parser le contenu (Markdown ou blockContent)
      if (post.contentRich && Array.isArray(post.contentRich)) {
        // Contenu riche (blockContent) de Sanity - pas besoin de parsing
        // On extrait les headings pour la table des matières
        const headings: Array<{ level: number; text: string; id: string }> = [];
        post.contentRich.forEach((block: any, index: number) => {
          if (block._type === 'block' && block.style && ['h1', 'h2', 'h3', 'h4'].includes(block.style)) {
            const level = parseInt(block.style.replace('h', '')) || 1;
            const text = block.children?.map((child: any) => child.text || '').join('') || '';
            const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, '-')}`;
            headings.push({ level, text, id });
          }
        });
        setParsedContent({
          html: '', // Pas besoin pour blockContent
          headings,
          wordCount: post.wordCount || 0,
          readingTime: post.readTime || 5,
        });
      } else if (post.content && typeof post.content === 'string') {
        // Contenu Markdown (legacy)
        const parsed = parseMarkdownToHTML(post.content);
        setParsedContent(parsed);
      }
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-rounded">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-rounded">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-slate-800 mb-4">Article non trouvé</h1>
          <p className="text-slate-600 mb-8">L'article que vous recherchez n'existe pas.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white rounded-button hover:shadow-soft-lg transition-all duration-300 shadow-soft font-semibold"
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
    <div className="min-h-screen bg-cream font-rounded">
      {/* Header */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50 border-b border-soft-pink-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-slate-600 hover:text-slate-800 transition-colors mb-4 p-2 hover:bg-white/50 rounded-card-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={1.5} />
            Retour au blog
          </button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-6 leading-tight">
            {post.title}
          </h1>
          
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" strokeWidth={1.5} />
              <span>{post.author || 'Auteur inconnu'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" strokeWidth={1.5} />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" strokeWidth={1.5} />
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
                  className="px-4 py-1.5 bg-gradient-to-br from-soft-pink-50 to-lavender-50 text-soft-pink-700 text-sm rounded-pill flex items-center border border-soft-pink-200/50"
                >
                  <Tag className="w-3 h-3 mr-1" strokeWidth={1.5} />
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
            className="w-full h-64 md:h-96 object-cover rounded-card shadow-soft-xl"
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          {/* Excerpt */}
          <div className="bg-gradient-to-br from-soft-pink-50/50 via-peach-50/50 to-lavender-50/50 border-l-4 border-soft-pink-400 p-6 mb-8 rounded-r-card-sm shadow-soft">
            <p className="text-lg text-slate-700 italic leading-relaxed">
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
            {post.contentRich && Array.isArray(post.contentRich) ? (
              // Contenu riche (blockContent) de Sanity
              <PortableText content={post.contentRich} />
            ) : parsedContent && parsedContent.html ? (
              // Contenu Markdown (legacy)
              <div dangerouslySetInnerHTML={{ 
                __html: parsedContent.html
              }} />
            ) : (
              <p>Contenu de l'article en cours de chargement...</p>
            )}
          </div>

          {/* CTA Button pour tous les articles */}
          <div className="text-center my-8">
            <button
              onClick={() => onNavigate?.('instagram-followers')}
              className="group bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 hover:shadow-soft-xl text-white font-semibold py-4 px-8 rounded-button transition-all duration-300 transform hover:scale-105 shadow-soft-lg text-lg flex items-center justify-center mx-auto"
            >
              <Users className="w-6 h-6 mr-3 group-hover:animate-pulse" strokeWidth={1.5} />
              Acheter des Followers Instagram
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </button>
            <p className="text-sm text-slate-600 mt-2 italic">
              Service français • Livraison rapide • Abonnés réels
            </p>
          </div>

          {/* Article Stats */}
          {parsedContent && (
            <div className="mt-8 pt-6 border-t border-soft-pink-200/50 text-sm text-slate-500">
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
        <div className="bg-gradient-to-br from-soft-pink-400 via-peach-400 to-lavender-400 rounded-card p-10 text-white mt-12 shadow-soft-xl">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">
            Prêt à booster votre présence Instagram ?
          </h3>
          <p className="text-lg mb-6 opacity-90 leading-relaxed">
            Découvrez nos services de croissance organique pour Instagram, TikTok et YouTube.
          </p>
          <button
            onClick={() => onBack()}
            className="bg-white/90 backdrop-blur-sm text-soft-pink-600 px-8 py-3 rounded-button font-semibold hover:bg-white transition-all shadow-soft-lg"
          >
            Découvrir nos services
          </button>
        </div>
      </article>
    </div>
  );
}