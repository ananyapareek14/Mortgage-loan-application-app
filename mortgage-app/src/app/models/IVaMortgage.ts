interface IVaMortgage {
  HomePrice: number;
  DownPayment: number;
  InterestRate: number;
  LoanTermYears: number;
}

interface IVaMortgageRequest {
  MonthNumber: number;
  MonthlyPayment: number;
  PrincipalPayment: number;
  InterestPayment: number;
  RemainingBalance: number;
}

export type {IVaMortgage, IVaMortgageRequest}