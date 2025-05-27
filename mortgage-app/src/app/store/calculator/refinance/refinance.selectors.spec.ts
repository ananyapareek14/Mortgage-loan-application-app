import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  selectRefinanceState,
  selectRefinanceResult,
  selectRefinanceLoading,
  selectRefinanceError,
} from './refinance.selectors';
import { RefinanceState } from './refinance.reducer';
import { IRefinance } from '../../../models/IRefinance';
import { MockStore, provideMockStore } from '@ngrx/store/testing';


describe('Refinance Selectors', () => {
    
    let store: MockStore;
    const initialState = {
      refinance: {
        result: null,
        isLoading: false,
        error: null,
      } as RefinanceState,
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideMockStore({ initialState })],
      });

      store = TestBed.inject(MockStore);
    });

  it('should select the refinance feature state', () => {
    const initialState: RefinanceState = {
      result: null,
      isLoading: false,
      error: null,
    };

    let result: RefinanceState | undefined;

    store.select(selectRefinanceState).subscribe((value) => {
      result = value;
    });

    store.setState({ refinance: initialState });

    expect(result).toEqual(initialState);
  });

  it('should select the refinance result', () => {
    const mockResult: IRefinance = {
      MonthlySavings: 100,
      NewPayment: 1000,
      BreakEvenMonths: 12,
      LifetimeSavings: 10000,
    };
    const state: RefinanceState = {
      result: mockResult,
      isLoading: false,
      error: null,
    };

    let result: IRefinance | null | undefined;

    store.select(selectRefinanceResult).subscribe((value) => {
      result = value;
    });

    store.setState({ refinance: state });

    expect(result).toEqual(mockResult);
  });

  it('should select the refinance loading state', () => {
    const state: RefinanceState = {
      result: null,
      isLoading: true,
      error: null,
    };

    let isLoading: boolean | undefined;

    store.select(selectRefinanceLoading).subscribe((value) => {
      isLoading = value;
    });

    store.setState({ refinance: state });

    expect(isLoading).toBe(true);
  });

  it('should select the refinance error', () => {
    const mockError = 'Test error';
    const state: RefinanceState = {
      result: null,
      isLoading: false,
      error: mockError,
    };

    let error: string | null | undefined;

    store.select(selectRefinanceError).subscribe((value) => {
      error = value;
    });

    store.setState({ refinance: state });

    expect(error).toBe(mockError);
  });

  // it('should handle null state', () => {
  //   let result: IRefinance | null | undefined;
  //   let isLoading: boolean | undefined;
  //   let error: string | null | undefined;

  //   store.select(selectRefinanceResult).subscribe((value) => {
  //     result = value;
  //   });
  //   store.select(selectRefinanceLoading).subscribe((value) => {
  //     isLoading = value;
  //   });
  //   store.select(selectRefinanceError).subscribe((value) => {
  //     error = value;
  //   });

  //   store.setState({ refinance: null as any });

  //   expect(result).toBeUndefined();
  //   expect(isLoading).toBeUndefined();
  //   expect(error).toBeUndefined();
  // });

  // it('should handle empty state', () => {
  //   let result: IRefinance | null | undefined;
  //   let isLoading: boolean | undefined;
  //   let error: string | null | undefined;

  //   store.select(selectRefinanceResult).subscribe((value) => {
  //     result = value;
  //   });
  //   store.select(selectRefinanceLoading).subscribe((value) => {
  //     isLoading = value;
  //   });
  //   store.select(selectRefinanceError).subscribe((value) => {
  //     error = value;
  //   });

  //   store.setState({ refinance: {} as any });

  //   expect(result).toBeUndefined();
  //   expect(isLoading).toBeUndefined();
  //   expect(error).toBeUndefined();
  // });

  it('should handle null state', () => {
  let result: IRefinance | null | undefined;
  let isLoading: boolean | undefined;
  let error: string | null | undefined;

  store.select(selectRefinanceResult).subscribe((value) => {
    result = value;
  });
  store.select(selectRefinanceLoading).subscribe((value) => {
    isLoading = value;
  });
  store.select(selectRefinanceError).subscribe((value) => {
    error = value;
  });

  store.setState({ refinance: null as any });

  expect(result).toBeNull(); // or expect(result).toEqual(null);
  expect(isLoading).toBe(false); // since selector defaults to false
  expect(error).toBeNull(); // or expect(error).toEqual(null);
});

it('should handle empty state', () => {
  let result: IRefinance | null | undefined;
  let isLoading: boolean | undefined;
  let error: string | null | undefined;

  store.select(selectRefinanceResult).subscribe((value) => {
    result = value;
  });
  store.select(selectRefinanceLoading).subscribe((value) => {
    isLoading = value;
  });
  store.select(selectRefinanceError).subscribe((value) => {
    error = value;
  });

  store.setState({ refinance: {} as any });

  expect(result).toBeNull(); // or as per your selector logic
  expect(isLoading).toBe(false);
  expect(error).toBeNull();
});


  it('should handle state changes', () => {
    let result: IRefinance | null | undefined;
    let isLoading: boolean | undefined;
    let error: string | null | undefined;

    store.select(selectRefinanceResult).subscribe((value) => {
      result = value;
    });
    store.select(selectRefinanceLoading).subscribe((value) => {
      isLoading = value;
    });
    store.select(selectRefinanceError).subscribe((value) => {
      error = value;
    });

    // Initial state
    store.setState({
      refinance: {
        result: null,
        isLoading: false,
        error: null,
      },
    });

    expect(result).toBeNull();
    expect(isLoading).toBe(false);
    expect(error).toBeNull();

    // Update state
    const newResult: IRefinance = {
      MonthlySavings: 200,
      NewPayment: 1500,
      BreakEvenMonths: 18,
      LifetimeSavings: 15000,
    };
    store.setState({
      refinance: {
        result: newResult,
        isLoading: true,
        error: 'New error',
      },
    });

    expect(result).toEqual(newResult);
    expect(isLoading).toBe(true);
    expect(error).toBe('New error');
  });

  // Edge cases
  it('should handle negative values in refinance result', () => {
    const negativeResult: IRefinance = {
      MonthlySavings: -50,
      NewPayment: 1200,
      BreakEvenMonths: -6,
      LifetimeSavings: -5000,
    };
    const state: RefinanceState = {
      result: negativeResult,
      isLoading: false,
      error: null,
    };

    let result: IRefinance | null | undefined;

    store.select(selectRefinanceResult).subscribe((value) => {
      result = value;
    });

    store.setState({ refinance: state });

    expect(result).toEqual(negativeResult);
  });

  it('should handle very large values in refinance result', () => {
    const largeResult: IRefinance = {
      MonthlySavings: Number.MAX_SAFE_INTEGER,
      NewPayment: Number.MAX_SAFE_INTEGER,
      BreakEvenMonths: Number.MAX_SAFE_INTEGER,
      LifetimeSavings: Number.MAX_SAFE_INTEGER,
    };
    const state: RefinanceState = {
      result: largeResult,
      isLoading: false,
      error: null,
    };

    let result: IRefinance | null | undefined;

    store.select(selectRefinanceResult).subscribe((value) => {
      result = value;
    });

    store.setState({ refinance: state });

    expect(result).toEqual(largeResult);
  });
});
