import {
  IAffordability,
  IAffordabilityRequest,
} from '../../../models/IAffordability';
import * as AffordabilityActions from './affordability.actions';

describe('Affordability Actions', () => {
  // Test for calculateAffordability action
  it('should create calculateAffordability action with provided request', () => {
    const request: IAffordabilityRequest = {
      AnnualIncome: 50000,
      DownPayment: 20000,
      LoanTermMonths: 360,
      InterestRate: 3.5,
      MonthlyDebts: 1000,
    };
    const action = AffordabilityActions.calculateAffordability({ request });

    expect(action.type).toBe('[Affordability] Calculate Affordability');
    expect(action.request).toEqual(request);
  });

  // Test for calculateAffordabilitySuccess action
  it('should create calculateAffordabilitySuccess action with provided result', () => {
    const result: IAffordability = {
      MaxAffordableHomePrice: 250000,
      EstimatedLoanAmount: 230000,
      EstimatedMonthlyPayment: 1032.5,
      DtiPercentage: 36,
      AnnualIncome: 50000,
      DownPayment: 20000,
      LoanTermMonths: 360,
      InterestRate: 3.5,
      MonthlyDebts: 1000,
    };
    const action = AffordabilityActions.calculateAffordabilitySuccess({
      result,
    });

    expect(action.type).toBe('[Affordability] Calculate Affordability Success');
    expect(action.result).toEqual(result);
  });

  // Test for calculateAffordabilityFailure action
  it('should create calculateAffordabilityFailure action with provided error', () => {
    const error = 'Calculation failed';
    const action = AffordabilityActions.calculateAffordabilityFailure({
      error,
    });

    expect(action.type).toBe('[Affordability] Calculate Affordability Failure');
    expect(action.error).toBe(error);
  });

  // Test for resetAffordability action
  it('should create resetAffordability action', () => {
    const action = AffordabilityActions.resetAffordability();

    expect(action.type).toBe('[Affordability] Reset');
  });

  // Edge case: Minimum values for calculateAffordability
  it('should handle minimum values for calculateAffordability', () => {
    const minRequest: IAffordabilityRequest = {
      AnnualIncome: 0,
      DownPayment: 0,
      LoanTermMonths: 1,
      InterestRate: 0,
      MonthlyDebts: 0,
    };
    const action = AffordabilityActions.calculateAffordability({
      request: minRequest,
    });

    expect(action.type).toBe('[Affordability] Calculate Affordability');
    expect(action.request).toEqual(minRequest);
  });

  // Edge case: Maximum values for calculateAffordability
  it('should handle maximum values for calculateAffordability', () => {
    const maxRequest: IAffordabilityRequest = {
      AnnualIncome: Number.MAX_SAFE_INTEGER,
      DownPayment: Number.MAX_SAFE_INTEGER,
      LoanTermMonths: Number.MAX_SAFE_INTEGER,
      InterestRate: Number.MAX_VALUE,
      MonthlyDebts: Number.MAX_SAFE_INTEGER,
    };
    const action = AffordabilityActions.calculateAffordability({
      request: maxRequest,
    });

    expect(action.type).toBe('[Affordability] Calculate Affordability');
    expect(action.request).toEqual(maxRequest);
  });

  // Edge case: Negative values for calculateAffordability
  it('should handle negative values for calculateAffordability', () => {
    const negativeRequest: IAffordabilityRequest = {
      AnnualIncome: -50000,
      DownPayment: -20000,
      LoanTermMonths: -360,
      InterestRate: -3.5,
      MonthlyDebts: -1000,
    };
    const action = AffordabilityActions.calculateAffordability({
      request: negativeRequest,
    });

    expect(action.type).toBe('[Affordability] Calculate Affordability');
    expect(action.request).toEqual(negativeRequest);
  });

  // Error handling: Long error message for calculateAffordabilityFailure
  it('should handle long error message for calculateAffordabilityFailure', () => {
    const longError = 'A'.repeat(1000);
    const action = AffordabilityActions.calculateAffordabilityFailure({
      error: longError,
    });

    expect(action.type).toBe('[Affordability] Calculate Affordability Failure');
    expect(action.error).toBe(longError);
    expect(action.error.length).toBe(1000);
  });
});
