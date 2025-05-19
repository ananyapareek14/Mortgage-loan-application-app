import { Route } from "@angular/router";
import { AuthGuard } from "../../services/auth/auth.guard";
import { AffordabilityComponent } from "./affordability.component";

export default [
    {
        path: '',
        component: AffordabilityComponent,
        canActivate: [AuthGuard],
    }
] as Route[];