import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrdersComponent } from './create-orders/create-orders.component';
import { ScheduleComponent } from './schedule/schedule.component';


const routes: Routes =[
  { path: '', redirectTo: 'generateOrder', pathMatch: 'full'},
  {
    path: 'generateOrder',
    component: CreateOrdersComponent
  },
  {
    path: 'schedule',
    component: ScheduleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrdersRoutingModule { }
