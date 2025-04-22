// import { TestBed } from '@angular/core/testing';
// import { Store, StoreModule } from '@ngrx/store';
// import { LoanState } from './loan.state';
// import * as fromLoan from './loan.selectors';
// import { ILoan } from '../../models/ILoan';

// describe('Loan Selectors', () => {
//   let store: Store<LoanState>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [StoreModule.forRoot({}), StoreModule.forFeature('loan', {})],
//     });

//     store = TestBed.inject(Store);
//   });

//   const mockLoan: ILoan = {
//     LoanId: 1,
//     UserLoanNumber: 12345,
//     LoanAmount: 100000,
//     InterestRate: 5.5,
//     LoanTermYears: 30,
//     ApplicationDate: '2023-06-01',
//     ApprovalStatus: 'Approved',
//   };

//   describe('selectLoans', () => {
//     it('should return an empty array when state is undefined', () => {
//       const result = fromLoan.selectLoans.projector(undefined);
//       expect(result).toEqual([]);
//     });

//     it('should return loans array when state is defined', () => {
//       const mockLoans: ILoan[] = [mockLoan, { ...mockLoan, LoanId: 2 }];
//       const result = fromLoan.selectLoans.projector({ loans: mockLoans });
//       expect(result).toEqual(mockLoans);
//     });
//   });

//   describe('selectSelectedLoan', () => {
//     it('should return null when state is undefined', () => {
//       const result = fromLoan.selectSelectedLoan.projector(undefined);
//       expect(result).toBeNull();
//     });

//     it('should return selected loan when state is defined', () => {
//       const result = fromLoan.selectSelectedLoan.projector({
//         selectedLoan: mockLoan,
//       });
//       expect(result).toEqual(mockLoan);
//     });
//   });

//   describe('selectLoanLoading', () => {
//     it('should return false when state is undefined', () => {
//       const result = fromLoan.selectLoanLoading.projector(undefined);
//       expect(result).toBeFalse();
//     });

//     it('should return loading state when defined', () => {
//       const result = fromLoan.selectLoanLoading.projector({ loading: true });
//       expect(result).toBeTrue();
//     });
//   });

//   describe('selectLoanError', () => {
//     it('should return null when state is undefined', () => {
//       const result = fromLoan.selectLoanError.projector(undefined);
//       expect(result).toBeNull();
//     });

//     it('should return error when state is defined', () => {
//       const mockError = 'An error occurred';
//       const result = fromLoan.selectLoanError.projector({ error: mockError });
//       expect(result).toEqual(mockError);
//     });
//   });

//   describe('selectLoanById', () => {
//     it('should return null when state is undefined', () => {
//       const result = fromLoan.selectLoanById.projector(undefined, {
//         loanId: 1,
//       });
//       expect(result).toBeNull();
//     });

//     it('should return selected loan when state is defined', () => {
//       const mockLoans: ILoan[] = [mockLoan, { ...mockLoan, LoanId: 2 }];
//       const result = fromLoan.selectLoanById.projector(
//         { loans: mockLoans },
//         { loanId: 1 }
//       );
//       expect(result).toEqual(mockLoan);
//     });
//   });

//   describe('selectLoanAddSuccess', () => {
//     it('should return undefined when state is undefined', () => {
//       const result = fromLoan.selectLoanAddSuccess.projector(undefined);
//       expect(result).toBeUndefined();
//     });

//     it('should return lastAddedLoan when state is defined', () => {
//       const result = fromLoan.selectLoanAddSuccess.projector({
//         lastAddedLoan: mockLoan,
//       });
//       expect(result).toEqual(mockLoan);
//     });
//   });

//   // Edge case: Empty state
//   describe('Edge case: Empty state', () => {
//     it('should handle empty state for all selectors', () => {
//       const emptyState = {};
//       expect(fromLoan.selectLoans.projector(emptyState)).toEqual([]);
//       expect(fromLoan.selectSelectedLoan.projector(emptyState)).toBeNull();
//       expect(fromLoan.selectLoanLoading.projector(emptyState)).toBeFalse();
//       expect(fromLoan.selectLoanError.projector(emptyState)).toBeNull();
//       expect(
//         fromLoan.selectLoanById.projector(emptyState, { loanId: 1 })
//       ).toBeNull();
//       expect(
//         fromLoan.selectLoanAddSuccess.projector(emptyState)
//       ).toBeUndefined();
//     });
//   });

//   // Boundary condition: Large dataset
//   describe('Boundary condition: Large dataset', () => {
//     it('should handle a large number of loans', () => {
//       const largeLoansArray: ILoan[] = Array(10000)
//         .fill(mockLoan)
//         .map((loan, index) => ({ ...loan, LoanId: index + 1 }));
//       const result = fromLoan.selectLoans.projector({ loans: largeLoansArray });
//       expect(result.length).toBe(10000);
//     });
//   });

//   // Error handling
//   describe('Error handling', () => {
//     it('should handle non-string error', () => {
//       const nonStringError = { message: 'Error object' };
//       const result = fromLoan.selectLoanError.projector({
//         error: nonStringError,
//       });
//       expect(result).toEqual(nonStringError);
//     });
//   });

//   // Edge case: Invalid loan data
//   describe('Edge case: Invalid loan data', () => {
//     it('should handle invalid loan data', () => {
//       const invalidLoan: any = { ...mockLoan, LoanAmount: 'invalid' };
//       const result = fromLoan.selectSelectedLoan.projector({
//         selectedLoan: invalidLoan,
//       });
//       expect(result).toEqual(invalidLoan);
//     });
//   });

//   // Edge case: Negative values
//   describe('Edge case: Negative values', () => {
//     it('should handle negative loan amount and interest rate', () => {
//       const negativeLoan: ILoan = {
//         ...mockLoan,
//         LoanAmount: -100000,
//         InterestRate: -5.5,
//       };
//       const result = fromLoan.selectSelectedLoan.projector({
//         selectedLoan: negativeLoan,
//       });
//       expect(result).toEqual(negativeLoan);
//     });
//   });
// });
