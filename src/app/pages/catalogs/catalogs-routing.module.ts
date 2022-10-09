import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { ProductsComponent } from './products/products.component';
import { TypeOfProductsComponent } from './type-of-products/type-of-products.component';

const routes: Routes =[
  { path: '', redirectTo: 'clients', pathMatch: 'full'},
  {
    path: 'clients',
    component: ClientsComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'typeOfProducts',
    component: TypeOfProductsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
