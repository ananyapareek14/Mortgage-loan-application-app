import { Route } from "@angular/router";
import { LoanDetailsComponent } from "./loan-details.component";
import { AuthGuard } from "../services/auth/auth.guard";

export default[
    {
        path: ':id',
        component: LoanDetailsComponent,
        canActivate: [AuthGuard]
    }
] as Route[];