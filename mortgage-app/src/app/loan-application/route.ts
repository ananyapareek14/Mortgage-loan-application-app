import { Route } from "@angular/router";
import { LoanApplicationComponent } from "./loan-application.component";
import { AuthGuard } from "../services/auth/auth.guard";

export default[
    {
        path: '',
        component: LoanApplicationComponent, 
        canActivate: [AuthGuard]
    }
] as Route[];