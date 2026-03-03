import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-feed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Feed works!</p>`,
})
export default class FeedPage {}
