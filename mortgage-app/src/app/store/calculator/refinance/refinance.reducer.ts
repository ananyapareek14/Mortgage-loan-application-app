import { createReducer, on } from '@ngrx/store';
import {
  calculateRefinance,
  calculateRefinanceSuccess,
  calculateRefinanceFailure,
  resetRefinance,
} from './refinance.actions';
import { IRefinance } from '../../../models/IRefinance';

export interface RefinanceState {
  result: IRefinance | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RefinanceState = {
  result: null,
  isLoading: false,
  error: null,
};

export const refinanceReducer = createReducer(
  initialState,
  on(calculateRefinance, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(calculateRefinanceSuccess, (state, { result }) => ({
    ...state,
    result,
    isLoading: false,
  })),
  on(calculateRefinanceFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(resetRefinance, () => initialState)
);
