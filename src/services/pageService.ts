import { client } from '../../sanity/lib/client'
import { urlFor } from '../../sanity/lib/image'

// Requête GROQ pour récupérer la page d'accueil
const homePageQuery = `*[_type == "homePage" && published == true][0] {
  _id,
  title,
  hero,
  services,
  sectionTitles,
  benefits,
  faq,
  seo,
  openGraph,
  twitter,
  published
}`

// Requête GROQ pour récupérer la page Instagram Followers
const instagramFollowersPageQuery = `*[_type == "instagramFollowersPage" && published == true && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero {
    title,
    description
  },
  sectionTitles {
    testimonials,
    security,
    whyBuy
  },
  followerTypes {
    international {
      title,
      descriptions
    },
    french {
      title,
      descriptions
    }
  },
  securitySection {
    serviceClient {
      title,
      description
    },
    remboursement {
      title,
      description
    },
    paiements {
      title,
      description
    }
  },
  whyBuySection {
    credibilite {
      title,
      description
    },
    explorer {
      title,
      description
    },
    communaute {
      title,
      description
    }
  },
  faq {
    questions[] {
      question,
      answer
    }
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl
  },
  openGraph {
    title,
    description,
    image {
      asset-> {
        _id,
        url
      }
    }
  },
  twitter {
    card,
    title,
    description,
    image {
      asset-> {
        _id,
        url
      }
    }
  },
  published
}`

// Requête GROQ pour récupérer la page Instagram Likes
const instagramLikesPageQuery = `*[_type == "instagramLikesPage" && published == true && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero {
    title,
    description
  },
  sectionTitles {
    testimonials,
    security,
    whyBuy
  },
  likeTypes {
    international {
      title,
      descriptions
    },
    french {
      title,
      descriptions
    }
  },
  securitySection {
    serviceClient {
      title,
      description
    },
    remboursement {
      title,
      description
    },
    paiements {
      title,
      description
    }
  },
  whyBuySection {
    engagement {
      title,
      description
    },
    portee {
      title,
      description
    },
    credibilite {
      title,
      description
    }
  },
  faq {
    questions[] {
      question,
      answer
    }
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl
  },
  openGraph {
    title,
    description,
    image {
      asset-> {
        _id,
        url
      }
    }
  },
  twitter {
    card,
    title,
    description,
    image {
      asset-> {
        _id,
        url
      }
    }
  },
  published
}`

// Requête GROQ pour récupérer la page Instagram Views
const instagramViewsPageQuery = `*[_type == "instagramViewsPage" && published == true && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero {
    title,
    description
  },
  sectionTitles {
    testimonials,
    security,
    whyBuy
  },
  viewTypes {
    international {
      title,
      descriptions
    },
    french {
      title,
      descriptions
    }
  },
  securitySection {
    serviceClient {
      title,
      description
    },
    remboursement {
      title,
      description
    },
    paiements {
      title,
      description
    }
  },
  whyBuySection {
    portee {
      title,
      description
    },
    visibilite {
      title,
      description
    },
    credibilite {
      title,
      description
    }
  },
  faq {
    questions[] {
      question,
      answer
    }
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl
  },
  openGraph {
    title,
    description,
    image {
      asset-> {
        _id,
        url
      }
    }
  },
  twitter {
    card,
    title,
    description,
    image {
      asset-> {
        _id,
        url
      }
    }
  },
  published
}`

// Requête GROQ pour récupérer la page Instagram Commentaires
const instagramCommentsPageQuery = `*[_type == "instagramCommentsPage" && published == true && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero {
    title,
    description
  },
  sectionTitles {
    testimonials,
    security,
    whyBuy
  },
  commentTypes {
    international {
      title,
      descriptions
    },
    french {
      title,
      descriptions
    }
  },
  securitySection {
    serviceClient {
      title,
      description
    },
    remboursement {
      title,
      description
    },
    paiements {
      title,
      description
    }
  },
  whyBuySection {
    items[] {
      title,
      description
    }
  },
  faq {
    questions[] {
      question,
      answer
    }
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl
  },
  openGraph {
    title,
    description,
    image {
      asset-> {
        _id,
        url
      }
    }
  },
  twitter {
    card,
    title,
    description,
    image {
      asset-> {
        _id,
        url
      }
    }
  },
  published
}`

// Requête GROQ pour récupérer une page par slug
const pageBySlugQuery = `*[_type == "page" && slug.current == $slug && published == true][0] {
  _id,
  title,
  slug,
  content,
  seo,
  published
}`

// Types pour les données de page
export interface HomePageData {
  _id: string
  title: string
  hero?: {
    title?: string
    subtitle?: string
    description?: string
  }
  services?: {
    title?: string
  }
  sectionTitles?: {
    whyBuy?: string
    howItWorks?: string
    advantages?: string
    whyChoose?: string
    faq?: string
  }
  benefits?: {
    items?: Array<{
      title?: string
      description?: string
      icon?: string
    }>
  }
  faq?: {
    questions?: Array<{
      question?: string
      answer?: string
    }>
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    canonicalUrl?: string
  }
  openGraph?: {
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
    }
  }
  twitter?: {
    card?: string
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
    }
  }
  published?: boolean
}

export interface InstagramLikesPageData {
  _id: string
  title: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
  }
  sectionTitles?: {
    testimonials?: string
    security?: string
    whyBuy?: string
  }
  likeTypes?: {
    international?: {
      title?: string
      descriptions?: string[]
    }
    french?: {
      title?: string
      descriptions?: string[]
    }
  }
  securitySection?: {
    serviceClient?: {
      title?: string
      description?: string
    }
    remboursement?: {
      title?: string
      description?: string
    }
    paiements?: {
      title?: string
      description?: string
    }
  }
  whyBuySection?: {
    engagement?: {
      title?: string
      description?: string
    }
    portee?: {
      title?: string
      description?: string
    }
    credibilite?: {
      title?: string
      description?: string
    }
  }
  faq?: {
    questions?: Array<{
      question?: string
      answer?: string
    }>
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    canonicalUrl?: string
  }
  openGraph?: {
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
      url?: string
    }
  }
  twitter?: {
    card?: string
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
      url?: string
    }
  }
  published?: boolean
}

export interface InstagramViewsPageData {
  _id: string
  title: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
  }
  sectionTitles?: {
    testimonials?: string
    security?: string
    whyBuy?: string
  }
  viewTypes?: {
    international?: {
      title?: string
      descriptions?: string[]
    }
    french?: {
      title?: string
      descriptions?: string[]
    }
  }
  securitySection?: {
    serviceClient?: {
      title?: string
      description?: string
    }
    remboursement?: {
      title?: string
      description?: string
    }
    paiements?: {
      title?: string
      description?: string
    }
  }
  whyBuySection?: {
    portee?: {
      title?: string
      description?: string
    }
    visibilite?: {
      title?: string
      description?: string
    }
    credibilite?: {
      title?: string
      description?: string
    }
  }
  faq?: {
    questions?: Array<{
      question?: string
      answer?: string
    }>
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    canonicalUrl?: string
  }
  openGraph?: {
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
      url?: string
    }
  }
  twitter?: {
    card?: string
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
      url?: string
    }
  }
  published?: boolean
}

export interface InstagramCommentsPageData {
  _id: string
  title: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
  }
  sectionTitles?: {
    testimonials?: string
    security?: string
    whyBuy?: string
  }
  commentTypes?: {
    international?: {
      title?: string
      descriptions?: string[]
    }
    french?: {
      title?: string
      descriptions?: string[]
    }
  }
  securitySection?: {
    serviceClient?: {
      title?: string
      description?: string
    }
    remboursement?: {
      title?: string
      description?: string
    }
    paiements?: {
      title?: string
      description?: string
    }
  }
  whyBuySection?: {
    items?: Array<{
      title?: string
      description?: string
    }>
  }
  faq?: {
    questions?: Array<{
      question?: string
      answer?: string
    }>
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    canonicalUrl?: string
  }
  openGraph?: {
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
      url?: string
    }
  }
  twitter?: {
    card?: string
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
      url?: string
    }
  }
  published?: boolean
}

export interface InstagramFollowersPageData {
  _id: string
  title: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
  }
  sectionTitles?: {
    testimonials?: string
    security?: string
    whyBuy?: string
  }
  followerTypes?: {
    international?: {
      title?: string
      descriptions?: string[]
    }
    french?: {
      title?: string
      descriptions?: string[]
    }
  }
  securitySection?: {
    serviceClient?: {
      title?: string
      description?: string
    }
    remboursement?: {
      title?: string
      description?: string
    }
    paiements?: {
      title?: string
      description?: string
    }
  }
  whyBuySection?: {
        credibilite?: {
          title?: string
          description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
        }
        explorer?: {
          title?: string
          description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
        }
        communaute?: {
          title?: string
          description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
        }
  }
  faq?: {
    questions?: Array<{
      question?: string
      answer?: string
    }>
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    canonicalUrl?: string
  }
  openGraph?: {
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
      url?: string
    }
  }
  twitter?: {
    card?: string
    title?: string
    description?: string
    image?: {
      asset?: {
        url?: string
      }
      url?: string
    }
  }
  published?: boolean
}

export interface PageData {
  _id: string
  title: string
  slug: {
    current: string
  }
  content?: any[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  published?: boolean
}

export class PageService {
  /**
   * Récupère les données de la page d'accueil
   */
  static async getHomePage(): Promise<HomePageData | null> {
    try {
      const data = await client.fetch(homePageQuery)
      if (!data) return null
      
      // Transformer l'image Open Graph si elle existe
      if (data.openGraph?.image?.asset) {
        data.openGraph.image.url = urlFor(data.openGraph.image).url()
      }
      
      // Transformer l'image Twitter si elle existe
      if (data.twitter?.image?.asset) {
        data.twitter.image.url = urlFor(data.twitter.image).url()
      }
      
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de la page d\'accueil:', error)
      return null
    }
  }

  /**
   * Récupère la page Instagram Commentaires
   */
  static async getInstagramCommentsPage(): Promise<InstagramCommentsPageData | null> {
    try {
      const data = await client.fetch(instagramCommentsPageQuery)
      console.log('🔍 Instagram Comments - Données brutes de Sanity:', data)
      if (!data || !data._id) {
        console.warn('⚠️ Aucun document Instagram Comments trouvé dans Sanity')
        return null
      }
      
      console.log('✅ Instagram Comments - Hero:', data.hero)
      console.log('✅ Instagram Comments - Hero Title:', data.hero?.title)
      console.log('✅ Instagram Comments - Hero Description:', data.hero?.description)
      
      // Transformer l'image Open Graph si elle existe
      if (data.openGraph?.image?.asset) {
        data.openGraph.image.url = urlFor(data.openGraph.image).url()
      }
      
      // Transformer l'image Twitter si elle existe
      if (data.twitter?.image?.asset) {
        data.twitter.image.url = urlFor(data.twitter.image).url()
      }
      
      return data
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la page Instagram Commentaires:', error)
      return null
    }
  }

  /**
   * Récupère la page Instagram Followers
   */
  static async getInstagramFollowersPage(): Promise<InstagramFollowersPageData | null> {
    try {
      const data = await client.fetch(instagramFollowersPageQuery)
      if (!data || !data._id) return null
      
      if (data.openGraph?.image?.asset) {
        data.openGraph.image.url = urlFor(data.openGraph.image).url()
      }
      if (data.twitter?.image?.asset) {
        data.twitter.image.url = urlFor(data.twitter.image).url()
      }
      
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de la page Instagram Followers:', error)
      return null
    }
  }

  /**
   * Récupère la page Instagram Likes
   */
  static async getInstagramLikesPage(): Promise<InstagramLikesPageData | null> {
    try {
      const data = await client.fetch(instagramLikesPageQuery)
      if (!data || !data._id) return null
      
      if (data.openGraph?.image?.asset) {
        data.openGraph.image.url = urlFor(data.openGraph.image).url()
      }
      if (data.twitter?.image?.asset) {
        data.twitter.image.url = urlFor(data.twitter.image).url()
      }
      
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de la page Instagram Likes:', error)
      return null
    }
  }

  /**
   * Récupère la page Instagram Views
   */
  static async getInstagramViewsPage(): Promise<InstagramViewsPageData | null> {
    try {
      const data = await client.fetch(instagramViewsPageQuery)
      if (!data || !data._id) return null
      
      if (data.openGraph?.image?.asset) {
        data.openGraph.image.url = urlFor(data.openGraph.image).url()
      }
      if (data.twitter?.image?.asset) {
        data.twitter.image.url = urlFor(data.twitter.image).url()
      }
      
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de la page Instagram Views:', error)
      return null
    }
  }

  /**
   * Récupère une page par son slug
   */
  static async getPageBySlug(slug: string): Promise<PageData | null> {
    try {
      const page = await client.fetch(pageBySlugQuery, { slug })
      if (!page) return null
      return page
    } catch (error) {
      console.error('Erreur lors de la récupération de la page:', error)
      return null
    }
  }
}

