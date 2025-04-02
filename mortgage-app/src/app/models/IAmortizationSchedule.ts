interface IAmortizationSchedule {
  PaymentNumber: number;
  PaymentDate: Date;
  MonthlyPayment: number;
  PrincipalPayment: number;
  InterestPayment: number;
  RemainingBalance: number;
}

interface IAmortizationRequest {
  LoanAmount: number;
  InterestRate: number;
  LoanTermYears: number;
}

export type { IAmortizationSchedule, IAmortizationRequest };