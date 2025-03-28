import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import ILogin, { ILoginCredentials } from '../../models/IAuth';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../../state/auth/auth.state';
import { login, loginFailure, loginSuccess, logout } from '../../state/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
// export class AuthService {
//   private userNameSubject = new BehaviorSubject<string>('');
//   userName$ = this.userNameSubject.asObservable();
//   private readonly AUTH_KEY = 'auth';
//   private apiUrl = environment.apiUrl;
//   constructor(private http: HttpClient) {}

//   login(credentials: ILoginCredentials) {
//     return this.http
//       .post<ILogin>(`${this.apiUrl}/auth/login`, credentials, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }).pipe(
//         tap((loginresponse) => {
//           const username = loginresponse.username;
//           if (username){
//             this.setUserName(username);
//           }
//           localStorage.setItem(this.AUTH_KEY, JSON.stringify(loginresponse)
//         );
//       })
//     );
//   }

//   getAuthToken(): string | null {
//     const auth = localStorage.getItem(this.AUTH_KEY);
//     if (auth) {
//       const parsedAuth = JSON.parse(auth);
//       return parsedAuth.token || null; // Adjust "token" to match your backend's key
//     }
//     return null;
//   }

//   setUserName(username: string): void {
//     this.userNameSubject.next(username);
//     localStorage.setItem(this.AUTH_KEY, JSON.stringify({ username }));
//   }

//   isAuthenticated(): boolean {
//     return !!this.getAuthToken(); // Returns true if a token exists, false otherwise
//   }

//   logout() {
//     localStorage.removeItem(this.AUTH_KEY);
//   }
// }





export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private store: Store<AuthState>) {}

  login(credentials: ILoginCredentials) {
    this.store.dispatch(login({ credentials })); // Dispatch login action

    return this.http.post<ILogin>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('auth', JSON.stringify(response)); // Store in local storage
        this.store.dispatch(loginSuccess({ username: response.username, token: response.token }));
      }),
      catchError((error) => {
        this.store.dispatch(loginFailure({ error: 'Login failed. Please try again.' }));
        return throwError(() => new Error(error));
      })
    );
  }

  logout() {
    this.store.dispatch(logout()); // Dispatch logout action
  }
}


