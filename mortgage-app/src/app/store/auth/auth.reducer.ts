import { createReducer, on } from '@ngrx/store';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';

export interface AuthState {
  token: string | null;
  username: string | null;
  error: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  token: null,
  username: null,
  error: null,
  isLoading: false
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(loginSuccess, (state, { token, username }) => ({
    ...state,
    token,
    username,
    isLoading: false,
    error: null,
  })),

  on(loginFailure, (state, { error }) => ({
    ...state,
    token: null,
    username: null,
    isLoading: false,
    error,
  })),
  on(logout, () => ({
    token: null,
    username: null,
    error: null,
    isLoading: false
  }))
);
