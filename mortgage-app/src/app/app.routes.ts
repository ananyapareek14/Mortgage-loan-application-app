import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'LoginPage' },
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/route').then((m) => m.default),
    data: { animation: 'DashboardPage' },
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./loan-details/route').then((m) => m.default),
    data: { animation: 'LoanDetailPage' },
  },
  {
    path: 'calculator/amortization',
    loadChildren: () =>
      import('./calculator/amortization/route').then((m) => m.default),
    data: { animation: 'AmortizationPage' },
  },
  {
    path: 'loan-application',
    loadChildren: () =>
      import('./loan-application/route').then((m) => m.default),
    data: { animation: 'LoanApplicationPage' },
  },
  {
    path: 'calculator/affordability',
    loadChildren: () =>
      import('./calculator/affordability/route').then((m) => m.default),
  },
  {
    path: 'calculator/debt-to-income',
    loadChildren: () =>
      import('./calculator/debt-to-income/route').then((m) => m.default),
  },
  {
    path: 'calculator/refinance',
    loadChildren: () =>
      import('./calculator/refinance/route').then((m) => m.default),
  },
  {
    path: 'calculator/va-mortgage',
    loadChildren: () =>
      import('./calculator/va-mortgage/route').then((m) => m.default),
  }
];
