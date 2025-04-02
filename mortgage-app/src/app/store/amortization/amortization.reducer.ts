import { createReducer, on } from '@ngrx/store';
import {
  loadAmortizationSchedule,
  loadAmortizationScheduleSuccess,
  loadAmortizationScheduleFailure,
  calculateAmortization,
  calculateAmortizationSuccess,
  calculateAmortizationFailure,
} from './amortization.actions';
import { IAmortizationSchedule } from '../../models/IAmortizationSchedule';

export interface AmortizationState {
  schedule: IAmortizationSchedule[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AmortizationState = {
  schedule: null,
  loading: false,
  error: null,
};

export const amortizationReducer = createReducer(
  initialState,

  // Load Amortization
  on(loadAmortizationSchedule, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadAmortizationScheduleSuccess, (state, { schedule }) => ({
    ...state,
    schedule,
    loading: false,
    error: null,
  })),
  on(loadAmortizationScheduleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Calculate Amortization
  on(calculateAmortization, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(calculateAmortizationSuccess, (state, { schedule }) => ({
    ...state,
    schedule,
    loading: false,
    error: null,
  })),
  on(calculateAmortizationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
