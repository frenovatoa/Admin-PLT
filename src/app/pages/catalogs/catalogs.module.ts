import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients/clients.component';
import { ProductsComponent } from './products/products.component';
import { TypeOfProductsComponent } from './type-of-products/type-of-products.component';
import { CatalogsRoutingModule } from './catalogs-routing.module';
import { ProductsDialogComponent } from './products/products-dialog/products-dialog.component';



@NgModule({
  declarations: [
    ClientsComponent,
    ProductsComponent,
    TypeOfProductsComponent,
    ProductsDialogComponent
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule
  ]
})
export class CatalogsModule { }
