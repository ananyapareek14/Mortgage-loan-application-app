import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from './pie-chart.component';
import { SimpleChange } from '@angular/core';
import { Chart } from 'chart.js';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';

describe('Pie Chart Component', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartComponent);
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

  it('should create chart with correct data when schedule is provided', () => {
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
        MonthlyPayment: 275,
        PrincipalPayment: 200,
        InterestPayment: 75,
        RemainingBalance: 700,
      },
    ];
    component.schedule = mockSchedule;
    component.ngAfterViewInit();
    expect(component.chart).toBeDefined();
    expect(component.chart?.data.datasets[0].data).toEqual([300, 125]);
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
    component.schedule = initialSchedule;
    component.ngAfterViewInit();

    const newSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 275,
        PrincipalPayment: 200,
        InterestPayment: 75,
        RemainingBalance: 800,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 400,
        PrincipalPayment: 300,
        InterestPayment: 100,
        RemainingBalance: 500,
      },
    ];
    component.schedule = newSchedule;
    component.ngOnChanges({
      schedule: new SimpleChange(initialSchedule, newSchedule, false),
    });

    expect(component.chart?.data.datasets[0].data).toEqual([500, 175]);
  });

  it('should handle large numbers correctly', () => {
    const largeSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1500000000,
        PrincipalPayment: 1000000000,
        InterestPayment: 500000000,
        RemainingBalance: 9000000000,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 2750000000,
        PrincipalPayment: 2000000000,
        InterestPayment: 750000000,
        RemainingBalance: 7000000000,
      },
    ];
    component.schedule = largeSchedule;
    component.ngAfterViewInit();
    expect(component.chart?.data.datasets[0].data).toEqual([
      3000000000, 1250000000,
    ]);
  });

  it('should handle decimal numbers correctly', () => {
    const decimalSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 151,
        PrincipalPayment: 100.25,
        InterestPayment: 50.75,
        RemainingBalance: 899.75,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: 275.75,
        PrincipalPayment: 200.5,
        InterestPayment: 75.25,
        RemainingBalance: 699.25,
      },
    ];
    component.schedule = decimalSchedule;
    component.ngAfterViewInit();
    expect(component.chart?.data.datasets[0].data).toEqual([300.75, 126]);
  });

  it('should handle negative numbers correctly', () => {
    const negativeSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: -150,
        PrincipalPayment: -100,
        InterestPayment: -50,
        RemainingBalance: -900,
      },
      {
        PaymentNumber: 2,
        PaymentDate: new Date(),
        MonthlyPayment: -275,
        PrincipalPayment: -200,
        InterestPayment: -75,
        RemainingBalance: -700,
      },
    ];
    component.schedule = negativeSchedule;
    component.ngAfterViewInit();
    expect(component.chart?.data.datasets[0].data).toEqual([-300, -125]);
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

//   it('should destroy existing chart before creating a new one', () => {
//     const mockSchedule: IAmortizationSchedule[] = [
//       {
//         PaymentNumber: 1,
//         PaymentDate: new Date(),
//         MonthlyPayment: 150,
//         PrincipalPayment: 100,
//         InterestPayment: 50,
//         RemainingBalance: 900,
//       },
//     ];
//     component.schedule = mockSchedule;
//     component.ngAfterViewInit();

//     const destroySpy = jest.spyOn(component.chart as Chart, 'destroy');
//     component.ngOnChanges({
//       schedule: new SimpleChange(mockSchedule, [...mockSchedule], false),
//     });

//     expect(destroySpy).toHaveBeenCalled();
//   });

  it('should handle a schedule with only one payment', () => {
    const singlePaymentSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        PrincipalPayment: 950,
        InterestPayment: 50,
        RemainingBalance: 0,
      },
    ];
    component.schedule = singlePaymentSchedule;
    component.ngAfterViewInit();
    expect(component.chart?.data.datasets[0].data).toEqual([950, 50]);
  });

  it('should handle a schedule with zero payments', () => {
    const zeroPaymentSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 0,
        PrincipalPayment: 0,
        InterestPayment: 0,
        RemainingBalance: 1000,
      },
    ];
    component.schedule = zeroPaymentSchedule;
    component.ngAfterViewInit();
    expect(component.chart?.data.datasets[0].data).toEqual([0, 0]);
  });
});
