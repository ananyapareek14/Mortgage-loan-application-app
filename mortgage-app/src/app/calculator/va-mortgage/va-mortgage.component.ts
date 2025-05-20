// import {
//   Component,
//   ElementRef,
//   OnDestroy,
//   ViewChild,
//   inject,
// } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { Store } from '@ngrx/store';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatButtonModule } from '@angular/material/button';
// import { Chart } from 'chart.js';
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


// @Component({
//   selector: 'app-va-mortgage',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatSliderModule,
//     MatButtonModule,
//     CurrencyPipe,
//   ],
//   templateUrl: './va-mortgage.component.html',
//   styleUrl: './va-mortgage.component.css',
// })
// export class VaMortgageComponent implements OnDestroy {
//   private store = inject(Store);
//   private fb = inject(FormBuilder);

//   form = this.fb.group({
//     HomePrice: [300000, [Validators.required, Validators.min(0)]],
//     DownPayment: [60000, [Validators.required, Validators.min(0)]],
//     InterestRate: [5, [Validators.required, Validators.min(0)]],
//     LoanTermYears: [30, [Validators.required, Validators.min(1)]],
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

//   @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;

//   constructor() {
//     this.resultSub = this.result$.subscribe((data: IVaMortgage[] | null) => {
//       if (data && data.length) {
//         this.latestData = data;
//         this.totalPages = Math.ceil(data.length / this.pageSize);
//         this.currentPage = 1;
//         this.updatePage(data);
//         this.renderChart(data);
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
//             borderColor: 'rgba(63, 81, 181, 1)',
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

//   // onSubmit() {
//   //   if (this.form.valid) {
//   //     const request = this.form.getRawValue();
//   //     this.store.dispatch(calculateVaMortgage({ request }));
//   //   } else {
//   //     this.form.markAllAsTouched();
//   //   }
//   // }

//   onSubmit() {
//     if (this.form.valid) {
//       const raw = this.form.getRawValue();

//       // Assert non-null using `!` or fallback values:
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

// import { Chart, registerables } from 'chart.js';

// // Register Chart.js components globally once
// Chart.register(...registerables);

// import {
//   Component,
//   ElementRef,
//   OnDestroy,
//   ViewChild,
//   inject,
// } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { Store } from '@ngrx/store';
// import { MatSliderModule } from '@angular/material/slider';
// import { MatButtonModule } from '@angular/material/button';
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

// @Component({
//   selector: 'app-va-mortgage',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatSliderModule,
//     MatButtonModule,
//     CurrencyPipe,
//   ],
//   templateUrl: './va-mortgage.component.html',
//   styleUrl: './va-mortgage.component.css',
// })
// export class VaMortgageComponent implements OnDestroy {
//   private store = inject(Store);
//   private fb = inject(FormBuilder);

//   form = this.fb.group({
//     HomePrice: [300000, [Validators.required, Validators.min(0)]],
//     DownPayment: [60000, [Validators.required, Validators.min(0)]],
//     InterestRate: [5, [Validators.required, Validators.min(0)]],
//     LoanTermYears: [30, [Validators.required, Validators.min(1)]],
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

//   @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;

//   constructor() {
//     this.resultSub = this.result$.subscribe((data: IVaMortgage[] | null) => {
//       if (data && data.length) {
//         this.latestData = data;
//         this.totalPages = Math.ceil(data.length / this.pageSize);
//         this.currentPage = 1;
//         this.updatePage(data);
//         this.renderChart(data);
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
//             borderColor: 'rgba(63, 81, 181, 1)',
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
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { Chart} from 'chart.js';
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
    MatSliderModule,
    MatButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './va-mortgage.component.html',
  styleUrls: ['./va-mortgage.component.css'],
})
export class VaMortgageComponent implements OnDestroy, AfterViewInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    HomePrice: [300000, [Validators.required, Validators.min(0)]],
    DownPayment: [60000, [Validators.required, Validators.min(0)]],
    InterestRate: [5, [Validators.required, Validators.min(0)]],
    LoanTermYears: [30, [Validators.required, Validators.min(1)]],
  });

  result$ = this.store.select(selectVaMortgageResult);
  loading$ = this.store.select(selectVaMortgageLoading);
  error$ = this.store.select(selectVaMortgageError);

  paginatedResults: IVaMortgage[] = [];
  pageSize = 12;
  currentPage = 1;
  totalPages = 1;

  private chartInstance: Chart | null = null;
  private resultSub: Subscription;
  private latestData: IVaMortgage[] = [];

  @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    this.resultSub = this.result$.subscribe((data: IVaMortgage[] | null) => {
      if (data && data.length) {
        this.latestData = data;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.currentPage = 1;
        this.updatePage(data);

        // Only render if the canvas element is ready
        if (this.chartCanvasRef) {
          this.renderChart(data);
        }
      } else {
        this.paginatedResults = [];
        this.totalPages = 1;
        this.currentPage = 1;
        if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }
      }
    });
  }

  ngAfterViewInit() {
    // If data is already loaded before view init, render the chart now
    if (this.latestData.length) {
      this.renderChart(this.latestData);
    }
  }

  updatePage(data: IVaMortgage[]) {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedResults = data.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage(this.latestData);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage(this.latestData);
    }
  }

  renderChart(data: IVaMortgage[]) {
    if (!this.chartCanvasRef) return;

    const labels = data.map((item) => `Month ${item.MonthNumber}`);
    const balance = data.map((item) => item.RemainingBalance);

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
            borderColor: 'rgba(63, 81, 181, 1)',
            backgroundColor: 'rgba(63, 81, 181, 0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
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
    this.totalPages = 1;
    this.currentPage = 1;
    this.latestData = [];
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
