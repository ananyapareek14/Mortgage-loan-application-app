import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { LineChartComponent } from './line-chart.component';
import { Chart } from 'chart.js';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

describe('Line Chart Component', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartComponent);
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
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 99000,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        PrincipalPayment: 810,
        InterestPayment: 190,
        RemainingBalance: 98190,
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
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 99000,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        PrincipalPayment: 810,
        InterestPayment: 190,
        RemainingBalance: 98190,
      },
    ];
    component.schedule = initialSchedule;
    component.ngAfterViewInit();

    const updatedSchedule: IAmortizationSchedule[] = [
      ...initialSchedule,
      {
        PaymentNumber: 3,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        PrincipalPayment: 820,
        InterestPayment: 180,
        RemainingBalance: 97370,
      },
    ];
    component.schedule = updatedSchedule;
    component.ngOnChanges({
      schedule: new SimpleChange(initialSchedule, updatedSchedule, false),
    });

    expect(component.chart?.data.labels?.length).toBe(3);
    expect(component.chart?.data.datasets[0].data.length).toBe(3);
  });

  it('should handle large datasets', () => {
    const largeSchedule: IAmortizationSchedule[] = Array.from(
      { length: 1000 },
      (_, i) => ({
        PaymentNumber: i + 1,
        PaymentDate: new Date(2023, 0, i + 1),
        MonthlyPayment: 1000,
        PrincipalPayment: 800 + i,
        InterestPayment: 200 - i,
        RemainingBalance: 100000 - i * 1000,
      })
    );
    component.schedule = largeSchedule;
    component.ngAfterViewInit();
    expect(component.chart?.data.labels?.length).toBe(1000);
    expect(component.chart?.data.datasets[0].data.length).toBe(1000);
  });

  it('should handle schedule with zero remaining balance', () => {
    const zeroBalanceSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 200,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 200,
        PrincipalPayment: 198,
        InterestPayment: 2,
        RemainingBalance: 0,
      },
    ];
    component.schedule = zeroBalanceSchedule;
    component.ngAfterViewInit();
    expect(component.chart).toBeDefined();
    expect(component.chart?.data.datasets[0].data[1]).toBe(0);
  });

  it('should not throw error when chartRef is undefined', () => {
    component.chartRef = undefined as any;
    expect(() => component.ngAfterViewInit()).not.toThrow();
  });

//   it('should destroy existing chart before creating a new one', () => {
//     const mockSchedule: IAmortizationSchedule[] = [
//       {
//         PaymentNumber: 1,
//         PaymentDate: new Date(),
//         MonthlyPayment: 1000,
//         PrincipalPayment: 800,
//         InterestPayment: 200,
//         RemainingBalance: 99000,
//       },
//       {
//         PaymentNumber: 2,
//         PaymentDate: new Date(),
//         MonthlyPayment: 1000,
//         PrincipalPayment: 810,
//         InterestPayment: 190,
//         RemainingBalance: 98190,
//       },
//     ];
//     component.schedule = mockSchedule;
//     component.ngAfterViewInit();
//     const initialChart = component.chart;
//     const destroySpy = jest.spyOn(initialChart as Chart, 'destroy');

//     component.ngOnChanges({
//       schedule: new SimpleChange(null, mockSchedule, false),
//     });

//     expect(destroySpy).toHaveBeenCalled();
//     expect(component.chart).not.toBe(initialChart);
//   });

  it('should handle schedule with different payment dates', () => {
    const variableDateSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(2023, 0, 1),
        MonthlyPayment: 1000,
        PrincipalPayment: 800,
        InterestPayment: 200,
        RemainingBalance: 99000,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(2023, 1, 1),
        MonthlyPayment: 1000,
        PrincipalPayment: 810,
        InterestPayment: 190,
        RemainingBalance: 98190,
      },
      {
        PaymentNumber: 3,
        PaymentDate: new Date(2023, 2, 1),
        MonthlyPayment: 1000,
        PrincipalPayment: 820,
        InterestPayment: 180,
        RemainingBalance: 97370,
      },
    ];
    component.schedule = variableDateSchedule;
    component.ngAfterViewInit();
    expect(component.chart).toBeDefined();
    expect(component.chart?.data.labels?.length).toBe(3);
  });
});
