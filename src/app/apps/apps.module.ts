import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { CalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppsRoutes } from './apps.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EmployeeDialogContent } from './employee/employee.component';
import {MatDialogModule} from '@angular/material/dialog';

import { EmployeeComponent } from './employee/employee.component';
import { NgApexchartsModule } from 'ng-apexcharts';







@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AppsRoutes),
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        FlexLayoutModule,
        QuillModule.forRoot(),
        NgApexchartsModule,
        PerfectScrollbarModule,
        Ng2SearchPipeModule,
        DragDropModule,
        NgxPaginationModule,
        MatDialogModule
    ],
    declarations: [
        EmployeeComponent
    ],
    providers: [
        DatePipe
    ],
    entryComponents: [
        EmployeeDialogContent
    ]
})
export class AppsModule { }
