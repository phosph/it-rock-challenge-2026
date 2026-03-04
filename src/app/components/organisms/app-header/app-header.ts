import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '@src/app/interfaces/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
})
export class AppHeaderComponent {
  user = input<User | null>(null);
  hasNotifications = input(false);

  notificationClick = output<void>();
  menuClick = output<void>();
  profileClick = output<void>();
}
