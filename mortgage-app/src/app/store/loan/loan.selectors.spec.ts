// import { TestBed } from '@angular/core/testing';
// import { provideMockStore, MockStore } from '@ngrx/store/testing';
// import { LoanSelectors } from './loan.selectors';
// import { LoanState } from './loan.state';

// describe('Loan Selectors', () => {
//   let mockStore: MockStore<LoanState>;

//   const initialState: LoanState = {
//     loans: [
//       {
//         LoanId: 1,
//         UserLoanNumber: 123,
//         LoanAmount: 1000,
//         InterestRate: 5,
//         LoanTermYears: 5,
//         ApplicationDate: '2021-01-01',
//         ApprovalStatus: 'Approved',
//       }
//     ],
//     selectedLoan: {
//       LoanId: 1,
//       UserLoanNumber: 123,
//       LoanAmount: 1000,
//       InterestRate: 5,
//       LoanTermYears: 5,
//       ApplicationDate: '2021-01-01',
//       ApprovalStatus: 'Approved',
//     },
//     lastAddedLoan: {
//       LoanId: 1,
//       UserLoanNumber: 123,
//       LoanAmount: 1000,
//       InterestRate: 5,
//       LoanTermYears: 5,
//       ApplicationDate: '2021-01-01',
//       ApprovalStatus: 'Approved',
//     },
//     loading: false,
//     error: null,
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [provideMockStore()],
//     });

//     mockStore = TestBed.inject(MockStore);
//     mockStore.setState({ loans: initialState });
//   });

//   it('should select all loans', () => {
//     const result = LoanSelectors.selectLoans.projector(initialState);
//     expect(result.length).toBe(1);
//     expect(result[0]).toEqual({
//       LoanId: 1,
//       UserLoanNumber: 123,
//       LoanAmount: 1000,
//       InterestRate: 5,
//       LoanTermYears: 5,
//       ApplicationDate: '2021-01-01',
//       ApprovalStatus: 'Approved',
//     });
//   });

//   it('should select the selected loan', () => {
//     const result = LoanSelectors.selectSelectedLoan.projector(initialState);
//     expect(result).toEqual({
//       LoanId: 1,
//       UserLoanNumber: 123,
//       LoanAmount: 1000,
//       InterestRate: 5,
//       LoanTermYears: 5,
//       ApplicationDate: '2021-01-01',
//       ApprovalStatus: 'Approved',
//     });
//   });

//   it('should select the last added loan', () => {
//     const result = LoanSelectors.selectLoanAddSuccess.projector(initialState);
//     expect(result).toEqual({
//       LoanId: 1,
//       UserLoanNumber: 123,
//       LoanAmount: 1000,
//       InterestRate: 5,
//       LoanTermYears: 5,
//       ApplicationDate: '2021-01-01',
//       ApprovalStatus: 'Approved',
//     });
//   });

//   it('should select the loan loading state', () => {
//     const result = LoanSelectors.selectLoanLoading.projector(initialState);
//     expect(result).toBe(false);
//   });

//   it('should select the loan error state', () => {
//     const result = LoanSelectors.selectLoanError.projector(initialState);
//     expect(result).toBeNull();
//   });
// });