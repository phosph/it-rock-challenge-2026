export interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  likes: number;
  createdAt: string;
}
