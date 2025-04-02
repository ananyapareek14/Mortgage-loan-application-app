import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoanApplicationComponent } from './loan-application/loan-application.component';
import { AmortizationComponent } from './amortization/amortization.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';

export const routes: Routes = [
    
    {
        path: 'amortization',
        component: AmortizationComponent,
    },

    {
        path: 'loan-application',
        component: LoanApplicationComponent, 
    },

    {
        path: 'dashboard',
        component: DashboardComponent, 
    },

    {
        path: 'dashboard/:id',
        component: LoanDetailsComponent,
    },

    {
        path: 'home',
        component: HomeComponent, 
    },

    {
        path: '',
        component: LoginComponent,
    }
];
