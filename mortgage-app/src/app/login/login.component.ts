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

export class LoginComponent {
  credentials = { username: '', password: '' };
  
  constructor(private store: Store<AuthState>, private router: Router) {}

  login() {
    console.log('Dispatching login action');
    this.store.dispatch(login({ credentials: this.credentials }));
  }
  
}


