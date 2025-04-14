import * as fromActions from './amortization.actions';
import { IAmortizationSchedule, IAmortizationRequest } from '../../models/IAmortizationSchedule';

describe('Amortization Actions', () => {
  it('should create loadAmortizationSchedule action', () => {
    const userLoanNumber = 123;
    const action = fromActions.loadAmortizationSchedule({ userLoanNumber });

    expect(action.type).toBe('[Amortization] Load Amortization Schedule');
    expect(action.userLoanNumber).toBe(userLoanNumber);
  });

  it('should create loadAmortizationScheduleSuccess action', () => {
    const schedule: IAmortizationSchedule[] = [];
    const action = fromActions.loadAmortizationScheduleSuccess({ schedule });

    expect(action.type).toBe('[Amortization] Load Amortization Schedule Success');
    expect(action.schedule).toBe(schedule);
  });

  it('should create loadAmortizationScheduleFailure action', () => {
    const error = 'Failed to load schedule';
    const action = fromActions.loadAmortizationScheduleFailure({ error });

    expect(action.type).toBe('[Amortization] Load Amortization Schedule Failure');
    expect(action.error).toBe(error);
  });

  it('should create calculateAmortization action', () => {
    const request: IAmortizationRequest = { LoanAmount: 100000, InterestRate: 5, LoanTermYears: 30 };
    const action = fromActions.calculateAmortization({ request });

    expect(action.type).toBe('[Amortization] Calculate Amortization');
    expect(action.request).toBe(request);
  });

  it('should create calculateAmortizationSuccess action', () => {
    const schedule: IAmortizationSchedule[] = [];
    const action = fromActions.calculateAmortizationSuccess({ schedule });

    expect(action.type).toBe('[Amortization] Calculate Amortization Success');
    expect(action.schedule).toBe(schedule);
  });

  it('should create calculateAmortizationFailure action', () => {
    const error = 'Calculation failed';
    const action = fromActions.calculateAmortizationFailure({ error });

    expect(action.type).toBe('[Amortization] Calculate Amortization Failure');
    expect(action.error).toBe(error);
  });
});
