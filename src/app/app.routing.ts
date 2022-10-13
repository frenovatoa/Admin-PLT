import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';
import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
//import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';

//import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { UserComponent } from './pages/admin/users/users.component';
//const  accesWerbPage = () => redirectUnauthorizedTo(['/authentication/login']);

export const AppRoutes: Routes = [
    {
        path: '',
        component: FullComponent,
        children: [
            {
                path: '',
                redirectTo: '/pages/dashboard',
                pathMatch: 'full',
                //canActivate: [AuthGuard], 
            },
             {
                path: 'dashboard',
               //canActivate: [AuthGuard], //data: { authGuardPipe: accesWerbPage},
                loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule),
                //canActivate: [AuthGuard],
                pathMatch: 'full',
                canActivate: [AuthGuard], 
            },
            {
                path: 'pages',
               //canActivate: [ AuthGuard ], //data: { authGuardPipe: accesWerbPage},
                loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
                //canActivate: [AuthGuard],
                canActivate: [AuthGuard], 
            },  
        ]
    },
    // Ruta a usuarios
    {
        path: '',
        children: [
            {
                path: './pages/admin/users',
                component: UserComponent,
                data: {
                    title: 'Usuarios',
                    urls: [
                    ]
                }
            },
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
    },
];
