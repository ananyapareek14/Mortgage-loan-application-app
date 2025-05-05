import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { login, loginSuccess, loginFailure } from './auth.actions';
import { hot, cold } from 'jasmine-marbles';
import ILogin, { ILoginCredentials } from '../../models/IAuth';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('login$', () => {
    it('should return a loginSuccess action on successful login', () => {
      const credentials: ILoginCredentials = {
        username: 'testuser',
        password: 'password123',
      };
      const loginAction = login({ credentials });
      const loginResponse = {
        token: 'test-token',
        username: 'testuser',
      };
      const outcome = loginSuccess(loginResponse);

      actions$ = hot('-a', { a: loginAction });
      const response = cold('-b|', { b: loginResponse });
      authService.login.and.returnValue(response);

      const expected = cold('--c', { c: outcome });
      expect(effects.login$).toBeObservable(expected);
    });

    it('should return a loginFailure action on login error', () => {
      const credentials: ILoginCredentials = {
        username: 'testuser',
        password: 'wrongpassword',
      };
      const loginAction = login({ credentials });
      const error = new Error('Invalid credentials');
      const outcome = loginFailure({
        error: 'Login failed. Please try again.',
      });

      actions$ = hot('-a', { a: loginAction });
      const response = cold('-#|', {}, error);
      authService.login.and.returnValue(response);

      const expected = cold('--c', { c: outcome });
      expect(effects.login$).toBeObservable(expected);
    });

    it('should store auth data in localStorage on successful login', () => {
      const credentials: ILoginCredentials = {
        username: 'testuser',
        password: 'password123',
      };
      const loginAction = login({ credentials });
      const loginResponse: ILogin = {
        token: 'test-token',
        username: 'testuser',
        message: 'Login successful',
      };

      actions$ = hot('-a', { a: loginAction });
      const response = cold('-b|', { b: loginResponse });
      authService.login.and.returnValue(response);

      effects.login$.subscribe(() => {
        expect(localStorage.getItem('auth')).toBe(
          JSON.stringify(loginResponse)
        );
      });
    });
  });

  // describe('loginSuccess$', () => {
  //   it('should navigate to dashboard on loginSuccess', () => {
  //     const loginSuccessAction = loginSuccess({
  //       token: 'test-token',
  //       username: 'testuser',
  //     });

  //     actions$ = hot('-a', { a: loginSuccessAction });

  //     effects.loginSuccess$.subscribe(() => {
  //       expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  //     });
  //   });
  // });

  // Edge case: Empty credentials
  // it('should handle login with empty credentials', () => {
  //   const credentials: ILoginCredentials = { username: '', password: '' };
  //   const loginAction = login({ credentials });
  //   const outcome = loginFailure({ error: 'Login failed. Please try again.' });

  //   actions$ = hot('-a', { a: loginAction });
  //   const response = cold('-#|', {}, new Error('Empty credentials'));
  //   authService.login.and.returnValue(response);

  //   const expected = cold('--c', { c: outcome });
  //   expect(effects.login$).toBeObservable(expected);
  // });

  // // Error handling: Network error
  // it('should handle network errors during login', () => {
  //   const credentials: ILoginCredentials = {
  //     username: 'testuser',
  //     password: 'password123',
  //   };
  //   const loginAction = login({ credentials });
  //   const networkError = new Error('Network Error');
  //   const outcome = loginFailure({ error: 'Login failed. Please try again.' });

  //   actions$ = hot('-a', { a: loginAction });
  //   const response = cold('-#|', {}, networkError);
  //   authService.login.and.returnValue(response);

  //   const expected = cold('--c', { c: outcome });
  //   expect(effects.login$).toBeObservable(expected);
  // });
});
