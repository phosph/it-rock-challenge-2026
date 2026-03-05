import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Comment } from '@src/app/interfaces/comment.interface';
import { AvatarComponent } from '@src/app/components/atoms/avatar/avatar';
import { TimeAgoPipe } from '@src/app/pipes/time-ago.pipe';

@Component({
  selector: 'app-comment-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, TimeAgoPipe],
  host: { class: 'block py-3 border-b border-neutral-100 last:border-b-0' },
  template: `
    <div class="flex gap-3">
      <app-avatar [src]="comment().author.avatarUrl" [alt]="comment().author.name" size="sm" />
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-2">
          <span class="text-sm font-semibold text-neutral-900">{{ comment().author.name }}</span>
          <time class="text-xs text-neutral-400">{{ comment().createdAt | timeAgo }}</time>
        </div>
        <p class="text-sm text-neutral-700 mt-0.5">{{ comment().content }}</p>
      </div>
    </div>
  `,
})
export class CommentItemComponent {
  comment = input.required<Comment>();
}
