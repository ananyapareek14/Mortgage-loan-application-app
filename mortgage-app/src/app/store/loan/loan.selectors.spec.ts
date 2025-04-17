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
import { TestBed } from '@angular/core/testing';

describe('Loan Selectors', () => {
  beforeEach(() => {
    // Reset global mocks, state, etc.
    jasmine.clock().uninstall?.(); // Uninstall any clocks if used
  });

  afterEach(() => {
    // Fully cleanup to avoid memory leaks or cross-test pollution
    TestBed.resetTestingModule();
  });

  
  const mockLoan: ILoan = {
    LoanId: 1,
    UserLoanNumber: 1,
    LoanAmount: 200000,
    InterestRate: 3.5,
    LoanTermYears: 30,
    ApplicationDate: '2024-01-01T00:00:00Z',
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

  it('should select all loans', () => {
    const result = selectLoans(state);
    expect(result).toEqual([mockLoan]);
  });

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

  // Test case when state is missing (empty)
  it('should handle missing loan state gracefully', () => {
    const state = { loan: {} as LoanState };

    expect(selectLoans(state)).toEqual([]);
    expect(selectSelectedLoan(state)).toBeNull();
    expect(selectLoanLoading(state)).toBeFalse();
    expect(selectLoanError(state)).toBeNull();
    expect(selectLoanById(state)).toBeNull();
  });
  

  // Test case when some state properties are missing
  it('should handle partially missing loan state gracefully', () => {
    const partialState = { loan: { loans: [], selectedLoan: null } };

    const result = selectLoans(partialState);
    expect(result).toEqual([]); // Default empty array when loans are missing

    const selectedLoanResult = selectSelectedLoan(partialState);
    expect(selectedLoanResult).toBeNull(); // Default null when selectedLoan is missing

    const loadingResult = selectLoanLoading(partialState);
    expect(loadingResult).toBeFalse(); // Default false when loading is missing

    const errorResult = selectLoanError(partialState);
    expect(errorResult).toBeNull(); // Default null when error is missing

    const loanByIdResult = selectLoanById(partialState);
    expect(loanByIdResult).toBeNull(); // Default null when selectedLoan is missing
  });
});
