import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentInputComponent } from '@src/app/components/molecules/comment-input/comment-input';
import { CommentItemComponent } from '@src/app/components/molecules/comment-item/comment-item';
import { PostCardComponent } from '@src/app/components/organisms/post-card/post-card';
import { AuthStore } from '@src/app/store/auth.store';
import { FeedStore } from '@src/app/store/feed.store';
import { from } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, PostCardComponent, CommentInputComponent, CommentItemComponent],
  styleUrl: './post-detail.css',
  templateUrl: './post-detail.html',
})
export default class PostDetailPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly feedStore = inject(FeedStore);
  private readonly authStore = inject(AuthStore);
  readonly destroyRef = inject(DestroyRef)
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly post = this.feedStore.selectedPost;
  readonly user = this.authStore.user;
  readonly loading = signal(true);

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('postId');

    // NOTA: en circustancias normales esto no debería cargarse solo en browser
    // pero no tenemos server ni DB, y los posts están en el cliente en el localstorage
    // así que estoy forzado a cargarlo solamente en el browser
    if (postId && this.isBrowser) {
      from(this.feedStore.loadPost(postId)).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        complete: () => this.loading.set(false),
        error: () => this.close()
      })
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

  onLike(): void {
    const postId = this.post()?.id;
    if (!postId) return;
    this.feedStore.toggleLike(postId);
  }

  onShare(): void {
    const postId = this.post()?.id;
    if (!postId) return;
    this.feedStore.sharePost(postId);
  }

  onTag(): void {
    const postId = this.post()?.id;
    if (!postId) return;
    this.feedStore.toggleTag(postId);
  }

  async onCommentSubmit(content: string): Promise<void> {
    const postId = this.post()?.id;
    if (!postId) return;
    await this.feedStore.addComment(postId, { content });
  }
}
