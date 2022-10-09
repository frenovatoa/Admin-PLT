import { Routes } from '@angular/router';
//import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';


export const AppRoutes: Routes = [
    {
        path: '',
        component: FullComponent,
        children: [
            {
                path: '',
                redirectTo: '/pages/dashboard',
                pathMatch: 'full'
            },
             {
                path: 'dashboard',
              //  canActivate: [AuthGuard], 
                loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule),
                pathMatch: 'full',
            },
            {
                path: 'pages',
              //  canActivate: [ AuthGuard ],
                loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
            }
        ]
    },
    {
        path: '',
        component: AppBlankComponent,
        children: [
            {
                path: 'authentication',
                loadChildren:
                    () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'authentication/404'
    }
];
