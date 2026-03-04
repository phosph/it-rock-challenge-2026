import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-feed-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-32 lg:pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Sidebar — desktop only -->
      <aside class="hidden lg:block lg:col-span-3 sticky top-24 space-y-6">
        <ng-content select="[sidebar-left]" />
      </aside>

      <!-- Center Feed -->
      <main class="col-span-1 lg:col-span-6 space-y-6">
        <ng-content />
      </main>

      <!-- Right Sidebar — desktop only -->
      <aside class="hidden lg:block lg:col-span-3 sticky top-24 space-y-6">
        <ng-content select="[sidebar-right]" />
      </aside>
    </div>
  `,
})
export class FeedLayoutComponent {}
