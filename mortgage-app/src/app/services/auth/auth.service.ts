import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import ILogin, { ILoginCredentials } from '../../models/IAuth';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.state';
import { login, loginFailure, loginSuccess, logout } from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private store: Store<AuthState>) {}

  login(credentials: ILoginCredentials) : Observable<ILogin> {
    this.store.dispatch(login({ credentials }));
    return this.http.post<ILogin>(`${this.apiUrl}/auth/login`, credentials);
  }
}


