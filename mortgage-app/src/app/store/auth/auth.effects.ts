import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth/auth.service';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          tap(() => console.log('Login API call made...')),
          map((response) => {
            localStorage.setItem('auth', JSON.stringify(response));
            return loginSuccess({ token: response.token, username: response.username });
          }),
          catchError((error) => {
            console.error('Login API error:', error);
            return of(loginFailure({ error: 'Login failed. Please try again.' }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']); // Adjust to your routing logic
        })
      ),
    { dispatch: false }
  );
}
