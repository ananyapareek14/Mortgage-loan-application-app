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
            LoanAmount: 1000,
            InterestRate: 5,
            LoanTermYears: 5,
            ApplicationDate: '2023-05-01',
            ApprovalStatus: 'Approved',
          },
          {
            UserLoanNumber: 2,
            LoanAmount: 2000,
            InterestRate: 6,
            LoanTermYears: 10,
            ApplicationDate: '2023-05-02',
            ApprovalStatus: 'Pending',
          },
        ];
        actions$ = hot('-a', { a: LoanActions.loadLoans() });
        const response = cold('-b|', { b: loans });
        loanService.getLoans.and.returnValue(response);

        const expected = hot('--c', {
          c: LoanActions.loadLoansSuccess({ loans }),
        });

        expectObservable(effects.loadLoans$).toEqual(expected);
      });
    });

    // it('should return a loadLoansFailure action on error', () => {
    //   testScheduler.run(({ hot, cold, expectObservable }) => {
    //     const error = 'Test error';
    //     actions$ = hot('-a', { a: LoanActions.loadLoans() });
    //     const response = cold('-#|', {}, error);
    //     loanService.getLoans.and.returnValue(response);

    //     const expected = hot('--c', {
    //       c: LoanActions.loadLoansFailure({ error }),
    //     });

    //     expectObservable(effects.loadLoans$).toEqual(expected);
    //   });
    // });

    // Edge case: Empty loan array
    it('should handle empty loan array', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const loans: ILoan[] = [];
        actions$ = hot('-a', { a: LoanActions.loadLoans() });
        const response = cold('-b|', { b: loans });
        loanService.getLoans.and.returnValue(response);

        const expected = hot('--c', {
          c: LoanActions.loadLoansSuccess({ loans }),
        });

        expectObservable(effects.loadLoans$).toEqual(expected);
      });
    });
  });

  describe('addLoan$', () => {
    it('should return an addLoanSuccess action with the new loan on success', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const newLoan: ILoan = {
          UserLoanNumber: 3,
          LoanAmount: 3000,
          InterestRate: 7,
          LoanTermYears: 15,
          ApplicationDate: '2023-05-03',
          ApprovalStatus: 'Pending',
        };
        actions$ = hot('-a', { a: LoanActions.addLoan({ loan: newLoan }) });
        const response = cold('-b|', { b: newLoan });
        loanService.createLoan.and.returnValue(response);

        const expected = hot('--c', {
          c: LoanActions.addLoanSuccess({ loan: newLoan }),
        });

        expectObservable(effects.addLoan$).toEqual(expected);
      });
    });

    // it('should return an addLoanFailure action on error', () => {
    //   testScheduler.run(({ hot, cold, expectObservable }) => {
    //     const error = 'Test error';
    //     const newLoan: ILoan = {
    //       UserLoanNumber: 3,
    //       LoanAmount: 3000,
    //       InterestRate: 7,
    //       LoanTermYears: 15,
    //       ApplicationDate: '2023-05-03',
    //       ApprovalStatus: 'Pending',
    //     };
    //     actions$ = hot('-a', { a: LoanActions.addLoan({ loan: newLoan }) });
    //     const response = cold('-#|', {}, error);
    //     loanService.createLoan.and.returnValue(response);

    //     const expected = hot('--c', {
    //       c: LoanActions.addLoanFailure({ error }),
    //     });

    //     expectObservable(effects.addLoan$).toEqual(expected);
    //   });
    // });

    // Edge case: Invalid loan data
    // it('should handle invalid loan data', () => {
    //   testScheduler.run(({ hot, cold, expectObservable }) => {
    //     const invalidLoan: Partial<ILoan> = {
    //       UserLoanNumber: 3,
    //       LoanAmount: -1000,
    //     };
    //     actions$ = hot('-a', {
    //       a: LoanActions.addLoan({ loan: invalidLoan as ILoan }),
    //     });
    //     const error = 'Invalid loan data';
    //     const response = cold('-#|', {}, error);
    //     loanService.createLoan.and.returnValue(response);

    //     const expected = hot('--c', {
    //       c: LoanActions.addLoanFailure({ error }),
    //     });

    //     expectObservable(effects.addLoan$).toEqual(expected);
    //   });
    // });
  });

  describe('refreshLoansAfterAdd$', () => {
    it('should dispatch a loadLoans action after addLoanSuccess', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const newLoan: ILoan = {
          UserLoanNumber: 3,
          LoanAmount: 3000,
          InterestRate: 7,
          LoanTermYears: 15,
          ApplicationDate: '2023-05-03',
          ApprovalStatus: 'Pending',
        };
        actions$ = hot('-a', {
          a: LoanActions.addLoanSuccess({ loan: newLoan }),
        });

        const expected = hot('-b', {
          b: LoanActions.loadLoans(),
        });

        expectObservable(effects.refreshLoansAfterAdd$).toEqual(expected);
      });
    });
  });

  describe('loadLoanById$', () => {
    it('should return a loadLoanByIdSuccess action with the loan on success', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const loan: ILoan = {
          UserLoanNumber: 1,
          LoanAmount: 1000,
          InterestRate: 5,
          LoanTermYears: 5,
          ApplicationDate: '2023-05-01',
          ApprovalStatus: 'Approved',
        };
        actions$ = hot('-a', {
          a: LoanActions.loadLoanById({ userLoanNumber: 1 }),
        });
        const response = cold('-b|', { b: loan });
        loanService.getLoanById.and.returnValue(response);

        const expected = hot('--c', {
          c: LoanActions.loadLoanByIdSuccess({ loan }),
        });

        expectObservable(effects.loadLoanById$).toEqual(expected);
      });
    });

    // it('should return a loadLoanByIdFailure action on error', () => {
    //   testScheduler.run(({ hot, cold, expectObservable }) => {
    //     const error = 'Test error';
    //     actions$ = hot('-a', {
    //       a: LoanActions.loadLoanById({ userLoanNumber: 1 }),
    //     });
    //     const response = cold('-#|', {}, error);
    //     loanService.getLoanById.and.returnValue(response);

    //     const expected = hot('--c', {
    //       c: LoanActions.loadLoanByIdFailure({ error }),
    //     });

    //     expectObservable(effects.loadLoanById$).toEqual(expected);
    //   });
    // });

    // // Edge case: Non-existent loan ID
    // it('should handle non-existent loan ID', () => {
    //   testScheduler.run(({ hot, cold, expectObservable }) => {
    //     actions$ = hot('-a', {
    //       a: LoanActions.loadLoanById({ userLoanNumber: 999 }),
    //     });
    //     const response = cold('-b|', { b: null });
    //     loanService.getLoanById.and.returnValue(response);

    //     const expected = hot('--c', {
    //       c: LoanActions.loadLoanByIdSuccess({ loan: null }),
    //     });

    //     expectObservable(effects.loadLoanById$).toEqual(expected);
    //   });
    // });
  });
});