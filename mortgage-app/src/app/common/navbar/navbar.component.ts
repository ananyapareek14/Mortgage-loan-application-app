import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn = false;
  username: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check if the user is logged in by checking local storage
    // const token = localStorage.getItem('auth');
    // if (token) {
    //   this.isLoggedIn = true;
    // }

    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        this.username = parsedAuth.username; // Extract username
        this.isLoggedIn = !!parsedAuth.token; // Check if token exists
      } catch (error) {
        console.error('Error parsing auth data:', error);
        this.isLoggedIn = false;
      }
    }
  }

  // Handle logout and clear local storage
  logout() {
    localStorage.removeItem('auth');
    this.isLoggedIn = false;
    // this.username = null;
    this.router.navigate(['/']); // Redirect to login or home page after logout
  }
}
