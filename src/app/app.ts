import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ShareModalComponent } from '@components/atoms/share-modal/share-modal';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ShareModalComponent],
  templateUrl: './app.html',
})
export class App {
  readonly hasNativeShare = isPlatformBrowser(inject(PLATFORM_ID)) && !!navigator.share;
}
