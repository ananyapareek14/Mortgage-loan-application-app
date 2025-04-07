import { Route } from "@angular/router";
import { AuthGuard } from "../services/auth/auth.guard";
import { DashboardComponent } from "./dashboard.component";

export default [
    {
      path: '',
      component: DashboardComponent,
      canActivate: [AuthGuard]
    }
  ] as Route[];