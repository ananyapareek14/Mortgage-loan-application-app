import { Component, inject } from '@angular/core';
import { calculateDti, resetDti } from '../../store/calculator/debt-to-income/dti.actions';
import { select, Store } from '@ngrx/store';
import { selectDtiError, selectDtiLoading, selectDtiResult } from '../../store/calculator/debt-to-income/dti.selectors';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-debt-to-income',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './debt-to-income.component.html',
  styleUrl: './debt-to-income.component.css',
})
export class DebtToIncomeComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    annualIncome: [0, [Validators.required, Validators.min(0)]],
    minCreditCardPayments: [0, [Validators.required, Validators.min(0)]],
    carLoanPayments: [0, [Validators.required, Validators.min(0)]],
    studentLoanPayments: [0, [Validators.required, Validators.min(0)]],
    proposedMonthlyPayment: [0, [Validators.required, Validators.min(0)]],
  });

  result$ = this.store.pipe(select(selectDtiResult));
  loading$ = this.store.pipe(select(selectDtiLoading));
  error$ = this.store.pipe(select(selectDtiError));

  onSubmit() {
    if (this.form.valid) {
      const {
        annualIncome,
        minCreditCardPayments,
        carLoanPayments,
        studentLoanPayments,
        proposedMonthlyPayment,
      } = this.form.getRawValue();

      this.store.dispatch(
        calculateDti({
          request: {
            AnnualIncome: annualIncome!,
            MinCreditCardPayments: minCreditCardPayments!,
            CarLoanPayments: carLoanPayments!,
            StudentLoanPayments: studentLoanPayments!,
            ProposedMonthlyPayment: proposedMonthlyPayment!,
          },
        })
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.store.dispatch(resetDti());
    this.form.reset({
      annualIncome: 0,
      minCreditCardPayments: 0,
      carLoanPayments: 0,
      studentLoanPayments: 0,
      proposedMonthlyPayment: 0,
    });
  }
}
