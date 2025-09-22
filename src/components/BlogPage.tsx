import React, { useState } from 'react';
import { Search, Filter, Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { blogPosts, getCategories, searchBlogPosts, type BlogPost } from '../config/blogPosts';

interface BlogPageProps {
  onNavigate?: (page: string) => void;
  onViewArticle?: (slug: string) => void;
}

export default function BlogPage({ onNavigate, onViewArticle }: BlogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = getCategories();

  const filteredPosts = searchQuery || selectedCategories.length > 0 
    ? searchBlogPosts(searchQuery).filter(post => 
        selectedCategories.length === 0 || selectedCategories.includes(post.category)
      )
    : blogPosts;

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = () => {
    // La recherche se fait automatiquement via le filtre
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="pt-20 pb-5">
          <h1 className="text-5xl font-bold text-center">Blog</h1>
        </div>
        <svg className="w-full h-24" viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
          <path fill="rgb(249, 250, 251)" d="M0,0L60,15C120,30,240,60,360,66.7C480,73,600,57,720,46.7C840,37,960,33,1080,28.3C1200,23,1320,17,1440,25C1560,33,1680,57,1800,56.7C1920,57,2040,33,2160,30C2280,27,2400,43,2520,56.7C2640,70,2760,80,2880,83.3C3000,87,3120,83,3240,76.7C3360,70,3480,60,3600,46.7C3720,33,3840,17,3960,16.7C4080,17,4200,33,4320,38.3C4440,43,4560,37,4680,40C4800,43,4920,57,5040,61.7C5160,67,5280,63,5400,60C5520,57,5640,53,5760,56.7C5880,60,6000,70,6120,63.3C6240,57,6360,33,6480,35C6600,37,6720,63,6840,68.3C6960,73,7080,57,7200,55C7320,53,7440,67,7560,68.3C7680,70,7800,60,7920,53.3C8040,47,8160,43,8280,46.7C8400,50,8520,60,8580,65L8640,70L8640,100L8580,100C8520,100,8400,100,8280,100C8160,100,8040,100,7920,100C7800,100,7680,100,7560,100C7440,100,7320,100,7200,100C7080,100,6960,100,6840,100C6720,100,6600,100,6480,100C6360,100,6240,100,6120,100C6000,100,5880,100,5760,100C5640,100,5520,100,5400,100C5280,100,5160,100,5040,100C4920,100,4800,100,4680,100C4560,100,4440,100,4320,100C4200,100,4080,100,3960,100C3840,100,3720,100,3600,100C3480,100,3360,100,3240,100C3120,100,3000,100,2880,100C2760,100,2640,100,2520,100C2400,100,2280,100,2160,100C2040,100,1920,100,1800,100C1680,100,1560,100,1440,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
        </svg>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-4xl mx-auto my-5 bg-white relative">
        <div className="flex">
          <div className="w-full">
            <input
              type="text"
              className="block w-full p-3 border-l-2 border-gray-300 rounded-l-lg lg:p-5 border-y-2"
              placeholder="Rechercher par titre, catégorie, mots-clés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex">
            <div className="p-1 bg-white border-gray-300 lg:p-3 border-y-2">
              <div 
                className="p-1 rounded cursor-pointer hover:bg-gray-200" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div 
              className="py-3 font-bold text-white rounded-r-lg cursor-pointer lg:py-5 lg:px-10 px-7 bg-purple-600"
              onClick={handleSearch}
            >
              Recherche
            </div>
          </div>
        </div>
        
        {/* Filters Dropdown */}
        {showFilters && (
          <div className="absolute z-50 w-full bg-white border-b-2 border-gray-100 rounded-b-lg border-x-2">
            {categories.map((category) => (
              <div 
                key={category}
                className="p-3 transition-all duration-500 cursor-pointer hover:bg-gray-100"
                onClick={() => handleCategoryToggle(category)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => {}}
                    className="mx-2 pointer-events-none"
                  />
                  <label className="capitalize pointer-events-none">{category}</label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Posts Grid */}
      <div className="container max-w-7xl mx-auto">
        <div className="my-10">
          <div className="justify-center m-auto md:flex md:flex-wrap" id="blogs">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="overflow-hidden m-5 bg-white shadow-sm lg:w-[30%] rounded-xl hover:shadow-lg transition-shadow duration-300"
                data-aos="fade-up"
              >
                 <a href={`/blog/${post.slug}`} className="block">
                  <div className="relative pb-32">
                    <div className="m-auto w-fit">
                      <div className="w-full m-auto overflow-hidden aspect-video rounded-xl">
                        <img 
                          src={post.image} 
                          loading="lazy" 
                          className="object-cover w-full h-full transition-all duration-700 hover:scale-105" 
                          alt={post.title}
                        />
                      </div>
                      <div className="px-10 my-5 text-2xl h-28 text-gray-800 hover:underline font-poppins">
                        <h2>{post.title}</h2>
                      </div>
                      <div className="mx-10 flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {post.date}
                        </div>
                        {post.readTime && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.readTime} min
                          </div>
                        )}
                      </div>
                      <div className="w-full h-56 px-10 text-justify text-gray-600">
                        <p>{post.excerpt}</p>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="px-10 mb-4">
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 mx-auto my-4 -translate-x-1/2 w-fit left-1/2">
                      <button className="px-10 py-5 mx-auto text-white rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300 flex items-center">
                        Lire la suite
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                 </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <div className="text-gray-500 text-xl">
            Aucun article trouvé pour votre recherche.
          </div>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategories([]);
            }}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

    </div>
  );
}