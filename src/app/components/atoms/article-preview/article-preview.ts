import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PostArticle } from '@src/app/interfaces/post.interface';

@Component({
  selector: 'app-article-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="rounded-2xl overflow-hidden shadow-sm border border-neutral-100 bg-neutral-50">
      <div class="flex flex-col md:flex-row">
        <div class="w-full md:w-1/3 h-48 md:h-auto">
          <img
            [src]="article().imageUrl"
            [alt]="article().title"
            class="w-full h-full object-cover"
          >
        </div>
        <div class="p-4 md:p-6 md:w-2/3 flex flex-col justify-center">
          @if (article().label) {
            <span class="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-1">{{ article().label }}</span>
          }
          <h4 class="text-base md:text-lg font-bold text-neutral-900 mb-2">{{ article().title }}</h4>
          <p class="text-xs md:text-sm text-neutral-500 line-clamp-2 md:line-clamp-3">{{ article().description }}</p>
        </div>
      </div>
    </div>
  `,
})
export class ArticlePreviewComponent {
  article = input.required<PostArticle>();
}
