import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { jwtInterceptor } from './services/auth/jwt.interceptor';
import { provideStore } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducer';
import { loanReducer } from './store/loan/loan.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './store/auth/auth.effects';
import { LoanEffects } from './store/loan/loan.effects';
import { interestRateReducer } from './store/interest-rates/interest-rate.reducer';
import { InterestRateEffects } from './store/interest-rates/interest-rate.effects';
import { amortizationReducer } from './store/amortization/amortization.reducer';
import { AmortizationEffects } from './store/amortization/amortization.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: jwtInterceptor,
      multi: true,
    },
    provideStore({ auth: authReducer, loan: loanReducer, interestRates: interestRateReducer, amortization : amortizationReducer }),
    provideEffects(AuthEffects, LoanEffects, InterestRateEffects, AmortizationEffects),
  ],
};
