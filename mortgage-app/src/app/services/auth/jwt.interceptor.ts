import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, distinctUntilChanged, first, Observable, switchMap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.state';
import { selectAuthToken } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})

export class jwtInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Retrieve the token from localStorage
    const storedAuth = localStorage.getItem('auth');
    let token = null;

    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      token = authData.token;
    }

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
