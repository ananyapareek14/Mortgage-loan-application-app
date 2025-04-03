import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthToken = createSelector(selectAuthState, (state) => state.token);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);
