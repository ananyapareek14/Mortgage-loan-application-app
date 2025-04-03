  import { CommonModule } from '@angular/common';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { Component, OnInit } from '@angular/core';
  import { Router, RouterLink } from '@angular/router';
  import { selectAuthError, selectAuthToken, selectIsLoading} from '../store/auth/auth.selectors';
  import { select, Store } from '@ngrx/store';
  import { login } from '../store/auth/auth.actions';
  import { Observable } from 'rxjs';
  import { AuthState } from '../store/auth/auth.state';
import { ToastrService } from 'ngx-toastr';

  @Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
  })
  export class LoginComponent {
    credentials = { username: '', password: '' };
    isLoading$: Observable<boolean>;
    authError$: Observable<string | null>;

    constructor(
      private store: Store<AuthState>,
      private router: Router,
      private toastr: ToastrService
    ) {
      this.isLoading$ = this.store.pipe(select(selectIsLoading));
      this.authError$ = this.store.pipe(select(selectAuthError));
    }

    // ngOnInit() {
    //   this.isLoading$ = this.store.pipe(select(selectIsLoading));
    // }

    login() {
      this.store.dispatch(login({ credentials: this.credentials }));
      this.authError$.subscribe((error) => {
        if (error) {
          this.toastr.error(error, 'Login Failed');
        } else {
          this.toastr.success('Login successful!', 'Welcome');
          this.router.navigate(['/dashboard']); // Redirect after successful login
        }
      });
    }
  }


