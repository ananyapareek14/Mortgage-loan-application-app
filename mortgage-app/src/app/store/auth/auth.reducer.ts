// import { createReducer, on } from '@ngrx/store';
// import { login, loginSuccess, loginFailure, logout } from './auth.actions';
// import { AuthState, initialAuthState } from './auth.state';

// export const authReducer = createReducer(
//   initialAuthState,

//   on(login, (state) => ({
//     ...state,
//     loading: true,
//     error: null,
//   })),

//   on(loginSuccess, (state, { username, token }) => ({
//     ...state,
//     username,
//     token,
//     loading: false,
//     error: null,
//   })),

//   on(loginFailure, (state, { error }) => ({
//     ...state,
//     loading: false,
//     error,
//   })),

//   on(logout, () => {
//     localStorage.removeItem('auth'); // Clear local storage on logout
//     return initialAuthState;
//   })
// );

import { createReducer, on } from '@ngrx/store';
import { login, loginFailure, loginSuccess, logout } from './auth.actions';

export interface AuthState {
  token: string | null;
  username: string | null;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  username: null,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { token, username }) => ({
    ...state,
    token,
    username,
    error: null
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    token: null,
    username: null,
    error
  })),
  on(logout, () => ({
    token: null,
    username: null,
    error: null
  }))
);
