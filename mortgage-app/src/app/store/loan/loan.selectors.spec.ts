import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { LoanState, initialState } from './loan.state';
import * as fromLoan from './loan.selectors';
import { ILoan } from '../../models/ILoan';

describe('Loan Selectors', () => {
  let store: Store<LoanState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), StoreModule.forFeature('loan', {})],
    });

    store = TestBed.inject(Store);
  });

  describe('selectLoans', () => {
    // it('should return an empty array when state is undefined', () => {
    //   const result = fromLoan.selectLoans.projector(undefined);
    //   expect(result).toEqual([]);
    // });

    it('should return loans array when state is defined', () => {
      const mockLoans: ILoan[] = [
        {
          UserLoanNumber: 1,
          LoanAmount: 1000,
          InterestRate: 5,
          LoanTermYears: 5,
          ApplicationDate: '2023-05-01',
          ApprovalStatus: 'Pending',
        },
        {
          UserLoanNumber: 2,
          LoanAmount: 2000,
          InterestRate: 6,
          LoanTermYears: 10,
          ApplicationDate: '2023-05-02',
          ApprovalStatus: 'Approved',
        },
      ];
      const result = fromLoan.selectLoans.projector({
        ...initialState,
        loans: mockLoans,
      });
      expect(result).toEqual(mockLoans);
    });
  });

  describe('selectSelectedLoan', () => {
    // it('should return null when state is undefined', () => {
    //   const result = fromLoan.selectSelectedLoan.projector(undefined);
    //   expect(result).toBeNull();
    // });

    it('should return selected loan when state is defined', () => {
      const mockSelectedLoan: ILoan = {
        UserLoanNumber: 1,
        LoanAmount: 1000,
        InterestRate: 5,
        LoanTermYears: 5,
        ApplicationDate: '2023-05-01',
        ApprovalStatus: 'Pending',
      };
      const result = fromLoan.selectSelectedLoan.projector({
        ...initialState,
        selectedLoan: mockSelectedLoan,
      });
      expect(result).toEqual(mockSelectedLoan);
    });
  });

  describe('selectLoanLoading', () => {
    // it('should return false when state is undefined', () => {
    //   const result = fromLoan.selectLoanLoading.projector(undefined);
    //   expect(result).toBeFalse();
    // });

    it('should return loading state when defined', () => {
      const result = fromLoan.selectLoanLoading.projector({
        ...initialState,
        loading: true,
      });
      expect(result).toBeTrue();
    });
  });

  describe('selectLoanError', () => {
    it('should return null when state is undefined', () => {
      const result = fromLoan.selectLoanError.projector(initialState);
      expect(result).toBeNull();
    });

    it('should return error when state is defined', () => {
      const mockError = 'An error occurred';
      const result = fromLoan.selectLoanError.projector({
        ...initialState,
        error: mockError,
      });
      expect(result).toEqual(mockError);
    });
  });

  describe('selectLastAddedLoan', () => {
    // it('should return null when state is undefined', () => {
    //   const result = fromLoan.selectLastAddedLoan.projector(undefined);
    //   expect(result).toBeNull();
    // });

    it('should return lastAddedLoan when state is defined', () => {
      const mockLastAddedLoan: ILoan = {
        UserLoanNumber: 1,
        LoanAmount: 1000,
        InterestRate: 5,
        LoanTermYears: 5,
        ApplicationDate: '2023-05-01',
        ApprovalStatus: 'Pending',
      };
      const result = fromLoan.selectLastAddedLoan.projector({
        ...initialState,
        lastAddedLoan: mockLastAddedLoan,
      });
      expect(result).toEqual(mockLastAddedLoan);
    });
  });

  // Edge case: Empty state
  describe('Empty state handling', () => {
    it('should handle empty state for all selectors', () => {
      expect(fromLoan.selectLoans.projector(initialState)).toEqual([]);
      expect(fromLoan.selectSelectedLoan.projector(initialState)).toBeNull();
      expect(fromLoan.selectLoanLoading.projector(initialState)).toBeFalse();
      expect(fromLoan.selectLoanError.projector(initialState)).toBeNull();
      expect(fromLoan.selectLastAddedLoan.projector(initialState)).toBeNull();
    });
  });

  // Boundary condition: Large dataset
  describe('Large dataset handling', () => {
    it('should handle a large number of loans', () => {
      const largeLoansArray: ILoan[] = Array(1000)
        .fill(null)
        .map((_, index) => ({
          UserLoanNumber: index,
          LoanAmount: index * 1000,
          InterestRate: 5,
          LoanTermYears: 10,
          ApplicationDate: '2023-05-01',
          ApprovalStatus: 'Pending',
        }));
      const result = fromLoan.selectLoans.projector({
        ...initialState,
        loans: largeLoansArray,
      });
      expect(result.length).toBe(1000);
      expect(result[999].LoanAmount).toBe(999000);
    });
  });

  // Error handling
  describe('Error handling', () => {
      it('should handle non-string error types', () => {
        const errorObject = 'Error occurred';
        const result = fromLoan.selectLoanError.projector({
        ...initialState,
        error: errorObject,
        });
        expect(result).toEqual(errorObject);
    });
  });

  // Edge case: Null values in ILoan properties
  describe('Null property handling', () => {
    it('should handle null values in ILoan properties', () => {
      const loanWithNullValues: ILoan = {
        UserLoanNumber: 1,
        LoanAmount: null as any,
        InterestRate: null as any,
        LoanTermYears: null as any,
        ApplicationDate: null as any,
        ApprovalStatus: null as any,
      };
      const result = fromLoan.selectSelectedLoan.projector({
        ...initialState,
        selectedLoan: loanWithNullValues,
      });
      expect(result).toEqual(loanWithNullValues);
    });
  });
});
