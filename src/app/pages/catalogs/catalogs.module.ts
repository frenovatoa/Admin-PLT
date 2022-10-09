import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients/clients.component';
import { ProductsComponent } from './products/products.component';
import { TypeOfProductsComponent } from './type-of-products/type-of-products.component';
import { CatalogsRoutingModule } from './catalogs-routing.module';



@NgModule({
  declarations: [
    ClientsComponent,
    ProductsComponent,
    TypeOfProductsComponent
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule
  ]
})
export class CatalogsModule { }
