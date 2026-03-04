export type PostType = 'image' | 'article' | 'quote' | 'event';

export interface PostAuthor {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface PostStats {
  likes: number;
  comments: number;
  shares: number;
}

export interface PostImage {
  imageUrl: string;
  alt: string;
  caption?: string;
}

export interface PostArticle {
  imageUrl: string;
  title: string;
  description: string;
  label?: string;
}

export interface PostEvent {
  imageUrl: string;
  title: string;
  location: string;
  date: string;
}

export interface PostInput {
  id: string;
  type: PostType;
  author: PostAuthor;
  content: string;
  createdAt: string;
  stats: PostStats;
  liked: boolean;
  meta?: string;
  image?: PostImage;
  article?: PostArticle;
  quote?: string;
  event?: PostEvent;
}

export interface Post extends PostInput {
  id: string;
}
