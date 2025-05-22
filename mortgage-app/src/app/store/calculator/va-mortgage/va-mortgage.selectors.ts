import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VaMortgageState } from './va-mortgage.reducer';

export const selectVaMortgageState = createFeatureSelector<VaMortgageState>('vaMortgage');

export const selectVaMortgageResult = createSelector(
  selectVaMortgageState,
  (state) => state.result
);

export const selectVaMortgageLoading = createSelector(
  selectVaMortgageState,
  (state) => state.loading
);

export const selectVaMortgageError = createSelector(
  selectVaMortgageState,
  (state) => state.error
);