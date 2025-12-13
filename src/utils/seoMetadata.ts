import { InstagramServicePageData } from '../services/pageService'

/**
 * Met à jour les métadonnées SEO dans le document head
 */
export function updateSEOMetadata(pageData: InstagramServicePageData | null) {
  if (!pageData?.seo) return

  // Titre de la page
  if (pageData.seo.metaTitle) {
    document.title = pageData.seo.metaTitle
  }

  // Meta description
  if (pageData.seo.metaDescription) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', pageData.seo.metaDescription)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = pageData.seo.metaDescription
      document.head.appendChild(meta)
    }
  }

  // Keywords
  if (pageData.seo.keywords && pageData.seo.keywords.length > 0) {
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', pageData.seo.keywords.join(', '))
    } else {
      const meta = document.createElement('meta')
      meta.name = 'keywords'
      meta.content = pageData.seo.keywords.join(', ')
      document.head.appendChild(meta)
    }
  }

  // Canonical URL
  if (pageData.seo.canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', pageData.seo.canonicalUrl)
    } else {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = pageData.seo.canonicalUrl
      document.head.appendChild(link)
    }
  }

  // Open Graph
  if (pageData.openGraph) {
    if (pageData.openGraph.title) {
      let ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', pageData.openGraph.title)
      } else {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:title')
        meta.content = pageData.openGraph.title
        document.head.appendChild(meta)
      }
    }

    if (pageData.openGraph.description) {
      let ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) {
        ogDesc.setAttribute('content', pageData.openGraph.description)
      } else {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:description')
        meta.content = pageData.openGraph.description
        document.head.appendChild(meta)
      }
    }

    if (pageData.openGraph.image?.url) {
      let ogImage = document.querySelector('meta[property="og:image"]')
      if (ogImage) {
        ogImage.setAttribute('content', pageData.openGraph.image.url)
      } else {
        const meta = document.createElement('meta')
        meta.setAttribute('property', 'og:image')
        meta.content = pageData.openGraph.image.url
        document.head.appendChild(meta)
      }
    }
  }

  // Twitter Card
  if (pageData.twitter) {
    if (pageData.twitter.card) {
      let twitterCard = document.querySelector('meta[name="twitter:card"]')
      if (twitterCard) {
        twitterCard.setAttribute('content', pageData.twitter.card)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'twitter:card'
        meta.content = pageData.twitter.card
        document.head.appendChild(meta)
      }
    }

    if (pageData.twitter.title) {
      let twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) {
        twitterTitle.setAttribute('content', pageData.twitter.title)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'twitter:title'
        meta.content = pageData.twitter.title
        document.head.appendChild(meta)
      }
    }

    if (pageData.twitter.description) {
      let twitterDesc = document.querySelector('meta[name="twitter:description"]')
      if (twitterDesc) {
        twitterDesc.setAttribute('content', pageData.twitter.description)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'twitter:description'
        meta.content = pageData.twitter.description
        document.head.appendChild(meta)
      }
    }

    if (pageData.twitter.image?.url) {
      let twitterImage = document.querySelector('meta[name="twitter:image"]')
      if (twitterImage) {
        twitterImage.setAttribute('content', pageData.twitter.image.url)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'twitter:image'
        meta.content = pageData.twitter.image.url
        document.head.appendChild(meta)
      }
    }
  }
}

