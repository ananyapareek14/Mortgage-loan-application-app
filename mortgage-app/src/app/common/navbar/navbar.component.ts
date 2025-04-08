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
    this.isLoggedIn$ = this.store.select(selectAuthToken).pipe(map(token => !!token));
    this.username$ = this.store.select(selectAuthState).pipe(map(state => state.username));
  }

  // Handle logout and clear local storage
  logout() {
    localStorage.removeItem('auth');
    this.store.dispatch(logout());
    this.router.navigate(['/login']); 
  }
}
