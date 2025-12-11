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

