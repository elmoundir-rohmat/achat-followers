import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: () => '📁',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom de la catégorie',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'Couleur',
      type: 'string',
      options: {
        list: [
          { title: 'Rose', value: 'pink' },
          { title: 'Bleu', value: 'blue' },
          { title: 'Violet', value: 'purple' },
          { title: 'Vert', value: 'green' },
          { title: 'Orange', value: 'orange' },
        ],
      },
    }),
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    },
  },
})

