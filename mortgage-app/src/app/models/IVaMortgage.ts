interface IVaMortgageRequest {
  HomePrice: number;
  DownPayment: number;
  InterestRate: number;
  LoanTermYears: number;
}

interface IVaMortgage {
  MonthNumber: number;
  MonthlyPayment: number;
  PrincipalPayment: number;
  InterestPayment: number;
  RemainingBalance: number;
}

export type {IVaMortgage, IVaMortgageRequest}