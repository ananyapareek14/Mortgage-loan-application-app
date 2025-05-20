import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { selectVaMortgageError, selectVaMortgageLoading, selectVaMortgageResult } from '../../store/calculator/va-mortgage/va-mortgage.selectors';
import { calculateVaMortgage, resetVaMortgage } from '../../store/calculator/va-mortgage/va-mortgage.actions';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-va-mortgage',
  imports: [CurrencyPipe, CommonModule, ReactiveFormsModule],
  templateUrl: './va-mortgage.component.html',
  styleUrl: './va-mortgage.component.css'
})
export class VaMortgageComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form = this.fb.group({
  HomePrice: [0, [Validators.required, Validators.min(0)]],
  DownPayment: [0, [Validators.required, Validators.min(0)]],
  InterestRate: [0, [Validators.required, Validators.min(0)]],
  LoanTermYears: [30, [Validators.required, Validators.min(1)]],
});


  result$ = this.store.pipe(select(selectVaMortgageResult));
  loading$ = this.store.pipe(select(selectVaMortgageLoading));
  error$ = this.store.pipe(select(selectVaMortgageError));

  onSubmit() {
    if (this.form.valid) {
      const request = this.form.getRawValue() as any;
      this.store.dispatch(calculateVaMortgage({ request }));
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.form.reset({
      HomePrice: 0,
      DownPayment: 0,
      InterestRate: 0,
      LoanTermYears: 30,
    });
    this.store.dispatch(resetVaMortgage());
  }
}
