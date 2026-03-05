import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '@src/app/components/organisms/app-header/app-header';
import { PostCardComponent } from '@src/app/components/organisms/post-card/post-card';
import { FeedLayoutComponent } from '@src/app/components/templates/feed-layout/feed-layout';
import { FeedStore } from '@src/app/store/feed.store';

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

       @for (post of feedStore.posts(); track post.id) {
          <app-post-card [post]="post"/>
       } @empty {
          <p class="text-neutral-500 text-sm">No posts yet.</p>
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
export default class FeedPage {
  readonly feedStore = inject(FeedStore)
}
