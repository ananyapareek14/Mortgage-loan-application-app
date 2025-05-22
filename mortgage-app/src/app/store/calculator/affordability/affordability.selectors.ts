import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AffordabilityState } from './affordability.reducer';

export const selectAffordabilityState =
  createFeatureSelector<AffordabilityState>('affordability');

export const selectAffordabilityResult = createSelector(
  selectAffordabilityState,
  (state) => state.result
);

export const selectAffordabilityLoading = createSelector(
  selectAffordabilityState,
  (state) => state.isLoading
);

export const selectAffordabilityError = createSelector(
  selectAffordabilityState,
  (state) => state.error
);