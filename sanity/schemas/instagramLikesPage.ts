import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'instagramLikesPage',
  title: 'Page Instagram Likes',
  type: 'document',
  icon: () => '❤️',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      initialValue: 'Page Instagram Likes',
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
        },
        {
          name: 'description',
          title: 'Description (Paragraphe sous H1)',
          type: 'text',
          rows: 3,
          description: 'Description importante pour le SEO - visible sous le titre',
        },
      ],
    }),

    // Titres des Sections (H2) - SEO
    defineField({
      name: 'sectionTitles',
      title: 'Titres des Sections (H2) - SEO',
      type: 'object',
      fields: [
        {
          name: 'testimonials',
          title: 'Titre Section "Avis des clients" (H2)',
          type: 'string',
        },
        {
          name: 'security',
          title: 'Titre Section "Sécurité" (H2)',
          type: 'string',
        },
        {
          name: 'whyBuy',
          title: 'Titre Section "Pourquoi acheter" (H2)',
          type: 'string',
        },
      ],
    }),

    // Section FAQ - SEO Important
    defineField({
      name: 'faq',
      title: 'Section FAQ - SEO',
      type: 'object',
      fields: [
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
        title: 'Page Instagram Likes',
        subtitle: 'Contenu SEO de la page Instagram Likes',
      }
    },
  },
})

