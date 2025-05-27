// import { createFeatureSelector, createSelector } from '@ngrx/store';
// import { RefinanceState } from './refinance.reducer';

import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RefinanceState } from "./refinance.reducer";

// export const selectRefinanceState =
//   createFeatureSelector<RefinanceState>('refinance');

// export const selectRefinanceResult = createSelector(
//   selectRefinanceState,
//   (state) => state.result
// );

// export const selectRefinanceLoading = createSelector(
//   selectRefinanceState,
//   (state) => state.isLoading
// );

// export const selectRefinanceError = createSelector(
//   selectRefinanceState,
//   (state) => state.error
// );

export const selectRefinanceState =
  createFeatureSelector<RefinanceState>('refinance');

export const selectRefinanceResult = createSelector(
  selectRefinanceState,
  (state) => state?.result ?? null
);

export const selectRefinanceLoading = createSelector(
  selectRefinanceState,
  (state) => state?.isLoading ?? false
);

export const selectRefinanceError = createSelector(
  selectRefinanceState,
  (state) => state?.error ?? null
);
