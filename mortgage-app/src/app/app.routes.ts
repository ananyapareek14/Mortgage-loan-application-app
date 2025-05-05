import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { AuthGuard } from './services/auth/auth.guard';

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
  {
    path: '404',
    component: NotFoundComponent,
    canActivate: [AuthGuard]
  }
];