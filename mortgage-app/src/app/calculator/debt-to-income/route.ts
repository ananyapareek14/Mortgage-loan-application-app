import { Route } from "@angular/router";
import { DebtToIncomeComponent } from "./debt-to-income.component";
import { AuthGuard } from "../../services/auth/auth.guard";

export default [
    {
        path: '',
        component: DebtToIncomeComponent,
        canActivate: [AuthGuard],
    }
] as Route[]