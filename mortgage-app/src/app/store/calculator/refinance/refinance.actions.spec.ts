import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  calculateRefinance,
  calculateRefinanceSuccess,
  calculateRefinanceFailure,
  resetRefinance,
} from './refinance.actions';
import { IRefinance, IRefinanceRequest } from '../../../models/IRefinance';

describe('Refinance Actions', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
    });
    store = TestBed.inject(Store);
  });

  it('should create calculateRefinance action with valid request', () => {
    const request: IRefinanceRequest = {
      CurrentLoanAmount: 200000,
      InterestRate: 4.5,
      CurrentTermMonths: 360,
      OriginationYear: 2015,
      NewLoanAmount: 190000,
      NewInterestRate: 3.75,
      NewTermMonths: 300,
      RefinanceFees: 3000,
    };
    const action = calculateRefinance({ request });
    expect(action.type).toBe('[Refinance] Calculate Refinance');
    expect(action.request).toEqual(request);
  });

  it('should create calculateRefinanceSuccess action with valid result', () => {
    const result: IRefinance = {
      MonthlySavings: 250.75,
      NewPayment: 1000.5,
      BreakEvenMonths: 12,
      LifetimeSavings: 50000.25,
    };
    const action = calculateRefinanceSuccess({ result });
    expect(action.type).toBe('[Refinance] Calculate Refinance Success');
    expect(action.result).toEqual(result);
  });

  it('should create calculateRefinanceFailure action with error message', () => {
    const error = 'Calculation failed';
    const action = calculateRefinanceFailure({ error });
    expect(action.type).toBe('[Refinance] Calculate Refinance Failure');
    expect(action.error).toBe(error);
  });

  it('should create resetRefinance action', () => {
    const action = resetRefinance();
    expect(action.type).toBe('[Refinance] Reset');
  });

  // Edge cases
  it('should handle zero values in calculateRefinance action', () => {
    const request: IRefinanceRequest = {
      CurrentLoanAmount: 0,
      InterestRate: 0,
      CurrentTermMonths: 0,
      OriginationYear: 2023,
      NewLoanAmount: 0,
      NewInterestRate: 0,
      NewTermMonths: 0,
      RefinanceFees: 0,
    };
    const action = calculateRefinance({ request });
    expect(action.type).toBe('[Refinance] Calculate Refinance');
    expect(action.request).toEqual(request);
  });

  it('should handle very large numbers in calculateRefinance action', () => {
    const request: IRefinanceRequest = {
      CurrentLoanAmount: Number.MAX_SAFE_INTEGER,
      InterestRate: 100,
      CurrentTermMonths: Number.MAX_SAFE_INTEGER,
      OriginationYear: 9999,
      NewLoanAmount: Number.MAX_SAFE_INTEGER,
      NewInterestRate: 100,
      NewTermMonths: Number.MAX_SAFE_INTEGER,
      RefinanceFees: Number.MAX_SAFE_INTEGER,
    };
    const action = calculateRefinance({ request });
    expect(action.type).toBe('[Refinance] Calculate Refinance');
    expect(action.request).toEqual(request);
  });

  it('should handle negative numbers in calculateRefinance action', () => {
    const request: IRefinanceRequest = {
      CurrentLoanAmount: -100000,
      InterestRate: -5,
      CurrentTermMonths: -360,
      OriginationYear: -2000,
      NewLoanAmount: -95000,
      NewInterestRate: -4,
      NewTermMonths: -300,
      RefinanceFees: -2000,
    };
    const action = calculateRefinance({ request });
    expect(action.type).toBe('[Refinance] Calculate Refinance');
    expect(action.request).toEqual(request);
  });

  it('should handle floating point precision in calculateRefinanceSuccess action', () => {
    const result: IRefinance = {
      MonthlySavings: 0.1 + 0.2,
      NewPayment: 1000.00000000001,
      BreakEvenMonths: 11.999999999999,
      LifetimeSavings: 50000.00000000001,
    };
    const action = calculateRefinanceSuccess({ result });
    expect(action.type).toBe('[Refinance] Calculate Refinance Success');
    expect(action.result).toEqual(result);
  });

  it('should handle very long error messages in calculateRefinanceFailure action', () => {
    const error = 'a'.repeat(10000);
    const action = calculateRefinanceFailure({ error });
    expect(action.type).toBe('[Refinance] Calculate Refinance Failure');
    expect(action.error.length).toBe(10000);
  });
});
