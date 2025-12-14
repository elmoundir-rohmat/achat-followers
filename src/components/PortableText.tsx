import { PortableText as SanityPortableText, PortableTextComponents } from '@portabletext/react'
import { PortableTextBlock } from '@portabletext/types'

interface PortableTextProps {
  content: PortableTextBlock[] | null | undefined
  className?: string
}

/**
 * Composant pour rendre le contenu riche de Sanity (blockContent)
 * Supporte : gras, italique, souligné, liens, listes, etc.
 */
export default function PortableText({ content, className = '' }: PortableTextProps) {
  if (!content || content.length === 0) {
    return null
  }

  const components: PortableTextComponents = {
    // Styles de texte
    marks: {
      // Gras
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      // Italique
      em: ({ children }) => <em className="italic">{children}</em>,
      // Code
      code: ({ children }) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
      ),
      // Liens
      link: ({ value, children }) => {
        const href = value?.href || '#'
        const isExternal = href.startsWith('http')
        return (
          <a
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-soft-pink-600 hover:text-soft-pink-700 font-semibold underline transition-colors"
          >
            {children}
          </a>
        )
      },
      // Souligné (si vous l'ajoutez dans Sanity)
      underline: ({ children }) => <span className="underline">{children}</span>,
    },
    // Blocs de texte
    block: {
      // Paragraphe normal
      normal: ({ children }) => (
        <p className="mb-4 leading-relaxed text-slate-600">{children}</p>
      ),
      // Titres
      h1: ({ children }) => (
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-4 mt-6">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-3 mt-5">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2 mt-4">{children}</h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 mt-3">{children}</h4>
      ),
      // Citation
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-soft-pink-400 pl-4 py-2 mb-4 bg-soft-pink-50 italic text-slate-700">
          {children}
        </blockquote>
      ),
    },
    // Listes
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside mb-4 space-y-2 text-slate-600">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-600">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="ml-4">{children}</li>,
      number: ({ children }) => <li className="ml-4">{children}</li>,
    },
  }

  return (
    <div className={className}>
      <SanityPortableText value={content} components={components} />
    </div>
  )
}

