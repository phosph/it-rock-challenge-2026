import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PostEvent } from '@src/app/interfaces/post.interface';

@Component({
  selector: 'app-event-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="relative rounded-2xl overflow-hidden shadow-sm">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" aria-hidden="true"></div>
      <img
        [src]="event().imageUrl"
        [alt]="event().title"
        class="w-full h-56 object-cover"
      >
      <div class="absolute bottom-4 left-4 z-20 text-white">
        <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg inline-block mb-2 border border-white/30">
          <span class="text-xs font-bold uppercase tracking-wider">Upcoming Event</span>
        </div>
        <h4 class="text-lg font-bold">{{ event().title }}</h4>
        <p class="text-xs text-white/80">{{ event().location }} · {{ event().date }}</p>
      </div>
    </div>
  `,
})
export class EventPreviewComponent {
  event = input.required<PostEvent>();
}
