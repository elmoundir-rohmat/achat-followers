import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'instagramFollowersPage',
  title: 'Page Instagram Followers',
  type: 'document',
  icon: () => '👥',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      initialValue: 'Page Instagram Followers',
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
          type: 'array',
          of: [{ type: 'block' }],
          description: 'Description importante pour le SEO - visible sous le titre. Supporte le formatage : gras, italique, liens, etc.',
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
          title: 'Titre Section "Sécurité & Garanties" (H2)',
          type: 'string',
        },
        {
          name: 'whyBuy',
          title: 'Titre Section "Pourquoi acheter des followers..." (H2)',
          type: 'string',
        },
      ],
    }),

    // Section "Types de Followers" - SEO
    defineField({
      name: 'followerTypes',
      title: 'Section "Types de Followers" - SEO',
      type: 'object',
      description: 'Contenu des sections "Followers Internationaux" et "Abonnés Instagram Français"',
      fields: [
        {
          name: 'international',
          title: 'Followers Internationaux',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titre (H3)',
              type: 'string',
              initialValue: 'Followers Internationaux',
            },
            {
              name: 'descriptions',
              title: 'Descriptions (3 points)',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Les 3 descriptions de la section Followers Internationaux',
            },
          ],
        },
        {
          name: 'french',
          title: 'Abonnés Instagram Français',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titre (H3)',
              type: 'string',
              initialValue: 'Abonnés Instagram Français',
            },
            {
              name: 'descriptions',
              title: 'Descriptions (3 points)',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Les 3 descriptions de la section Abonnés Instagram Français',
            },
          ],
        },
      ],
    }),

    // Section "Sécurité & Garanties" - SEO
    defineField({
      name: 'securitySection',
      title: 'Section "Sécurité & Garanties" - SEO',
      type: 'object',
      description: 'Contenu des 3 cartes de la section Sécurité & Garanties',
      fields: [
        {
          name: 'serviceClient',
          title: 'Service client 24/7',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titre (H3)',
              type: 'string',
              initialValue: 'Service client 24/7',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Supporte le formatage : gras, italique, liens, etc.',
            },
          ],
        },
        {
          name: 'remboursement',
          title: 'Politique de remboursement',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titre (H3)',
              type: 'string',
              initialValue: 'Politique de remboursement',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Supporte le formatage : gras, italique, liens, etc.',
            },
          ],
        },
        {
          name: 'paiements',
          title: 'Paiements sécurisés',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titre (H3)',
              type: 'string',
              initialValue: 'Paiements sécurisés',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Supporte le formatage : gras, italique, liens, etc.',
            },
          ],
        },
      ],
    }),

    // Section "Pourquoi acheter" - SEO
    defineField({
      name: 'whyBuySection',
      title: 'Section "Pourquoi acheter des followers" - SEO',
      type: 'object',
      description: 'Les 3 sous-sections avec H3 et paragraphes de la section "Pourquoi acheter"',
      fields: [
        {
          name: 'credibilite',
          title: 'Améliorer votre crédibilité',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titre (H3)',
              type: 'string',
              initialValue: 'Améliorer votre crédibilité',
            },
            {
              name: 'description',
              title: 'Description (Paragraphe)',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Paragraphe complet avec mots-clés SEO. Supporte le formatage : gras, italique, liens, etc. Utilisez les boutons de la barre d\'outils pour formater.',
            },
          ],
        },
        {
          name: 'explorer',
          title: 'Apparaître dans l\'onglet "Explorer"',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titre (H3)',
              type: 'string',
              initialValue: 'Apparaître dans l\'onglet "Explorer"',
            },
            {
              name: 'description',
              title: 'Description (Paragraphe)',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Paragraphe complet avec mots-clés SEO. Supporte le formatage : gras, italique, liens, etc. Utilisez les boutons de la barre d\'outils pour formater.',
            },
          ],
        },
        {
          name: 'communaute',
          title: 'Bâtir une vraie communauté',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Titre (H3)',
              type: 'string',
              initialValue: 'Bâtir une vraie communauté',
            },
            {
              name: 'description',
              title: 'Description (Paragraphe)',
              type: 'array',
              of: [{ type: 'block' }],
              description: 'Paragraphe complet avec mots-clés SEO. Supporte le formatage : gras, italique, liens, etc. Utilisez les boutons de la barre d\'outils pour formater.',
            },
          ],
        },
      ],
    }),

    // Contenu riche avant FAQ - SEO
    defineField({
      name: 'contentBeforeFaq',
      title: 'Contenu riche avant la FAQ',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Contenu riche qui apparaît juste avant la section FAQ. Supporte le formatage : gras, italique, liens, listes, etc. Important pour le SEO.',
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
          initialValue: 'https://doctorfollowers.com/products/acheter-followers-instagram',
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
        title: 'Page Instagram Followers',
        subtitle: 'Contenu SEO de la page Instagram Followers',
      }
    },
  },
})

