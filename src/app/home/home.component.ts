import { Component, inject } from '@angular/core';
import { AuthService } from '../shared/service/auth.service';
import { AuthStore } from '../shared/store/auth.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  authService = inject(AuthService);
  authStore = inject(AuthStore);

  logout() {
    this.authStore.logout();
  }
}
