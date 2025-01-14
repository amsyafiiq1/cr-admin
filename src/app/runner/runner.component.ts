import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '../shared/store/user.store';
import { RunnerStore } from '../shared/store/runner.store';
import { NgClass } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { AuthStore } from '../shared/store/auth.store';
import { RunnerService } from '../shared/service/runner.service';

@Component({
  selector: 'app-runner',
  standalone: true,
  imports: [RouterLink, NgClass, DrawerModule],
  templateUrl: './runner.component.html',
  styleUrl: './runner.component.css',
})
export class RunnerComponent {
  userStore = inject(UserStore);
  runnerStore = inject(RunnerStore);
  authStore = inject(AuthStore);
  runnerService = inject(RunnerService);

  runners = this.runnerStore.runners;
  selectedId = signal<string>('');
  selectedRunner = computed(() => {
    if (this.selectedId() !== '') {
      return this.runners()!.find(
        (runner) => runner.user.id === this.selectedId()
      );
    } else {
      return null;
    }
  });
  drawerVisible = false;

  constructor() {
    this.runnerService.onChanges();

    this.runnerStore.getAll({});
    effect(() => {});

    this.userStore.getUsers({});
  }

  openDrawer(id: string) {
    this.drawerVisible = true;
    this.selectedId.set(id);
  }

  verify(id: string) {
    this.runnerStore.updateStatus({
      id,
      verifierId: this.authStore.user()!.uitmId,
      status: 'Verified',
    });
  }

  suspend(id: string) {
    this.runnerStore.updateStatus({
      id,
      verifierId: this.authStore.user()!.uitmId,
      status: 'Suspended',
    });
  }
}
