// import { TestBed } from '@angular/core/testing';
// import { Actions } from '@ngrx/effects';
// import { StoreModule } from '@ngrx/store';
// import { of, throwError } from 'rxjs';
// import { LoanService } from '../../services/loan/loan.service';
// import { LoanEffects } from './loan.effects';
// import * as LoanActions from './loan.actions';
// import { provideMockStore } from '@ngrx/store/testing';

// describe('LoanEffects', () => {
//   let actions$: Actions;
//   let effects: LoanEffects;
//   let loanService: jasmine.SpyObj<LoanService>;

//   beforeEach(() => {
//     const spy = jasmine.createSpyObj('LoanService', ['getLoans', 'createLoan', 'getLoanById']);

//     TestBed.configureTestingModule({
//       imports: [StoreModule.forRoot({})],
//       providers: [
//         LoanEffects,
//         { provide: LoanService, useValue: spy },
//         provideMockStore(),
//       ],
//     });

//     actions$ = TestBed.inject(Actions);
//     effects = TestBed.inject(LoanEffects);
//     loanService = TestBed.inject(LoanService) as jasmine.SpyObj<LoanService>;
//   });

//   it('should load loans successfully', () => {
//     const mockLoans = [
//       { LoanId: 1, UserLoanNumber: 123, LoanAmount: 1000, InterestRate: 5, LoanTermYears: 5, ApplicationDate: '2021-01-01', ApprovalStatus: 'Approved' },
//     ];

//     loanService.getLoans.and.returnValue(of(mockLoans));

//     const action = LoanActions.loadLoans();
//     const completion = LoanActions.loadLoansSuccess({ loans: mockLoans });

//     actions$ = of(action);
//     effects.loadLoans$.subscribe(result => {
//       expect(result).toEqual(completion);
//     });
//   });

//   it('should handle failure to load loans', () => {
//     const errorMessage = 'Failed to load loans';
//     loanService.getLoans.and.returnValue(throwError(() => new Error(errorMessage)));

//     const action = LoanActions.loadLoans();
//     const completion = LoanActions.loadLoansFailure({ error: errorMessage });

//     actions$ = of(action);
//     effects.loadLoans$.subscribe(result => {
//       expect(result).toEqual(completion);
//     });
//   });
// });
