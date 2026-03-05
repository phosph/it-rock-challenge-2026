import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PostStats } from '@src/app/interfaces/post.interface';

@Component({
  selector: 'app-post-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="flex items-center justify-between text-xs text-neutral-500 px-1">
      <div class="flex items-center gap-1">
        <div class="flex -space-x-2" aria-hidden="true">
          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <span class="material-symbols-outlined filled text-[12px]!">thumb_up</span>
          </div>
          @if (liked()) {
            <div class="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white">
              <span class="material-symbols-outlined filled text-[12px]!">favorite</span>
            </div>
          }
        </div>
        <span class="ml-1 font-medium text-neutral-700">{{ stats().likes }} likes</span>
      </div>
      <div class="flex gap-3">
        <span>{{ stats().comments }} comments</span>
        <span>{{ stats().shares }} shares</span>
      </div>
    </div>
  `,
})
export class PostStatsComponent {
  stats = input.required<PostStats>();
  liked = input.required<boolean>();
}
