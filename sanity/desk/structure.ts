import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      // Page d'accueil
      S.listItem()
        .title('Page d\'Accueil')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),
      
      // Page Instagram Commentaires
      S.listItem()
        .title('Page Instagram Commentaires')
        .child(
          S.document()
            .schemaType('instagramCommentsPage')
            .documentId('instagramCommentsPage')
        ),
      
      // Articles de blog
      S.listItem()
        .title('Articles de Blog')
        .child(
          S.documentTypeList('blogPost')
            .title('Articles de Blog')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      
      // Pages
      S.listItem()
        .title('Pages')
        .child(
          S.documentTypeList('page')
            .title('Pages')
        ),
      
      // Auteurs
      S.listItem()
        .title('Auteurs')
        .child(
          S.documentTypeList('author')
            .title('Auteurs')
        ),
      
      // Catégories
      S.listItem()
        .title('Catégories')
        .child(
          S.documentTypeList('category')
            .title('Catégories')
        ),
      
      // Tags
      S.listItem()
        .title('Tags')
        .child(
          S.documentTypeList('tag')
            .title('Tags')
        ),
      
      // Séparateur
      S.divider(),
      
      // Tous les documents
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['blogPost', 'page', 'homePage', 'instagramCommentsPage', 'author', 'category', 'tag'].includes(
            listItem.getId()!
          )
      ),
    ])

