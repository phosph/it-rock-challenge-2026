import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppHeaderComponent } from '@src/app/components/organisms/app-header/app-header';
import { PostCardComponent } from '@src/app/components/organisms/post-card/post-card';
import { FeedLayoutComponent } from '@src/app/components/templates/feed-layout/feed-layout';
import { FeedStore } from '@src/app/store/feed.store';

@Component({
  selector: 'app-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppHeaderComponent, FeedLayoutComponent, PostCardComponent],
  providers: [FeedStore],
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
  `,
})
export default class FeedPage {
  readonly feedStore = inject(FeedStore)
}
