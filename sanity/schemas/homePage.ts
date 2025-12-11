import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Page d\'Accueil',
  type: 'document',
  icon: () => '🏠',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      initialValue: 'Page d\'Accueil',
      readOnly: true,
    }),
    
    // Section Hero (Bannière principale) - SEO
    defineField({
      name: 'hero',
      title: 'Section Hero (Bannière Principale) - SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre Principal (H1)',
          type: 'string',
          description: 'Le titre principal H1 de la page - Important pour le SEO',
        },
        {
          name: 'subtitle',
          title: 'Sous-titre (H1)',
          type: 'string',
          description: 'Le sous-titre qui complète le H1',
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

    // Section Services - SEO
    defineField({
      name: 'services',
      title: 'Section Services - SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Titre de la Section (H2)',
          type: 'string',
          description: 'Titre H2 de la section services - Important pour le SEO',
        },
      ],
    }),

    // Sections SEO (Titres H2 des différentes sections)
    defineField({
      name: 'sectionTitles',
      title: 'Titres des Sections (H2) - SEO',
      type: 'object',
      fields: [
        {
          name: 'whyBuy',
          title: 'Titre Section "Pourquoi acheter" (H2)',
          type: 'string',
          description: 'Titre H2 de la section "Pourquoi acheter des followers Instagram actifs ?"',
        },
        {
          name: 'howItWorks',
          title: 'Titre Section "Comment fonctionne" (H2)',
          type: 'string',
          description: 'Titre H2 de la section "Comment fonctionne notre service"',
        },
        {
          name: 'advantages',
          title: 'Titre Section "Avantages" (H2)',
          type: 'string',
          description: 'Titre H2 de la section "Les avantages d\'un achat de followers"',
        },
        {
          name: 'whyChoose',
          title: 'Titre Section "Pourquoi choisir" (H2)',
          type: 'string',
          description: 'Titre H2 de la section "Pourquoi choisir Doctor Followers"',
        },
        {
          name: 'faq',
          title: 'Titre Section FAQ (H2)',
          type: 'string',
          description: 'Titre H2 de la section FAQ',
        },
      ],
    }),

    // Section Avantages/Bénéfices (pas SEO critique, mais gardé pour cohérence)
    defineField({
      name: 'benefits',
      title: 'Section Avantages',
      type: 'object',
      fields: [
        {
          name: 'items',
          title: 'Liste des Avantages',
          type: 'array',
          of: [
            {
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
                  rows: 2,
                },
                {
                  name: 'icon',
                  title: 'Icône',
                  type: 'string',
                  description: 'Nom de l\'icône (ex: Shield, Clock, Zap)',
                },
              ],
            },
          ],
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
          initialValue: 'https://doctorfollowers.com',
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
      description: 'La page d\'accueil est toujours publiée',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare() {
      return {
        title: 'Page d\'Accueil',
        subtitle: 'Contenu de la page d\'accueil',
      }
    },
  },
})

