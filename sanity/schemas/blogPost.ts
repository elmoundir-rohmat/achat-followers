import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Article de Blog',
  type: 'document',
  icon: () => '📝',
  fields: [
    // Informations de base
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required().max(100).warning('Le titre devrait être court pour le SEO'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait / Description courte',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200).warning('L\'extrait devrait faire moins de 200 caractères'),
    }),
    defineField({
      name: 'image',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texte alternatif (SEO)',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Contenu (Markdown)',
      type: 'text',
      rows: 20,
      description: 'Vous pouvez utiliser Markdown pour formater le texte',
      validation: (Rule) => Rule.required(),
    }),
    
    // Auteur et catégorie
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
    }),
    
    // Dates
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Date de mise à jour',
      type: 'datetime',
    }),
    
    // SEO - Meta Tags
    defineField({
      name: 'seo',
      title: 'Réglages SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Titre SEO (meta title)',
          type: 'string',
          description: '50-60 caractères recommandés',
          validation: (Rule) => Rule.max(60).warning('Le titre SEO devrait faire moins de 60 caractères'),
        },
        {
          name: 'metaDescription',
          title: 'Description SEO (meta description)',
          type: 'text',
          rows: 3,
          description: '150-160 caractères recommandés',
          validation: (Rule) => Rule.max(160).warning('La description devrait faire moins de 160 caractères'),
        },
        {
          name: 'focusKeyword',
          title: 'Mot-clé principal',
          type: 'string',
        },
        {
          name: 'keywords',
          title: 'Mots-clés secondaires',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'canonicalUrl',
          title: 'URL canonique',
          type: 'url',
          description: 'Ex: https://doctorfollowers.com/blogs/mon-article',
        },
        {
          name: 'noIndex',
          title: 'Ne pas indexer (noindex)',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'noFollow',
          title: 'Ne pas suivre les liens (nofollow)',
          type: 'boolean',
          initialValue: false,
        },
      ],
    }),
    
    // Open Graph (Facebook, LinkedIn)
    defineField({
      name: 'openGraph',
      title: 'Open Graph (Réseaux sociaux)',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre OG',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description OG',
          type: 'text',
          rows: 2,
        },
        {
          name: 'image',
          title: 'Image OG',
          type: 'image',
          options: {
            hotspot: true,
          },
          description: 'Image pour le partage sur les réseaux sociaux (1200x630px recommandé)',
        },
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          initialValue: 'article',
          options: {
            list: [
              { title: 'Article', value: 'article' },
              { title: 'Site web', value: 'website' },
            ],
          },
        },
      ],
    }),
    
    // Twitter Card
    defineField({
      name: 'twitter',
      title: 'Twitter Card',
      type: 'object',
      fields: [
        {
          name: 'card',
          title: 'Type de carte',
          type: 'string',
          initialValue: 'summary_large_image',
          options: {
            list: [
              { title: 'Résumé', value: 'summary' },
              { title: 'Résumé avec grande image', value: 'summary_large_image' },
            ],
          },
        },
        {
          name: 'title',
          title: 'Titre Twitter',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description Twitter',
          type: 'text',
          rows: 2,
        },
        {
          name: 'image',
          title: 'Image Twitter',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'creator',
          title: 'Créateur Twitter (@username)',
          type: 'string',
        },
      ],
    }),
    
    // Statut et métadonnées
    defineField({
      name: 'published',
      title: 'Publié',
      type: 'boolean',
      initialValue: false,
      description: 'Cochez cette case pour publier l\'article',
    }),
    defineField({
      name: 'featured',
      title: 'Article mis en avant',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'readTime',
      title: 'Temps de lecture (minutes)',
      type: 'number',
      initialValue: 5,
    }),
    
    // Relations
    defineField({
      name: 'relatedPosts',
      title: 'Articles liés',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blogPost' }] }],
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'image',
      published: 'published',
    },
    prepare({ title, author, media, published }) {
      return {
        title: title,
        subtitle: `${author || 'Aucun auteur'} • ${published ? '✅ Publié' : '⏳ Brouillon'}`,
        media: media,
      }
    },
  },
  
  orderings: [
    {
      title: 'Date de publication, Nouveau',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Date de publication, Ancien',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
})

