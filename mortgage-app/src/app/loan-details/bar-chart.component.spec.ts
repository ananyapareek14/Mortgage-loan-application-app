import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { BarChartComponent } from './bar-chart.component';
import { Chart } from 'chart.js';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

describe('Bar Chart Component', () => {
  let component: BarChartComponent;
    let fixture: ComponentFixture<BarChartComponent>;
    let chart: Chart | undefined;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BarChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.chart) {
      component.chart.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create chart when schedule is null', () => {
    component.schedule = null;
    component.ngAfterViewInit();
    expect(component.chart).toBeUndefined();
  });

  it('should not create chart when schedule is empty', () => {
    component.schedule = [];
    component.ngAfterViewInit();
    expect(component.chart).toBeUndefined();
  });

  it('should create chart with valid schedule data', () => {
    const mockSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 150,
        PrincipalPayment: 100,
        InterestPayment: 50,
        RemainingBalance: 900,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 150,
        PrincipalPayment: 110,
        InterestPayment: 40,
        RemainingBalance: 790,
      },
    ];
    component.schedule = mockSchedule;
    component.ngAfterViewInit();
    expect(component.chart).toBeDefined();
  });

  it('should update chart when schedule changes', () => {
    const initialSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 150,
        PrincipalPayment: 100,
        InterestPayment: 50,
        RemainingBalance: 900,
      },
    ];

    const updatedSchedule: IAmortizationSchedule[] = [
      ...initialSchedule,
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 150,
        PrincipalPayment: 110,
        InterestPayment: 40,
        RemainingBalance: 790,
      },
    ];

    // Initialize with initial schedule
    component.schedule = initialSchedule;
    fixture.detectChanges();
    component.ngAfterViewInit();

    // Simulate input change
    component.schedule = updatedSchedule;
    component.ngOnChanges({
      schedule: new SimpleChange(initialSchedule, updatedSchedule, false),
    });

    // Let Chart.js update
    fixture.detectChanges();

    expect(component.chart?.data.labels?.length).toBe(2);
  });


  it('should handle large datasets', () => {
    const largeSchedule: IAmortizationSchedule[] = Array.from(
      { length: 1000 },
      (_, i) => ({
        PaymentNumber: i + 1,
        PaymentDate: new Date(),
        MonthlyPayment: Math.random() * 1500,
        PrincipalPayment: Math.random() * 1000,
        InterestPayment: Math.random() * 500,
        RemainingBalance: Math.random() * 100000,
      })
    );
    component.schedule = largeSchedule;
    component.ngAfterViewInit();
    expect(component.chart?.data.labels?.length).toBe(1000);
  });

  it('should handle schedule with zero values', () => {
    const zeroValueSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 0,
        PrincipalPayment: 0,
        InterestPayment: 0,
        RemainingBalance: 1000,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 0,
        PrincipalPayment: 0,
        InterestPayment: 0,
        RemainingBalance: 1000,
      },
    ];
    component.schedule = zeroValueSchedule;
    component.ngAfterViewInit();
    expect(component.chart).toBeDefined();
  });

  it('should handle schedule with negative values', () => {
    const negativeValueSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: -150,
        PrincipalPayment: -100,
        InterestPayment: -50,
        RemainingBalance: 1100,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: -150,
        PrincipalPayment: -110,
        InterestPayment: -40,
        RemainingBalance: 1210,
      },
    ];
    component.schedule = negativeValueSchedule;
    component.ngAfterViewInit();
    expect(component.chart).toBeDefined();
  });

  it('should destroy existing chart before creating a new one', () => {
    const initialSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 150,
        PrincipalPayment: 100,
        InterestPayment: 50,
        RemainingBalance: 900,
      },
    ];

    // Initialize with initial schedule
    component.schedule = initialSchedule;
    fixture.detectChanges();
    component.ngAfterViewInit();

    // Spy before triggering change
    const destroySpy = spyOn(component.chart!, 'destroy').and.callThrough();

    const updatedSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 300,
        PrincipalPayment: 200,
        InterestPayment: 100,
        RemainingBalance: 800,
      },
    ];

    // Update input
    component.schedule = updatedSchedule;
    component.ngOnChanges({
      schedule: new SimpleChange(initialSchedule, updatedSchedule, false),
    });

    expect(destroySpy).toHaveBeenCalled();
  });


  it('should not create chart when chartRef is undefined', () => {
    component.chartRef = undefined as any;
    component.schedule = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 150,
        PrincipalPayment: 100,
        InterestPayment: 50,
        RemainingBalance: 900,
      },
    ];
    component.ngAfterViewInit();
    expect(component.chart).toBeUndefined();
  });

  it('should handle schedule with very large numbers', () => {
    const largeNumberSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1e10,
        PrincipalPayment: 9e9,
        InterestPayment: 1e9,
        RemainingBalance: 1e12,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 1e10,
        PrincipalPayment: 9.5e9,
        InterestPayment: 5e8,
        RemainingBalance: 9.905e11,
      },
    ];
    component.schedule = largeNumberSchedule;
    component.ngAfterViewInit();
    expect(component.chart).toBeDefined();
  });

  it('should handle schedule with different payment dates', () => {
    const differentDatesSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date('2023-01-01'),
        MonthlyPayment: 150,
        PrincipalPayment: 100,
        InterestPayment: 50,
        RemainingBalance: 900,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date('2023-02-01'),
        MonthlyPayment: 150,
        PrincipalPayment: 110,
        InterestPayment: 40,
        RemainingBalance: 790,
      },
    ];
    component.schedule = differentDatesSchedule;
    component.ngAfterViewInit();
    expect(component.chart).toBeDefined();
  });
});
