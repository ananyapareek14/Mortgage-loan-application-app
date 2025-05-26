// import { createFeatureSelector, createSelector } from '@ngrx/store';
// import { VaMortgageState } from './va-mortgage.reducer';

// export const selectVaMortgageState = createFeatureSelector<VaMortgageState>('vaMortgage');

// export const selectVaMortgageResult = createSelector(
//   selectVaMortgageState,
//   (state) => state.result
// );

// export const selectVaMortgageLoading = createSelector(
//   selectVaMortgageState,
//   (state) => state.loading
// );

// export const selectVaMortgageError = createSelector(
//   selectVaMortgageState,
//   (state) => state.error
// );

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VaMortgageState } from './va-mortgage.reducer';

export const selectVaMortgageState =
  createFeatureSelector<VaMortgageState>('vaMortgage');

export const selectVaMortgageResult = createSelector(
  selectVaMortgageState,
  (state) => state?.result ?? null
);

export const selectVaMortgageLoading = createSelector(
  selectVaMortgageState,
  (state) => state?.loading ?? false
);

export const selectVaMortgageError = createSelector(
  selectVaMortgageState,
  (state) => state?.error ?? null
);