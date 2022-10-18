import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { UserComponent } from './users/users.component';
import { AdminRoutingModule } from './admin-routing.module';
//import { UsersDialogComponent } from './users/users-dialog/users-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    //UserComponent,
    //UsersDialogComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatDialogModule
  ]
})
export class AdminModule { }
