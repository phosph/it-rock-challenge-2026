import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SHARE_REQUEST } from '@src/app/store/feed.store';

@Component({
  selector: 'app-share-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './share-modal.css',
  template: `
    @if (shareRequest(); as req) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
           (click)="onBackdropClick($event)"
           (keydown.escape)="close()">
        <div class="card w-full max-w-sm mx-4 p-5" role="dialog" aria-modal="true" aria-labelledby="share-title">
          <div class="flex items-center justify-between mb-4">
            <h2 id="share-title" class="text-lg font-bold text-neutral-900">Share</h2>
            <button type="button"
                    class="close-btn"
                    (click)="close()"
                    aria-label="Close">
              <span class="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </div>

          <div class="flex gap-2">
            <input type="text" readonly [value]="req.url"
                   class="form-input flex-1 text-sm select-all"
                   aria-label="Share URL" />
            <button type="button"
                    class="btn-filled text-sm"
                    (click)="copy(req.url)">
              {{ copied() ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
/**
 * Modal dialog for sharing a post URL. Displays a read-only URL input with a copy-to-clipboard button.
 * Visibility is controlled by the `SHARE_REQUEST` signal — the modal appears when a share request
 * is set and closes when cleared.
 */
export class ShareModalComponent {
  /** Signal holding the current share request (URL + post ID), or `null` when closed. */
  readonly shareRequest = inject(SHARE_REQUEST);
  /** Whether the URL was recently copied to clipboard. Resets on close. */
  readonly copied = signal(false);

  close(): void {
    this.shareRequest.set(null);
    this.copied.set(false);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  copy(url: string): void {
    navigator.clipboard.writeText(url);
    this.copied.set(true);
  }
}
