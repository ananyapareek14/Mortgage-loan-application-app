import { authReducer } from './auth.reducer';
import { login, loginSuccess, loginFailure, logout } from './auth.actions';

describe('Auth Reducer', () => {
  it('should set isLoading to true when login is initiated', () => {
    const initialState = {
      token: null,
      username: null,
      error: null,
      isLoading: false
    };

    const action = login({ credentials: { username: 'test', password: 'test' } });
    const state = authReducer(initialState, action);

    expect(state.isLoading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should set token and username on loginSuccess', () => {
    const initialState = {
      token: null,
      username: null,
      error: null,
      isLoading: false
    };

    const action = loginSuccess({ token: 'mock-token', username: 'user' });
    const state = authReducer(initialState, action);

    expect(state.token).toBe('mock-token');
    expect(state.username).toBe('user');
    expect(state.isLoading).toBeFalse();
  });

  it('should set error on loginFailure', () => {
    const initialState = {
      token: null,
      username: null,
      error: null,
      isLoading: false
    };

    const action = loginFailure({ error: 'Login failed' });
    const state = authReducer(initialState, action);

    expect(state.error).toBe('Login failed');
  });

  it('should reset state on logout', () => {
    const loggedInState = {
      token: 'mock-token',
      username: 'user',
      error: 'Some error',
      isLoading: true,
    };

    const action = logout();
    const state = authReducer(loggedInState, action);

    expect(state).toEqual({
      token: null,
      username: null,
      error: null,
      isLoading: false,
    });
  });
});
