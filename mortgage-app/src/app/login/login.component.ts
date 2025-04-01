import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { selectAuthError, selectAuthToken} from '../store/auth/auth.selectors';
import { select, Store } from '@ngrx/store';
import { login } from '../store/auth/auth.actions';
import { Observable } from 'rxjs';
import { AuthState } from '../store/auth/auth.state';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
// export class LoginComponent {
//   credentials: { username: string; password: string } = {
//     username: '',
//     password: '',
//   };

//   constructor(private authService:AuthService, private router: Router) {}

//   login() {
//     this.authService.login(this.credentials).subscribe({
//       next: (loginResponse) => {
//         this.router.navigateByUrl('/home');
//       },
//       error: (err) => {
//         console.error('Login failed:', err);
//         alert('Login failed. Please check your credentials and try again.');
//       }
//     });
//   }
// }

export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage$: Observable<string | null>;
  authToken$: Observable<string | null>;
  
  constructor(private store: Store<AuthState>, private router: Router) {
    this.errorMessage$ = this.store.pipe(select(selectAuthError));
    this.authToken$ = this.store.pipe(select(selectAuthToken));

    this.authToken$.subscribe((token) => {
      if (token) {
        this.router.navigate(['/home']); // Navigate only when a token exists
      }
    });
  }

  login() {
    console.log('Dispatching login action');
    this.store.dispatch(login({ credentials: this.credentials }));
  }
  
}


