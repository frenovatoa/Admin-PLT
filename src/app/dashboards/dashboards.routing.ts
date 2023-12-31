
import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guard/auth.guard';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    component: Dashboard1Component,
    canActivate: [AuthGuard]
  }
];
