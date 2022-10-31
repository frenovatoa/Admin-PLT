import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductionComponent } from './production.component';


const routes: Routes =[
  { path: '', redirectTo: 'production', pathMatch: 'full'},
  {
    path: 'production',
    component: ProductionComponent,
    data: {
      title: 'Employee List',   
  }
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionRoutingModule { }
