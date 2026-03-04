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
export class PostCardComponent {
  post = input.required<Post>();

  like = output<void>();
  comment = output<void>();
  share = output<void>();
}
