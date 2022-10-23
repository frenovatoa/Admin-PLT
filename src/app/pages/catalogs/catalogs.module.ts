import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients/clients.component';
import { ProductsComponent } from './products/products.component';
import { TypeOfProductsComponent } from './type-of-products/type-of-products.component';
import { CatalogsRoutingModule } from './catalogs-routing.module';
import { ProductsDialogComponent } from './products/products-dialog/products-dialog.component';
import { TypeOfProductsDialogComponent } from './type-of-products/type-of-products-dialog/type-of-products-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientsDialogComponent } from './clients/clients-dialog/clients-dialog.component';

@NgModule({
  declarations: [
    ClientsComponent,
    ProductsComponent,
    TypeOfProductsComponent,
    ProductsDialogComponent,
    TypeOfProductsDialogComponent,
    ClientsDialogComponent
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule,
    MatDialogModule,
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
export class CatalogsModule { }
