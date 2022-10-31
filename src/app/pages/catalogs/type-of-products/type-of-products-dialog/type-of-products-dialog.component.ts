import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TypeOfProductsComponent } from '../type-of-products.component';

import { ProductType } from 'src/app/shared/interfaces/product.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeOfProductService } from 'src/app/shared/services/typeOfProduct.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-type-of-products-dialog',
  templateUrl: './type-of-products-dialog.component.html',
  styleUrls: ['./type-of-products-dialog.component.scss']
})

export class TypeOfProductsDialogComponent {

  private started: boolean = false;
  public productType: ProductType[]=[];
  public dataSourceP: MatTableDataSource<ProductType>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;

  public formTypeOfProduct: FormGroup;


  constructor(
      public datePipe: DatePipe,
      public dialogRef: MatDialogRef<TypeOfProductsDialogComponent>,
      public fb: FormBuilder,
      public typeOfProductService: TypeOfProductService,
      public authService : AuthService,
      public toastr :ToastrService,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: ProductType) {
      this.local_data = { ...data };
      this.action = this.local_data.action;
      this.formTypeOfProduct = this.fb.group ({
        id: [''],
        description: ['', Validators.required],
        retailPrice: ['', Validators.required],
        wholesalePrice: ['', Validators.required],
        status: ['', Validators.required],
    });
    console.log(this.local_data);
  }

  ngOnInit() {    
    this.typeOfProductService.getTypeOfProduct().subscribe((productType: any)=>{      
    this.productType=productType
  });  
}

/** Guarda registro */
save(): void {
  let descriptionExistente = false;
  let data = this.formTypeOfProduct.value;
  //console.log(data)  

  //obtiene el valor de la descripcion
  const description = this.formTypeOfProduct.value.description;
  //se traen todas las descripciones de la BD
  this.productType.forEach(data =>{
    if(data.description == description){
      descriptionExistente = true    
    }
  })
  if( descriptionExistente == false){  
  if (this.formTypeOfProduct.valid) {
      // Aquí va la inserción en la base de datos
        this.typeOfProductService.addTypeOfProduct(data).then((typeOfProduct: any)=>{
        console.log(typeOfProduct)
        this.toastr.success("Tipo de producto creado");
        this.closeDialog();
      });
    } else {
      this.toastr.error("Favor de verificar los datos ingresados");
    }
  }else{
    this.toastr.error("Ya existe un tipo de producto con la misma descripcion");
  }    
}

/** Actualiza registro */
update(): void {
this.formTypeOfProduct.get("id").setValue(this.local_data.id)  
let data = this.formTypeOfProduct.value;
console.log(data)
if (this.formTypeOfProduct.valid) {
// Aquí va la inserción en la base de datos
  this.typeOfProductService.updateTypeOfProduct(data.id, data)
  this.toastr.success("Actualizacion realizada");
  this.closeDialog();
} else {
 this.toastr.error("Favor de llenar campos faltantes");
}
}


doAction(): void {
  let data = this.local_data;
  data.status = false;
console.log(data)
// Aquí va la inserción en la base de datos
  this.typeOfProductService.updateTypeOfProduct(data.id, data)
  this.toastr.success("Tipo de producto Eliminado");
  this.closeDialog();
}

closeDialog(): void {
  this.dialogRef.close({ event: 'Cancelar' });
}
  
}
