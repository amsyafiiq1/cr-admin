import { Component, inject } from '@angular/core';
import { AuthService } from '../shared/service/auth.service';
import { AuthStore } from '../shared/store/auth.store';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent, RouterOutlet],
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
