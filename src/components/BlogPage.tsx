import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { BlogMetadata } from '../lib/blog';
import { BlogServiceSanity } from '../lib/blog/blogServiceSanity';

interface BlogPageProps {
  onNavigate?: (page: string) => void;
  onViewArticle?: (slug: string) => void;
}

export default function BlogPage({ onNavigate, onViewArticle }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [posts, setPosts] = useState<BlogMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les articles au montage du composant
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        // Charger les articles depuis Sanity
        await BlogServiceSanity.forceReloadMetadata();
        const response = await BlogServiceSanity.getArticlesList();
        setPosts(response.posts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Charger les catégories
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await BlogServiceSanity.getArticlesList();
        const uniqueCategories = [...new Set(response.posts.map(post => post.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Mise à jour des métadonnées SEO pour la page blog
  useEffect(() => {
    // Mise à jour du titre de la page
    document.title = 'Blog Réseaux Sociaux : Instagram & TikTok | Doctor Followers';
    
    // Mise à jour de la meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez des conseils, stratégies et guides pour développer votre audience sur Instagram et TikTok. Astuces growth, engagement et visibilité social media.');
    } else {
      const metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = 'Découvrez des conseils, stratégies et guides pour développer votre audience sur Instagram et TikTok. Astuces growth, engagement et visibilité social media.';
      document.head.appendChild(metaDesc);
    }

    // Mise à jour des meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'blog, conseils, instagram, tiktok, youtube, réseaux sociaux, followers, engagement');
    } else {
      const metaKw = document.createElement('meta');
      metaKw.name = 'keywords';
      metaKw.content = 'blog, conseils, instagram, tiktok, youtube, réseaux sociaux, followers, engagement';
      document.head.appendChild(metaKw);
    }

    // Mise à jour de l'URL canonique
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://doctorfollowers.com/blogs');
    } else {
      const linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      linkCanonical.href = 'https://doctorfollowers.com/blogs';
      document.head.appendChild(linkCanonical);
    }

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Blog Réseaux Sociaux : Instagram & TikTok | Doctor Followers');
    } else {
      const metaOgTitle = document.createElement('meta');
      metaOgTitle.setAttribute('property', 'og:title');
      metaOgTitle.setAttribute('content', 'Blog Réseaux Sociaux : Instagram & TikTok | Doctor Followers');
      document.head.appendChild(metaOgTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Découvrez des conseils, stratégies et guides pour développer votre audience sur Instagram et TikTok. Astuces growth, engagement et visibilité social media.');
    } else {
      const metaOgDesc = document.createElement('meta');
      metaOgDesc.setAttribute('property', 'og:description');
      metaOgDesc.setAttribute('content', 'Découvrez des conseils, stratégies et guides pour développer votre audience sur Instagram et TikTok. Astuces growth, engagement et visibilité social media.');
      document.head.appendChild(metaOgDesc);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', 'https://doctorfollowers.com/blogs');
    } else {
      const metaOgUrl = document.createElement('meta');
      metaOgUrl.setAttribute('property', 'og:url');
      metaOgUrl.setAttribute('content', 'https://doctorfollowers.com/blogs');
      document.head.appendChild(metaOgUrl);
    }

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute('content', 'website');
    } else {
      const metaOgType = document.createElement('meta');
      metaOgType.setAttribute('property', 'og:type');
      metaOgType.setAttribute('content', 'website');
      document.head.appendChild(metaOgType);
    }
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(post.category);

    return matchesSearch && matchesCategory;
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche est déjà gérée par le filtre
  };

  const formatDate = (dateString: string) => {
    return dateString; // La date est déjà formatée dans les données
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-rounded">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-pink-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream font-rounded">
      {/* Header */}
      <div className="bg-gradient-to-br from-peach-50 via-soft-pink-50 to-lavender-50 border-b border-soft-pink-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-800 mb-6">
              Blog
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos conseils et stratégies pour développer votre présence sur les réseaux sociaux
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 p-8 mb-10">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-soft-pink-200/50 rounded-button focus:ring-2 focus:ring-soft-pink-300 focus:border-soft-pink-300 bg-white/80 backdrop-blur-sm transition-all text-slate-900"
              />
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-5 py-2.5 text-slate-700 hover:text-slate-900 border border-soft-pink-200/50 rounded-button hover:bg-soft-pink-50/50 transition-all shadow-soft"
            >
              <Filter className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Filtres
            </button>

            {showFilters && (
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-4 py-2 rounded-pill text-sm transition-all shadow-soft ${
                      selectedCategories.includes(category)
                        ? 'bg-gradient-to-r from-soft-pink-400 via-peach-400 to-lavender-400 text-white shadow-soft-lg'
                        : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-soft-pink-50/50 border border-soft-pink-200/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Aucun article trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white/80 backdrop-blur-sm rounded-card shadow-soft-lg border border-soft-pink-200/50 overflow-hidden hover:shadow-soft-xl transition-all duration-300 cursor-pointer"
                onClick={() => onViewArticle?.(post.slug)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <Calendar className="w-4 h-4 mr-1" strokeWidth={1.5} />
                    <span className="mr-4">{formatDate(post.date)}</span>
                    <User className="w-4 h-4 mr-1" strokeWidth={1.5} />
                    <span className="mr-4">{post.authorId}</span>
                    <Clock className="w-4 h-4 mr-1" strokeWidth={1.5} />
                    <span>{post.readTime} min</span>
                  </div>

                  <h2 className="text-xl font-semibold text-slate-800 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 bg-gradient-to-br from-soft-pink-50 to-lavender-50 text-soft-pink-700 text-sm rounded-pill border border-soft-pink-200/50 font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center bg-gradient-to-r from-soft-pink-500 via-peach-500 to-lavender-500 bg-clip-text text-transparent hover:from-soft-pink-600 hover:via-peach-600 hover:to-lavender-600">
                      <span className="text-sm font-semibold">Lire l'article</span>
                      <ArrowRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}