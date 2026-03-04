import { Injectable } from '@angular/core';
import type { FeedService } from '../../interfaces/feed-service.interface';
import type { Post, PostInput } from '../../interfaces/post.interface';
import mockPosts from './feeds.mock.json';

@Injectable()
export class MockFeedServiceImpl implements FeedService {
  readonly #mockedDb = new Map<Post['id'], Post>(
    mockPosts.map(post => ([post.id, post as Post]))
  )

  async getPost(postId: Post['id']): Promise<Post> {
    const post = this.#mockedDb.get(postId)

    if (!post) throw new Error(`Post ${postId} not found`)

    return post
  }

  async uploadPost(postInput: PostInput): Promise<Post> {
    const post = structuredClone(postInput)

    post.id = crypto.randomUUID()

    this.#mockedDb.set(post.id, post)

    return structuredClone(post)
  }

  async getAll(): Promise<Post[]> {
    return Iterator.from(this.#mockedDb.values())
      .map(post => structuredClone(post))
      .toArray()
  }
}
