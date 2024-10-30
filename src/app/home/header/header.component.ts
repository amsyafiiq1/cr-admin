import { Component, inject } from '@angular/core';
import { AuthStore } from '../../shared/store/auth.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authStore = inject(AuthStore);

  logout() {
    this.authStore.logout();
  }
}
