import { BlogPost } from '../config/blogPosts';

export const generateArticleMeta = (post: BlogPost) => {
  return {
    title: `${post.title} | Doctor Followers`,
    description: post.excerpt,
    keywords: post.tags?.join(', ') || '',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      image: post.image,
      url: `https://doctorfollowers.com/blogs/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      image: post.image,
    },
    canonical: `https://doctorfollowers.com/blogs/${post.slug}`,
  };
};

export const generateBlogMeta = () => {
  return {
    title: 'Blog | Doctor Followers - Conseils Instagram, TikTok, YouTube',
    description: 'Découvrez nos conseils d\'experts pour développer votre présence sur les réseaux sociaux. Guides complets pour Instagram, TikTok, YouTube et plus encore.',
    keywords: 'blog, conseils, instagram, tiktok, youtube, réseaux sociaux, followers, engagement',
    openGraph: {
      title: 'Blog | Doctor Followers',
      description: 'Conseils d\'experts pour les réseaux sociaux',
      url: 'https://doctorfollowers.com/blogs',
      type: 'website',
    },
    canonical: 'https://doctorfollowers.com/blogs',
  };
};
