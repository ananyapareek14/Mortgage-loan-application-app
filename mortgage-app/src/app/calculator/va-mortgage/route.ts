import { Route } from "@angular/router";
import { VaMortgageComponent } from "./va-mortgage.component";
import { AuthGuard } from "../../services/auth/auth.guard";

export default [
    {
        path: '',
        component: VaMortgageComponent,
        canActivate: [AuthGuard],
    }
] as Route[];