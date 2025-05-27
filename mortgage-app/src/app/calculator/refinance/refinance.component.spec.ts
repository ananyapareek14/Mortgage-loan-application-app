import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { RefinanceComponent } from './refinance.component';
import {
  calculateRefinance,
  resetRefinance,
} from '../../store/calculator/refinance/refinance.actions';
import { Chart } from 'chart.js';
import { IRefinance, IRefinanceRequest } from '../../models/IRefinance';

describe('RefinanceComponent', () => {
  let component: RefinanceComponent;
  let fixture: ComponentFixture<RefinanceComponent>;
  let storeMock: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'pipe']);
    storeMock.pipe.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [RefinanceComponent, ReactiveFormsModule],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RefinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.barChart) {
      component.barChart.destroy();
    }
    if (component.lineChart) {
      component.lineChart.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.form.get('currentLoanAmount')?.value).toBe(200000);
      expect(component.form.get('interestRate')?.value).toBe(6.5);
      expect(component.form.get('currentTermMonths')?.value).toBe(360);
      expect(component.form.get('originationYear')?.value).toBe(2019);
      expect(component.form.get('newLoanAmount')?.value).toBe(195000);
      expect(component.form.get('newInterestRate')?.value).toBe(5);
      expect(component.form.get('newTermMonths')?.value).toBe(360);
      expect(component.form.get('refinanceFees')?.value).toBe(1000);
    });
  });

  describe('Form Validation', () => {
    it('should mark form as invalid when required fields are empty', () => {
      component.form.patchValue({
        currentLoanAmount: null,
        interestRate: null,
        currentTermMonths: null,
        originationYear: null,
        newLoanAmount: null,
        newInterestRate: null,
        newTermMonths: null,
        refinanceFees: null,
      });
      expect(component.form.valid).toBeFalsy();
    });

    it('should mark form as invalid when values are below minimum', () => {
      component.form.patchValue({
        currentLoanAmount: -1,
        interestRate: -1,
        currentTermMonths: 0,
        originationYear: 1899,
        newLoanAmount: -1,
        newInterestRate: -1,
        newTermMonths: 0,
        refinanceFees: -1,
      });
      expect(component.form.valid).toBeFalsy();
    });

    it('should mark form as valid when all fields are filled correctly', () => {
      component.form.patchValue({
        currentLoanAmount: 200000,
        interestRate: 5,
        currentTermMonths: 360,
        originationYear: 2020,
        newLoanAmount: 195000,
        newInterestRate: 4.5,
        newTermMonths: 300,
        refinanceFees: 2000,
      });
      expect(component.form.valid).toBeTruthy();
    });

    // Edge case: Maximum values
    it('should mark form as valid with maximum allowed values', () => {
      component.form.patchValue({
        currentLoanAmount: 10000000,
        interestRate: 20,
        currentTermMonths: 600,
        originationYear: 2023,
        newLoanAmount: 10000000,
        newInterestRate: 20,
        newTermMonths: 600,
        refinanceFees: 100000,
      });
      expect(component.form.valid).toBeTruthy();
    });

    // Edge case: Decimal values
    it('should handle decimal values correctly', () => {
      component.form.patchValue({
        currentLoanAmount: 200000.5,
        interestRate: 5.75,
        currentTermMonths: 360,
        originationYear: 2020,
        newLoanAmount: 195000.25,
        newInterestRate: 4.25,
        newTermMonths: 300,
        refinanceFees: 2000.75,
      });
      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('onSubmit', () => {
    it('should dispatch calculateRefinance action when form is valid', () => {
      // const testRequest: IRefinanceRequest = {
      //   CurrentLoanAmount: 200000,
      //   InterestRate: 5,
      //   CurrentTermMonths: 360,
      //   OriginationYear: 2020,
      //   NewLoanAmount: 195000,
      //   NewInterestRate: 4.5,
      //   NewTermMonths: 300,
      //   RefinanceFees: 2000,
      // };
      // component.form.patchValue(testRequest);

      function mapRequestToFormValue(request: IRefinanceRequest) {
        return {
          currentLoanAmount: request.CurrentLoanAmount,
          interestRate: request.InterestRate,
          currentTermMonths: request.CurrentTermMonths,
          originationYear: request.OriginationYear,
          newLoanAmount: request.NewLoanAmount,
          newInterestRate: request.NewInterestRate,
          newTermMonths: request.NewTermMonths,
          refinanceFees: request.RefinanceFees,
        };
      }

      const testRequest: IRefinanceRequest = {
        CurrentLoanAmount: 200000,
        InterestRate: 5,
        CurrentTermMonths: 360,
        OriginationYear: 2020,
        NewLoanAmount: 195000,
        NewInterestRate: 4.5,
        NewTermMonths: 300,
        RefinanceFees: 2000,
      };

      component.form.patchValue(mapRequestToFormValue(testRequest));
      
      component.onSubmit();
      expect(storeMock.dispatch).toHaveBeenCalledWith(
        calculateRefinance({ request: testRequest })
      );
    });

    it('should not dispatch action when form is invalid', () => {
      component.form.patchValue({
        currentLoanAmount: -1,
        interestRate: -1,
        currentTermMonths: 0,
        originationYear: 1899,
        newLoanAmount: -1,
        newInterestRate: -1,
        newTermMonths: 0,
        refinanceFees: -1,
      });
      component.onSubmit();
      expect(storeMock.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    it('should reset form and dispatch resetRefinance action', () => {
      spyOn(component.form, 'reset');
      component.onReset();
      expect(component.form.reset).toHaveBeenCalledWith({
        currentLoanAmount: 0,
        interestRate: 0,
        currentTermMonths: 360,
        originationYear: 2020,
        newLoanAmount: 0,
        newInterestRate: 0,
        newTermMonths: 360,
        refinanceFees: 0,
      });
      expect(storeMock.dispatch).toHaveBeenCalledWith(resetRefinance());
    });

//   it('should destroy charts if they exist', () => {
//   const mockCanvas = document.createElement('canvas');
//   const ctx = mockCanvas.getContext('2d')!;

//   component.barChart = new Chart(ctx, {
//     type: 'bar',
//     data: { labels: [], datasets: [] },
//   });
//   component.lineChart = new Chart(ctx, {
//     type: 'line',
//     data: { labels: [], datasets: [] },
//   });

//   spyOn(component.barChart, 'destroy');
//   spyOn(component.lineChart, 'destroy');

//   component.onReset();

//   expect(component.barChart.destroy).toHaveBeenCalled();
//   expect(component.lineChart.destroy).toHaveBeenCalled();
// });
});


  describe('renderBarChart', () => {
//     it('should create a bar chart with correct data', () => {
//   const mockResult: IRefinance = {
//     MonthlySavings: 1000,  // match label 'Monthly Savings'
//     NewPayment: 900,
//     BreakEvenMonths: 24,
//     LifetimeSavings: 50000,
//   };
//   component.barChartCanvas = {
//     nativeElement: document.createElement('canvas'),
//   } as any;
//   component.renderBarChart(mockResult);
//   expect(component.barChart).toBeTruthy();
//   expect(component.barChart?.data.datasets[0].data).toEqual([1000, 900]);
// });



    it('should not create chart if canvas is not available', () => {
      component.barChartCanvas = undefined as any;
      component.renderBarChart({} as IRefinance);
      expect(component.barChart).toBeUndefined();
    });
  });

  describe('renderLineChart', () => {
    it('should create a line chart with correct data', () => {
      const mockResult: IRefinance = {
        MonthlySavings: 100,
        NewPayment: 900,
        BreakEvenMonths: 24,
        LifetimeSavings: 50000,
      };
      component.lineChartCanvas = {
        nativeElement: document.createElement('canvas'),
      } as any;
      component.renderLineChart(mockResult);
      expect(component.lineChart).toBeTruthy();
      expect(component.lineChart?.data.datasets[0].data.length).toBe(30);
    });

    it('should not create chart if canvas is not available', () => {
      component.lineChartCanvas = undefined as any;
      component.renderLineChart({} as IRefinance);
      expect(component.lineChart).toBeUndefined();
    });
  });

//   describe('ngOnDestroy', () => {
//     it('should destroy charts if they exist on ngOnDestroy', () => {
//   const mockCanvas = document.createElement('canvas');
//   const ctx = mockCanvas.getContext('2d')!;

//   component.barChart = new Chart(ctx, {
//     type: 'bar',
//     data: { labels: [], datasets: [] },
//   });
//   component.lineChart = new Chart(ctx, {
//     type: 'line',
//     data: { labels: [], datasets: [] },
//   });

//   spyOn(component.barChart, 'destroy');
//   spyOn(component.lineChart, 'destroy');

//   component.ngOnDestroy();

//   expect(component.barChart.destroy).toHaveBeenCalled();
//   expect(component.lineChart.destroy).toHaveBeenCalled();
// });

//   });
});
