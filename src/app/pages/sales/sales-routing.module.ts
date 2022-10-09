import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';


const routes: Routes =[
  { path: '', redirectTo: 'sales', pathMatch: 'full'},
  {
    path: 'sales',
    component: SalesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
