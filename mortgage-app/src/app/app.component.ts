import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './common/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loginSuccess } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'mortgage-app';
  hideNavbar = false;
  isAuthReady = false;

  constructor(private store: Store,private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideNavbar = event.urlAfterRedirects === '/login';
      }
    });
  }

  ngOnInit() {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { token, username } = JSON.parse(auth);
      this.store.dispatch(loginSuccess({ token, username }));
    }
    setTimeout(() => {
      this.isAuthReady = true;
    }); // allow state update to propagate
  }
}
