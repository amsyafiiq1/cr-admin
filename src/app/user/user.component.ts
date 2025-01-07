import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '../shared/store/user.store';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  userStore = inject(UserStore);

  constructor() {
    this.userStore.getUsers({});

    effect(() => {
      console.log(this.userStore.users());
    });
  }
}
