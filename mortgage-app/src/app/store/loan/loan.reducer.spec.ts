import { loanReducer } from './loan.reducer';
import * as LoanActions from './loan.actions';
import { initialState } from './loan.state';

describe('Loan Reducer', () => {
  
  it('should return the default state when no action is matched', () => {
    const result = loanReducer(initialState, { type: 'Unknown' });
    expect(result).toEqual(initialState);
  });

  it('should handle loadLoans action', () => {
    const result = loanReducer(initialState, LoanActions.loadLoans());
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle loadLoansSuccess action', () => {
    const loans = [{ UserLoanNumber: 123, LoanAmount: 1000, InterestRate: 5, LoanTermYears: 15, ApplicationDate: '2021-01-01', ApprovalStatus: 'Approved' }];
    const result = loanReducer(initialState, LoanActions.loadLoansSuccess({ loans }));
    expect(result.loans).toEqual(loans);
    expect(result.loading).toBe(false);
  });

  it('should handle loadLoansFailure action', () => {
    const error = 'Failed to load loans';
    const result = loanReducer(initialState, LoanActions.loadLoansFailure({ error }));
    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });
  
  // Add tests for other actions like addLoan, addLoanSuccess, etc.
});
