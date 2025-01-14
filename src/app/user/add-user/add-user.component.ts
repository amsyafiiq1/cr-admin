import { NgClass } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarService } from '../../shared/service/avatar.service';
import { AuthStore } from '../../shared/store/auth.store';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { UserService } from '../../shared/service/user.service';
import { UserStore } from '../../shared/store/user.store';
import { Router } from '@angular/router';
import { VehicleTypeService } from '../../shared/service/vehicle-type.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, KeyFilterModule, FileUploadModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddComponent {
  fb = inject(FormBuilder);
  avatarService = inject(AvatarService);
  authStore = inject(AuthStore);
  userStore = inject(UserStore);
  router = inject(Router);
  vehicleTypeService = inject(VehicleTypeService);

  isPasswordShow = signal(false);
  file = signal<File | undefined>(undefined);
  isImageSet = false;
  vehicleTypes = toSignal(this.vehicleTypeService.getAll());

  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        Validators.required,
      ],
    ],
    password: ['', [Validators.minLength(8), Validators.required]],
    type: [
      'Administrator' as 'Administrator' | 'User' | 'Runner',
      Validators.required,
    ],
    name: ['', Validators.required],
    photo: [undefined as File | undefined],
    id: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', Validators.required],
    vehicle: [1, runnerRequired],
    plate: ['', runnerRequired],
  });

  constructor() {
    effect(() => {
      if (this.userStore.status() === 'success') {
        this.router.navigate(['/user']);
      }

      // this.form.valueChanges.subscribe(() => {
      //   // console.log(this.form);
      // });

      const img = document.getElementById('image') as HTMLImageElement;
      if (this.isPasswordShow()) {
        document.getElementById('password')!.setAttribute('type', 'text');
      } else {
        document.getElementById('password')!.setAttribute('type', 'password');
      }

      if (this.file()) {
        img.src = URL.createObjectURL(this.file()!);
        this.isImageSet = true;
      } else {
        img.src = '';
        this.isImageSet = false;
      }
    });
  }

  passwordShow() {
    this.isPasswordShow.update(() => !this.isPasswordShow());
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      (document.getElementById('my_modal_2') as HTMLDialogElement).showModal();
      (document.getElementById('fileUpload') as HTMLInputElement).value = '';
    } else {
      this.file.set(file);
    }
  }

  goToTab(tabNumber: string) {
    (document.getElementById(tabNumber)! as HTMLInputElement).checked = true;
  }

  submit() {
    const data = this.form.getRawValue();
    data.photo = this.file();

    this.userStore.addUser(data);
  }

  // required only when type is Runner
}

function runnerRequired(control: AbstractControl): ValidationErrors | null {
  const formGroup = control.parent as FormGroup;
  if (formGroup) {
    const typeControl = formGroup.get('type');
    if (typeControl) {
      typeControl.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
      });
      if (typeControl.value === 'Runner') {
        return Validators.required(control);
      }
    }
  }
  return null;
}
