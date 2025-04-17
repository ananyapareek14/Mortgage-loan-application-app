import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  selectAuthState,
  selectAuthToken,
  selectAuthError,
  selectIsLoading,
} from './auth.selectors';
import { firstValueFrom } from 'rxjs';

describe('Auth Selectors', () => {
  let store: MockStore;

  const initialState = {
    auth: {
      token: 'mock-token',
      username: 'user',
      error: 'mock-error',
      isLoading: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
    });

    store = TestBed.inject(MockStore);
  });

  it('should select the auth state', () => {
    store.setState(initialState); // Ensure the state is set before selecting
    store.select(selectAuthState).subscribe((state) => {
      expect(state).toEqual(initialState.auth);
    });
  });

  it('should select the loading status', () => {
    store.setState(initialState); // Ensure the state is set before selecting
    store.select(selectIsLoading).subscribe((isLoading) => {
      expect(isLoading).toBeFalse();
    });
  });

  it('should select the auth token', async () => {
    const token = await firstValueFrom(store.select(selectAuthToken));
    expect(token).toBe('mock-token');
  });

});

