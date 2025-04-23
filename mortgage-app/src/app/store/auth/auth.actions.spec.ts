// import { ILoginCredentials } from '../../models/IAuth';
// import ILogin from '../../models/IAuth';
// import * as AuthActions from './auth.actions';

// describe('Auth Actions', () => {
//   // Test for login action
//   it('should create a login action with credentials', () => {
//     const credentials: ILoginCredentials = {
//       username: 'testuser',
//       password: 'password123',
//     };
//     const action = AuthActions.login({ credentials });

//     expect(action.type).toBe('[Auth] Login');
//     expect(action.credentials).toEqual(credentials);
//   });

//   // Test for login action with empty credentials
//   it('should create a login action with empty credentials', () => {
//     const credentials: ILoginCredentials = { username: '', password: '' };
//     const action = AuthActions.login({ credentials });

//     expect(action.type).toBe('[Auth] Login');
//     expect(action.credentials).toEqual(credentials);
//   });

//   // Test for loginSuccess action
//   it('should create a loginSuccess action with login data', () => {
//     const loginData: ILogin = {
//       token: 'abc123',
//       username: 'testuser',
//       message: 'Login successful',
//     };
//     const action = AuthActions.loginSuccess({ loginData });

//     expect(action.type).toBe('[Auth] Login Success');
//     expect(action.loginData).toEqual(loginData);
//   });

//   // Test for loginSuccess action with empty strings
//   it('should create a loginSuccess action with empty strings', () => {
//     const loginData: ILogin = {
//       token: '',
//       username: '',
//       message: '',
//     };
//     const action = AuthActions.loginSuccess({ loginData });

//     expect(action.type).toBe('[Auth] Login Success');
//     expect(action.loginData).toEqual(loginData);
//   });

//   // Test for loginFailure action
//   it('should create a loginFailure action with an error message', () => {
//     const error = 'Invalid credentials';
//     const action = AuthActions.loginFailure({ error });

//     expect(action.type).toBe('[Auth] Login Failure');
//     expect(action.error).toBe(error);
//   });

//   // Test for loginFailure action with empty error message
//   it('should create a loginFailure action with an empty error message', () => {
//     const error = '';
//     const action = AuthActions.loginFailure({ error });

//     expect(action.type).toBe('[Auth] Login Failure');
//     expect(action.error).toBe(error);
//   });

//   // Test for logout action
//   it('should create a logout action', () => {
//     const action = AuthActions.logout();

//     expect(action.type).toBe('[Auth] Logout');
//   });

//   // Test for action type uniqueness
//   it('should have unique action types', () => {
//     const actionTypes = new Set([
//       AuthActions.login.type,
//       AuthActions.loginSuccess.type,
//       AuthActions.loginFailure.type,
//       AuthActions.logout.type,
//     ]);

//     expect(actionTypes.size).toBe(4);
//   });

//   // Test for action creator function types
//   it('should have correct action creator function types', () => {
//     expect(typeof AuthActions.login).toBe('function');
//     expect(typeof AuthActions.loginSuccess).toBe('function');
//     expect(typeof AuthActions.loginFailure).toBe('function');
//     expect(typeof AuthActions.logout).toBe('function');
//   });

//   // Edge case: Test for login action with special characters
//   it('should create a login action with special characters in credentials', () => {
//     const credentials: ILoginCredentials = {
//       username: 'user@example.com',
//       password: 'p@ssw0rd!',
//     };
//     const action = AuthActions.login({ credentials });

//     expect(action.type).toBe('[Auth] Login');
//     expect(action.credentials).toEqual(credentials);
//   });

//   // Edge case: Test for loginSuccess action with a very long token
//   it('should create a loginSuccess action with a very long token', () => {
//     const loginData: ILogin = {
//       token: 'a'.repeat(1000),
//       username: 'testuser',
//       message: 'Login successful',
//     };
//     const action = AuthActions.loginSuccess({ loginData });

//     expect(action.type).toBe('[Auth] Login Success');
//     expect(action.loginData).toEqual(loginData);
//   });

//   // Edge case: Test for loginFailure action with a very long error message
//   it('should create a loginFailure action with a very long error message', () => {
//     const error = 'e'.repeat(1000);
//     const action = AuthActions.loginFailure({ error });

//     expect(action.type).toBe('[Auth] Login Failure');
//     expect(action.error).toBe(error);
//   });
// });
