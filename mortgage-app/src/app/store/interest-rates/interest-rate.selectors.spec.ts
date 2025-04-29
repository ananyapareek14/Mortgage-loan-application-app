// import { TestBed } from '@angular/core/testing';
// import { Store, StoreModule } from '@ngrx/store';
// import {
//   selectInterestRateState,
//   selectAllInterestRates,
//   selectInterestRatesLoading,
//   selectInterestRatesError,
// } from './interest-rate.selectors';
// import {
//   interestRateReducer,
//   InterestRateState,
// } from './interest-rate.reducer';
// import { IInterestRate } from '../../models/IInterestRate';
// import { MockStore, provideMockStore } from '@ngrx/store/testing';
// import { initialState } from '../loan/loan.state';

// describe('Interest Rate Selectors', () => {
//   let store: Store<{ interestRates: InterestRateState }>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         StoreModule.forRoot({
//           interestRates: interestRateReducer,
//         }),
//       ],
//       providers: [
//         provideMockStore({ initialState }),
//       ],
//     });

//     store = TestBed.inject(MockStore);
//   });

//   describe('selectInterestRateState', () => {
//     it('should select the interest rate feature state', (done) => {
//       const initialState: InterestRateState = {
//         interestRates: [],
//         loading: false,
//         error: null,
//       };

//       store.select(selectInterestRateState).subscribe((state) => {
//         expect(state).toEqual(initialState);
//         done();
//       });
//     });
//   });

//   describe('selectAllInterestRates', () => {
//     it('should select all interest rates', (done) => {
//       const mockInterestRates: IInterestRate[] = [
//         { Id: '1', Rate: 0.05, ValidFrom: '2023-01-01' },
//         { Id: '2', Rate: 0.07, ValidFrom: '2023-02-01' },
//       ];

//       store.dispatch({
//         type: '[Interest Rate] Set Interest Rates',
//         payload: mockInterestRates,
//       });

//       store.select(selectAllInterestRates).subscribe((interestRates) => {
//         expect(interestRates).toEqual(mockInterestRates);
//         done();
//       });
//     });

//     it('should return an empty array when no interest rates are available', (done) => {
//       store.select(selectAllInterestRates).subscribe((interestRates) => {
//         expect(interestRates).toEqual([]);
//         done();
//       });
//     });
//   });

//   describe('selectInterestRatesLoading', () => {
//     it('should select the loading state', (done) => {
//       store.dispatch({ type: '[Interest Rate] Load Interest Rates' });

//       store.select(selectInterestRatesLoading).subscribe((loading) => {
//         expect(loading).toBe(true);
//         done();
//       });
//     });

//     it('should return false when not loading', (done) => {
//       store.select(selectInterestRatesLoading).subscribe((loading) => {
//         expect(loading).toBe(false);
//         done();
//       });
//     });
//   });

//   describe('selectInterestRatesError', () => {
//     it('should select the error state', (done) => {
//       const mockError = 'An error occurred';
//       store.dispatch({
//         type: '[Interest Rate] Load Interest Rates Failure',
//         payload: mockError,
//       });

//       store.select(selectInterestRatesError).subscribe((error) => {
//         expect(error).toBe(mockError);
//         done();
//       });
//     });

//     it('should return null when there is no error', (done) => {
//       store.select(selectInterestRatesError).subscribe((error) => {
//         expect(error).toBeNull();
//         done();
//       });
//     });
//   });

//   // Edge case: Testing selectors with undefined state
//   describe('Selectors with undefined state', () => {
//     it('should handle undefined state in selectAllInterestRates', (done) => {
//       (store as any).setState({ interestRates: undefined });

//       store.select(selectAllInterestRates).subscribe((interestRates) => {
//         expect(interestRates).toBeUndefined();
//         done();
//       });
//     });

//     it('should handle undefined state in selectInterestRatesLoading', (done) => {
//       (store as any).setState({ interestRates: undefined });

//       store.select(selectInterestRatesLoading).subscribe((loading) => {
//         expect(loading).toBeUndefined();
//         done();
//       });
//     });

//     it('should handle undefined state in selectInterestRatesError', (done) => {
//       (store as any).setState({ interestRates: undefined });

//       store.select(selectInterestRatesError).subscribe((error) => {
//         expect(error).toBeUndefined();
//         done();
//       });
//     });
//   });

//   // Edge case: Testing with invalid date formats
//   describe('Selectors with invalid date formats', () => {
//     it('should handle invalid date format in ValidFrom', (done) => {
//       const invalidInterestRates: IInterestRate[] = [
//         { Id: '1', Rate: 0.05, ValidFrom: 'invalid-date' },
//         { Id: '2', Rate: 0.07, ValidFrom: '2023-02-01' },
//       ];

//       store.dispatch({
//         type: '[Interest Rate] Set Interest Rates',
//         payload: invalidInterestRates,
//       });

//       store.select(selectAllInterestRates).subscribe((interestRates) => {
//         expect(interestRates).toEqual(invalidInterestRates);
//         done();
//       });
//     });
//   });
// });


import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  selectInterestRateState,
  selectAllInterestRates,
  selectInterestRatesLoading,
  selectInterestRatesError,
} from './interest-rate.selectors';
import { InterestRateState } from './interest-rate.reducer';
import { IInterestRate } from '../../models/IInterestRate';

describe('Interest Rate Selectors', () => {
  let store: MockStore;
  const defaultState: { interestRates: InterestRateState } = {
    interestRates: {
      interestRates: [],
      loading: false,
      error: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: defaultState })],
    });

    store = TestBed.inject(MockStore);
  });

  describe('selectInterestRateState', () => {
    it('should select the interest rate feature state', (done) => {
      store.select(selectInterestRateState).subscribe((state) => {
        expect(state).toEqual(defaultState.interestRates);
        done();
      });
    });
  });

  describe('selectAllInterestRates', () => {
    it('should select all interest rates', (done) => {
      const mockInterestRates: IInterestRate[] = [
        { Id: '1', Rate: 0.05, ValidFrom: '2023-01-01' },
        { Id: '2', Rate: 0.07, ValidFrom: '2023-02-01' },
      ];

      store.setState({
        interestRates: {
          interestRates: mockInterestRates,
          loading: false,
          error: null,
        },
      });

      store.select(selectAllInterestRates).subscribe((interestRates) => {
        expect(interestRates).toEqual(mockInterestRates);
        done();
      });
    });

    it('should return an empty array when no interest rates are available', (done) => {
      store.setState({
        interestRates: {
          interestRates: [],
          loading: false,
          error: null,
        },
      });

      store.select(selectAllInterestRates).subscribe((interestRates) => {
        expect(interestRates).toEqual([]);
        done();
      });
    });
  });

  describe('selectInterestRatesLoading', () => {
    it('should select the loading state', (done) => {
      store.setState({
        interestRates: {
          interestRates: [],
          loading: true,
          error: null,
        },
      });

      store.select(selectInterestRatesLoading).subscribe((loading) => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('should return false when not loading', (done) => {
      store.setState({
        interestRates: {
          interestRates: [],
          loading: false,
          error: null,
        },
      });

      store.select(selectInterestRatesLoading).subscribe((loading) => {
        expect(loading).toBe(false);
        done();
      });
    });
  });

  describe('selectInterestRatesError', () => {
    it('should select the error state', (done) => {
      const mockError = 'An error occurred';

      store.setState({
        interestRates: {
          interestRates: [],
          loading: false,
          error: mockError,
        },
      });

      store.select(selectInterestRatesError).subscribe((error) => {
        expect(error).toBe(mockError);
        done();
      });
    });

    it('should return null when there is no error', (done) => {
      store.setState({
        interestRates: {
          interestRates: [],
          loading: false,
          error: null,
        },
      });

      store.select(selectInterestRatesError).subscribe((error) => {
        expect(error).toBeNull();
        done();
      });
    });
  });

  describe('Selectors with undefined state', () => {
    it('should handle undefined state in selectAllInterestRates', (done) => {
      store.setState({ interestRates: undefined as any });

      store.select(selectAllInterestRates).subscribe((interestRates) => {
        expect(interestRates).toEqual([]);
        done();
      });
    });

    it('should handle undefined state in selectInterestRatesLoading', (done) => {
      store.setState({ interestRates: undefined as any });

      store.select(selectInterestRatesLoading).subscribe((loading) => {
        expect(loading).toBeUndefined();
        done();
      });
    });

    it('should handle undefined state in selectInterestRatesError', (done) => {
      store.setState({ interestRates: undefined as any });

      store.select(selectInterestRatesError).subscribe((error) => {
        expect(error).toBeUndefined();
        done();
      });
    });
  });

  describe('Selectors with invalid date formats', () => {
    it('should handle invalid date format in ValidFrom', (done) => {
      const invalidInterestRates: IInterestRate[] = [
        { Id: '1', Rate: 0.05, ValidFrom: 'invalid-date' },
        { Id: '2', Rate: 0.07, ValidFrom: '2023-02-01' },
      ];

      store.setState({
        interestRates: {
          interestRates: invalidInterestRates,
          loading: false,
          error: null,
        },
      });

      store.select(selectAllInterestRates).subscribe((interestRates) => {
        expect(interestRates).toEqual(invalidInterestRates);
        done();
      });
    });
  });
});
