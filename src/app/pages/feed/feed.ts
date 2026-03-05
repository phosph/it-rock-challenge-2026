import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '@components/organisms/app-header/app-header';
import { PostCardComponent } from '@components/organisms/post-card/post-card';
import { FeedLayoutComponent } from '@components/templates/feed-layout/feed-layout';
import { FeedStore } from '@store/feed.store';

@Component({
  selector: 'app-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppHeaderComponent, FeedLayoutComponent, PostCardComponent, RouterOutlet, RouterLink],
  providers: [FeedStore],
  host: { class: 'block min-h-screen' },
  template: `
    <app-header />

    <app-feed-layout>
      <div sidebar-left>
        <!-- TODO: profile card, nav menu, trending -->
      </div>

      @defer (on immediate) {
        @for (post of feedStore.posts(); track post.id) {
            <app-post-card [post]="post" (like)="onLike(post.id)" (comment)="onComment(post.id)" (share)="onShare(post.id)" (tag)="onTag(post.id)" />
        } @empty {
            <p class="text-neutral-500 text-sm">No posts yet.</p>
        }
      }

      <div sidebar-right>
        <!-- TODO: search, who to follow -->
      </div>
    </app-feed-layout>

    <!-- FAB: New Post -->
    <a routerLink="publish"
       class="fixed bottom-8 right-8 z-40 w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center text-white shadow-lg shadow-neutral-800/30 hover:bg-black hover:scale-105 transition-all border-4 border-white"
       aria-label="Create new post">
      <span class="material-symbols-outlined text-3xl" aria-hidden="true">add</span>
    </a>

    <router-outlet />
  `,
})
/**
 * Main social network feed page. Loads and displays all posts from the `FeedStore`,
 * with support for filtering by bookmarked posts via the `?tagged=true` query param.
 * Handles post interactions (like, comment, share, save) and provides a FAB to
 * navigate to the publish page. Child routes (post detail, publish) render via `RouterOutlet`.
 *
 * Data loading is guarded by `isPlatformBrowser` since all data lives in localStorage.
 *
 * @route `/feed`
 * @guard `authGuard` — redirects unauthenticated users to `/auth`
 */
export default class FeedPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly feedStore = inject(FeedStore);

  private taggedFilter = false;

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(params => {
      this.taggedFilter = params['tagged'] === 'true';
      this.feedStore.loadAll(this.taggedFilter ? { tagged: true } : undefined);
    });
  }

  onLike(postId: string): void {
    this.feedStore.toggleLike(postId);
  }

  onComment(postId: string): void {
    this.router.navigate(['/feed', postId]);
  }

  onShare(postId: string): void {
    this.feedStore.sharePost(postId);
  }

  async onTag(postId: string): Promise<void> {
    await this.feedStore.toggleTag(postId);
    if (this.taggedFilter) {
      this.feedStore.loadAll({ tagged: true });
    }
  }
}
