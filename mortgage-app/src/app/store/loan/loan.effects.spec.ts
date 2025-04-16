import { TestBed } from '@angular/core/testing';
import { LoanEffects } from './loan.effects';
import { LoanService } from '../../services/loan/loan.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, throwError, Subject } from 'rxjs';
import * as LoanActions from './loan.actions';
import { ILoan } from '../../models/ILoan';
import { Action } from '@ngrx/store';

describe('LoanEffects', () => {
  let actions$: Subject<Action>;
  let effects: LoanEffects;
  let loanService: jasmine.SpyObj<LoanService>;
  let mockLoan: ILoan;

  beforeEach(() => {
    mockLoan = {
      LoanId: 1,
      UserLoanNumber: 1001,
      LoanAmount: 150000,
      InterestRate: 4.5,
      LoanTermYears: 15,
      ApplicationDate: '2024-01-01',
      ApprovalStatus: 'Pending',
    };

    const spy = jasmine.createSpyObj('LoanService', [
      'getLoans',
      'createLoan',
      'getLoanById',
    ]);

    TestBed.configureTestingModule({
      providers: [
        LoanEffects,
        provideMockActions(() => actions$),
        { provide: LoanService, useValue: spy },
      ],
    });

    effects = TestBed.inject(LoanEffects);
    loanService = TestBed.inject(LoanService) as jasmine.SpyObj<LoanService>;
    actions$ = new Subject<Action>();
  });

  afterEach(() => {
    actions$.complete();
  });

  it('should return loadLoansSuccess on successful loadLoans', (done) => {
    const loans = [mockLoan];
    loanService.getLoans.and.returnValue(of(loans));

    effects.loadLoans$.subscribe((result) => {
      expect(result).toEqual(LoanActions.loadLoansSuccess({ loans }));
      done();
    });

    actions$.next(LoanActions.loadLoans());
  });

  it('should return loadLoansFailure on loadLoans error', (done) => {
    const error = 'Failed to load';
    loanService.getLoans.and.returnValue(throwError(() => error));

    effects.loadLoans$.subscribe((result) => {
      expect(result).toEqual({ type: '[Loan] Load Loans Failure', error });
      done();
    });

    actions$.next(LoanActions.loadLoans());
  });

  it('should return addLoanSuccess on successful addLoan', (done) => {
    loanService.createLoan.and.returnValue(of(mockLoan));

    effects.addLoan$.subscribe((result) => {
      expect(result).toEqual(LoanActions.addLoanSuccess({ loan: mockLoan }));
      done();
    });

    actions$.next(LoanActions.addLoan({ loan: mockLoan }));
  });

  it('should return addLoanFailure on addLoan error', (done) => {
    const error = 'Failed to add loan';
    loanService.createLoan.and.returnValue(throwError(() => error));

    effects.addLoan$.subscribe((result) => {
      expect(result).toEqual({ type: '[Loan] Add Loan Failure', error });
      done();
    });

    actions$.next(LoanActions.addLoan({ loan: mockLoan }));
  });

  it('should dispatch loadLoans after addLoanSuccess', (done) => {
    effects.refreshLoansAfterAdd$.subscribe((result) => {
      expect(result).toEqual(LoanActions.loadLoans());
      done();
    });

    actions$.next(LoanActions.addLoanSuccess({ loan: mockLoan }));
  });

  it('should return loadLoanByIdSuccess on successful loadLoanById', (done) => {
    loanService.getLoanById.and.returnValue(of(mockLoan));

    effects.loadLoanById$.subscribe((result) => {
      expect(result).toEqual(
        LoanActions.loadLoanByIdSuccess({ loan: mockLoan })
      );
      done();
    });

    actions$.next(
      LoanActions.loadLoanById({ userLoanNumber: mockLoan.UserLoanNumber })
    );
  });

  it('should return loadLoanByIdFailure on error', (done) => {
    const error = 'Not found';
    loanService.getLoanById.and.returnValue(throwError(() => error));

    effects.loadLoanById$.subscribe((result) => {
      expect(result).toEqual(LoanActions.loadLoanByIdFailure({ error }));
      done();
    });

    actions$.next(
      LoanActions.loadLoanById({ userLoanNumber: mockLoan.UserLoanNumber })
    );
  });
});
