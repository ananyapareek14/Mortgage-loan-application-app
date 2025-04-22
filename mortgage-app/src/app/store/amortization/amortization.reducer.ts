import { createReducer, on } from '@ngrx/store';
import {
  loadAmortizationSchedule,
  loadAmortizationScheduleSuccess,
  loadAmortizationScheduleFailure,
  calculateAmortization,
  calculateAmortizationSuccess,
  calculateAmortizationFailure,
  resetAmortization,
  setState
} from './amortization.actions';
import { IAmortizationSchedule } from '../../models/IAmortizationSchedule';

export interface AmortizationState {
  schedule: IAmortizationSchedule[] | null;
  loading: boolean;
  error: string | null;
  isLoading: boolean;
}

const initialState: AmortizationState = {
  schedule: null,
  loading: false,
  error: null,
  isLoading: false
};

export const amortizationReducer = createReducer(
  initialState,

  // Load Amortization
  on(loadAmortizationSchedule, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(loadAmortizationScheduleSuccess, (state, { schedule }) => ({
    ...state,
    schedule,
    isLoading: false,
    error: null,
  })),
  on(loadAmortizationScheduleFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Calculate Amortization
  on(calculateAmortization, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(calculateAmortizationSuccess, (state, { schedule }) => ({
    ...state,
    schedule,
    isLoading: false,
    error: null,
  })),
  on(calculateAmortizationFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(setState, (_, { state }) => state || initialState),
  on(resetAmortization, () => initialState)
);
