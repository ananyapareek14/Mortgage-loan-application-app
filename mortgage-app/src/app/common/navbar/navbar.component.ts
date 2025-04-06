import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthState } from '../../store/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { selectAuthState, selectAuthToken } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn$!: Observable<boolean>;
  username: string | null = null;
  username$!: Observable<string | null>;

  constructor(private router: Router, private store: Store<AuthState>) {}

  ngOnInit() {
    // Check if the user is logged in by checking local storage
    // const token = localStorage.getItem('auth');
    // if (token) {
    //   this.isLoggedIn = true;
    // }

    this.isLoggedIn$ = this.store.select(selectAuthToken).pipe(map(token => !!token));
    this.username$ = this.store.select(selectAuthState).pipe(map(state => state.username));

    //const authData = localStorage.getItem('auth');
    //if (authData) {
    //  try {
    //    const parsedAuth = JSON.parse(authData);
    //    this.username = parsedAuth.username; // Extract username
    //    this.isLoggedIn = !!parsedAuth.token; // Check if token exists
    //  } catch (error) {
    //    console.error('Error parsing auth data:', error);
    //    this.isLoggedIn = false;  
    //  }
    //}
  }

  // Handle logout and clear local storage
  logout() {
    localStorage.removeItem('auth');
    //this.isLoggedIn = false;
    this.store.dispatch(logout());
    this.router.navigate(['/login']); // Redirect to login or home page after logout
  }
}
