// import {
//   Component,
//   ElementRef,
//   OnDestroy,
//   ViewChild,
//   inject,
//   AfterViewInit,
//   OnInit,
// } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { Store } from '@ngrx/store';
// import { Chart} from 'chart.js';
// import { Subscription } from 'rxjs';

// import {
//   calculateVaMortgage,
//   resetVaMortgage,
// } from '../../store/calculator/va-mortgage/va-mortgage.actions';
// import {
//   selectVaMortgageError,
//   selectVaMortgageLoading,
//   selectVaMortgageResult,
// } from '../../store/calculator/va-mortgage/va-mortgage.selectors';
// import { IVaMortgage, IVaMortgageRequest } from '../../models/IVaMortgage';
// import { MatTabsModule } from '@angular/material/tabs';
// import {
//   LineController,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// Chart.register(
//   LineController,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Tooltip,
//   Legend
// );

// @Component({
//   selector: 'app-va-mortgage',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     CurrencyPipe,
//     MatTabsModule,
//   ],
//   templateUrl: './va-mortgage.component.html',
//   styleUrls: ['./va-mortgage.component.css'],
// })
// export class VaMortgageComponent implements OnDestroy, AfterViewInit, OnInit {
//   @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;
//   private store = inject(Store);
//   private fb = inject(FormBuilder);

//   form = this.fb.group({
//     HomePrice: [300000, [Validators.required, Validators.min(0)]],
//     DownPayment: [60000, [Validators.required, Validators.min(0)]],
//     InterestRate: [5, [Validators.required, Validators.min(0)]],
//     LoanTermYears: [10, [Validators.required, Validators.min(1)]],
//   });

//   result$ = this.store.select(selectVaMortgageResult);
//   loading$ = this.store.select(selectVaMortgageLoading);
//   error$ = this.store.select(selectVaMortgageError);

//   paginatedResults: IVaMortgage[] = [];
//   pageSize = 12;
//   currentPage = 1;
//   totalPages = 1;

//   private chartInstance: Chart | null = null;
//   private resultSub: Subscription;
//   private latestData: IVaMortgage[] = [];


//   constructor() {
//     this.resultSub = this.result$.subscribe((data: IVaMortgage[] | null) => {
//       if (data && data.length) {
//         this.latestData = data;
//         this.totalPages = Math.ceil(data.length / this.pageSize);
//         this.currentPage = 1;
//         this.updatePage(data);

//         // Only render if the canvas element is ready
//         if (this.chartCanvasRef) {
//           this.renderChart(data);
//         }
//       } else {
//         this.paginatedResults = [];
//         this.totalPages = 1;
//         this.currentPage = 1;
//         if (this.chartInstance) {
//           this.chartInstance.destroy();
//           this.chartInstance = null;
//         }
//       }
//     });
//   }

//   ngOnInit(): void {
//   const request: IVaMortgageRequest = {
//     HomePrice: this.form.value.HomePrice ?? 0,
//     DownPayment: this.form.value.DownPayment ?? 0,
//     InterestRate: this.form.value.InterestRate ?? 0,
//     LoanTermYears: this.form.value.LoanTermYears ?? 0,
//   };

//   this.store.dispatch(calculateVaMortgage({ request }));
// }

//   ngAfterViewInit() {
//     // If data is already loaded before view init, render the chart now
//     if (this.latestData.length) {
//       this.renderChart(this.latestData);
//     }
//   }

//   updatePage(data: IVaMortgage[]) {
//     const start = (this.currentPage - 1) * this.pageSize;
//     this.paginatedResults = data.slice(start, start + this.pageSize);
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.updatePage(this.latestData);
//     }
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.updatePage(this.latestData);
//     }
//   }

//   renderChart(data: IVaMortgage[]) {
//     if (!this.chartCanvasRef) return;

//     const labels = data.map((item) => `Month ${item.MonthNumber}`);
//     const balance = data.map((item) => item.RemainingBalance);

//     const canvas = this.chartCanvasRef.nativeElement;

//     if (this.chartInstance) {
//       this.chartInstance.destroy();
//     }

//     this.chartInstance = new Chart(canvas, {
//       type: 'line',
//       data: {
//         labels,
//         datasets: [
//           {
//             label: 'Remaining Balance',
//             data: balance,
//             borderColor: 'rgb(0, 47, 255)',
//             backgroundColor: 'rgba(63, 81, 181, 0.2)',
//             fill: true,
//             tension: 0.3,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: { display: true },
//         },
//         scales: {
//           y: {
//             beginAtZero: false,
//             ticks: {
//               callback: (val) => `$${val}`,
//             },
//           },
//         },
//       },
//     });
//   }

//   onTabChange(index: number): void {
//   // Assuming "Breakdown" tab is index 0
//   if (index === 0 && this.latestData.length) {
//     setTimeout(() => {
//       if (this.chartInstance) {
//         this.chartInstance.resize();
//       } else {
//         this.renderChart(this.latestData);
//       }
//     }, 50); 
//   }
// }


//   onSubmit() {
//     if (this.form.valid) {
//       const raw = this.form.getRawValue();

//       const request: IVaMortgageRequest = {
//         HomePrice: raw.HomePrice ?? 0,
//         DownPayment: raw.DownPayment ?? 0,
//         InterestRate: raw.InterestRate ?? 0,
//         LoanTermYears: raw.LoanTermYears ?? 0,
//       };

//       this.store.dispatch(calculateVaMortgage({ request }));
//     } else {
//       this.form.markAllAsTouched();
//     }
//   }

//   onReset() {
//     this.form.reset({
//       HomePrice: 300000,
//       DownPayment: 60000,
//       InterestRate: 5,
//       LoanTermYears: 30,
//     });
//     this.store.dispatch(resetVaMortgage());
//     this.paginatedResults = [];
//     this.totalPages = 1;
//     this.currentPage = 1;
//     this.latestData = [];
//     if (this.chartInstance) {
//       this.chartInstance.destroy();
//       this.chartInstance = null;
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.chartInstance) {
//       this.chartInstance.destroy();
//     }
//     this.resultSub.unsubscribe();
//   }
// }


import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';

import {
  calculateVaMortgage,
  resetVaMortgage,
} from '../../store/calculator/va-mortgage/va-mortgage.actions';
import {
  selectVaMortgageError,
  selectVaMortgageLoading,
  selectVaMortgageResult,
} from '../../store/calculator/va-mortgage/va-mortgage.selectors';
import { IVaMortgage, IVaMortgageRequest } from '../../models/IVaMortgage';
import { MatTabsModule } from '@angular/material/tabs';
import {
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-va-mortgage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MatTabsModule,
  ],
  templateUrl: './va-mortgage.component.html',
  styleUrls: ['./va-mortgage.component.css'],
})
export class VaMortgageComponent implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    HomePrice: [300000, [Validators.required, Validators.min(0)]],
    DownPayment: [60000, [Validators.required, Validators.min(0)]],
    InterestRate: [5, [Validators.required, Validators.min(0)]],
    LoanTermYears: [10, [Validators.required, Validators.min(1)]],
  });

  result$ = this.store.select(selectVaMortgageResult);
  loading$ = this.store.select(selectVaMortgageLoading);
  error$ = this.store.select(selectVaMortgageError);

  paginatedResults: IVaMortgage[] = [];
  latestData: IVaMortgage[] = [];

  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  visiblePages: number[] = [];

  private chartInstance: Chart | null = null;
  private resultSub: Subscription;

  constructor() {
    this.resultSub = this.result$.subscribe((data: IVaMortgage[] | null) => {
      if (data && data.length) {
        this.latestData = data;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.currentPage = 1;
        this.updatePage(data);

        if (this.chartCanvasRef) {
          this.renderChart(data);
        }
      } else {
        this.paginatedResults = [];
        this.totalPages = 1;
        this.currentPage = 1;
        this.visiblePages = [];
        if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }
      }
    });
  }

  ngOnInit(): void {
    const request: IVaMortgageRequest = {
      HomePrice: this.form.value.HomePrice ?? 0,
      DownPayment: this.form.value.DownPayment ?? 0,
      InterestRate: this.form.value.InterestRate ?? 0,
      LoanTermYears: this.form.value.LoanTermYears ?? 0,
    };

    this.store.dispatch(calculateVaMortgage({ request }));
  }

  ngAfterViewInit() {
    if (this.latestData.length) {
      this.renderChart(this.latestData);
    }
  }

  updatePage(data: IVaMortgage[]) {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedResults = data.slice(start, start + this.pageSize);
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  goToPage(page: number, event: Event) {
    event.preventDefault();
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePage(this.latestData);
    }
  }

  // renderChart(data: IVaMortgage[]) {
  //   if (!this.chartCanvasRef) return;

  //   const labels = data.map((item) => `Month ${item.MonthNumber}`);
  //   const balance = data.map((item) => item.RemainingBalance);

  //   const canvas = this.chartCanvasRef.nativeElement;

  //   if (this.chartInstance) {
  //     this.chartInstance.destroy();
  //   }

  //   this.chartInstance = new Chart(canvas, {
  //     type: 'line',
  //     data: {
  //       labels,
  //       datasets: [
  //         {
  //           label: 'Remaining Balance',
  //           data: balance,
  //           borderColor: 'rgb(0, 47, 255)',
  //           backgroundColor: 'rgba(63, 81, 181, 0.2)',
  //           fill: true,
  //           tension: 0.3,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: { display: true },
  //       },
  //       scales: {
  //         y: {
  //           beginAtZero: false,
  //           ticks: {
  //             callback: (val) => `$${val}`,
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  renderChart(data: IVaMortgage[]) {
  if (!this.chartCanvasRef) return;

  const labels = data.map((item) => `Month ${item.MonthNumber}`);
  const balance = data.map((item) => item.RemainingBalance);
  const principal = data.map((item) => item.PrincipalPayment);
  const interest = data.map((item) => item.InterestPayment);

  const canvas = this.chartCanvasRef.nativeElement;

  if (this.chartInstance) {
    this.chartInstance.destroy();
  }

  this.chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Remaining Balance',
          data: balance,
          borderColor: 'rgb(0, 47, 255)',
          backgroundColor: 'rgba(0, 47, 255, 0.1)',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Principal',
          data: principal,
          borderColor: 'rgb(40, 167, 69)',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Interest',
          data: interest,
          borderColor: 'rgb(220, 53, 69)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              return `${label}: $${value.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: (val) => `$${val}`,
          },
        },
      },
    },
  });
}


  onTabChange(index: number): void {
    if (index === 1 && this.latestData.length) {
      setTimeout(() => {
        if (this.chartInstance) {
          this.chartInstance.resize();
        } else {
          this.renderChart(this.latestData);
        }
      }, 50);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();

      const request: IVaMortgageRequest = {
        HomePrice: raw.HomePrice ?? 0,
        DownPayment: raw.DownPayment ?? 0,
        InterestRate: raw.InterestRate ?? 0,
        LoanTermYears: raw.LoanTermYears ?? 0,
      };

      this.store.dispatch(calculateVaMortgage({ request }));
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.form.reset({
      HomePrice: 300000,
      DownPayment: 60000,
      InterestRate: 5,
      LoanTermYears: 30,
    });

    this.store.dispatch(resetVaMortgage());

    this.paginatedResults = [];
    this.latestData = [];
    this.totalPages = 1;
    this.currentPage = 1;
    this.visiblePages = [];

    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    this.resultSub.unsubscribe();
  }
}
