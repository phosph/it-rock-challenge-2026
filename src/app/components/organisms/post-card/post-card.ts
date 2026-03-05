import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Post } from '@src/app/interfaces/post.interface';
import { ArticlePreviewComponent } from '@src/app/components/atoms/article-preview/article-preview';
import { QuoteBlockComponent } from '@src/app/components/atoms/quote-block/quote-block';
import { EventPreviewComponent } from '@src/app/components/atoms/event-preview/event-preview';
import { ImagePreviewComponent } from '@src/app/components/atoms/image-preview/image-preview';
import { PostStatsComponent } from '@src/app/components/atoms/post-stats/post-stats';
import { PostHeaderComponent } from '@src/app/components/molecules/post-header/post-header';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticlePreviewComponent, QuoteBlockComponent, EventPreviewComponent, ImagePreviewComponent, PostStatsComponent, PostHeaderComponent],
  styleUrl: './post-card.css'
})
/**
 * Full post card used in the feed. Composes `PostHeader`, content previews (image, article,
 * quote, or event), `PostStats`, and action buttons (like, comment, share, save).
 *
 * @example
 * ```html
 * <app-post-card [post]="post" (like)="onLike()" (share)="onShare()" />
 * ```
 */
export class PostCardComponent {
  /** Complete post data including author, content, stats, and interaction state. */
  post = input.required<Post>();
  /** Whether to show the comment action button. Set to `false` on the post detail page. Defaults to `true`. */
  showCommentAction = input(true);

  /** Emits when the user clicks the like button. */
  like = output<void>();
  /** Emits when the user clicks the comment button. */
  comment = output<void>();
  /** Emits when the user clicks the share button. */
  share = output<void>();
  /** Emits when the user clicks the bookmark/save button. */
  tag = output<void>();
}
