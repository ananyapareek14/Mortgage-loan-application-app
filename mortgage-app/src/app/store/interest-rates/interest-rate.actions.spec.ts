import * as fromActions from './interest-rate.actions';
import { IInterestRate } from '../../models/IInterestRate';

describe('Interest Rate Actions', () => {
  it('should create a loadInterestRates action', () => {
    const action = fromActions.loadInterestRates();
    expect(action.type).toBe('[Interest Rate] Load Interest Rates');
  });

  it('should create a loadInterestRatesSuccess action with interest rates', () => {
    const interestRates: IInterestRate[] = [
      { Id: '1', Rate: 5, ValidFrom: '2021-01-01' },
    ];
    const action = fromActions.loadInterestRatesSuccess({ interestRates });
    expect(action.type).toBe('[Interest Rate] Load Interest Rates Success');
    expect(action.interestRates).toEqual(interestRates);
  });

  it('should create a loadInterestRatesFailure action with an error message', () => {
    const error = 'Error loading interest rates';
    const action = fromActions.loadInterestRatesFailure({ error });
    expect(action.type).toBe('[Interest Rate] Load Interest Rates Failure');
    expect(action.error).toBe(error);
  });
});
