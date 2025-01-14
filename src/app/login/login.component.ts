import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/service/auth.service';
import { AuthStore } from '../shared/store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  authStore = inject(AuthStore);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.authStore.signed() === 'init') {
        return;
      }
      if (this.authStore.signed()) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    const rawForm = this.form.getRawValue();
    this.authStore.login({
      email: rawForm.email,
      password: rawForm.password,
    });
  }
}
