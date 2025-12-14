/**
 * Type réutilisable pour le contenu riche (blockContent)
 * Permet le formatage : gras, italique, souligné, liens, listes, etc.
 */
export default {
  name: 'blockContent',
  title: 'Contenu Riche',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Citation', value: 'blockquote' },
      ],
      marks: {
        // Formatage de texte
        decorators: [
          { title: 'Gras', value: 'strong' },
          { title: 'Italique', value: 'em' },
          { title: 'Souligné', value: 'underline' },
          { title: 'Code', value: 'code' },
        ],
        // Annotations (liens, etc.)
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Lien',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule: any) => Rule.required(),
              },
              {
                name: 'target',
                type: 'string',
                title: 'Ouvrir dans',
                options: {
                  list: [
                    { title: 'Même fenêtre', value: '_self' },
                    { title: 'Nouvelle fenêtre', value: '_blank' },
                  ],
                },
                initialValue: '_self',
              },
            ],
          },
        ],
      },
    },
  ],
}

