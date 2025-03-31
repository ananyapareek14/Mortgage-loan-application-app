import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LoanService } from '../services/loan/loan.service';
import { ILoan } from '../models/ILoan';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-application',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './loan-application.component.html',
  styleUrl: './loan-application.component.css'
})
export class LoanApplicationComponent {
  loanForm: FormGroup;

  constructor(private fb: FormBuilder, private store: Store, private loanService: LoanService) {
    this.loanForm = this.fb.group({
      LoanAmount: ['', Validators.required],
      InterestRate: ['', Validators.required],
      LoanTermYears: ['', Validators.required],
    });
  }

  submitLoan() {
    if (this.loanForm.valid) {
      const newLoan: ILoan = {
        LoanId: 0,
        ...this.loanForm.value,
        ApplicationDate: new Date().toISOString(),
        ApplicationStatus: 'Pending',
      };

      this.loanService.createLoan(newLoan);
    }
  }
}
