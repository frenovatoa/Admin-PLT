import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrdersComponent } from './create-orders/create-orders.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { OrdersRoutingModule } from './orders-routing.module';



@NgModule({
  declarations: [
    CreateOrdersComponent,
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
