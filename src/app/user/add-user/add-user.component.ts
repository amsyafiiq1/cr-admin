import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddComponent {
  isPasswordShow = signal(false);

  constructor() {
    effect(() => {
      if (this.isPasswordShow()) {
        document.getElementById('password')!.setAttribute('type', 'text');
      } else {
        document.getElementById('password')!.setAttribute('type', 'password');
      }
    });
  }

  passwordShow() {
    this.isPasswordShow.update(() => !this.isPasswordShow());
  }
}
