import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  selectAffordabilityError,
  selectAffordabilityLoading,
  selectAffordabilityResult,
} from '../../store/calculator/affordability/affordability.selectors';
import {
  calculateAffordability,
  resetAffordability,
} from '../../store/calculator/affordability/affordability.actions';
import { IAffordabilityRequest } from '../../models/IAffordability';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Chart } from 'chart.js';
import { take, tap } from 'rxjs';
import {
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-affordability',
  imports: [CurrencyPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './affordability.component.html',
  styleUrl: './affordability.component.css',
})
export class AffordabilityComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('breakdownChartCanvas') breakdownChartCanvas!: ElementRef;
  private store = inject(Store);
  private fb = inject(FormBuilder);
  activeTab = 'summary';
  chart: Chart | null = null;

  form = this.fb.group({
    annualIncome: [700000, [Validators.required, Validators.min(0)]],
    monthlyDebts: [2500, [Validators.required, Validators.min(0)]],
    downPayment: [200000, [Validators.required, Validators.min(0)]],
    interestRate: [6.5, [Validators.required, Validators.min(0)]],
    loanTermYears: [30, [Validators.required, Validators.min(1)]],
  });

  // result$ = this.store.pipe(select(selectAffordabilityResult));
  result$ = this.store.pipe(
    select(selectAffordabilityResult),
    tap(result => {
      if (result && this.activeTab === 'breakdown') {
        this.renderChart(result.EstimatedMonthlyPayment, result.MaxAffordableHomePrice);
      }
    })
  );

  loading$ = this.store.pipe(select(selectAffordabilityLoading));
  error$ = this.store.pipe(select(selectAffordabilityError));

  ngOnInit(): void {
    const raw = this.form.getRawValue();
    const request: IAffordabilityRequest = {
      AnnualIncome: raw.annualIncome ?? 0,
      MonthlyDebts: raw.monthlyDebts ?? 0,
      DownPayment: raw.downPayment ?? 0,
      InterestRate: raw.interestRate ?? 0,
      LoanTermMonths: raw.loanTermYears ?? 0,
    };

    this.store.dispatch(calculateAffordability({ request }));
  }

  ngAfterViewInit(): void {
    // Chart will be rendered in tap() once result arrives
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();

      const request: IAffordabilityRequest = {
        AnnualIncome: raw.annualIncome ?? 0,
        MonthlyDebts: raw.monthlyDebts ?? 0,
        DownPayment: raw.downPayment ?? 0,
        InterestRate: raw.interestRate ?? 0,
        LoanTermMonths: (raw.loanTermYears ?? 0),
      };

      this.store.dispatch(calculateAffordability({ request }));
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.store.dispatch(resetAffordability());
    this.form.reset({
      annualIncome: 0,
      monthlyDebts: 0,
      downPayment: 0,
      interestRate: 0,
      loanTermYears: 30,
    });
  }

  private renderChart(monthlyPayment: number, MaxAffordableHomePrice: number) {
    const taxes = (MaxAffordableHomePrice * 0.012)/12;
    const insurance = Math.ceil(945/12);
    const principalAndInterest = monthlyPayment - (taxes + insurance);

    this.destroyChart(); 

    this.chart = new Chart(this.breakdownChartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Principal & Interest', 'Taxes', 'Insurance'],
        datasets: [{
          data: [principalAndInterest, taxes, insurance],
          backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  private destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  setActiveTab(tab: string) {
  this.activeTab = tab;

  if (tab === 'breakdown') {
    // Wait for the canvas to be in the DOM
    setTimeout(() => {
      this.result$.pipe(take(1)).subscribe(result => {
        if (result) {
          this.renderChart(result.EstimatedMonthlyPayment, result.MaxAffordableHomePrice);
        }
      });
    }, 0);
  } else {
    this.destroyChart(); // destroy chart if switching away
  }
}

}