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
          <div class="w-5 h-5 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[8px] text-white">
            <i class="fa-solid fa-thumbs-up"></i>
          </div>
          @if (liked()) {
            <div class="w-5 h-5 rounded-full bg-red-500 border border-white flex items-center justify-center text-[8px] text-white">
              <i class="fa-solid fa-heart"></i>
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
