import { ILoan } from '../../models/ILoan';
import * as LoanActions from './loan.actions';

describe('Loan Actions', () => {
  
  it('should create the loadLoans action', () => {
    const action = LoanActions.loadLoans();
    expect(action.type).toBe('[Loan] Load Loans');
  });

  it('should create the loadLoansSuccess action', () => {
    const loans: ILoan[] = [
      { UserLoanNumber: 123, LoanAmount: 1000, InterestRate: 5, LoanTermYears: 15, ApplicationDate: '2021-01-01', ApprovalStatus: 'Approved' },
    ];
    const action = LoanActions.loadLoansSuccess({ loans });
    expect(action.type).toBe('[Loan] Load Loans Success');
    expect(action.loans).toEqual(loans);
  });

  it('should create the loadLoansFailure action', () => {
    const error = 'Error loading loans';
    const action = LoanActions.loadLoansFailure({ error });
    expect(action.type).toBe('[Loan] Load Loans Failure');
    expect(action.error).toBe(error);
  });

  it('should create the addLoan action', () => {
    const loan: ILoan = {
      UserLoanNumber: 123, LoanAmount: 1000, InterestRate: 5, LoanTermYears: 15, ApplicationDate: '2021-01-01', ApprovalStatus: 'Approved',
    };
    const action = LoanActions.addLoan({ loan });
    expect(action.type).toBe('[Loan] Add Loan');
    expect(action.loan).toEqual(loan);
  });

  it('should create the addLoanSuccess action', () => {
    const loan: ILoan = {
      UserLoanNumber: 123, LoanAmount: 1000, InterestRate: 5, LoanTermYears: 15, ApplicationDate: '2021-01-01', ApprovalStatus: 'Approved',
    };
    const action = LoanActions.addLoanSuccess({ loan });
    expect(action.type).toBe('[Loan] Add Loan Success');
    expect(action.loan).toEqual(loan);
  });

  it('should create the addLoanFailure action', () => {
    const error = 'Error adding loan';
    const action = LoanActions.addLoanFailure({ error });
    expect(action.type).toBe('[Loan] Add Loan Failure');
    expect(action.error).toBe(error);
  });

  it('should create the loadLoanById action', () => {
    const userLoanNumber = 123;
    const action = LoanActions.loadLoanById({ userLoanNumber });
    expect(action.type).toBe('[Loan] Load Loan By ID');
    expect(action.userLoanNumber).toBe(userLoanNumber);
  });

  it('should create the loadLoanByIdSuccess action', () => {
    const loan: ILoan = {
      UserLoanNumber: 123, LoanAmount: 1000, InterestRate: 5, LoanTermYears: 15, ApplicationDate: '2021-01-01', ApprovalStatus: 'Approved',
    };
    const action = LoanActions.loadLoanByIdSuccess({ loan });
    expect(action.type).toBe('[Loan] Load Loan By ID Success');
    expect(action.loan).toEqual(loan);
  });

  it('should create the loadLoanByIdFailure action', () => {
    const error = 'Error loading loan by ID';
    const action = LoanActions.loadLoanByIdFailure({ error });
    expect(action.type).toBe('[Loan] Load Loan By ID Failure');
    expect(action.error).toBe(error);
  });
});
