import { amortizationReducer, AmortizationState } from './amortization.reducer';
import * as fromActions from './amortization.actions';
import { IAmortizationSchedule } from '../../models/IAmortizationSchedule';

describe('Amortization Reducer', () => {
  const initialState: AmortizationState = {
    schedule: null,
    loading: false,
    error: null,
    isLoading: false
  };

  it('should set isLoading to true when loadAmortizationSchedule is dispatched', () => {
    const action = fromActions.loadAmortizationSchedule({ userLoanNumber: 123 });

    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBeTrue();
  });

  it('should set schedule when loadAmortizationScheduleSuccess is dispatched', () => {
    const schedule: IAmortizationSchedule[] = [{ PaymentNumber: 1, PaymentDate: new Date(), MonthlyPayment: 1000, PrincipalPayment: 900, InterestPayment: 100, RemainingBalance: 9900 }];
    const action = fromActions.loadAmortizationScheduleSuccess({ schedule });

    const state = amortizationReducer(initialState, action);

    expect(state.schedule).toEqual(schedule);
    expect(state.isLoading).toBeFalse();
  });

  it('should set error when loadAmortizationScheduleFailure is dispatched', () => {
    const error = 'Failed to load schedule';
    const action = fromActions.loadAmortizationScheduleFailure({ error });

    const state = amortizationReducer(initialState, action);

    expect(state.error).toBe(error);
    expect(state.isLoading).toBeFalse();
  });
});
