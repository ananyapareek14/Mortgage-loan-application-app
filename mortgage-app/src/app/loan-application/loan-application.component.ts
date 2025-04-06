import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ILoan } from '../models/ILoan';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { IInterestRate } from '../models/IInterestRate';
import { addLoan } from '../store/loan/loan.actions';
import { selectAllInterestRates } from '../store/interest-rates/interest-rate.selectors';
import { loadInterestRates } from '../store/interest-rates/interest-rate.actions';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-application',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './loan-application.component.html',
  styleUrl: './loan-application.component.css',
})

export class LoanApplicationComponent implements OnInit {
  loanForm!: FormGroup;
  interestRates$!: Observable<IInterestRate[]>;

  constructor(private fb: FormBuilder, private store: Store, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.loanForm = this.fb.group({
      LoanAmount: ['', [Validators.required, Validators.min(1000)]],
      InterestRate: ['', Validators.required],
      LoanTermYears: ['', [Validators.required, Validators.min(1)]],
    });

    this.store.dispatch(loadInterestRates());
    this.interestRates$ = this.store.select(selectAllInterestRates);
  }

  submitLoan() {
    if (this.loanForm.valid) {
      const newLoan: ILoan = {
        LoanId: 0,
        ...this.loanForm.value,
        ApplicationDate: new Date().toISOString(),
        ApplicationStatus: 'Pending',
      };

      this.store.dispatch(addLoan({ loan: newLoan }));
      this.toastr.success('Loan application submitted successfully!', 'Success');
      this.loanForm.reset();
      this.router.navigate(['/dashboard']);
    }
    else {
      this.toastr.error('Please fill in all required fields correctly.', 'Invalid Form');
    }
  }
}
