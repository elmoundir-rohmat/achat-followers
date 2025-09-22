export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  slug: string;
  content?: string; // Pour le contenu complet de l'article
  tags?: string[]; // Pour les mots-clés
  readTime?: number; // Temps de lecture estimé en minutes
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Comment augmenter ses followers Instagram en 2025 : Guide complet",
    excerpt: "Découvrez les stratégies les plus efficaces pour développer votre audience Instagram en 2025. Techniques éprouvées, conseils d'experts et méthodes légitimes pour booster votre visibilité.",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=400&fit=crop",
    date: "22 septembre 2025",
    author: "ThinkWell",
    category: "Instagram",
    slug: "augmenter-followers-instagram-2025",
    tags: ["Instagram", "Followers", "Growth", "Social Media"],
    readTime: 8
  },
  {
    id: 2,
    title: "TikTok : Les secrets du succès viral en 2025",
    excerpt: "Apprenez les techniques qui font le succès sur TikTok. Algorithmes, timing, contenu engageant : tout ce qu'il faut savoir pour créer des vidéos virales.",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=400&fit=crop",
    date: "20 septembre 2025",
    author: "ThinkWell",
    category: "TikTok",
    slug: "secrets-succes-viral-tiktok-2025",
    tags: ["TikTok", "Viral", "Content", "Algorithm"],
    readTime: 6
  },
  {
    id: 3,
    title: "YouTube : Optimiser ses vidéos pour l'algorithme",
    excerpt: "Maîtrisez l'algorithme YouTube et maximisez la visibilité de vos vidéos. SEO, thumbnails, engagement : les clés du succès sur la plateforme.",
    image: "https://images.unsplash.com/photo-1611162616305-c69b5031e2d1?w=800&h=400&fit=crop",
    date: "18 septembre 2025",
    author: "ThinkWell",
    category: "YouTube",
    slug: "optimiser-videos-youtube-algorithme",
    tags: ["YouTube", "SEO", "Algorithm", "Optimization"],
    readTime: 10
  },
  {
    id: 4,
    title: "Facebook : Stratégies de croissance pour les pages",
    excerpt: "Développez votre page Facebook avec des stratégies efficaces. Engagement, contenu viral, publicités : les meilleures pratiques pour 2025.",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=400&fit=crop",
    date: "15 septembre 2025",
    author: "ThinkWell",
    category: "Facebook",
    slug: "strategies-croissance-pages-facebook",
    tags: ["Facebook", "Growth", "Strategy", "Engagement"],
    readTime: 7
  },
  {
    id: 5,
    title: "Les erreurs à éviter sur les réseaux sociaux",
    excerpt: "Découvrez les pièges les plus courants sur les réseaux sociaux et comment les éviter. Conseils d'experts pour une stratégie social media réussie.",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=400&fit=crop",
    date: "12 septembre 2025",
    author: "ThinkWell",
    category: "Conseils",
    slug: "erreurs-eviter-reseaux-sociaux",
    tags: ["Social Media", "Mistakes", "Tips", "Strategy"],
    readTime: 5
  },
  {
    id: 6,
    title: "Comment créer du contenu engageant ?",
    excerpt: "Les secrets d'un contenu qui engage et convertit. Formats, timing, storytelling : tous les éléments pour captiver votre audience.",
    image: "https://images.unsplash.com/photo-1611162616305-c69b5031e2d1?w=800&h=400&fit=crop",
    date: "10 septembre 2025",
    author: "ThinkWell",
    category: "Conseils",
    slug: "creer-contenu-engageant",
    tags: ["Content", "Engagement", "Storytelling", "Strategy"],
    readTime: 6
  },
  {
    id: 7,
    title: "6 conseils pratiques pour augmenter le nombre d'abonnés Instagram",
    excerpt: "Découvrez 6 conseils essentiels pour développer votre audience Instagram. Contenu de qualité, engagement, hashtags et stratégies éprouvées pour attirer de nouveaux abonnés.",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=400&fit=crop",
    date: "25 janvier 2025",
    author: "Dr. Followers",
    category: "Instagram",
    slug: "6-conseils-augmenter-abonnes-instagram",
    tags: ["Instagram", "Abonnés", "Conseils", "Growth", "Engagement"],
    readTime: 5,
    content: `Instagram est une plateforme de réseau social très populaire, utilisée par des millions de personnes dans le monde entier. Si vous souhaitez augmenter votre nombre d'abonnés sur Instagram, voici quelques conseils qui pourraient vous aider :

## 1. Créez du contenu de qualité

Pour attirer de nouveaux abonnés, il est essentiel de publier du contenu de qualité qui intéresse votre audience cible. Prenez le temps de réfléchir à ce que vous voulez partager et à comment le présenter de manière attrayante. Utilisez des hashtags pertinents et des légendes qui incitent à l'engagement.

## 2. Soyez actif

Pour être visible sur Instagram, il est important de publier du contenu régulièrement. Essayez de publier au moins une fois par jour pour maintenir votre visibilité et montrer à votre audience que vous êtes actif. N'oubliez pas de varier votre contenu pour ne pas lasser vos abonnés.

## 3. Utilisez les bons hashtags

Les hashtags sont un moyen efficace de faire découvrir votre contenu à de nouvelles personnes. Utilisez des hashtags pertinents qui ciblent votre audience et qui sont populaires sur Instagram. N'hésitez pas à varier les hashtags pour toucher un public différent chaque jour.

## 4. Interagissez avec d'autres utilisateurs

Instagram est avant tout une plateforme de partage et d'interaction. Pour augmenter votre nombre d'abonnés, il est important de participer à la communauté en commentant et en likant les publications d'autres utilisateurs. Cela vous permettra de créer des liens et d'attirer l'attention sur votre compte.

## 5. Utilisez les fonctionnalités d'Instagram à votre avantage

Instagram met à disposition de nombreuses fonctionnalités pour aider les utilisateurs à se faire connaître. Par exemple, vous pouvez utiliser les stories pour partager du contenu supplémentaire et vous connecter avec votre audience. Vous pouvez également utiliser les différents filtres et outils de montage pour donner plus de dynamisme à vos publications.

## 6. Faites la promotion de votre compte

Pour attirer de nouveaux abonnés, il est important de faire la promotion de votre compte. Vous pouvez utiliser vos autres réseaux sociaux pour partager vos publications Instagram et inviter vos amis à vous suivre. Vous pouvez également participer à des collaborations avec d'autres utilisateurs et participer à des défis populaires sur Instagram.

## Conclusion

En suivant ces conseils, vous devriez être en mesure d'augmenter le nombre d'abonnés Instagram de votre compte. N'oubliez pas que vous pouvez vous faire accompagner par nos consultants pour développer votre compte au niveau supérieur !`
  }
];

// Fonction pour ajouter un nouvel article
export const addBlogPost = (newPost: Omit<BlogPost, 'id'>): BlogPost => {
  const id = Math.max(...blogPosts.map(post => post.id)) + 1;
  const post: BlogPost = { ...newPost, id };
  blogPosts.unshift(post); // Ajouter au début de la liste
  return post;
};

// Fonction pour obtenir un article par son slug
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

// Fonction pour obtenir les articles par catégorie
export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};

// Fonction pour rechercher des articles
export const searchBlogPosts = (query: string): BlogPost[] => {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Fonction pour obtenir les catégories disponibles
export const getCategories = (): string[] => {
  const categories = [...new Set(blogPosts.map(post => post.category))];
  return categories.sort();
};
