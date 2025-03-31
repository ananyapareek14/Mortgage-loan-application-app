import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUsername = createSelector(
  selectAuthState,
  (state) => state.username
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
