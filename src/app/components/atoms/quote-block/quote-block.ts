import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-quote-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 flex items-center justify-center border border-neutral-100 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-accent-light rounded-full blur-3xl opacity-50 -mr-10 -mt-10" aria-hidden="true"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl opacity-50 -ml-10 -mb-10" aria-hidden="true"></div>
      <blockquote class="text-center text-lg font-serif italic text-neutral-800 relative z-10">
        "{{ quote() }}"
      </blockquote>
    </div>
  `,
})
export class QuoteBlockComponent {
  quote = input.required<string>();
}
