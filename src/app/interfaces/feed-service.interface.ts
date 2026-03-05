import type { Comment, CommentInput } from "./comment.interface";
import type { Post, PostInput } from "./post.interface";

export interface FeedFilter {
  tagged?: boolean;
}

export interface FeedService {
  getAll(filter?: FeedFilter): Promise<Post[]>
  getPost(postId: Post['id']): Promise<Post>
  uploadPost(post: PostInput): Promise<Post>
  addComment(postId: Post['id'], comment: CommentInput): Promise<Comment>
  toggleLike(postId: Post['id']): Promise<Post>
  sharePost(postId: Post['id']): Promise<Post>
  toggleTag(postId: Post['id']): Promise<Post>
}
