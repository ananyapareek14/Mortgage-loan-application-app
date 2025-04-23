// import { TestBed } from '@angular/core/testing';
// import { StoreModule } from '@ngrx/store';
// import { authReducer, AuthState } from './auth.reducer';
// import { login, loginSuccess, loginFailure, logout } from './auth.actions';
// import ILogin, { ILoginCredentials } from '../../models/IAuth';

// describe('AuthReducer', () => {
//   let initialState: AuthState;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [StoreModule.forRoot({ auth: authReducer })],
//     });

//     initialState = {
//       token: null,
//       username: null,
//       message: null,
//       isLoading: false,
//     };
//   });

//   it('should return the initial state', () => {
//     const action = { type: 'NOOP' } as any;
//     const state = authReducer(undefined, action);

//     expect(state).toEqual(initialState);
//   });

//   it('should set isLoading to true and clear message on login action', () => {
//     const credentials: ILoginCredentials = {
//       username: 'testuser',
//       password: 'testpass',
//     };
//     const action = login({ credentials });
//     const state = authReducer(initialState, action);

//     expect(state.isLoading).toBe(true);
//     expect(state.message).toBeNull();
//   });

//   it('should update state correctly on loginSuccess action', () => {
//     const loginData: ILogin = {
//       token: 'test-token',
//       username: 'test-user',
//       message: 'Login successful',
//     };
//     const action = loginSuccess({ loginData });
//     const state = authReducer(initialState, action);

//     expect(state.token).toBe(loginData.token);
//     expect(state.username).toBe(loginData.username);
//     expect(state.message).toBe(loginData.message);
//     expect(state.isLoading).toBe(false);
//   });

//   it('should update state correctly on loginFailure action', () => {
//     const error = 'Login failed';
//     const action = loginFailure({ error });
//     const state = authReducer(initialState, action);

//     expect(state.token).toBeNull();
//     expect(state.username).toBeNull();
//     expect(state.isLoading).toBe(false);
//     expect(state.message).toBe(error);
//   });

//   it('should reset state to initial values on logout action', () => {
//     const loggedInState: AuthState = {
//       token: 'existing-token',
//       username: 'existing-user',
//       message: null,
//       isLoading: false,
//     };
//     const action = logout();
//     const state = authReducer(loggedInState, action);

//     expect(state).toEqual(initialState);
//   });

//   it('should handle login action when already logged in', () => {
//     const loggedInState: AuthState = {
//       token: 'existing-token',
//       username: 'existing-user',
//       message: null,
//       isLoading: false,
//     };
//     const credentials: ILoginCredentials = {
//       username: 'newuser',
//       password: 'newpass',
//     };
//     const action = login({ credentials });
//     const state = authReducer(loggedInState, action);

//     expect(state.isLoading).toBe(true);
//     expect(state.message).toBeNull();
//     expect(state.token).toBe('existing-token');
//     expect(state.username).toBe('existing-user');
//   });

//   it('should handle loginSuccess action with empty token and username', () => {
//     const loginData: ILogin = {
//       token: '',
//       username: '',
//       message: 'Empty login',
//     };
//     const action = loginSuccess({ loginData });
//     const state = authReducer(initialState, action);

//     expect(state.token).toBe('');
//     expect(state.username).toBe('');
//     expect(state.message).toBe('Empty login');
//     expect(state.isLoading).toBe(false);
//   });

//   it('should handle loginFailure action with empty error message', () => {
//     const action = loginFailure({ error: '' });
//     const state = authReducer(initialState, action);

//     expect(state.token).toBeNull();
//     expect(state.username).toBeNull();
//     expect(state.isLoading).toBe(false);
//     expect(state.message).toBe('');
//   });

//   it('should not modify state for unknown action', () => {
//     const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
//     const state = authReducer(initialState, unknownAction);

//     expect(state).toEqual(initialState);
//   });

//   it('should handle multiple actions in sequence', () => {
//     const credentials: ILoginCredentials = {
//       username: 'testuser',
//       password: 'testpass',
//     };
//     let state = authReducer(initialState, login({ credentials }));
//     expect(state.isLoading).toBe(true);

//     const loginData: ILogin = {
//       token: 'new-token',
//       username: 'new-user',
//       message: 'Login successful',
//     };
//     state = authReducer(state, loginSuccess({ loginData }));
//     expect(state.token).toBe('new-token');
//     expect(state.username).toBe('new-user');
//     expect(state.message).toBe('Login successful');

//     state = authReducer(state, logout());
//     expect(state).toEqual(initialState);
//   });

//   // Edge cases
//   it('should handle loginSuccess with very long token and username', () => {
//     const longToken = 'a'.repeat(1000);
//     const longUsername = 'b'.repeat(1000);
//     const loginData: ILogin = {
//       token: longToken,
//       username: longUsername,
//       message: 'Long login',
//     };
//     const action = loginSuccess({ loginData });
//     const state = authReducer(initialState, action);

//     expect(state.token).toBe(longToken);
//     expect(state.username).toBe(longUsername);
//     expect(state.message).toBe('Long login');
//     expect(state.isLoading).toBe(false);
//   });

//   it('should handle login with special characters in credentials', () => {
//     const credentials: ILoginCredentials = {
//       username: 'user@example.com',
//       password: 'p@ssw0rd!',
//     };
//     const action = login({ credentials });
//     const state = authReducer(initialState, action);

//     expect(state.isLoading).toBe(true);
//     expect(state.message).toBeNull();
//   });

//   it('should handle loginFailure with a very long error message', () => {
//     const longError = 'e'.repeat(1000);
//     const action = loginFailure({ error: longError });
//     const state = authReducer(initialState, action);

//     expect(state.token).toBeNull();
//     expect(state.username).toBeNull();
//     expect(state.isLoading).toBe(false);
//     expect(state.message).toBe(longError);
//   });
// });