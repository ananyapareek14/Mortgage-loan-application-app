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
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { affordabilityReducer } from './store/calculator/affordability/affordability.reducer';
import { dtiReducer } from './store/calculator/debt-to-income/dti.reducer';
import { refinanceReducer } from './store/calculator/refinance/refinance.reducer';
import { vaMortgageReducer } from './store/calculator/va-mortgage/va-mortgage.reducer';
import { VaMortgageEffects } from './store/calculator/va-mortgage/va-mortgage.effects';
import { RefinanceEffects } from './store/calculator/refinance/refinance.effects';
import { DtiEffects } from './store/calculator/debt-to-income/dti.effects';
import { AffordabilityEffects } from './store/calculator/affordability/affordability.effects';

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
    provideStore({
      auth: authReducer,
      loan: loanReducer,
      interestRates: interestRateReducer,
      amortization: amortizationReducer,
      affordability: affordabilityReducer,
      dti: dtiReducer,
      refinance: refinanceReducer,
      vaMortgage: vaMortgageReducer
    }),
    provideEffects(
      AuthEffects,
      LoanEffects,
      InterestRateEffects,
      AmortizationEffects,
      AffordabilityEffects,
      DtiEffects,
      RefinanceEffects,
      VaMortgageEffects
    ),
    provideToastr({
      positionClass: 'my-custom-toast',
      preventDuplicates: true,
      timeOut: 2000
    }),
    provideAnimations()
  ],
};
