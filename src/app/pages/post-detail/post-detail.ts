import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostCardComponent } from '@src/app/components/organisms/post-card/post-card';
import { CommentInputComponent } from '@src/app/components/molecules/comment-input/comment-input';
import { CommentItemComponent } from '@src/app/components/molecules/comment-item/comment-item';
import { AuthStore } from '@src/app/store/auth.store';
import { FeedStore } from '@src/app/store/feed.store';

@Component({
  selector: 'app-post-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PostCardComponent, CommentInputComponent, CommentItemComponent],
  styleUrl: './post-detail.css',
  templateUrl: './post-detail.html',
})
export default class PostDetailPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly feedStore = inject(FeedStore);
  private readonly authStore = inject(AuthStore);

  readonly post = this.feedStore.selectedPost;
  readonly user = this.authStore.user;
  readonly loading = this.feedStore.loading;

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      this.feedStore.loadPost(postId);
    }
  }

  ngOnDestroy(): void {
    this.feedStore.clearSelectedPost();
  }

  close(): void {
    this.router.navigate(['/feed']);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  async onCommentSubmit(content: string): Promise<void> {
    const postId = this.post()?.id;
    if (!postId) return;
    await this.feedStore.addComment(postId, { content });
  }
}
