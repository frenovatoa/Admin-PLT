import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrdersComponent } from './create-orders/create-orders.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { OrdersRoutingModule } from './orders-routing.module';

import {MatStepperModule} from '@angular/material/stepper';

import {MatDialogModule} from '@angular/material/dialog';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLineModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridList, MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
/* import { filterPipe } from './filter.pipe'; */
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

import { CalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'

@NgModule({
  declarations: [
    CreateOrdersComponent,
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    CommonModule,
    MatDialogModule,
    DemoMaterialModule,
    FlexLayoutModule,
    FormsModule,
    MatListModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatExpansionModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatGridListModule,
    MatExpansionModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
  }),
  ],
  exports: [
  MatStepperModule,
  MatFormFieldModule, 
  MatInputModule 
  ]
})


export class OrdersModule { }
