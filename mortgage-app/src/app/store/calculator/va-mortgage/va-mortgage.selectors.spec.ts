import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VaMortgageState } from './va-mortgage.reducer';
import { IVaMortgage } from '../../../models/IVaMortgage';
import { firstValueFrom } from 'rxjs';

describe('VA Mortgage Selectors', () => {
  let store: MockStore;

  let selectVaMortgageState: any;
  let selectVaMortgageResult: any;
  let selectVaMortgageLoading: any;
  let selectVaMortgageError: any;

  beforeEach(() => {
    const vaMortgageFeatureSelector =
      createFeatureSelector<VaMortgageState>('vaMortgage');

    selectVaMortgageState = vaMortgageFeatureSelector;

    selectVaMortgageResult = createSelector(
      vaMortgageFeatureSelector,
      (state) => state?.result ?? null
    );

    selectVaMortgageLoading = createSelector(
      vaMortgageFeatureSelector,
      (state) => state?.loading ?? false
    );

    selectVaMortgageError = createSelector(
      vaMortgageFeatureSelector,
      (state) => state?.error ?? null
    );

    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
    store.setState({ vaMortgage: undefined as any });
  });

  it('should select the VA mortgage state', async () => {
    const initialState: VaMortgageState = {
      result: null,
      loading: false,
      error: null,
    };

    store.setState({ vaMortgage: initialState });

    const result = await firstValueFrom(store.select(selectVaMortgageState));
    expect(result).toEqual(initialState);
  });

  it('should select the VA mortgage result', async () => {
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

    store.setState({ vaMortgage: state });

    const result = await firstValueFrom(store.select(selectVaMortgageResult));
    expect(result).toEqual(mockResult);
  });

  it('should select the VA mortgage loading state', async () => {
    store.setState({
      vaMortgage: {
        result: null,
        loading: true,
        error: null,
      },
    });

    const loading = await firstValueFrom(store.select(selectVaMortgageLoading));
    expect(loading).toBe(true);
  });

  it('should select the VA mortgage error state', async () => {
    const mockError = 'Test error';

    store.setState({
      vaMortgage: {
        result: null,
        loading: false,
        error: mockError,
      },
    });

    const error = await firstValueFrom(store.select(selectVaMortgageError));
    expect(error).toEqual(mockError);
  });

  it('should handle empty state for result selector', async () => {
    store.setState({
      vaMortgage: {
        result: null,
        loading: false,
        error: null,
      },
    });

    const result = await firstValueFrom(store.select(selectVaMortgageResult));
    expect(result).toBeNull();
  });

  it('should handle undefined state', async () => {
    store.setState({ vaMortgage: undefined as any });

    const result = await firstValueFrom(store.select(selectVaMortgageResult));
    const loading = await firstValueFrom(store.select(selectVaMortgageLoading));
    const error = await firstValueFrom(store.select(selectVaMortgageError));

    expect(result).toBeNull();
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });

  it('should handle state changes', async () => {
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

    store.setState({ vaMortgage: initialState });

    let result = await firstValueFrom(store.select(selectVaMortgageResult));
    let loading = await firstValueFrom(store.select(selectVaMortgageLoading));
    let error = await firstValueFrom(store.select(selectVaMortgageError));

    expect(result).toBeNull();
    expect(loading).toBe(false);
    expect(error).toBeNull();

    store.setState({ vaMortgage: updatedState });

    result = await firstValueFrom(store.select(selectVaMortgageResult));
    loading = await firstValueFrom(store.select(selectVaMortgageLoading));
    error = await firstValueFrom(store.select(selectVaMortgageError));

    expect(result).toEqual(updatedState.result);
    expect(loading).toBe(true);
    expect(error).toEqual('New error');
  });

  it('should handle empty array result', async () => {
    store.setState({
      vaMortgage: {
        result: [],
        loading: false,
        error: null,
      },
    });

    const result = await firstValueFrom(store.select(selectVaMortgageResult));
    expect(result).toEqual([]);
  });

  it('should handle negative values in result', async () => {
    const mockResult: IVaMortgage[] = [
      {
        MonthNumber: -1,
        MonthlyPayment: -1000,
        PrincipalPayment: -800,
        InterestPayment: -200,
        RemainingBalance: -199000,
      },
    ];

    store.setState({
      vaMortgage: {
        result: mockResult,
        loading: false,
        error: null,
      },
    });

    const result = await firstValueFrom(store.select(selectVaMortgageResult));
    expect(result).toEqual(mockResult);
  });

  it('should handle very large numbers in result', async () => {
    const mockResult: IVaMortgage[] = [
      {
        MonthNumber: Number.MAX_SAFE_INTEGER,
        MonthlyPayment: Number.MAX_VALUE,
        PrincipalPayment: Number.MAX_VALUE,
        InterestPayment: Number.MAX_VALUE,
        RemainingBalance: Number.MAX_VALUE,
      },
    ];

    store.setState({
      vaMortgage: {
        result: mockResult,
        loading: false,
        error: null,
      },
    });

    const result = await firstValueFrom(store.select(selectVaMortgageResult));
    expect(result).toEqual(mockResult);
  });
});
