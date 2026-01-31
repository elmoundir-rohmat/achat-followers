import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'captionGeneratorPage',
  title: 'Page Générateur de Captions Instagram',
  type: 'document',
  icon: () => '📝',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      initialValue: 'Page Générateur de Captions Instagram',
      readOnly: true,
    }),

    // Section Hero - SEO
    defineField({
      name: 'hero',
      title: 'Section Hero - SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre Principal (H1)',
          type: 'string',
          description: 'Le titre principal H1 de la page - Important pour le SEO',
          initialValue: 'Générateur de captions Instagram',
        },
        {
          name: 'description',
          title: 'Description (Paragraphe sous H1)',
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Description importante pour le SEO - visible sous le titre. Supporte le formatage : gras, italique, liens, etc.',
        },
      ],
    }),

    // H2 avant le générateur - SEO
    defineField({
      name: 'h2BeforeGenerator',
      title: 'Titre H2 avant le générateur',
      type: 'string',
      description: 'Titre H2 qui apparaît après la description et avant l\'outil de génération. Important pour le SEO.',
    }),

    // Contenu enrichi après le générateur - SEO
    defineField({
      name: 'contentAfterGenerator',
      title: 'Contenu enrichi après le générateur',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Contenu riche qui apparaît après l\'outil de génération. Supporte le formatage : gras, italique, liens, listes, etc. Important pour le SEO.',
    }),

    // Section FAQ - SEO Important
    defineField({
      name: 'faq',
      title: 'Section FAQ - SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre de la section FAQ',
          type: 'string',
          description: 'Titre H2 de la section FAQ (ex: "Questions fréquentes")',
        },
        {
          name: 'questions',
          title: 'Questions Fréquentes',
          type: 'array',
          description: 'Les FAQ sont importantes pour le SEO (rich snippets)',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'question',
                  title: 'Question',
                  type: 'string',
                  description: 'Question visible par Google (rich snippets)',
                },
                {
                  name: 'answer',
                  title: 'Réponse',
                  type: 'text',
                  rows: 4,
                  description: 'Réponse visible par Google (rich snippets)',
                },
              ],
            },
          ],
        },
      ],
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'Réglages SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Titre SEO',
          type: 'string',
          description: 'Titre qui apparaît dans les résultats de recherche (50-60 caractères)',
        },
        {
          name: 'metaDescription',
          title: 'Description SEO',
          type: 'text',
          rows: 3,
          description: 'Description qui apparaît dans les résultats de recherche (150-160 caractères)',
        },
        {
          name: 'keywords',
          title: 'Mots-clés',
          type: 'array',
          of: [{ type: 'string' }],
        },
        {
          name: 'canonicalUrl',
          title: 'URL Canonique',
          type: 'url',
          initialValue: 'https://doctorfollowers.com/generateur-captions-instagram',
        },
      ],
    }),

    // Open Graph
    defineField({
      name: 'openGraph',
      title: 'Open Graph (Facebook, LinkedIn)',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
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
          title: 'Type de Carte',
          type: 'string',
          options: {
            list: [
              { title: 'Summary', value: 'summary' },
              { title: 'Summary Large Image', value: 'summary_large_image' },
            ],
          },
          initialValue: 'summary_large_image',
        },
        {
          name: 'title',
          title: 'Titre',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    defineField({
      name: 'published',
      title: 'Publié',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare() {
      return {
        title: 'Page Générateur de Captions Instagram',
        subtitle: 'Contenu SEO de la page générateur de captions',
      }
    },
  },
})

