import type { Comment, CommentInput } from "./comment.interface";
import type { Post, PostInput } from "./post.interface";

export interface FeedService {
  getAll(): Promise<Post[]>
  getPost(postId: Post['id']): Promise<Post>
  uploadPost(post: PostInput): Promise<Post>
  addComment(postId: Post['id'], comment: CommentInput): Promise<Comment>
  toggleLike(postId: Post['id']): Promise<Post>
}
