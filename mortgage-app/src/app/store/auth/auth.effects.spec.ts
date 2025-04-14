import { TestBed } from '@angular/core/testing';
import { AuthEffects } from './auth.effects';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { login, loginSuccess, loginFailure } from './auth.actions';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('Auth Effects', () => {
  let actions$: Actions;
  let authService: jasmine.SpyObj<AuthService>; // Use SpyObj
  let store: MockStore;
  let effects: AuthEffects;
  let router: Router;

  beforeEach(() => {
    // Create the spy object for AuthService
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });

    effects = TestBed.inject(AuthEffects);
    actions$ = TestBed.inject(Actions);
    store = TestBed.inject(MockStore);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;  // Get the spy instance
    router = TestBed.inject(Router);
  });

  it('should dispatch loginSuccess when login is successful', () => {
    const credentials = { username: 'test@example.com', password: 'password' };
    const loginResponse = { token: 'mock-token', username: 'user', message: 'Login successful' };
    actions$ = of(login({ credentials }));

    // Now, mock the login method to return a successful response
    authService.login.and.returnValue(of(loginResponse));  // Mock successful login

    effects.login$.subscribe(action => {
      expect(action).toEqual(loginSuccess({ token: loginResponse.token, username: loginResponse.username }));
    });
  });

  it('should dispatch loginFailure when login fails', () => {
    const credentials = { username: 'test@example.com', password: 'password' };
    actions$ = of(login({ credentials }));

    // Mock the login method to simulate an error
    authService.login.and.returnValue(throwError('error'));  // Mock failure response

    effects.login$.subscribe(action => {
      expect(action).toEqual(loginFailure({ error: 'Login failed. Please try again.' }));
    });
  });
});
