import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '../shared/store/user.store';
import { RunnerStore } from '../shared/store/runner.store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-runner',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './runner.component.html',
  styleUrl: './runner.component.css',
})
export class RunnerComponent {
  userStore = inject(UserStore);
  runnerStore = inject(RunnerStore);

  runners = this.runnerStore.runners;

  constructor() {
    this.runnerStore.getAll({});
    effect(() => {
      console.log(this.runnerStore.runners());
    });

    this.userStore.getUsers({});
  }
}
