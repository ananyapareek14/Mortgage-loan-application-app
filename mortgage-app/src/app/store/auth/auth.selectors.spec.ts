// import { TestBed } from '@angular/core/testing';
// import { Store, StoreModule } from '@ngrx/store';
// import {
//   selectAuthState,
//   selectAuthToken,
//   selectAuthError,
//   selectIsLoading,
//   selectAuthUsername,
// } from './auth.selectors';
// import { AuthState, initialAuthState } from './auth.state';

// describe('Auth Selectors', () => {
//   let store: Store<{ auth: AuthState }>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         StoreModule.forRoot({}),
//         StoreModule.forFeature('auth', {} as any),
//       ],
//     });

//     store = TestBed.inject(Store);
//   });

//   describe('selectAuthState', () => {
//     it('should select the auth state', () => {
//       let result: AuthState | undefined;
//       store.select(selectAuthState).subscribe((value) => {
//         result = value;
//       });

//       store.setState({ auth: initialAuthState });

//       expect(result).toEqual(initialAuthState);
//     });
//   });

//   describe('selectAuthUsername', () => {
//     it('should return the username when present', () => {
//       const state: AuthState = { ...initialAuthState, username: 'testuser' };

//       let result: string | null | undefined;
//       store.select(selectAuthUsername).subscribe((value) => {
//         result = value;
//       });

//       store.setState({ auth: state });

//       expect(result).toBe('testuser');
//     });

//     it('should return null when username is not present', () => {
//       let result: string | null | undefined;
//       store.select(selectAuthUsername).subscribe((value) => {
//         result = value;
//       });

//       store.setState({ auth: initialAuthState });

//       expect(result).toBeNull();
//     });
//   });

//   describe('selectAuthToken', () => {
//     it('should return the auth token when present', () => {
//       const state: AuthState = { ...initialAuthState, token: 'test-token' };

//       let result: string | null | undefined;
//       store.select(selectAuthToken).subscribe((value) => {
//         result = value;
//       });

//       store.setState({ auth: state });

//       expect(result).toBe('test-token');
//     });

//     it('should return null when auth token is not present', () => {
//       let result: string | null | undefined;
//       store.select(selectAuthToken).subscribe((value) => {
//         result = value;
//       });

//       store.setState({ auth: initialAuthState });

//       expect(result).toBeNull();
//     });
//   });

//   describe('selectAuthError', () => {
//     it('should return the error message when present', () => {
//       const state: AuthState = {
//         ...initialAuthState,
//         error: 'Authentication failed',
//       };

//       let result: string | null | undefined;
//       store.select(selectAuthError).subscribe((value) => {
//         result = value;
//       });

//       store.setState({ auth: state });

//       expect(result).toBe('Authentication failed');
//     });

//     it('should return null when no error is present', () => {
//       let result: string | null | undefined;
//       store.select(selectAuthError).subscribe((value) => {
//         result = value;
//       });

//       store.setState({ auth: initialAuthState });

//       expect(result).toBeNull();
//     });
//   });

//   describe('selectIsLoading', () => {
//     it('should return true when isLoading is true', () => {
//       const state: AuthState = { ...initialAuthState, isLoading: true };

//       let result: boolean | undefined;
//       store.select(selectIsLoading).subscribe((value) => {
//         result = value;
//       });

//       store.setState({ auth: state });

//       expect(result).toBe(true);
//     });

//     it('should return false when isLoading is false', () => {
//       let result: boolean | undefined;
//       store.select(selectIsLoading).subscribe((value) => {
//         result = value;
//       });

//       store.setState({ auth: initialAuthState });

//       expect(result).toBe(false);
//     });
//   });

//   // Edge case: Empty state
//   it('should handle empty state', () => {
//     const emptyState = {};

//     store.setState(emptyState);

//     store.select(selectAuthState).subscribe((value) => {
//       expect(value).toBeUndefined();
//     });

//     store.select(selectAuthUsername).subscribe((value) => {
//       expect(value).toBeUndefined();
//     });

//     store.select(selectAuthToken).subscribe((value) => {
//       expect(value).toBeUndefined();
//     });

//     store.select(selectAuthError).subscribe((value) => {
//       expect(value).toBeUndefined();
//     });

//     store.select(selectIsLoading).subscribe((value) => {
//       expect(value).toBeUndefined();
//     });
//   });

//   // Boundary condition: Large username and token
//   it('should handle large username and token', () => {
//     const largeString = 'a'.repeat(10000);
//     const state: AuthState = {
//       ...initialAuthState,
//       username: largeString,
//       token: largeString,
//     };

//     let usernameResult: string | null | undefined;
//     let tokenResult: string | null | undefined;

//     store.select(selectAuthUsername).subscribe((value) => {
//       usernameResult = value;
//     });

//     store.select(selectAuthToken).subscribe((value) => {
//       tokenResult = value;
//     });

//     store.setState({ auth: state });

//     expect(usernameResult).toBe(largeString);
//     expect(usernameResult?.length).toBe(10000);
//     expect(tokenResult).toBe(largeString);
//     expect(tokenResult?.length).toBe(10000);
//   });

//   // Error handling: Incorrect state shape
//   it('should handle incorrect state shape', () => {
//     const incorrectState = {
//       auth: {
//         unexpectedField: 'value',
//       },
//     };

//     store.setState(incorrectState);

//     store.select(selectAuthUsername).subscribe((value) => {
//       expect(value).toBeUndefined();
//     });

//     store.select(selectAuthToken).subscribe((value) => {
//       expect(value).toBeUndefined();
//     });

//     store.select(selectAuthError).subscribe((value) => {
//       expect(value).toBeUndefined();
//     });

//     store.select(selectIsLoading).subscribe((value) => {
//       expect(value).toBeUndefined();
//     });
//   });
// });
