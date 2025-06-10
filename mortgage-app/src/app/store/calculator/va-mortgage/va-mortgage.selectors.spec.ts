// import { TestBed } from '@angular/core/testing';
// import { MockStore, provideMockStore } from '@ngrx/store/testing';
// import {
//   selectVaMortgageState,
//   selectVaMortgageResult,
//   selectVaMortgageLoading,
//   selectVaMortgageError,
// } from './va-mortgage.selectors';
// import { VaMortgageState } from './va-mortgage.reducer';
// import { IVaMortgage } from '../../../models/IVaMortgage';


// describe('VA Mortgage Selectors', () => {
//   let store: MockStore<{ vaMortgage: VaMortgageState }>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [provideMockStore()],
//     });

//     store = TestBed.inject(MockStore);
//   });

//   it('should select the VA mortgage state', () => {
//     const initialState: VaMortgageState = {
//       result: null,
//       loading: false,
//       error: null,
//     };

//     let result: VaMortgageState | undefined;

//     store.setState({ vaMortgage: initialState });

//     store.select(selectVaMortgageState).subscribe((state) => {
//       result = state;
//     });

//     expect(result).toEqual(initialState);
//   });

//   it('should select the VA mortgage result', () => {
//     const mockResult: IVaMortgage[] = [
//       {
//         MonthNumber: 1,
//         MonthlyPayment: 1000,
//         PrincipalPayment: 800,
//         InterestPayment: 200,
//         RemainingBalance: 199000,
//       },
//     ];
//     const state: VaMortgageState = {
//       result: mockResult,
//       loading: false,
//       error: null,
//     };

//     let result: IVaMortgage[] | null | undefined;

//     store.setState({ vaMortgage: state });

//     store.select(selectVaMortgageResult).subscribe((value) => {
//       result = value;
//     });

//     expect(result).toEqual(mockResult);
//   });

//   it('should select the VA mortgage loading state', () => {
//     const state: VaMortgageState = {
//       result: null,
//       loading: true,
//       error: null,
//     };

//     let loading: boolean | undefined;

//     store.setState({ vaMortgage: state });

//     store.select(selectVaMortgageLoading).subscribe((value) => {
//       loading = value;
//     });

//     expect(loading).toBe(true);
//   });

//   it('should select the VA mortgage error state', () => {
//     const mockError = 'Test error';
//     const state: VaMortgageState = {
//       result: null,
//       loading: false,
//       error: mockError,
//     };

//     let error: string | null | undefined;

//     store.setState({ vaMortgage: state });

//     store.select(selectVaMortgageError).subscribe((value) => {
//       error = value;
//     });

//     expect(error).toEqual(mockError);
//   });

//   it('should handle empty state for result selector', () => {
//     const state: VaMortgageState = {
//       result: null,
//       loading: false,
//       error: null,
//     };

//     let result: IVaMortgage[] | null | undefined;

//     store.setState({ vaMortgage: state });

//     store.select(selectVaMortgageResult).subscribe((value) => {
//       result = value;
//     });

//     expect(result).toBeNull();
//   });

//     // it('should handle undefined state', () => {
//     //     let result: IVaMortgage[] | null | undefined;
//     //     let loading: boolean | undefined;
//     //     let error: Error | null | undefined;

//     //     store.setState({ vaMortgage: undefined as any });

//     //     store.select(selectVaMortgageResult).subscribe((value) => {
//     //         result = value;
//     //     });

//     //     store.select(selectVaMortgageLoading).subscribe((value) => {
//     //         loading = value;
//     //     });

//     //     store.select(selectVaMortgageError).subscribe((value) => {
//     //         error = value;
//     //     });

//     //     expect(result).toBeUndefined();
//     //     expect(loading).toBeUndefined();
//     //     expect(error).toBeUndefined();
//   // });
  
//   it('should handle undefined state', () => {
//     let result: IVaMortgage[] | null | undefined;
//     let loading: boolean | undefined;
//     let error: string | null | undefined;

//     store.setState({ vaMortgage: undefined as any });

//     store.select(selectVaMortgageResult).subscribe((value) => (result = value));
//     store
//       .select(selectVaMortgageLoading)
//       .subscribe((value) => (loading = value));
//     store.select(selectVaMortgageError).subscribe((value) => (error = value));

//     expect(result).toBeNull(); // matches selector default
//     expect(loading).toBe(false); // matches selector default
//     expect(error).toBeNull(); // matches selector default
//   });
  
  
  
//   it('should handle state changes', () => {
//     const initialState: VaMortgageState = {
//       result: null,
//       loading: false,
//       error: null,
//     };

//     const updatedState: VaMortgageState = {
//       result: [
//         {
//           MonthNumber: 1,
//           MonthlyPayment: 1500,
//           PrincipalPayment: 1000,
//           InterestPayment: 500,
//           RemainingBalance: 299000,
//         },
//       ],
//       loading: true,
//       error: 'New error',
//     };

//     let result: IVaMortgage[] | null | undefined;
//     let loading: boolean | undefined;
//     let error: string | null | undefined;

//     store.setState({ vaMortgage: initialState });

//     store.select(selectVaMortgageResult).subscribe((value) => {
//       result = value;
//     });
//     store.select(selectVaMortgageLoading).subscribe((value) => {
//       loading = value;
//     });
//     store.select(selectVaMortgageError).subscribe((value) => {
//       error = value;
//     });

//     expect(result).toBeNull();
//     expect(loading).toBe(false);
//     expect(error).toBeNull();

//     store.setState({ vaMortgage: updatedState });

//     expect(result).toEqual(updatedState.result);
//     expect(loading).toBe(true);
//     expect(error).toEqual('New error');
//   });
  
      

//   it('should handle empty array result', () => {
//     const state: VaMortgageState = {
//       result: [],
//       loading: false,
//       error: null,
//     };

//     let result: IVaMortgage[] | null | undefined;

//     store.setState({ vaMortgage: state });

//     store.select(selectVaMortgageResult).subscribe((value) => {
//       result = value;
//     });

//     expect(result).toEqual([]);
//   });

//   it('should handle negative values in result', () => {
//     const mockResult: IVaMortgage[] = [
//       {
//         MonthNumber: -1,
//         MonthlyPayment: -1000,
//         PrincipalPayment: -800,
//         InterestPayment: -200,
//         RemainingBalance: -199000,
//       },
//     ];
//     const state: VaMortgageState = {
//       result: mockResult,
//       loading: false,
//       error: null,
//     };

//     let result: IVaMortgage[] | null | undefined;

//     store.setState({ vaMortgage: state });

//     store.select(selectVaMortgageResult).subscribe((value) => {
//       result = value;
//     });

//     expect(result).toEqual(mockResult);
//   });

//   it('should handle very large numbers in result', () => {
//     const mockResult: IVaMortgage[] = [
//       {
//         MonthNumber: Number.MAX_SAFE_INTEGER,
//         MonthlyPayment: Number.MAX_VALUE,
//         PrincipalPayment: Number.MAX_VALUE,
//         InterestPayment: Number.MAX_VALUE,
//         RemainingBalance: Number.MAX_VALUE,
//       },
//     ];
//     const state: VaMortgageState = {
//       result: mockResult,
//       loading: false,
//       error: null,
//     };

//     let result: IVaMortgage[] | null | undefined;

//     store.setState({ vaMortgage: state });

//     store.select(selectVaMortgageResult).subscribe((value) => {
//       result = value;
//     });

//     expect(result).toEqual(mockResult);
//   });
// });


import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  selectVaMortgageState,
  selectVaMortgageResult,
  selectVaMortgageLoading,
  selectVaMortgageError,
} from './va-mortgage.selectors';
import { VaMortgageState } from './va-mortgage.reducer';
import { IVaMortgage } from '../../../models/IVaMortgage';

describe('VA Mortgage Selectors', () => {
  let store: MockStore<{ vaMortgage: VaMortgageState }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    store = TestBed.inject(MockStore);
  });

  it('should select the VA mortgage state', () => {
    const initialState: VaMortgageState = {
      result: null,
      loading: false,
      error: null,
    };

    let result: VaMortgageState | undefined;
    store.setState({ vaMortgage: initialState });

    store.select(selectVaMortgageState).subscribe((state) => {
      result = state;
    });

    expect(result).toEqual(initialState);
  });

  it('should select the VA mortgage result', () => {
    const mockResult: IVaMortgage[] = [
      {
        MonthNumber: 1,
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 199000,
      },
    ];

    const state: VaMortgageState = {
      result: mockResult,
      loading: false,
      error: null,
    };

    let result: IVaMortgage[] | null | undefined;
    store.setState({ vaMortgage: state });

    store.select(selectVaMortgageResult).subscribe((value) => {
      result = value;
    });

    expect(result).toEqual(mockResult);
  });

  it('should select the VA mortgage loading state', () => {
    const state: VaMortgageState = {
      result: null,
      loading: true,
      error: null,
    };

    let loading: boolean | undefined;
    store.setState({ vaMortgage: state });

    store.select(selectVaMortgageLoading).subscribe((value) => {
      loading = value;
    });

    expect(loading).toBe(true);
  });

  it('should select the VA mortgage error state', () => {
    const mockError = 'Test error';

    const state: VaMortgageState = {
      result: null,
      loading: false,
      error: mockError,
    };

    let error: string | null | undefined;
    store.setState({ vaMortgage: state });

    store.select(selectVaMortgageError).subscribe((value) => {
      error = value;
    });

    expect(error).toEqual(mockError);
  });

  it('should handle empty state for result selector', () => {
    const state: VaMortgageState = {
      result: null,
      loading: false,
      error: null,
    };

    let result: IVaMortgage[] | null | undefined;
    store.setState({ vaMortgage: state });

    store.select(selectVaMortgageResult).subscribe((value) => {
      result = value;
    });

    expect(result).toBeNull();
  });

  it('should handle undefined state', () => {
    let result: IVaMortgage[] | null | undefined;
    let loading: boolean | undefined;
    let error: string | null | undefined;

    store.setState({ vaMortgage: undefined as any });

    store.select(selectVaMortgageResult).subscribe((value) => (result = value));
    store
      .select(selectVaMortgageLoading)
      .subscribe((value) => (loading = value));
    store.select(selectVaMortgageError).subscribe((value) => (error = value));

    expect(result).toBeNull(); // as per selector fallback
    expect(loading).toBe(false); // as per selector fallback
    expect(error).toBeNull(); // as per selector fallback
  });

  it('should handle state changes', () => {
    const initialState: VaMortgageState = {
      result: null,
      loading: false,
      error: null,
    };

    const updatedState: VaMortgageState = {
      result: [
        {
          MonthNumber: 1,
          MonthlyPayment: 1500,
          PrincipalPayment: 1000,
          InterestPayment: 500,
          RemainingBalance: 299000,
        },
      ],
      loading: true,
      error: 'New error',
    };

    let result: IVaMortgage[] | null | undefined;
    let loading: boolean | undefined;
    let error: string | null | undefined;

    store.setState({ vaMortgage: initialState });

    store.select(selectVaMortgageResult).subscribe((value) => {
      result = value;
    });
    store.select(selectVaMortgageLoading).subscribe((value) => {
      loading = value;
    });
    store.select(selectVaMortgageError).subscribe((value) => {
      error = value;
    });

    expect(result).toBeNull();
    expect(loading).toBe(false);
    expect(error).toBeNull();

    store.setState({ vaMortgage: updatedState });

    expect(result).toEqual(updatedState.result);
    expect(loading).toBe(true);
    expect(error).toEqual('New error');
  });

  it('should handle empty array result', () => {
    const state: VaMortgageState = {
      result: [],
      loading: false,
      error: null,
    };

    let result: IVaMortgage[] | null | undefined;
    store.setState({ vaMortgage: state });

    store.select(selectVaMortgageResult).subscribe((value) => {
      result = value;
    });

    expect(result).toEqual([]);
  });

  it('should handle negative values in result', () => {
    const mockResult: IVaMortgage[] = [
      {
        MonthNumber: -1,
        MonthlyPayment: -1000,
        PrincipalPayment: -800,
        InterestPayment: -200,
        RemainingBalance: -199000,
      },
    ];

    const state: VaMortgageState = {
      result: mockResult,
      loading: false,
      error: null,
    };

    let result: IVaMortgage[] | null | undefined;
    store.setState({ vaMortgage: state });

    store.select(selectVaMortgageResult).subscribe((value) => {
      result = value;
    });

    expect(result).toEqual(mockResult);
  });

  it('should handle very large numbers in result', () => {
    const mockResult: IVaMortgage[] = [
      {
        MonthNumber: Number.MAX_SAFE_INTEGER,
        MonthlyPayment: Number.MAX_VALUE,
        PrincipalPayment: Number.MAX_VALUE,
        InterestPayment: Number.MAX_VALUE,
        RemainingBalance: Number.MAX_VALUE,
      },
    ];

    const state: VaMortgageState = {
      result: mockResult,
      loading: false,
      error: null,
    };

    let result: IVaMortgage[] | null | undefined;
    store.setState({ vaMortgage: state });

    store.select(selectVaMortgageResult).subscribe((value) => {
      result = value;
    });

    expect(result).toEqual(mockResult);
  });
});
