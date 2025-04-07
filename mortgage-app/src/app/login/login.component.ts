  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { Component, OnDestroy, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { selectAuthError, selectAuthToken, selectIsLoading} from '../store/auth/auth.selectors';
  import { select, Store } from '@ngrx/store';
  import { login } from '../store/auth/auth.actions';
  import { Observable, Subject, takeUntil } from 'rxjs';
  import { AuthState } from '../store/auth/auth.state';
import { ToastrService } from 'ngx-toastr';
import { slideIn, slideOut } from '../../animations';

  @Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
  })
  export class LoginComponent implements OnInit, OnDestroy {
    credentials = { username: '', password: '' };
    isLoading$: Observable<boolean>;
    authError$: Observable<string | null>;
    authToken$: Observable<string | null>;
    private destroy$ = new Subject<void>();

    constructor(
      private store: Store<AuthState>,
      private router: Router,
      private toastr: ToastrService
    ) {
      this.isLoading$ = this.store.pipe(select(selectIsLoading));
      this.authError$ = this.store.pipe(select(selectAuthError));
      this.authToken$ = this.store.pipe(select(selectAuthToken));
    }

    ngOnInit() {
      this.authError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.toastr.error(error, 'Login Failed');
          this.credentials = { username: '', password: '' };
        }
      });

    this.authToken$
      .pipe(takeUntil(this.destroy$))
      .subscribe((token) => {
        if (token) {
          this.toastr.success('Login successful!', 'Welcome');
          this.router.navigate(['/dashboard']);
        }
      });
    }

    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }

    login() {
      this.store.dispatch(login({ credentials: this.credentials }));
    }
  }


