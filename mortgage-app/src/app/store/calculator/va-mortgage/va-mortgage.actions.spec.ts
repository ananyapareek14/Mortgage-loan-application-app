import { createAction, props } from '@ngrx/store';
import { IVaMortgage, IVaMortgageRequest } from '../../../models/IVaMortgage';
import * as VaMortgageActions from './va-mortgage.actions';

describe('VA Mortgage Actions', () => {
  // Test case for calculateVaMortgage action
  it('should create calculateVaMortgage action with request payload', () => {
    const request: IVaMortgageRequest = {
      HomePrice: 250000,
      DownPayment: 50000,
      InterestRate: 3.5,
      LoanTermYears: 30,
    };
    const action = VaMortgageActions.calculateVaMortgage({ request });
    expect(action.type).toBe('[VA Mortgage] Calculate');
    expect(action.request).toEqual(request);
  });

  // Test case for calculateVaMortgageSuccess action
  it('should create calculateVaMortgageSuccess action with result payload', () => {
    const result: IVaMortgage[] = [
      {
        MonthNumber: 1,
        MonthlyPayment: 898.09,
        PrincipalPayment: 273.09,
        InterestPayment: 625.0,
        RemainingBalance: 199726.91,
      },
    ];
    const action = VaMortgageActions.calculateVaMortgageSuccess({ result });
    expect(action.type).toBe('[VA Mortgage] Calculate Success');
    expect(action.result).toEqual(result);
  });

  // Test case for calculateVaMortgageFailure action
  it('should create calculateVaMortgageFailure action with error payload', () => {
    const error = 'An error occurred';
    const action = VaMortgageActions.calculateVaMortgageFailure({ error });
    expect(action.type).toBe('[VA Mortgage] Calculate Failure');
    expect(action.error).toBe(error);
  });

  // Test case for resetVaMortgage action
  it('should create resetVaMortgage action', () => {
    const action = VaMortgageActions.resetVaMortgage();
    expect(action.type).toBe('[VA Mortgage] Reset');
  });

  // Edge case: calculateVaMortgage with minimum values
  it('should handle calculateVaMortgage with minimum values', () => {
    const request: IVaMortgageRequest = {
      HomePrice: 0,
      DownPayment: 0,
      InterestRate: 0,
      LoanTermYears: 1,
    };
    const action = VaMortgageActions.calculateVaMortgage({ request });
    expect(action.type).toBe('[VA Mortgage] Calculate');
    expect(action.request).toEqual(request);
  });

  // Edge case: calculateVaMortgage with maximum values
  it('should handle calculateVaMortgage with maximum values', () => {
    const request: IVaMortgageRequest = {
      HomePrice: Number.MAX_SAFE_INTEGER,
      DownPayment: Number.MAX_SAFE_INTEGER,
      InterestRate: 100,
      LoanTermYears: 100,
    };
    const action = VaMortgageActions.calculateVaMortgage({ request });
    expect(action.type).toBe('[VA Mortgage] Calculate');
    expect(action.request).toEqual(request);
  });

  // Edge case: calculateVaMortgage with down payment greater than home price
  it('should handle calculateVaMortgage with down payment greater than home price', () => {
    const request: IVaMortgageRequest = {
      HomePrice: 200000,
      DownPayment: 250000,
      InterestRate: 3.5,
      LoanTermYears: 30,
    };
    const action = VaMortgageActions.calculateVaMortgage({ request });
    expect(action.type).toBe('[VA Mortgage] Calculate');
    expect(action.request).toEqual(request);
  });

  // Error handling: calculateVaMortgageFailure with empty error string
  it('should handle calculateVaMortgageFailure with empty error string', () => {
    const error = '';
    const action = VaMortgageActions.calculateVaMortgageFailure({ error });
    expect(action.type).toBe('[VA Mortgage] Calculate Failure');
    expect(action.error).toBe(error);
  });

  // Edge case: calculateVaMortgageSuccess with empty result array
  it('should handle calculateVaMortgageSuccess with empty result array', () => {
    const result: IVaMortgage[] = [];
    const action = VaMortgageActions.calculateVaMortgageSuccess({ result });
    expect(action.type).toBe('[VA Mortgage] Calculate Success');
    expect(action.result).toEqual(result);
  });

  // Edge case: calculateVaMortgageSuccess with multiple months
  it('should handle calculateVaMortgageSuccess with multiple months', () => {
    const result: IVaMortgage[] = [
      {
        MonthNumber: 1,
        MonthlyPayment: 898.09,
        PrincipalPayment: 273.09,
        InterestPayment: 625.0,
        RemainingBalance: 199726.91,
      },
      {
        MonthNumber: 2,
        MonthlyPayment: 898.09,
        PrincipalPayment: 273.94,
        InterestPayment: 624.15,
        RemainingBalance: 199452.97,
      },
    ];
    const action = VaMortgageActions.calculateVaMortgageSuccess({ result });
    expect(action.type).toBe('[VA Mortgage] Calculate Success');
    expect(action.result).toEqual(result);
  });
});
