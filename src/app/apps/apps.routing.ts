import { Routes } from '@angular/router';


import { EmployeeComponent } from './employee/employee.component';



export const AppsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'employeelist',
                component: EmployeeComponent,
                data: {
                    title: 'Employee List',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Employee List' }
                    ]
                 
            }
         }
        ]
    }
];
