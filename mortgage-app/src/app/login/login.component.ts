import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { ILoginCredentials } from '../models/IAuth';
import { selectAuthError, selectIsLoading } from '../store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { login } from '../store/auth/auth.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: { username: string; password: string } = {
    username: '',
    password: '',
  };

  constructor(private authService:AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (loginResponse) => {
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials and try again.');
      }
    });
  }
}


