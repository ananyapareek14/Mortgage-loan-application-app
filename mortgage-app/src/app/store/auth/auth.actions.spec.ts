import * as AuthActions from './auth.actions';
import { ILoginCredentials } from '../../models/IAuth';

describe('Auth Actions', () => {

  it('should create the login action with the correct payload', () => {
    const credentials: ILoginCredentials = {
      username: 'test@example.com',
      password: 'password123'
    };

    const action = AuthActions.login({ credentials });

    expect(action.type).toBe('[Auth] Login');
    expect(action.credentials).toEqual(credentials);
  });

  it('should create the loginSuccess action with the correct payload', () => {
    const username = 'testuser';
    const token = 'mock-jwt-token';

    const action = AuthActions.loginSuccess({ username, token });

    expect(action.type).toBe('[Auth] Login Success');
    expect(action.username).toBe(username);
    expect(action.token).toBe(token);
  });

  it('should create the loginFailure action with the correct error payload', () => {
    const error = 'Invalid credentials';

    const action = AuthActions.loginFailure({ error });

    expect(action.type).toBe('[Auth] Login Failure');
    expect(action.error).toBe(error);
  });

  it('should create the logout action with no payload', () => {
    const action = AuthActions.logout();

    expect(action.type).toBe('[Auth] Logout');
  });

});
