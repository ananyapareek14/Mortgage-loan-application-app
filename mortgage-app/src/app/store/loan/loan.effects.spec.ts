import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { LoanEffects } from './loan.effects';
import { LoanService } from '../../services/loan/loan.service';
import * as LoanActions from './loan.actions';
import { ILoan } from '../../models/ILoan';

describe('LoanEffects', () => {
  let actions$: Observable<any>;
  let effects: LoanEffects;
  let loanService: jasmine.SpyObj<LoanService>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    const loanServiceSpy = jasmine.createSpyObj('LoanService', [
      'getLoans',
      'createLoan',
      'getLoanById',
    ]);

    TestBed.configureTestingModule({
      providers: [
        LoanEffects,
        provideMockActions(() => actions$),
        { provide: LoanService, useValue: loanServiceSpy },
      ],
    });

    effects = TestBed.inject(LoanEffects);
    loanService = TestBed.inject(LoanService) as jasmine.SpyObj<LoanService>;
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadLoans$', () => {
    it('should return a loadLoansSuccess action with loans on success', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const loans: ILoan[] = [
          {
            UserLoanNumber: 1,
            LoanAmount: 100000,
            InterestRate: 5,
            LoanTermYears: 30,
            ApplicationDate: '2023-05-01',
            ApprovalStatus: 'Approved',
          },
          {
            UserLoanNumber: 2,
            LoanAmount: 200000,
            InterestRate: 4.5,
            LoanTermYears: 15,
            ApplicationDate: '2023-05-02',
            ApprovalStatus: 'Pending',
          },
        ];
        actions$ = hot('-a', { a: LoanActions.loadLoans() });
        const response = cold('-b|', { b: loans });
        loanService.getLoans.and.returnValue(response);

        const expected = '-c';
        const expectedValues = {
          c: LoanActions.loadLoansSuccess({ loans }),
        };

        expectObservable(effects.loadLoans$).toBe(expected, expectedValues);
      });
    });

    // ... (keep the existing error test case)
  });

  describe('addLoan$', () => {
    it('should return an addLoanSuccess action with the new loan on success', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const newLoan: ILoan = {
          UserLoanNumber: 3,
          LoanAmount: 150000,
          InterestRate: 4.75,
          LoanTermYears: 20,
          ApplicationDate: '2023-05-03',
          ApprovalStatus: 'Pending',
        };
        actions$ = hot('-a', { a: LoanActions.addLoan({ loan: newLoan }) });
        const response = cold('-b|', { b: newLoan });
        loanService.createLoan.and.returnValue(response);

        const expected = '-c';
        const expectedValues = {
          c: LoanActions.addLoanSuccess({ loan: newLoan }),
        };

        expectObservable(effects.addLoan$).toBe(expected, expectedValues);
      });
    });

    // ... (keep the existing error test case)
  });

  // ... (keep the existing refreshLoansAfterAdd$ test case)

  describe('loadLoanById$', () => {
    it('should return a loadLoanByIdSuccess action with the loan on success', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const loan: ILoan = {
          UserLoanNumber: 1,
          LoanAmount: 100000,
          InterestRate: 5,
          LoanTermYears: 30,
          ApplicationDate: '2023-05-01',
          ApprovalStatus: 'Approved',
        };
        actions$ = hot('-a', {
          a: LoanActions.loadLoanById({ userLoanNumber: 1 }),
        });
        const response = cold('-b|', { b: loan });
        loanService.getLoanById.and.returnValue(response);

        const expected = '-c';
        const expectedValues = {
          c: LoanActions.loadLoanByIdSuccess({ loan }),
        };

        expectObservable(effects.loadLoanById$).toBe(expected, expectedValues);
      });
    });

    // ... (keep the existing error test case)
  });

  // Edge case: Empty loan list
  it('should handle empty loan list in loadLoans$', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      actions$ = hot('-a', { a: LoanActions.loadLoans() });
      const response = cold('-b|', { b: [] });
      loanService.getLoans.and.returnValue(response);

      const expected = '-c';
      const expectedValues = {
        c: LoanActions.loadLoansSuccess({ loans: [] }),
      };

      expectObservable(effects.loadLoans$).toBe(expected, expectedValues);
    });
  });

  // Edge case: Maximum loan amount
  it('should handle maximum loan amount in addLoan$', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const maxLoan: ILoan = {
        UserLoanNumber: 4,
        LoanAmount: Number.MAX_SAFE_INTEGER,
        InterestRate: 3,
        LoanTermYears: 30,
        ApplicationDate: '2023-05-04',
        ApprovalStatus: 'Pending',
      };
      actions$ = hot('-a', { a: LoanActions.addLoan({ loan: maxLoan }) });
      const response = cold('-b|', { b: maxLoan });
      loanService.createLoan.and.returnValue(response);

      const expected = '-c';
      const expectedValues = {
        c: LoanActions.addLoanSuccess({ loan: maxLoan }),
      };

      expectObservable(effects.addLoan$).toBe(expected, expectedValues);
    });
  });

  // Edge case: Minimum loan term
  it('should handle minimum loan term in addLoan$', () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      const minTermLoan: ILoan = {
        UserLoanNumber: 5,
        LoanAmount: 50000,
        InterestRate: 6,
        LoanTermYears: 1,
        ApplicationDate: '2023-05-05',
        ApprovalStatus: 'Pending',
      };
      actions$ = hot('-a', { a: LoanActions.addLoan({ loan: minTermLoan }) });
      const response = cold('-b|', { b: minTermLoan });
      loanService.createLoan.and.returnValue(response);

      const expected = '-c';
      const expectedValues = {
        c: LoanActions.addLoanSuccess({ loan: minTermLoan }),
      };

      expectObservable(effects.addLoan$).toBe(expected, expectedValues);
    });
  });

  // Edge case: Invalid loan number
//   it('should handle invalid loan number in loadLoanById$', () => {
//     testScheduler.run(({ hot, cold, expectObservable }) => {
//       const error = 'Loan not found';
//       actions$ = hot('-a', {
//         a: LoanActions.loadLoanById({ userLoanNumber: -1 }),
//       });
//       const response = cold('-#|', {}, error);
//       loanService.getLoanById.and.returnValue(response);

//       const expected = '-c';
//       const expectedValues = {
//         c: LoanActions.loadLoanByIdFailure({ error }),
//       };

//       expectObservable(effects.loadLoanById$).toBe(expected, expectedValues);
//     });
//   });
});
