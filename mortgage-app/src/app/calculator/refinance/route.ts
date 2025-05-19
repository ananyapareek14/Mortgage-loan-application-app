import { Route } from "@angular/router";
import { RefinanceComponent } from "./refinance.component";
import { AuthGuard } from "../../services/auth/auth.guard";

export default [
    {
        path: '',
        component: RefinanceComponent,
        canActivate: [AuthGuard]
    }
] as Route[];