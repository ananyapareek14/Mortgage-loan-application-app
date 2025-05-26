import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { calculateDti, resetDti } from '../../store/calculator/debt-to-income/dti.actions';
import { selectDtiError, selectDtiLoading, selectDtiResult } from '../../store/calculator/debt-to-income/dti.selectors';
import { filter } from 'rxjs';

@Component({
  selector: 'app-debt-to-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './debt-to-income.component.html',
  styleUrl: './debt-to-income.component.css',
})
export class DebtToIncomeComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  calculateDefaultPayment = true;
  proposedPaymentValue = 0;
  minSliderValue = 0;
  maxSliderValue = 10000;

  annualIncome = 0;

  form = this.fb.group({
    annualIncome: [700000, [Validators.required, Validators.min(0)]],
    minCreditCardPayments: [200, [Validators.required, Validators.min(0)]],
    carLoanPayments: [500, [Validators.required, Validators.min(0)]],
    studentLoanPayments: [3000, [Validators.required, Validators.min(0)]],
  });

  result$ = this.store.pipe(select(selectDtiResult));
  loading$ = this.store.pipe(select(selectDtiLoading));
  error$ = this.store.pipe(select(selectDtiError));

  constructor() {
    this.result$.pipe(filter(Boolean)).subscribe(result => {
      this.proposedPaymentValue = result.ProposedMonthlyPayment;
      this.minSliderValue = result.TotalDebts;

      // If income was already entered, calculate max based on that
      const income = this.form.get('annualIncome')?.value ?? 0;
      this.maxSliderValue = Math.max(this.minSliderValue + 100, income / 12 - 100);
    });
  }

  ngOnInit() {
    this.result$.pipe(filter(Boolean)).subscribe((result) => {
      this.proposedPaymentValue = result.ProposedMonthlyPayment;
      this.minSliderValue = result.TotalDebts;

      // If income was already entered, calculate max based on that
      const income = this.form.get('annualIncome')?.value ?? 0;
      this.maxSliderValue = Math.max(
        this.minSliderValue + 100,
        income / 12 - 100
      );
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const {
        annualIncome,
        minCreditCardPayments,
        carLoanPayments,
        studentLoanPayments,
      } = this.form.getRawValue();

      this.store.dispatch(
        calculateDti({
          request: {
            AnnualIncome: annualIncome!,
            MinCreditCardPayments: minCreditCardPayments!,
            CarLoanPayments: carLoanPayments!,
            StudentLoanPayments: studentLoanPayments!,
            ProposedMonthlyPayment: this.proposedPaymentValue,
            CalculateDefaultPayment: this.calculateDefaultPayment,
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
    });
    this.proposedPaymentValue = 0;
    this.calculateDefaultPayment = true;
  }

  onSliderChange(value: number) {
    this.calculateDefaultPayment = false;
    this.proposedPaymentValue = value;
    this.onSubmit();
  }
}
