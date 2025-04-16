import { loanReducer } from './loan.reducer';
import * as LoanActions from './loan.actions';
import { initialState } from './loan.state';
import { ILoan } from '../../models/ILoan';

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
  
  it('should handle addLoan action', () => {
    const mockLoan: ILoan = {
      LoanId: 1,
      UserLoanNumber: 101,
      LoanAmount: 250000,
      InterestRate: 3.5,
      LoanTermYears: 30,
      ApplicationDate: '2023-04-01',
      ApprovalStatus: 'Pending',
    };

    const result = loanReducer(
      initialState,
      LoanActions.addLoan({ loan: mockLoan })
    );
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });


  it('should handle addLoanSuccess action', () => {
    const newLoan = {
      UserLoanNumber: 124,
      LoanAmount: 2000,
      InterestRate: 4,
      LoanTermYears: 30,
      ApplicationDate: '2022-01-01',
      ApprovalStatus: 'Pending',
    };
    const result = loanReducer(
      initialState,
      LoanActions.addLoanSuccess({ loan: newLoan })
    );
    expect(result.loans).toContain(newLoan);
    expect(result.lastAddedLoan).toEqual(newLoan);
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should handle addLoanFailure action', () => {
    const error = 'Failed to add loan';
    const result = loanReducer(
      initialState,
      LoanActions.addLoanFailure({ error })
    );
    expect(result.loading).toBe(false);
    expect(result.error).toBe(error);
  });

  it('should handle loadLoanById action', () => {
    const result = loanReducer(
      initialState,
      LoanActions.loadLoanById({ userLoanNumber: 123 })
    );
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });


  it('should handle loadLoanByIdSuccess action', () => {
    const loan = {
      UserLoanNumber: 125,
      LoanAmount: 1500,
      InterestRate: 3.5,
      LoanTermYears: 10,
      ApplicationDate: '2023-01-01',
      ApprovalStatus: 'Approved',
    };
    const result = loanReducer(
      initialState,
      LoanActions.loadLoanByIdSuccess({ loan })
    );
    expect(result.selectedLoan).toEqual(loan);
    expect(result.loading).toBe(false);
  });

  it('should handle loadLoanByIdFailure action', () => {
    const error = 'Loan not found';
    const result = loanReducer(
      initialState,
      LoanActions.loadLoanByIdFailure({ error })
    );
    expect(result.selectedLoan).toBeNull();
    expect(result.loading).toBe(false);
    expect(result.error).toBe(error);
  });

  it('should handle clearLastAddedLoan action', () => {
    const stateWithLoan = {
      ...initialState,
      lastAddedLoan: {
        UserLoanNumber: 200,
        LoanAmount: 5000,
        InterestRate: 6,
        LoanTermYears: 20,
        ApplicationDate: '2020-01-01',
        ApprovalStatus: 'Approved',
      },
    };
    const result = loanReducer(stateWithLoan, LoanActions.clearLastAddedLoan());
    expect(result.lastAddedLoan).toBeNull();
  });

});
