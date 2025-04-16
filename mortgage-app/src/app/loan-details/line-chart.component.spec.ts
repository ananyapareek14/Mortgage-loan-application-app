import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartComponent } from './line-chart.component';
import { IAmortizationSchedule } from '../models/IAmortizationSchedule';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Chart, ChartConfiguration } from 'chart.js';

describe('Line-Chart Component', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;
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
      imports: [LineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
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

  it('should initialize chart in ngAfterViewInit when schedule is set', () => {
      component.schedule = mockSchedule;
      fixture.detectChanges();
      component.ngAfterViewInit();
      
      const chart = component['chart'] as Chart;
    expect(component['chart']).toBeDefined();
    expect((chart?.config as ChartConfiguration).type).toBe('line');
      expect(component['chart']?.data.labels).toEqual([1, 2]);
  });

  it('should not create chart if schedule is null or empty', () => {
    component.schedule = [];
    fixture.detectChanges();
    component.ngAfterViewInit();

    expect(component['chart']).toBeUndefined();
  });

  it('should recreate chart on schedule input change after view init', () => {
    component.schedule = mockSchedule;
    fixture.detectChanges();
    component.ngAfterViewInit();

    const chartInstance = component['chart'];

    // Trigger ngOnChanges with new data
    const newSchedule: IAmortizationSchedule[] = [
      {
        PaymentNumber: 1,
        PaymentDate: new Date(),
        MonthlyPayment: 1000,
        PrincipalPayment: 600,
        InterestPayment: 400,
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
    expect(component['chart']).not.toBe(chartInstance);
    expect(component['chart']?.data.labels).toEqual([1]);
  });
});
