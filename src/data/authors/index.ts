import { Author } from '../../types/blog';

export const authors: Author[] = [
  {
    id: 'thinkwell',
    name: 'ThinkWell',
    bio: 'Expert en marketing digital et croissance des réseaux sociaux',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    social: {
      twitter: '@thinkwell',
      linkedin: 'thinkwell-digital'
    }
  },
  {
    id: 'marine',
    name: 'Marine',
    bio: 'Spécialiste en stratégies de contenu et engagement',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'marine-legaall',
    name: 'Marine LeGaall',
    bio: 'Consultante en marketing social media',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'moundir-rohmat',
    name: 'Moundir Rohmat',
    bio: 'Expert en croissance Instagram et stratégies de followers',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    social: {
      instagram: '@moundir_rohmat'
    }
  }
];

export const getAuthorById = (id: string): Author | undefined => {
  return authors.find(author => author.id === id);
};

export const getAuthors = (): Author[] => {
  return authors;
};
