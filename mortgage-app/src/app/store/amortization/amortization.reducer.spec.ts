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

  it('should set isLoading to true and clear error when calculateAmortization is dispatched', () => {
    const action = fromActions.calculateAmortization({
      request: { loanAmount: 10000, interestRate: 5, term: 12 } as any,
    });

    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBeTrue();
    expect(state.error).toBeNull();
  });


  it('should update schedule and set isLoading to false on calculateAmortizationSuccess', () => {
    const schedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 9200,
      },
    ];

    const action = fromActions.calculateAmortizationSuccess({ schedule });
    const state = amortizationReducer(initialState, action);

    expect(state.schedule).toEqual(schedule);
    expect(state.isLoading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('should set error and isLoading to false on calculateAmortizationFailure', () => {
    const error = 'Calculation failed';
    const action = fromActions.calculateAmortizationFailure({ error });

    const state = amortizationReducer(initialState, action);

    expect(state.error).toBe(error);
    expect(state.isLoading).toBeFalse();
  });

  it('should reset to initial state on resetAmortization', () => {
    const modifiedState: AmortizationState = {
      schedule: [
        {
          PaymentNumber: 1,
          PaymentDate: new Date(),
          MonthlyPayment: 1000,
          PrincipalPayment: 800,
          InterestPayment: 200,
          RemainingBalance: 9200,
        },
      ],
      loading: true,
      error: 'Some error',
      isLoading: true,
    };

    const action = fromActions.resetAmortization();
    const state = amortizationReducer(modifiedState, action);

    expect(state).toEqual(initialState);
  });

});
