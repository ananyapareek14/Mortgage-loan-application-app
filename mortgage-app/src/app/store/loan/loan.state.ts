import { ILoan } from '../../models/ILoan';

export interface LoanState {
  loans: ILoan[];
  selectedLoan: ILoan | null;
}

export const initialState: LoanState = {
  loans: [],
  selectedLoan: null,
};
