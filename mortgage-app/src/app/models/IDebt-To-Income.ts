interface IDebtToIncome{
    DtiPercentage: number;
    TotalDebts: number;
    ProposedMonthlyPayment: number;
    RemainingMonthlyIncome: number;     
}

interface IDebtToIncomeRequest {
  AnnualIncome: number;
  MinCreditCardPayments: number;
  CarLoanPayments: number;
  StudentLoanPayments: number;
  ProposedMonthlyPayment: number;
  CalculateDefaultPayment: boolean;
}

export type {IDebtToIncome, IDebtToIncomeRequest}