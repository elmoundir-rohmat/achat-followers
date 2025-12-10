import { client } from '../../sanity/lib/client'
import { urlFor } from '../../sanity/lib/image'
import { BlogPost, BlogMetadata } from '../lib/blog/blogTypes'

// Requête GROQ pour récupérer tous les articles publiés
// Note: Sanity a deux concepts : le statut Draft/Published ET le champ boolean "published"
// On filtre sur les deux pour être sûr
const blogPostsQuery = `*[_type == "blogPost" && !(_id in path("drafts.**")) && published == true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  "image": image.asset->url,
  "imageAlt": image.alt,
  publishedAt,
  updatedAt,
  "author": author->name,
  "authorId": author->_id,
  "category": category->name,
  "tags": tags[]->name,
  readTime,
  featured,
  seo,
  openGraph,
  twitter,
  "relatedPosts": relatedPosts[]->slug.current,
  published,
  content
}`

// Requête de test pour voir tous les articles (même non publiés et drafts)
const testQuery = `*[_type == "blogPost"] {
  _id,
  title,
  published,
  "author": author->name,
  "category": category->name,
  "isDraft": _id in path("drafts.**")
}`

// Requête GROQ pour un article spécifique
// Exclut les drafts et vérifie le champ published
const blogPostBySlugQuery = `*[_type == "blogPost" && !(_id in path("drafts.**")) && slug.current == $slug && published == true][0] {
  _id,
  title,
  slug,
  excerpt,
  content,
  "image": image.asset->url,
  "imageAlt": image.alt,
  publishedAt,
  updatedAt,
  "author": author->name,
  "authorId": author->_id,
  "category": category->name,
  "tags": tags[]->name,
  readTime,
  featured,
  seo,
  openGraph,
  twitter,
  "relatedPosts": relatedPosts[]->slug.current
}`

// Transformer les données Sanity en format BlogPost
function transformSanityPostToBlogPost(sanityPost: any): BlogPost {
  // Générer un ID numérique à partir de l'ID Sanity
  const numericId = parseInt(sanityPost._id.replace(/[^0-9]/g, '').slice(0, 10)) || Date.now()
  
  return {
    id: numericId,
    title: sanityPost.title,
    excerpt: sanityPost.excerpt,
    image: sanityPost.image || '',
    date: sanityPost.publishedAt || new Date().toISOString(),
    author: sanityPost.author || 'Auteur inconnu',
    category: sanityPost.category || 'Non catégorisé',
    slug: sanityPost.slug?.current || '',
    content: sanityPost.content || '',
    tags: sanityPost.tags || [],
    readTime: sanityPost.readTime || 5,
    featured: sanityPost.featured || false,
    published: true,
    updatedAt: sanityPost.updatedAt || sanityPost.publishedAt,
    views: 0,
    likes: 0,
    comments: 0,
    seo: {
      metaTitle: sanityPost.seo?.metaTitle || sanityPost.title,
      metaDescription: sanityPost.seo?.metaDescription || sanityPost.excerpt,
      focusKeyword: sanityPost.seo?.focusKeyword || '',
      keywords: sanityPost.seo?.keywords || [],
      canonicalUrl: sanityPost.seo?.canonicalUrl || `https://doctorfollowers.com/blogs/${sanityPost.slug?.current}`,
      imageAlt: sanityPost.imageAlt || sanityPost.title,
      noIndex: sanityPost.seo?.noIndex || false,
      noFollow: sanityPost.seo?.noFollow || false,
    },
    openGraph: sanityPost.openGraph ? {
      title: sanityPost.openGraph.title || sanityPost.title,
      description: sanityPost.openGraph.description || sanityPost.excerpt,
      image: sanityPost.openGraph.image?.asset?.url || sanityPost.image || '',
      type: sanityPost.openGraph.type || 'article',
      url: sanityPost.openGraph.url || `https://doctorfollowers.com/blogs/${sanityPost.slug?.current}`,
    } : undefined,
    twitter: sanityPost.twitter ? {
      card: sanityPost.twitter.card || 'summary_large_image',
      title: sanityPost.twitter.title || sanityPost.title,
      description: sanityPost.twitter.description || sanityPost.excerpt,
      image: sanityPost.twitter.image?.asset?.url || sanityPost.image || '',
      creator: sanityPost.twitter.creator || '@doctorfollowers',
    } : undefined,
    relatedPosts: sanityPost.relatedPosts || [],
    wordCount: sanityPost.content ? sanityPost.content.split(/\s+/).length : 0,
    readingTime: sanityPost.readTime || 5,
  }
}

function transformToBlogMetadata(sanityPost: any): BlogMetadata {
  const slug = sanityPost.slug?.current || sanityPost.slug || ''
  
  // Debug pour voir ce qui est reçu
  if (!slug) {
    console.warn('⚠️ Article sans slug:', {
      _id: sanityPost._id,
      title: sanityPost.title,
      slug: sanityPost.slug
    })
  }
  
  return {
    id: sanityPost._id,
    title: sanityPost.title,
    excerpt: sanityPost.excerpt,
    image: sanityPost.image || '',
    date: sanityPost.publishedAt || new Date().toISOString(),
    author: sanityPost.author || 'Auteur inconnu',
    authorId: sanityPost.authorId || '',
    category: sanityPost.category || 'Non catégorisé',
    slug: slug,
    tags: sanityPost.tags || [],
    readTime: sanityPost.readTime || 5,
    featured: sanityPost.featured || false,
    published: true,
    views: 0,
    likes: 0,
  }
}


export class SanityService {
  /**
   * Récupère tous les articles de blog publiés
   */
  static async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const posts = await client.fetch(blogPostsQuery)
      return posts.map(transformSanityPostToBlogPost)
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error)
      return []
    }
  }

  /**
   * Récupère un article par son slug
   */
  static async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const post = await client.fetch(blogPostBySlugQuery, { slug })
      if (!post) return null
      return transformSanityPostToBlogPost(post)
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error)
      return null
    }
  }

  /**
   * Récupère les métadonnées de tous les articles (pour la liste)
   */
  static async getBlogMetadata(): Promise<BlogMetadata[]> {
    try {
      // Test : récupérer tous les articles pour voir ce qui existe
      const allPosts = await client.fetch(testQuery)
      console.log('🔍 Tous les articles dans Sanity:', allPosts)
      console.log('🔍 Nombre d\'articles:', allPosts.length)
      console.log('🔍 Dataset utilisé:', client.config().dataset)
      
      // Maintenant récupérer seulement les publiés
      const posts = await client.fetch(blogPostsQuery)
      console.log('✅ Articles publiés récupérés:', posts)
      console.log('✅ Nombre d\'articles publiés:', posts.length)
      
      // Debug détaillé
      if (posts.length > 0) {
        console.log('📄 Détails du premier article:', {
          title: posts[0].title,
          published: posts[0].published,
          author: posts[0].author,
          category: posts[0].category,
          slug: posts[0].slug
        })
      }
      
      if (posts.length === 0 && allPosts.length > 0) {
        console.warn('⚠️ Des articles existent mais ne sont pas publiés. Vérifiez la case "Publié" dans Sanity Studio.')
        console.log('🔍 Détails de l\'article non publié:', {
          title: allPosts[0].title,
          published: allPosts[0].published,
          author: allPosts[0].author,
          category: allPosts[0].category
        })
      }
      
      return posts.map(transformToBlogMetadata)
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées:', error)
      return []
    }
  }
}

