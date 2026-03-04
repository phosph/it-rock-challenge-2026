import type { Post, PostInput } from "./post.interface";

export interface FeedService {
  getAll(): Promise<Post[]>
  getPost(postId: Post['id']): Promise<Post>
  uploadPost(post: PostInput, token: string): Promise<Post>

}
