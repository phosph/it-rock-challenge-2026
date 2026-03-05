import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'closed.emit()' },
  styleUrl: './dialog-layout.css',
  template: `
    <!-- Backdrop (desktop only, click to close) -->
    <div class="hidden sm:block absolute inset-0"
         (click)="onBackdropClick($event)"
         aria-hidden="true"></div>

    <div class="flex flex-col flex-1 w-full sm:card sm:relative sm:flex-initial sm:max-w-lg sm:w-full sm:mx-4 sm:max-h-[90vh]"
         role="dialog"
         aria-modal="true"
         [attr.aria-labelledby]="titleId">

      <!-- Header -->
      <header class="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <h2 [id]="titleId" class="text-lg font-bold text-neutral-900">{{ title() }}</h2>
        <button type="button"
                class="close-btn"
                (click)="closed.emit()"
                aria-label="Close">
          <span class="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
      </header>

      <!-- Scrollable body -->
      <div class="flex-1 overflow-y-auto">
        <ng-content />
      </div>

      <!-- Optional footer -->
      <ng-content select="[dialog-footer]" />
    </div>
  `,
})
export class DialogLayoutComponent {
  title = input.required<string>();
  closed = output<void>();

  protected readonly titleId = 'dialog-title-' + Math.random().toString(36).slice(2, 9);

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }
}
