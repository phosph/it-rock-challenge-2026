import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-publish',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Publish works!</p>`,
})
export default class PublishPage {}
