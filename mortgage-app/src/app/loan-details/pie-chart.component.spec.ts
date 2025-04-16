import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from './pie-chart.component';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Chart, ChartConfiguration } from 'chart.js';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
  let canvasEl: DebugElement;

  const mockSchedule: IAmortizationSchedule[] = [
    {
      PaymentNumber: 1,
      PaymentDate: new Date(),
      MonthlyPayment: 1000,
      PrincipalPayment: 700,
      InterestPayment: 300,
      RemainingBalance: 93000,
    },
    {
      PaymentNumber: 2,
      PaymentDate: new Date(),
      MonthlyPayment: 1000,
      PrincipalPayment: 710,
      InterestPayment: 290,
      RemainingBalance: 92290,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    canvasEl = fixture.debugElement.query(By.css('canvas'));
  });

  afterEach(() => {
    if (component['chart']) {
      component['chart'].destroy();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pie chart in ngAfterViewInit when schedule is set', () => {
    component.schedule = mockSchedule;

    fixture.detectChanges();
    component.ngAfterViewInit();

    const chart = component['chart'] as Chart;
    expect(chart).toBeDefined();
      expect((chart?.config as ChartConfiguration).type).toBe('pie');
    expect(chart?.data.labels).toEqual(['Principal', 'Interest']);
    expect(chart?.data.datasets[0].data).toEqual([
      700 + 710, // Principal sum
      300 + 290, // Interest sum
    ]);
  });

  it('should not create chart if schedule is empty', () => {
    component.schedule = [];
    fixture.detectChanges();
    component.ngAfterViewInit();

    expect(component['chart']).toBeUndefined();
  });

  it('should recreate chart on schedule input change after view init', () => {
    component.schedule = mockSchedule;
    fixture.detectChanges();
    component.ngAfterViewInit();
    const originalChart = component['chart'];

    const newSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 900,
        PrincipalPayment: 600,
        InterestPayment: 300,
        RemainingBalance: 94000,
      },
    ];
    component.schedule = newSchedule;

    component.ngOnChanges({
      schedule: {
        currentValue: newSchedule,
        previousValue: mockSchedule,
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(component['chart']).toBeDefined();
    expect(component['chart']).not.toBe(originalChart);
    expect(component['chart']?.data.datasets[0].data).toEqual([600, 300]);
  });
});
