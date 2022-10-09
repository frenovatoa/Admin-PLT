import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionComponent } from './production.component';
import { ProductionRoutingModule } from './production-routing.module';



@NgModule({
  declarations: [
    ProductionComponent
  ],
  imports: [
    CommonModule,
    ProductionRoutingModule
  ]
})
export class ProductionModule { }
