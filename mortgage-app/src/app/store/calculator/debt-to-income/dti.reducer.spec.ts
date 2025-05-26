import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { dtiReducer, DtiState, initialState } from './dti.reducer';
import * as DtiActions from './dti.actions';
import { IDebtToIncome } from '../../../models/IDebt-To-Income';

describe('DtiReducer', () => {
  let store: Store<DtiState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ dti: dtiReducer })],
    });

    store = TestBed.inject(Store);
  });

  it('should return the initial state', () => {
    const action = { type: 'NOOP' } as any;
    const state = dtiReducer(undefined, action);

    expect(state).toBe(initialState);
  });

  it('should set loading to true when calculateDti action is dispatched', () => {
    const action = DtiActions.calculateDti({
      request: {
        AnnualIncome: 80000,
        MinCreditCardPayments: 200,
        CarLoanPayments: 300,
        StudentLoanPayments: 250,
        ProposedMonthlyPayment: 1000,
        CalculateDefaultPayment: true,
      },
    });
    const state = dtiReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update state with result when calculateDtiSuccess action is dispatched', () => {
    const mockResult: IDebtToIncome = {
      DtiPercentage: 0.5,
      TotalDebts: 1000,
      ProposedMonthlyPayment: 500,
      RemainingMonthlyIncome: 1500,
    };
    const action = DtiActions.calculateDtiSuccess({ result: mockResult });
    const state = dtiReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.result).toEqual(mockResult);
  });

  it('should update state with error when calculateDtiFailure action is dispatched', () => {
    const mockError = new Error('Test error');
    const action = DtiActions.calculateDtiFailure({ error: mockError });
    const state = dtiReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError);
  });

  it('should reset state to initial state when resetDti action is dispatched', () => {
    const mockState: DtiState = {
      result: {
        DtiPercentage: 0.5,
        TotalDebts: 1000,
        ProposedMonthlyPayment: 500,
        RemainingMonthlyIncome: 1500,
      },
      loading: true,
      error: new Error('Test error'),
    };
    const action = DtiActions.resetDti();
    const state = dtiReducer(mockState, action);

    expect(state).toEqual(initialState);
  });

  it('should handle calculateDti action when state is already loading', () => {
    const loadingState: DtiState = { ...initialState, loading: true };
    const action = DtiActions.calculateDti({
      request: {
        AnnualIncome: 80000,
        MinCreditCardPayments: 200,
        CarLoanPayments: 300,
        StudentLoanPayments: 250,
        ProposedMonthlyPayment: 1000,
        CalculateDefaultPayment: true,
      },
    });
    const state = dtiReducer(loadingState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle calculateDtiSuccess action when state has previous error', () => {
    const errorState: DtiState = {
      ...initialState,
      error: new Error('Previous error'),
    };
    const mockResult: IDebtToIncome = {
      DtiPercentage: 0.5,
      TotalDebts: 1000,
      ProposedMonthlyPayment: 500,
      RemainingMonthlyIncome: 1500,
    };
    const action = DtiActions.calculateDtiSuccess({ result: mockResult });
    const state = dtiReducer(errorState, action);

    expect(state.loading).toBe(false);
    expect(state.result).toEqual(mockResult);
    expect(state.error).toBeNull();
  });

  it('should handle calculateDtiFailure action when state has previous result', () => {
    const resultState: DtiState = {
      ...initialState,
      result: {
        DtiPercentage: 0.5,
        TotalDebts: 1000,
        ProposedMonthlyPayment: 500,
        RemainingMonthlyIncome: 1500,
      },
    };
    const mockError = new Error('New error');
    const action = DtiActions.calculateDtiFailure({ error: mockError });
    const state = dtiReducer(resultState, action);

    expect(state.loading).toBe(false);
    expect(state.result).toBeNull();
    expect(state.error).toBe(mockError);
  });

  it('should not modify state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN' } as any;
    const state = dtiReducer(initialState, unknownAction);

    expect(state).toBe(initialState);
  });

  // Edge cases
  it('should handle calculateDtiSuccess with zero values', () => {
    const mockResult: IDebtToIncome = {
      DtiPercentage: 0,
      TotalDebts: 0,
      ProposedMonthlyPayment: 0,
      RemainingMonthlyIncome: 0,
    };
    const action = DtiActions.calculateDtiSuccess({ result: mockResult });
    const state = dtiReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.result).toEqual(mockResult);
  });

  it('should handle calculateDtiSuccess with very large values', () => {
    const mockResult: IDebtToIncome = {
      DtiPercentage: 1,
      TotalDebts: Number.MAX_SAFE_INTEGER,
      ProposedMonthlyPayment: Number.MAX_SAFE_INTEGER,
      RemainingMonthlyIncome: 0,
    };
    const action = DtiActions.calculateDtiSuccess({ result: mockResult });
    const state = dtiReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.result).toEqual(mockResult);
  });

  it('should handle calculateDtiFailure with a custom error object', () => {
    const mockError = { code: 'CUSTOM_ERROR', message: 'Custom error message' };
    const action = DtiActions.calculateDtiFailure({ error: mockError });
    const state = dtiReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toEqual(mockError);
  });
});
