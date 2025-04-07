import { Route } from "@angular/router";
import { AmortizationComponent } from "./amortization.component";
import { AuthGuard } from "../services/auth/auth.guard";

export default[
    {
        path: '',
        component: AmortizationComponent,
        canActivate: [AuthGuard]
    }
] as Route[];