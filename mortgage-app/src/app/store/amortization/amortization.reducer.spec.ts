import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { amortizationReducer, AmortizationState } from './amortization.reducer';
import * as AmortizationActions from './amortization.actions';
import { IAmortizationRequest, IAmortizationSchedule } from '../../models/IAmortizationSchedule';

describe('AmortizationReducer', () => {
  let store: Store<AmortizationState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ amortization: amortizationReducer })],
    });

    store = TestBed.inject(Store);
  });

  it('should return the initial state', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: false,
    };

    const action = { type: 'NOOP' };
    const state = amortizationReducer(undefined, action);

    expect(state).toEqual(initialState);
  });

  it('should set isLoading to true when loadAmortizationSchedule is dispatched', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: false,
    };

    const action = AmortizationActions.loadAmortizationSchedule({
      userLoanNumber: 101,
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update state correctly when loadAmortizationScheduleSuccess is dispatched', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: true,
    };

    const mockSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date('2023-06-01'),
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 99000,
      },
    ];

    const action = AmortizationActions.loadAmortizationScheduleSuccess({
      schedule: mockSchedule,
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.schedule).toEqual(mockSchedule);
  });

  it('should set error and isLoading to false when loadAmortizationScheduleFailure is dispatched', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: true,
    };

    const errorMessage = 'An error occurred';
    const action = AmortizationActions.loadAmortizationScheduleFailure({
      error: errorMessage,
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should set isLoading to true when calculateAmortization is dispatched', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: false,
      };
      
      const mockLoanRequest: IAmortizationRequest = {
        LoanAmount: 100000,
        InterestRate: 5,
        LoanTermYears: 30,
      };

    const action = AmortizationActions.calculateAmortization({
      request: mockLoanRequest,
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update state correctly when calculateAmortizationSuccess is dispatched', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: true,
    };

    const mockSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date('2023-06-01'),
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 99000,
      },
    ];

    const action = AmortizationActions.calculateAmortizationSuccess({
      schedule: mockSchedule,
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.schedule).toEqual(mockSchedule);
  });

  it('should set error and isLoading to false when calculateAmortizationFailure is dispatched', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: true,
    };

    const errorMessage = 'Calculation failed';
    const action = AmortizationActions.calculateAmortizationFailure({
      error: errorMessage,
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should reset state to initial state when resetAmortization is dispatched', () => {
    const currentState: AmortizationState = {
      schedule: [
        {
          PaymentNumber: 1,
          PaymentDate: new Date('2023-06-01'),
          MonthlyPayment: 1000,
          PrincipalPayment: 800,
          InterestPayment: 200,
          RemainingBalance: 99000,
        },
      ],
      loading: false,
      error: 'Some error',
      isLoading: true,
    };

    const action = AmortizationActions.resetAmortization();
    const state = amortizationReducer(currentState, action);

    expect(state).toEqual({
      schedule: null,
      loading: false,
      error: null,
      isLoading: false,
    });
  });

  // Edge case: Dispatching actions in sequence
  it('should handle multiple actions in sequence correctly', () => {
    let state: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: false,
    };

    state = amortizationReducer(
      state,
      AmortizationActions.loadAmortizationSchedule({
        userLoanNumber: 101,
      })
    );
    expect(state.isLoading).toBe(true);

    const mockSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date('2023-06-01'),
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 99000,
      },
    ];
    state = amortizationReducer(
      state,
      AmortizationActions.loadAmortizationScheduleSuccess({
        schedule: mockSchedule,
      })
    );
    expect(state.isLoading).toBe(false);
    expect(state.schedule).toEqual(mockSchedule);

    state = amortizationReducer(state, AmortizationActions.resetAmortization());
    expect(state).toEqual({
      schedule: null,
      loading: false,
      error: null,
      isLoading: false,
    });
  });

  // Boundary condition: Empty schedule
  it('should handle empty schedule correctly', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: true,
    };

    const action = AmortizationActions.loadAmortizationScheduleSuccess({
      schedule: [],
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.schedule).toEqual([]);
  });

  // Error handling: Null error
  it('should handle null error correctly', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: 'Previous error',
      isLoading: true,
    };

    const action = AmortizationActions.loadAmortizationScheduleFailure({
      error: null,
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  // Edge case: Large loan amount
  it('should handle large loan amount correctly', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: true,
    };

    const mockSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date('2023-06-01'),
        MonthlyPayment: 1000000,
        PrincipalPayment: 800000,
        InterestPayment: 200000,
        RemainingBalance: 99000000,
      },
    ];

    const action = AmortizationActions.calculateAmortizationSuccess({
      schedule: mockSchedule,
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.schedule).toEqual(mockSchedule);
  });

  // Edge case: Zero interest rate
  it('should handle zero interest rate correctly', () => {
    const initialState: AmortizationState = {
      schedule: null,
      loading: false,
      error: null,
      isLoading: true,
    };

    const mockSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date('2023-06-01'),
        MonthlyPayment: 1000,
        PrincipalPayment: 1000,
        InterestPayment: 0,
        RemainingBalance: 99000,
      },
    ];

    const action = AmortizationActions.calculateAmortizationSuccess({
      schedule: mockSchedule,
    });
    const state = amortizationReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.schedule).toEqual(mockSchedule);
  });
});
