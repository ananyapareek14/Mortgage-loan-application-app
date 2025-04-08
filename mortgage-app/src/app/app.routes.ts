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
    path: 'details',
    loadChildren: () => import('./loan-details/route').then((m) => m.default),
    data: { animation: 'LoanDetailPage' },
  },
  {
    path: 'amortization',
    loadChildren: () => import('./amortization/route').then((m) => m.default),
    data: { animation: 'AmortizationPage' },
  },
  {
    path: 'loan-application',
    loadChildren: () =>
      import('./loan-application/route').then((m) => m.default),
    data: { animation: 'LoanApplicationPage' },
  },
  
];