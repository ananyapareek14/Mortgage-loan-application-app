import { createAction, props } from '@ngrx/store';
import {
  IAmortizationRequest,
  IAmortizationSchedule,
} from '../../models/IAmortizationSchedule';

// Load amortization schedule for a loan
export const loadAmortizationSchedule = createAction(
  '[Amortization] Load Amortization Schedule',
  props<{ userLoanNumber: number }>()
);

export const loadAmortizationScheduleSuccess = createAction(
  '[Amortization] Load Amortization Schedule Success',
  props<{ schedule: IAmortizationSchedule[] }>()
);

export const loadAmortizationScheduleFailure = createAction(
  '[Amortization] Load Amortization Schedule Failure',
  props<{ error: string }>()
);

export const calculateAmortization = createAction(
  '[Amortization] Calculate Amortization',
  props<{ request: IAmortizationRequest }>()
);

export const calculateAmortizationSuccess = createAction(
  '[Amortization] Calculate Amortization Success',
  props<{ schedule: IAmortizationSchedule[] }>()
);

export const calculateAmortizationFailure = createAction(
  '[Amortization] Calculate Amortization Failure',
  props<{ error: string }>()
);

export const resetAmortization = createAction('[Amortization] Reset');
