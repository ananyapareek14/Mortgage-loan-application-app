// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { LoanDetailsComponent } from './loan-details.component';
// import { Store } from '@ngrx/store';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import { ILoan } from '../models/ILoan';
// import { IAmortizationSchedule } from '../models/IAmortizationSchedule';
// import { loadLoanById } from '../store/loan/loan.actions';
// import { loadAmortizationSchedule } from '../store/amortization/amortization.actions';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// describe('LoanDetailsComponent', () => {
//   let component: LoanDetailsComponent;
//   let fixture: ComponentFixture<LoanDetailsComponent>;
//   let storeMock: jasmine.SpyObj<Store>;
//   let routeMock: Partial<ActivatedRoute>;

//   beforeEach(() => {
//     storeMock = jasmine.createSpyObj('Store', ['dispatch', 'select']);
//     routeMock = {
//       snapshot: {
//         paramMap: {
//           get: jasmine.createSpy('get'),
//         },
//       },
//     };

//     TestBed.configureTestingModule({
//       imports: [LoanDetailsComponent,NoopAnimationsModule],
//       providers: [
//         { provide: Store, useValue: storeMock },
//         { provide: ActivatedRoute, useValue: routeMock },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoanDetailsComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize observables in constructor', () => {
//     storeMock.select.and.returnValue(of(null));
//     fixture.detectChanges();
//     expect(component.loan$).toBeDefined();
//     expect(component.amortizationSchedule$).toBeDefined();
//   });

//   it('should dispatch actions and calculate summary on ngOnInit with valid loan number', () => {
//     const userLoanNumber = 123;
//     routeMock.snapshot.paramMap.get.and.returnValue(userLoanNumber.toString());
//     const mockSchedule: IAmortizationSchedule[] = [
//       {
//         PaymentNumber: 1,
//         PaymentDate: new Date(),
//         MonthlyPayment: 500,
//         PrincipalPayment: 400,
//         InterestPayment: 100,
//         RemainingBalance: 9600,
//       },
//       {
//         PaymentNumber: 2,
//         PaymentDate: new Date(),
//         MonthlyPayment: 500,
//         PrincipalPayment: 410,
//         InterestPayment: 90,
//         RemainingBalance: 9190,
//       },
//     ];
//     storeMock.select.and.returnValue(of(mockSchedule));

//     component.ngOnInit();

//     expect(storeMock.dispatch).toHaveBeenCalledWith(
//       loadLoanById({ userLoanNumber })
//     );
//     expect(storeMock.dispatch).toHaveBeenCalledWith(
//       loadAmortizationSchedule({ userLoanNumber })
//     );
//     expect(component.totalInterest).toBe(190);
//     expect(component.totalPayment).toBe(1000);
//     expect(component.monthlyPayment).toBe(500);
//   });

//   it('should not dispatch actions on ngOnInit with invalid loan number', () => {
//     routeMock.snapshot.paramMap.get.and.returnValue(null);

//     component.ngOnInit();

//     expect(storeMock.dispatch).not.toHaveBeenCalled();
//   });

//   it('should handle empty amortization schedule', () => {
//     routeMock.snapshot.paramMap.get.and.returnValue('123');
//     storeMock.select.and.returnValue(of([]));

//     component.ngOnInit();

//     expect(component.totalInterest).toBe(0);
//     expect(component.totalPayment).toBe(0);
//     expect(component.monthlyPayment).toBe(0);
//   });

//   it('should set active tab', () => {
//     component.setActiveTab('pie-chart');
//     expect(component.activeTab).toBe('pie-chart');
//   });

//   it('should handle null amortization schedule', () => {
//     routeMock.snapshot.paramMap.get.and.returnValue('123');
//     storeMock.select.and.returnValue(of(null));

//     component.ngOnInit();

//     expect(component.totalInterest).toBe(0);
//     expect(component.totalPayment).toBe(0);
//     expect(component.monthlyPayment).toBe(0);
//   });

//   it('should handle extremely large numbers in amortization schedule', () => {
//     routeMock.snapshot.paramMap.get.and.returnValue('123');
//     const largeSchedule: IAmortizationSchedule[] = [
//       {
//         PaymentNumber: 1,
//         PaymentDate: new Date(),
//         MonthlyPayment: Number.MAX_SAFE_INTEGER,
//         PrincipalPayment: Number.MAX_SAFE_INTEGER - 1000,
//         InterestPayment: 1000,
//         RemainingBalance: Number.MAX_SAFE_INTEGER,
//       },
//       {
//         PaymentNumber: 2,
//         PaymentDate: new Date(),
//         MonthlyPayment: Number.MAX_SAFE_INTEGER,
//         PrincipalPayment: Number.MAX_SAFE_INTEGER - 1000,
//         InterestPayment: 1000,
//         RemainingBalance: Number.MAX_SAFE_INTEGER,
//       },
//     ];
//     storeMock.select.and.returnValue(of(largeSchedule));

//     component.ngOnInit();

//     expect(component.totalInterest).toBe(2000);
//     expect(component.totalPayment).toBe(Number.MAX_SAFE_INTEGER * 2);
//     expect(component.monthlyPayment).toBe(Number.MAX_SAFE_INTEGER);
//   });

//   it('should handle fractional numbers in amortization schedule', () => {
//     routeMock.snapshot.paramMap.get.and.returnValue('123');
//     const fractionalSchedule: IAmortizationSchedule[] = [
//       {
//         PaymentNumber: 1,
//         PaymentDate: new Date(),
//         MonthlyPayment: 500.5,
//         PrincipalPayment: 400.25,
//         InterestPayment: 100.25,
//         RemainingBalance: 9599.5,
//       },
//       {
//         PaymentNumber: 2,
//         PaymentDate: new Date(),
//         MonthlyPayment: 500.5,
//         PrincipalPayment: 410.35,
//         InterestPayment: 90.15,
//         RemainingBalance: 9189.15,
//       },
//     ];
//     storeMock.select.and.returnValue(of(fractionalSchedule));

//     component.ngOnInit();

//     expect(component.totalInterest).toBeCloseTo(190.4, 2);
//     expect(component.totalPayment).toBe(1001);
//     expect(component.monthlyPayment).toBe(500.5);
//   });

//   it('should handle amortization schedule with varying payment amounts', () => {
//     routeMock.snapshot.paramMap.get.and.returnValue('123');
//     const varyingSchedule: IAmortizationSchedule[] = [
//       {
//         PaymentNumber: 1,
//         PaymentDate: new Date(),
//         MonthlyPayment: 500,
//         PrincipalPayment: 400,
//         InterestPayment: 100,
//         RemainingBalance: 9600,
//       },
//       {
//         PaymentNumber: 2,
//         PaymentDate: new Date(),
//         MonthlyPayment: 600,
//         PrincipalPayment: 510,
//         InterestPayment: 90,
//         RemainingBalance: 9090,
//       },
//     ];
//     storeMock.select.and.returnValue(of(varyingSchedule));

//     component.ngOnInit();

//     expect(component.totalInterest).toBe(190);
//     expect(component.totalPayment).toBe(1100);
//     expect(component.monthlyPayment).toBe(550);
//   });
// });
