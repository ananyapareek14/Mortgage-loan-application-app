import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoanApplicationComponent } from './loan-application/loan-application.component';
import { AmortizationComponent } from './amortization/amortization.component';

export const routes: Routes = [
    
    {
        path: 'amortization',
        component: AmortizationComponent, // Home is authenticated
    },

    {
        path: 'loan-application',
        component: LoanApplicationComponent, // Home is authenticated
    },

    {
        path: 'dashboard',
        component: DashboardComponent, // Home is authenticated
    },

    {
        path: 'home',
        component: HomeComponent, // Home is authenticated
    },

    {
        path: '',
        component: LoginComponent, // Login is public
    }
];
