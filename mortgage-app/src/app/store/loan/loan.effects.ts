import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoanService } from '../../services/loan/loan.service';
import * as LoanActions from './loan.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class LoanEffects {
  private actions$ = inject(Actions);
  private loanService = inject(LoanService);

  loadLoans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoanActions.loadLoans),
      mergeMap(() =>
        this.loanService.getLoans().pipe(
          map((loans) => LoanActions.loadLoansSuccess({ loans })),
          catchError((error) => {
            return of({ type: '[Loan] Load Loans Failure', error });
          })
        )
      )
    )
  );

  addLoan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoanActions.addLoan),
      mergeMap((action) =>
        this.loanService.createLoan(action.loan).pipe(
          map((newLoan) => LoanActions.addLoanSuccess({ loan: newLoan })),
          catchError((error) => of({ type: '[Loan] Add Loan Failure', error }))
        )
      )
    )
  );

  loadLoanById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoanActions.loadLoanById),
      mergeMap((action) =>
        this.loanService.getLoanById(action.userLoanNumber).pipe(
          map((loan) => LoanActions.loadLoanByIdSuccess({ loan })),
          catchError((error) => of(LoanActions.loadLoanByIdFailure({ error })))
        )
      )
    )
  );
}
