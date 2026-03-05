import type { Comment, CommentInput } from "./comment.interface";
import type { Post, PostInput } from "./post.interface";

/** Optional filter criteria for listing posts. */
export interface FeedFilter {
  /** When `true`, return only bookmarked posts for the current user. */
  tagged?: boolean;
}

/**
 * Feed service contract. Implementations handle CRUD operations for posts
 * and comments, as well as like, share, and bookmark toggling.
 */
export interface FeedService {
  /** Returns all posts, optionally filtered. Posts are returned without comments. */
  getAll(filter?: FeedFilter): Promise<Post[]>
  /** Returns a single post by ID, including its comments. */
  getPost(postId: Post['id']): Promise<Post>
  /** Creates a new post from the given input and returns the persisted post. */
  uploadPost(post: PostInput): Promise<Post>
  /** Adds a comment to a post and returns the created comment. */
  addComment(postId: Post['id'], comment: CommentInput): Promise<Comment>
  /** Toggles the like state for the current user and returns the updated post. */
  toggleLike(postId: Post['id']): Promise<Post>
  /** Increments the share count and returns the updated post. */
  sharePost(postId: Post['id']): Promise<Post>
  /** Toggles the bookmark state for the current user and returns the updated post. */
  toggleTag(postId: Post['id']): Promise<Post>
}
