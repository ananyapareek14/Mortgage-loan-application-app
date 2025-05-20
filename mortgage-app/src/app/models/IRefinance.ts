interface IRefinance {
  MonthlySavings: number;
  NewPayment: number;
  BreakEvenMonths: number;
  LifetimeSavings: number;
}

interface IRefinanceRequest {
  CurrentLoanAmount: number;
  InterestRate: number;
  CurrentTermMonths: number;
  OriginationYear: number;
  NewLoanAmount: number;
  NewInterestRate: number;
  NewTermMonths: number;
  RefinanceFees: number;
}

export type {IRefinance, IRefinanceRequest}