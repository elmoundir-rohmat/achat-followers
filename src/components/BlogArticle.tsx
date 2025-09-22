import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';
import { getBlogPostBySlug } from '../config/blogPosts';
import { generateArticleMeta } from '../utils/seo';
import { useEffect } from 'react';

interface BlogArticleProps {
  slug: string;
  onBack: () => void;
}

export default function BlogArticle({ slug, onBack }: BlogArticleProps) {
  const post = getBlogPostBySlug(slug);

  // Mise à jour des métadonnées SEO
  useEffect(() => {
    if (post) {
      const meta = generateArticleMeta(post);
      
      // Mise à jour du titre de la page
      document.title = meta.title;
      
      // Mise à jour de la meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', meta.description);
      } else {
        const metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        metaDesc.content = meta.description;
        document.head.appendChild(metaDesc);
      }

      // Mise à jour des meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', meta.keywords);
      } else {
        const metaKw = document.createElement('meta');
        metaKw.name = 'keywords';
        metaKw.content = meta.keywords;
        document.head.appendChild(metaKw);
      }

      // Mise à jour de l'URL canonique
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', meta.canonical);
      } else {
        const linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        linkCanonical.href = meta.canonical;
        document.head.appendChild(linkCanonical);
      }

      // Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', meta.openGraph.title);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', meta.openGraph.description);
      }

      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', meta.openGraph.image);
      }

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', meta.openGraph.url);
      }
    }
  }, [post]);

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
    return dateString; // La date est déjà formatée dans les données
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
              <span>{post.author}</span>
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
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="text-gray-800 leading-relaxed">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br/>').replace(/## (.*?)(?=\n|$)/g, '<h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">$1</h2>')
              }} />
            ) : (
              <p>Contenu de l'article en cours de chargement...</p>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mt-12">
          <h3 className="text-2xl font-bold mb-4">
            Prêt à booster votre présence Instagram ?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Découvrez nos services de croissance organique pour Instagram, TikTok et YouTube.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Découvrir nos services
          </button>
        </div>
      </article>
    </div>
  );
}