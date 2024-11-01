import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/service/auth.service';
import { AuthStore } from './shared/store/auth.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  authStore = inject(AuthStore);

  constructor() {}

  // ngOnInit() {
  //   this.authService.supabase.auth.onAuthStateChange((event, session) => {
  //     if (event === 'SIGNED_IN') {
  //       if (this.authStore.user()?.token === session?.access_token) {
  //         return;
  //       }
  //       console.log(event, session);

  //       this.router.navigate(['/']);
  //     } else if (event === 'SIGNED_OUT') {
  //       this.router.navigate(['/login']);
  //     }
  //   });
  // }
}
