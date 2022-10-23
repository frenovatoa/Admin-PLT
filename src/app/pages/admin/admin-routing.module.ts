import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './users/users.component';


const routes: Routes =[
  { path: '', redirectTo: 'users', pathMatch: 'full'},
  {
    path: 'users',
    component: UserComponent,
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
