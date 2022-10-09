import { Routes } from '@angular/router';


export const PagesRoutes: Routes = [
  {
    path: '',  
    children:[
      {
        path: 'dashboard',
                loadChildren: () => import('../dashboards/dashboards.module').then(m => m.DashboardsModule),
                pathMatch: 'full',
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
      },
      {
        path: 'catalogs',
        loadChildren: () => import('./catalogs/catalogs.module').then(m => m.CatalogsModule),
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
      },
      {
        path: 'production',
        loadChildren: () => import('./production/production.module').then(m => m.ProductionModule),
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
      },
    ]
  }
];

