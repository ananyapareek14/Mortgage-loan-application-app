import { createAction, props } from '@ngrx/store';
import { ILoginCredentials } from '../../models/IAuth';


// User attempts login
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: ILoginCredentials }>()
);

// Login succeeds
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ username: string; token: string }>()
);

// Login fails
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout action
export const logout = createAction('[Auth] Logout');
