import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PostAuthor } from '@src/app/interfaces/post.interface';
import { AvatarComponent } from '@src/app/components/atoms/avatar/avatar';

@Component({
  selector: 'app-post-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [AvatarComponent],
  template: `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <app-avatar [src]="author().avatarUrl" [alt]="author().name" />
        <div>
          <h3 class="text-sm font-bold text-neutral-900">{{ author().name }}</h3>
          <div class="flex items-center gap-2 text-xs text-neutral-500">
            <span>{{ timeAgo() }}</span>
            @if (meta()) {
              <span class="w-1 h-1 bg-neutral-300 rounded-full" aria-hidden="true"></span>
              <span [class]="highlightMeta() ? 'text-primary-600 font-medium' : 'text-neutral-400'">{{ meta() }}</span>
            }
          </div>
        </div>
      </div>
      <button
        class="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition-colors"
        aria-label="Post options"
        (click)="options.emit()"
      >
        <i class="fa-solid fa-ellipsis" aria-hidden="true"></i>
      </button>
    </div>
  `,
})
export class PostHeaderComponent {
  author = input.required<PostAuthor>();
  timeAgo = input.required<string>();
  meta = input<string>();
  highlightMeta = input(false);

  options = output<void>();
}
