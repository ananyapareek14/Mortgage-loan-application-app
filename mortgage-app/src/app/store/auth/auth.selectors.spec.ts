// import { TestBed } from '@angular/core/testing';
// import { selectAuthState } from './auth.selectors';
// import { Store } from '@ngrx/store';
// import { MockStore, provideMockStore } from '@ngrx/store/testing';

// describe('Auth Selectors', () => {
//   let store: MockStore;
  
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [provideMockStore()]
//     });

//     store = TestBed.inject(MockStore);
//   });

//   it('should select the auth state', () => {
//     const mockAuthState = { token: 'mock-token', username: 'user', error: null, isLoading: false };
//     store.setState({ auth: mockAuthState });

//     store.select(selectAuthState).subscribe(state => {
//       expect(state).toEqual(mockAuthState);
//     });
//   });
// });


import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  selectAuthState,
  selectAuthToken,
  selectAuthError,
  selectIsLoading,
} from './auth.selectors';

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

  // it('should select the auth token', () => {
  //   store.setState(initialState); // Ensure the state is set before selecting
  //   store.select(selectAuthToken).subscribe((token) => {
  //     expect(token).toBe('mock-token');
  //   });
  // });

  // it('should select the auth error', () => {
  //   store.setState(initialState); // Ensure the state is set before selecting
  //   store.select(selectAuthError).subscribe((error) => {
  //     expect(error).toBe('mock-error');
  //   });
  // });

  it('should select the loading status', () => {
    store.setState(initialState); // Ensure the state is set before selecting
    store.select(selectIsLoading).subscribe((isLoading) => {
      expect(isLoading).toBeFalse();
    });
  });
});

