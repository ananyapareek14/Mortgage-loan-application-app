import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoanService } from '../../services/loan/loan.service';
import * as LoanActions from './loan.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ILoan } from '../../models/ILoan';

@Injectable()
export class LoanEffects {
  private actions$ = inject(Actions);
  private loanService = inject(LoanService);

  // Effect to Load Loans
  //   loadLoans$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(LoanActions.loadLoans), // Listen for loadLoans action
  //       mergeMap(() =>
  //         this.loanService.getLoans().pipe(
  //           map((loans: ILoan[]) => LoanActions.loadLoansSuccess({ loans })),
  //           catchError((error) =>
  //             of(LoanActions.loadLoansFailure({ error: error.message }))
  //           )
  //         )
  //       )
  //     )
  //   );

  //   // Effect to Add Loan
  //   addLoan$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(LoanActions.addLoan), // Listen for addLoan action
  //       mergeMap(({ loan }) =>
  //         this.loanService.createLoan(loan).pipe(
  //           map((newLoan: ILoan) =>
  //             LoanActions.addLoanSuccess({ loan: newLoan })
  //           ),
  //           catchError((error) =>
  //             of(LoanActions.addLoanFailure({ error: error.message }))
  //           )
  //         )
  //       )
  //     )
  //   );

  loadLoans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoanActions.loadLoans),
      tap(() => console.log('🚀 [Effect] Load Loans Dispatched')), // Debug log
      mergeMap(() =>
        this.loanService.getLoans().pipe(
          tap((loans) => console.log('✅ [Effect] Loans Fetched:', loans)), // Debug log
          map((loans) => LoanActions.loadLoansSuccess({ loans })),
          catchError((error) => {
            console.error('❌ [Effect] Load Loans Failed:', error);
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
}
