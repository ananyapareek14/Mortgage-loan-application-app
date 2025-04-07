import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoanApplicationComponent } from './loan-application/loan-application.component';
import { AmortizationComponent } from './amortization/amortization.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
    
    {
        path: 'amortization',
        component: AmortizationComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'loan-application',
        component: LoanApplicationComponent, 
        canActivate: [AuthGuard]
  },

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'dashboard/:id',
        component: LoanDetailsComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'login',
        component: LoginComponent,
    },

    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];
