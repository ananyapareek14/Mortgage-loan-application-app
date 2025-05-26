import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  VaMortgageState,
  vaMortgageReducer,
  initialState,
} from './va-mortgage.reducer';
import * as VaMortgageActions from './va-mortgage.actions';
import { IVaMortgage, IVaMortgageRequest } from '../../../models/IVaMortgage';

describe('VaMortgageReducer', () => {
  let store: Store<VaMortgageState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ vaMortgage: vaMortgageReducer })],
    });

    store = TestBed.inject(Store);
  });

  it('should return the initial state', () => {
    const action = { type: 'NOOP' } as any;
    const state = vaMortgageReducer(undefined, action);

    expect(state).toBe(initialState);
  });

//   it('should set loading to true when calculateVaMortgage action is dispatched', () => {
//     const action = VaMortgageActions.calculateVaMortgage();
//     const state = vaMortgageReducer(initialState, action);

//     expect(state.loading).toBe(true);
//     expect(state.error).toBeNull();
//     expect(state.result).toBeNull();
    //   });
    
    it('should set loading to true when calculateVaMortgage action is dispatched', () => {
      const mockRequest: IVaMortgageRequest = {
        HomePrice: 300000,
        DownPayment: 60000,
        InterestRate: 3.5,
        LoanTermYears: 30,
      };

      const action = VaMortgageActions.calculateVaMortgage({
        request: mockRequest,
      });
      const state = vaMortgageReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.result).toBeNull();
    });
      

  it('should update state with result when calculateVaMortgageSuccess action is dispatched', () => {
    const mockResult: IVaMortgage[] = [
      {
        MonthNumber: 1,
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 99000,
      },
    ];
    const action = VaMortgageActions.calculateVaMortgageSuccess({
      result: mockResult,
    });
    const state = vaMortgageReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.result).toEqual(mockResult);
    expect(state.error).toBeNull();
  });

  it('should update state with error when calculateVaMortgageFailure action is dispatched', () => {
    const mockError = 'An error occurred';
    const action = VaMortgageActions.calculateVaMortgageFailure({
      error: mockError,
    });
    const state = vaMortgageReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError);
    expect(state.result).toBeNull();
  });

  it('should reset state to initial state when resetVaMortgage action is dispatched', () => {
    const previousState: VaMortgageState = {
      result: [
        {
          MonthNumber: 1,
          MonthlyPayment: 1000,
          PrincipalPayment: 800,
          InterestPayment: 200,
          RemainingBalance: 99000,
        },
      ],
      loading: true,
      error: 'Previous error',
    };
    const action = VaMortgageActions.resetVaMortgage();
    const state = vaMortgageReducer(previousState, action);

    expect(state).toEqual(initialState);
  });

  it('should handle empty result array in calculateVaMortgageSuccess', () => {
    const action = VaMortgageActions.calculateVaMortgageSuccess({ result: [] });
    const state = vaMortgageReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.result).toEqual([]);
    expect(state.error).toBeNull();
  });

  it('should handle null error in calculateVaMortgageFailure', () => {
    const action = VaMortgageActions.calculateVaMortgageFailure({
      error: null,
    });
    const state = vaMortgageReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.result).toBeNull();
  });

  it('should not modify state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' } as any;
    const state = vaMortgageReducer(initialState, unknownAction);

    expect(state).toBe(initialState);
  });

//   it('should handle multiple actions in sequence', () => {
//     let state = vaMortgageReducer(
//       initialState,
//       VaMortgageActions.calculateVaMortgage()
//     );
//     expect(state.loading).toBe(true);

//     const mockResult: IVaMortgage[] = [
//       {
//         MonthNumber: 1,
//         MonthlyPayment: 1000,
//         PrincipalPayment: 800,
//         InterestPayment: 200,
//         RemainingBalance: 99000,
//       },
//     ];
//     state = vaMortgageReducer(
//       state,
//       VaMortgageActions.calculateVaMortgageSuccess({ result: mockResult })
//     );
//     expect(state.loading).toBe(false);
//     expect(state.result).toEqual(mockResult);

//     state = vaMortgageReducer(state, VaMortgageActions.resetVaMortgage());
//     expect(state).toEqual(initialState);
    //   });
    
    it('should handle multiple actions in sequence', () => {
      const mockRequest: IVaMortgageRequest = {
        HomePrice: 300000,
        DownPayment: 60000,
        InterestRate: 3.5,
        LoanTermYears: 30,
      };

      let state = vaMortgageReducer(
        initialState,
        VaMortgageActions.calculateVaMortgage({ request: mockRequest })
      );
      expect(state.loading).toBe(true);

      const mockResult: IVaMortgage[] = [
        {
          MonthNumber: 1,
          MonthlyPayment: 1000,
          PrincipalPayment: 800,
          InterestPayment: 200,
          RemainingBalance: 99000,
        },
      ];

      state = vaMortgageReducer(
        state,
        VaMortgageActions.calculateVaMortgageSuccess({ result: mockResult })
      );
      expect(state.loading).toBe(false);
      expect(state.result).toEqual(mockResult);

      state = vaMortgageReducer(state, VaMortgageActions.resetVaMortgage());
      expect(state).toEqual(initialState);
    });
      

  // Edge cases
  it('should handle very large numbers in the result', () => {
    const largeNumberResult: IVaMortgage[] = [
      {
        MonthNumber: 1,
        MonthlyPayment: 1e10,
        PrincipalPayment: 9e9,
        InterestPayment: 1e9,
        RemainingBalance: 1e12,
      },
    ];
    const action = VaMortgageActions.calculateVaMortgageSuccess({
      result: largeNumberResult,
    });
    const state = vaMortgageReducer(initialState, action);

    expect(state.result).toEqual(largeNumberResult);
  });

  it('should handle very small numbers in the result', () => {
    const smallNumberResult: IVaMortgage[] = [
      {
        MonthNumber: 1,
        MonthlyPayment: 0.00001,
        PrincipalPayment: 0.000008,
        InterestPayment: 0.000002,
        RemainingBalance: 0.99999,
      },
    ];
    const action = VaMortgageActions.calculateVaMortgageSuccess({
      result: smallNumberResult,
    });
    const state = vaMortgageReducer(initialState, action);

    expect(state.result).toEqual(smallNumberResult);
  });

  it('should handle a very long result array', () => {
    const longResult: IVaMortgage[] = Array(1000).fill({
      MonthNumber: 1,
      MonthlyPayment: 1000,
      PrincipalPayment: 800,
      InterestPayment: 200,
      RemainingBalance: 99000,
    });
    const action = VaMortgageActions.calculateVaMortgageSuccess({
      result: longResult,
    });
    const state = vaMortgageReducer(initialState, action);

    // expect(state.result).toHaveLength(1000);
    // expect(state.result).toEqual(longResult);
    expect(state.result).not.toBeNull();
    expect(state.result?.length).toBe(1000);
    expect(state.result).toEqual(longResult);
  });
});
