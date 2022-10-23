import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './users/users.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersDialogComponent } from './users/users-dialog/users-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    UserComponent,
    UsersDialogComponent,
  ],
  imports: [
    CommonModule,
     AdminRoutingModule,
    DemoMaterialModule,
    FlexLayoutModule,
    FormsModule,
    MatListModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatExpansionModule,
    SharedModule
  ]
})
export class AdminModule { }
