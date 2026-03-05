import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShareModalComponent } from './components/atoms/share-modal/share-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ShareModalComponent],
  templateUrl: './app.html',
})
export class App {
  readonly hasNativeShare = !!navigator?.share;
}
