import {
  selectLoans,
  selectSelectedLoan,
  selectLoanLoading,
  selectLoanError,
  selectLoanById,
  selectLoanAddSuccess,
  selectLoanState,
} from './loan.selectors';
import { LoanState } from './loan.state';
import { ILoan } from '../../models/ILoan';

describe('Loan Selectors', () => {
  const mockLoan: ILoan = {
    LoanId: 1,
    UserLoanNumber: 1001,
    LoanAmount: 200000,
    InterestRate: 3.5,
    LoanTermYears: 30,
    ApplicationDate: '2024-01-01',
    ApprovalStatus: 'Pending',
  };

  const state: { loan: LoanState } = {
    loan: {
      loans: [mockLoan],
      selectedLoan: mockLoan,
      lastAddedLoan: mockLoan,
      loading: true,
      error: 'Something went wrong',
    },
  };

  const emptyState = { loan: {} as LoanState }; // Empty state for testing

  it('should select loan feature state', () => {
    const result = selectLoanState(state);
    expect(result).toEqual(state.loan);
  });

//   it('should select all loans', () => {
//     const result = selectLoans(state);
//     expect(result).toEqual([mockLoan]);
//   });

  it('should select selectedLoan', () => {
    const result = selectSelectedLoan(state);
    expect(result).toEqual(mockLoan);
  });

  it('should select loading status', () => {
    const result = selectLoanLoading(state);
    expect(result).toBeTrue();
  });

  it('should select error', () => {
    const result = selectLoanError(state);
    expect(result).toBe('Something went wrong');
  });

  it('should select loan by id (alias of selectedLoan)', () => {
    const result = selectLoanById(state);
    expect(result).toEqual(mockLoan);
  });

  it('should select last added loan', () => {
    const result = selectLoanAddSuccess(state);
    expect(result).toEqual(mockLoan);
  });

//   it('should handle missing values gracefully', () => {
//     // Ensure selectors handle missing values correctly
//     expect(selectLoans(emptyState)).toEqual([]); // Default empty array
//     expect(selectSelectedLoan(emptyState)).toBeNull(); // Default null
//     expect(selectLoanLoading(emptyState)).toBeFalse(); // Default false
//     expect(selectLoanError(emptyState)).toBeNull(); // Default null
//     expect(selectLoanById(emptyState)).toBeNull(); // Default null
//     expect(selectLoanAddSuccess(emptyState)).toBeUndefined(); // Default undefined
//   });
});
