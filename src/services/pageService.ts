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
  pageH1,
  hero {
    title,
    description,
    image {
      asset-> {
        _id,
        url
      },
      alt
    }
  },
  sectionTitles {
    testimonials,
    security,
    whyBuy
  },
  followerTypes {
    international {
      title,
      descriptions,
      exampleImage {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    french {
      title,
      descriptions,
      exampleImage {
        asset-> {
          _id,
          url
        },
        alt
      }
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
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    explorer {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    communaute {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  },
  contentBeforeFaq,
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
    description,
    image {
      asset-> {
        _id,
        url
      },
      alt
    }
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
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    portee {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    credibilite {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  },
  contentBeforeFaq,
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
    description,
    image {
      asset-> {
        _id,
        url
      },
      alt
    }
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
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    visibilite {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    credibilite {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  },
  contentBeforeFaq,
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

// Requête GROQ pour récupérer la page Générateur de Police Instagram
const fontGeneratorPageQuery = `*[_type == "fontGeneratorPage" && published == true && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero {
    title,
    description
  },
  h2BeforeGenerator,
  contentAfterGenerator,
  faq {
    title,
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
    description,
    image {
      asset-> {
        _id,
        url
      },
      alt
    }
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
    engagement {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    portee {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    credibilite {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  },
  contentBeforeFaq,
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

// Requête GROQ pour récupérer la page TikTok Followers
const tiktokFollowersPageQuery = `*[_type == "tiktokFollowersPage" && published == true && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero {
    title,
    description,
    image {
      asset-> {
        _id,
        url
      },
      alt
    }
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
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    explorer {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    communaute {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  },
  contentBeforeFaq,
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

// Requête GROQ pour récupérer la page TikTok Likes
const tiktokLikesPageQuery = `*[_type == "tiktokLikesPage" && published == true && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero {
    title,
    description,
    image {
      asset-> {
        _id,
        url
      },
      alt
    }
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
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    portee {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    credibilite {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  },
  contentBeforeFaq,
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

// Requête GROQ pour récupérer la page TikTok Comments
const tiktokCommentsPageQuery = `*[_type == "tiktokCommentsPage" && published == true && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero {
    title,
    description,
    image {
      asset-> {
        _id,
        url
      },
      alt
    }
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
    engagement {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    portee {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    credibilite {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  },
  contentBeforeFaq,
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

// Requête GROQ pour récupérer la page TikTok Views
const tiktokViewsPageQuery = `*[_type == "tiktokViewsPage" && published == true && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  hero {
    title,
    description,
    image {
      asset-> {
        _id,
        url
      },
      alt
    }
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
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    visibilite {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    },
    credibilite {
      title,
      description,
      image {
        asset-> {
          _id,
          url
        },
        alt
      }
    }
  },
  contentBeforeFaq,
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
    image?: {
      asset?: {
        url?: string
      }
      url?: string
      alt?: string
    }
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
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    portee?: {
      title?: string
      description?: string
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    credibilite?: {
      title?: string
      description?: string
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
  }
  contentBeforeFaq?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
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
    image?: {
      asset?: {
        url?: string
      }
      url?: string
      alt?: string
    }
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
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    visibilite?: {
      title?: string
      description?: string
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    credibilite?: {
      title?: string
      description?: string
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
  }
  contentBeforeFaq?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
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
    image?: {
      asset?: {
        url?: string
      }
      url?: string
      alt?: string
    }
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
    engagement?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    portee?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    credibilite?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
  }
  contentBeforeFaq?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
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
  pageH1?: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    image?: {
      asset?: {
        url?: string
      }
      url?: string
      alt?: string
    }
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
      exampleImage?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    french?: {
      title?: string
      descriptions?: string[]
      exampleImage?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
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
          image?: {
            asset?: {
              url?: string
            }
            url?: string
            alt?: string
          }
        }
        explorer?: {
          title?: string
          description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
          image?: {
            asset?: {
              url?: string
            }
            url?: string
            alt?: string
          }
        }
        communaute?: {
          title?: string
          description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
          image?: {
            asset?: {
              url?: string
            }
            url?: string
            alt?: string
          }
        }
  }
  contentBeforeFaq?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
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

export interface TikTokFollowersPageData {
  _id: string
  title: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    image?: {
      asset?: {
        url?: string
      }
      url?: string
      alt?: string
    }
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
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
    remboursement?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
    paiements?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
  }
  whyBuySection?: {
    credibilite?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    explorer?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    communaute?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
  }
  contentBeforeFaq?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
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

export interface TikTokLikesPageData {
  _id: string
  title: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    image?: {
      asset?: {
        url?: string
      }
      url?: string
      alt?: string
    }
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
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
    remboursement?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
    paiements?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
  }
  whyBuySection?: {
    engagement?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    portee?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    credibilite?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
  }
  contentBeforeFaq?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
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

export interface TikTokCommentsPageData {
  _id: string
  title: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    image?: {
      asset?: {
        url?: string
      }
      url?: string
      alt?: string
    }
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
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
    remboursement?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
    paiements?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
  }
  whyBuySection?: {
    engagement?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    portee?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    credibilite?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
  }
  contentBeforeFaq?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
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

export interface TikTokViewsPageData {
  _id: string
  title: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    image?: {
      asset?: {
        url?: string
      }
      url?: string
      alt?: string
    }
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
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
    remboursement?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
    paiements?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
    }
  }
  whyBuySection?: {
    portee?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    visibilite?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
    credibilite?: {
      title?: string
      description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
      image?: {
        asset?: {
          url?: string
        }
        url?: string
        alt?: string
      }
    }
  }
  contentBeforeFaq?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
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

export interface FontGeneratorPageData {
  _id: string
  title: string
  hero?: {
    title?: string
    description?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
  }
  h2BeforeGenerator?: string
  contentAfterGenerator?: any[] // Contenu riche (blockContent) de Sanity - supporte le formatage
  faq?: {
    title?: string
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
      if (!data || !data._id) {
        return null
      }
      
      // Transformer les URLs d'images
      if (data.hero?.image?.asset) {
        data.hero.image.url = urlFor(data.hero.image).url()
      }
      if (data.whyBuySection?.engagement?.image?.asset) {
        data.whyBuySection.engagement.image.url = urlFor(data.whyBuySection.engagement.image).url()
      }
      if (data.whyBuySection?.portee?.image?.asset) {
        data.whyBuySection.portee.image.url = urlFor(data.whyBuySection.portee.image).url()
      }
      if (data.whyBuySection?.credibilite?.image?.asset) {
        data.whyBuySection.credibilite.image.url = urlFor(data.whyBuySection.credibilite.image).url()
      }
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
      
      // Transformer les URLs d'images
      if (data.hero?.image?.asset) {
        data.hero.image.url = urlFor(data.hero.image).url()
      }
      if (data.whyBuySection?.credibilite?.image?.asset) {
        data.whyBuySection.credibilite.image.url = urlFor(data.whyBuySection.credibilite.image).url()
      }
      if (data.whyBuySection?.explorer?.image?.asset) {
        data.whyBuySection.explorer.image.url = urlFor(data.whyBuySection.explorer.image).url()
      }
      if (data.whyBuySection?.communaute?.image?.asset) {
        data.whyBuySection.communaute.image.url = urlFor(data.whyBuySection.communaute.image).url()
      }
      if (data.followerTypes?.international?.exampleImage?.asset) {
        data.followerTypes.international.exampleImage.url = urlFor(data.followerTypes.international.exampleImage).url()
      }
      if (data.followerTypes?.french?.exampleImage?.asset) {
        data.followerTypes.french.exampleImage.url = urlFor(data.followerTypes.french.exampleImage).url()
      }
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
   * Récupère la page TikTok Followers
   */
  static async getTikTokFollowersPage(): Promise<TikTokFollowersPageData | null> {
    try {
      const data = await client.fetch(tiktokFollowersPageQuery)
      if (!data || !data._id) return null
      
      // Transformer les URLs d'images
      if (data.hero?.image?.asset) {
        data.hero.image.url = urlFor(data.hero.image).url()
      }
      if (data.whyBuySection?.credibilite?.image?.asset) {
        data.whyBuySection.credibilite.image.url = urlFor(data.whyBuySection.credibilite.image).url()
      }
      if (data.whyBuySection?.explorer?.image?.asset) {
        data.whyBuySection.explorer.image.url = urlFor(data.whyBuySection.explorer.image).url()
      }
      if (data.whyBuySection?.communaute?.image?.asset) {
        data.whyBuySection.communaute.image.url = urlFor(data.whyBuySection.communaute.image).url()
      }
      if (data.openGraph?.image?.asset) {
        data.openGraph.image.url = urlFor(data.openGraph.image).url()
      }
      if (data.twitter?.image?.asset) {
        data.twitter.image.url = urlFor(data.twitter.image).url()
      }
      
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de la page TikTok Followers:', error)
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
      
      // Transformer les URLs d'images
      if (data.hero?.image?.asset) {
        data.hero.image.url = urlFor(data.hero.image).url()
      }
      if (data.whyBuySection?.engagement?.image?.asset) {
        data.whyBuySection.engagement.image.url = urlFor(data.whyBuySection.engagement.image).url()
      }
      if (data.whyBuySection?.portee?.image?.asset) {
        data.whyBuySection.portee.image.url = urlFor(data.whyBuySection.portee.image).url()
      }
      if (data.whyBuySection?.credibilite?.image?.asset) {
        data.whyBuySection.credibilite.image.url = urlFor(data.whyBuySection.credibilite.image).url()
      }
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
      
      // Transformer les URLs d'images
      if (data.hero?.image?.asset) {
        data.hero.image.url = urlFor(data.hero.image).url()
      }
      if (data.whyBuySection?.portee?.image?.asset) {
        data.whyBuySection.portee.image.url = urlFor(data.whyBuySection.portee.image).url()
      }
      if (data.whyBuySection?.visibilite?.image?.asset) {
        data.whyBuySection.visibilite.image.url = urlFor(data.whyBuySection.visibilite.image).url()
      }
      if (data.whyBuySection?.credibilite?.image?.asset) {
        data.whyBuySection.credibilite.image.url = urlFor(data.whyBuySection.credibilite.image).url()
      }
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
   * Récupère la page TikTok Likes
   */
  static async getTikTokLikesPage(): Promise<TikTokLikesPageData | null> {
    try {
      const data = await client.fetch(tiktokLikesPageQuery)
      if (!data || !data._id) return null
      
      // Transformer les URLs d'images
      if (data.hero?.image?.asset) {
        data.hero.image.url = urlFor(data.hero.image).url()
      }
      if (data.whyBuySection?.engagement?.image?.asset) {
        data.whyBuySection.engagement.image.url = urlFor(data.whyBuySection.engagement.image).url()
      }
      if (data.whyBuySection?.portee?.image?.asset) {
        data.whyBuySection.portee.image.url = urlFor(data.whyBuySection.portee.image).url()
      }
      if (data.whyBuySection?.credibilite?.image?.asset) {
        data.whyBuySection.credibilite.image.url = urlFor(data.whyBuySection.credibilite.image).url()
      }
      if (data.openGraph?.image?.asset) {
        data.openGraph.image.url = urlFor(data.openGraph.image).url()
      }
      if (data.twitter?.image?.asset) {
        data.twitter.image.url = urlFor(data.twitter.image).url()
      }
      
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de la page TikTok Likes:', error)
      return null
    }
  }

  /**
   * Récupère la page TikTok Comments
   */
  static async getTikTokCommentsPage(): Promise<TikTokCommentsPageData | null> {
    try {
      const data = await client.fetch(tiktokCommentsPageQuery)
      if (!data || !data._id) return null
      
      // Transformer les URLs d'images
      if (data.hero?.image?.asset) {
        data.hero.image.url = urlFor(data.hero.image).url()
      }
      if (data.whyBuySection?.engagement?.image?.asset) {
        data.whyBuySection.engagement.image.url = urlFor(data.whyBuySection.engagement.image).url()
      }
      if (data.whyBuySection?.portee?.image?.asset) {
        data.whyBuySection.portee.image.url = urlFor(data.whyBuySection.portee.image).url()
      }
      if (data.whyBuySection?.credibilite?.image?.asset) {
        data.whyBuySection.credibilite.image.url = urlFor(data.whyBuySection.credibilite.image).url()
      }
      if (data.openGraph?.image?.asset) {
        data.openGraph.image.url = urlFor(data.openGraph.image).url()
      }
      if (data.twitter?.image?.asset) {
        data.twitter.image.url = urlFor(data.twitter.image).url()
      }
      
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de la page TikTok Comments:', error)
      return null
    }
  }

  /**
   * Récupère la page TikTok Views
   */
  static async getTikTokViewsPage(): Promise<TikTokViewsPageData | null> {
    try {
      const data = await client.fetch(tiktokViewsPageQuery)
      if (!data || !data._id) return null
      
      // Transformer les URLs d'images
      if (data.hero?.image?.asset) {
        data.hero.image.url = urlFor(data.hero.image).url()
      }
      if (data.whyBuySection?.portee?.image?.asset) {
        data.whyBuySection.portee.image.url = urlFor(data.whyBuySection.portee.image).url()
      }
      if (data.whyBuySection?.visibilite?.image?.asset) {
        data.whyBuySection.visibilite.image.url = urlFor(data.whyBuySection.visibilite.image).url()
      }
      if (data.whyBuySection?.credibilite?.image?.asset) {
        data.whyBuySection.credibilite.image.url = urlFor(data.whyBuySection.credibilite.image).url()
      }
      if (data.openGraph?.image?.asset) {
        data.openGraph.image.url = urlFor(data.openGraph.image).url()
      }
      if (data.twitter?.image?.asset) {
        data.twitter.image.url = urlFor(data.twitter.image).url()
      }
      
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de la page TikTok Views:', error)
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

  /**
   * Récupère les données de la page Générateur de Police Instagram
   */
  static async getFontGeneratorPage(): Promise<FontGeneratorPageData | null> {
    try {
      const data = await client.fetch(fontGeneratorPageQuery)
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
      console.error('Erreur lors de la récupération de la page générateur de police:', error)
      return null
    }
  }
}

