import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AmortizationState } from './amortization.reducer';

// Feature Selector
export const selectAmortizationState =
  createFeatureSelector<AmortizationState>('amortization');

// Selectors
export const selectAmortizationSchedule = createSelector(
  selectAmortizationState,
  (state) => state.schedule
);

export const selectAmortizationLoading = createSelector(
  selectAmortizationState,
  (state) => state.isLoading
);

export const selectAmortizationError = createSelector(
  selectAmortizationState,
  (state) => state.error
);



