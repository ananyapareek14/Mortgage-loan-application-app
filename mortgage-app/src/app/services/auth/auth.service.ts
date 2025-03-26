import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import ILogin, { ILoginCredentials } from '../../models/IAuth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth';
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(credentials: ILoginCredentials) {
    return this.http
      .post<ILogin>(`${this.apiUrl}/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(tap);
  }
}
