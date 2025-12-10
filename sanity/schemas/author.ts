import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Auteur',
  type: 'document',
  icon: () => '👤',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
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
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'avatar',
      title: 'Photo de profil',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'url',
      title: 'URL du profil',
      type: 'url',
    }),
    defineField({
      name: 'social',
      title: 'Réseaux sociaux',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'string',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'string',
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'string',
        },
        {
          name: 'website',
          title: 'Site web',
          type: 'url',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'avatar',
    },
  },
})

