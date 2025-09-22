import { BlogMetadata, BlogPost, Author, BlogFilters, BlogSearchParams } from '../types/blog';
import { getBlogMetadata, getBlogMetadataBySlug } from '../data/blog/metadata';
import { getAuthorById } from '../data/authors';

// Cache pour les contenus chargés
const contentCache = new Map<number, string>();

// Service pour gérer les articles de blog
export class BlogService {
  /**
   * Récupère tous les articles avec leurs métadonnées
   */
  static async getBlogPosts(filters?: BlogFilters): Promise<BlogMetadata[]> {
    let posts = getBlogMetadata();

    // Filtrer par catégorie
    if (filters?.category) {
      posts = posts.filter(post => post.category === filters.category);
    }

    // Filtrer par auteur
    if (filters?.author) {
      posts = posts.filter(post => post.authorId === filters.author);
    }

    // Filtrer par tags
    if (filters?.tags && filters.tags.length > 0) {
      posts = posts.filter(post => 
        filters.tags!.some(tag => post.tags.includes(tag))
      );
    }

    // Filtrer par featured
    if (filters?.featured !== undefined) {
      posts = posts.filter(post => post.featured === filters.featured);
    }

    // Filtrer par published
    if (filters?.published !== undefined) {
      posts = posts.filter(post => post.published === filters.published);
    }

    return posts;
  }

  /**
   * Récupère un article complet par son slug
   */
  static async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const metadata = getBlogMetadataBySlug(slug);
    if (!metadata) {
      return null;
    }

    const author = getAuthorById(metadata.authorId);
    const content = await this.getBlogContent(metadata.id);

    return {
      ...metadata,
      author,
      content
    };
  }

  /**
   * Récupère le contenu d'un article (avec cache)
   */
  static async getBlogContent(articleId: number): Promise<string> {
    // Vérifier le cache
    if (contentCache.has(articleId)) {
      return contentCache.get(articleId)!;
    }

    try {
      // Contenu spécifique pour l'article 7
      if (articleId === 7) {
        const content = `# 6 conseils pratiques pour augmenter le nombre d'abonnés Instagram

Instagram est une plateforme de réseau social très populaire, utilisée par des millions de personnes dans le monde entier. Si vous souhaitez augmenter votre nombre d'abonnés sur Instagram, voici quelques conseils qui pourraient vous aider :

> **Note importante** : Ces conseils sont basés sur des méthodes légitimes et durables pour développer votre audience Instagram de manière organique.

## 1. Créez du contenu de qualité

Pour attirer de nouveaux abonnés, il est essentiel de publier du contenu de qualité qui intéresse votre audience cible. Prenez le temps de réfléchir à ce que vous voulez partager et à comment le présenter de manière attrayante. Utilisez des hashtags pertinents et des légendes qui incitent à l'engagement.

### Conseils pratiques pour un contenu de qualité :

- **Photos nettes et bien éclairées** : Utilisez la lumière naturelle quand c'est possible
- **Cohérence visuelle** : Développez un style unique et reconnaissable
- **Légendes engageantes** : Posez des questions, racontez une histoire
- **Hashtags stratégiques** : Mélangez des hashtags populaires et de niche

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

## 7. Utilisez les Reels pour maximiser votre portée

Les Reels Instagram sont devenus un outil puissant pour augmenter votre visibilité. Créez du contenu court, engageant et tendance qui peut être découvert par de nouveaux utilisateurs. Utilisez des musiques populaires, des effets créatifs et des hashtags pertinents pour maximiser vos chances d'apparaître dans l'onglet "Explorer".

## 8. Analysez vos performances

Utilisez les statistiques Instagram pour comprendre ce qui fonctionne le mieux avec votre audience. Identifiez les types de contenu qui génèrent le plus d'engagement et adaptez votre stratégie en conséquence.

## Conclusion

En suivant ces conseils, vous devriez être en mesure d'augmenter le nombre d'abonnés Instagram de votre compte. N'oubliez pas que vous pouvez vous faire accompagner par nos consultants pour développer votre compte au niveau supérieur !`;

        // Mettre en cache
        contentCache.set(articleId, content);
        return content;
      }

      // Message pour les articles non disponibles
      const content = `# Article non disponible

Cet article est en cours de rédaction et sera bientôt disponible.

## Que faire en attendant ?

- Consultez nos autres articles de blog
- Découvrez nos services Instagram
- Contactez-nous pour toute question

Merci de votre compréhension !`;

      // Mettre en cache
      contentCache.set(articleId, content);
      
      return content;
    } catch (error) {
      console.error(`Error loading content for article ${articleId}:`, error);
      return 'Contenu non disponible.';
    }
  }

  /**
   * Recherche dans les articles
   */
  static async searchBlogPosts(params: BlogSearchParams): Promise<BlogMetadata[]> {
    let posts = await this.getBlogPosts(params.filters);

    // Recherche textuelle
    if (params.query) {
      const query = params.query.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Tri
    if (params.sortBy) {
      posts.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (params.sortBy) {
          case 'date':
            aValue = new Date(a.date);
            bValue = new Date(b.date);
            break;
          case 'title':
            aValue = a.title;
            bValue = b.title;
            break;
          case 'readTime':
            aValue = a.readTime;
            bValue = b.readTime;
            break;
          default:
            return 0;
        }

        if (params.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Pagination
    if (params.page && params.limit) {
      const start = (params.page - 1) * params.limit;
      const end = start + params.limit;
      posts = posts.slice(start, end);
    }

    return posts;
  }

  /**
   * Récupère les catégories disponibles
   */
  static async getCategories(): Promise<string[]> {
    const posts = getBlogMetadata();
    const categories = [...new Set(posts.map(post => post.category))];
    return categories.sort();
  }

  /**
   * Récupère les tags disponibles
   */
  static async getTags(): Promise<string[]> {
    const posts = getBlogMetadata();
    const allTags = posts.flatMap(post => post.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }

  /**
   * Récupère les articles mis en avant
   */
  static async getFeaturedPosts(): Promise<BlogMetadata[]> {
    return this.getBlogPosts({ featured: true });
  }

  /**
   * Récupère les articles récents
   */
  static async getRecentPosts(limit: number = 5): Promise<BlogMetadata[]> {
    const posts = await this.getBlogPosts();
    return posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  /**
   * Récupère les articles par auteur
   */
  static async getPostsByAuthor(authorId: string): Promise<BlogMetadata[]> {
    return this.getBlogPosts({ author: authorId });
  }

  /**
   * Récupère les articles par catégorie
   */
  static async getPostsByCategory(category: string): Promise<BlogMetadata[]> {
    return this.getBlogPosts({ category });
  }
}

// Export des fonctions utilitaires pour la compatibilité
export const getBlogPostBySlug = BlogService.getBlogPostBySlug;
export const searchBlogPosts = BlogService.searchBlogPosts;
export const getCategories = BlogService.getCategories;
