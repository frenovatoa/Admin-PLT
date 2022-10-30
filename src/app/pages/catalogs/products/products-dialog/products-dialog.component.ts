import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { Product } from 'src/app/shared/interfaces/product';
import { ProductType } from 'src/app/shared/interfaces/product.type';
import { ProductService } from 'src/app/shared/services/product.service';
import { ProductTypeService } from 'src/app/shared/services/product.type.service';

@Component({
  selector: 'app-products-dialog',
  templateUrl: './products-dialog.component.html',
  styleUrls: ['./products-dialog.component.scss']
})
export class ProductsDialogComponent implements OnInit {

  public dataSource: MatTableDataSource<ProductType>;    
  searchText: any;

  private started: boolean = false;

  // Inicializar un arreglo vacío de tipos de productos
  public productType: ProductType[]=[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  public formProducts: FormGroup;
  image: any;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ProductsDialogComponent>,
    public fb: FormBuilder,
    public productService: ProductService,
    public authService : AuthService,
    public toastr :ToastrService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Product) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    if (this.local_data.imagePath === undefined) {
        this.local_data.imagePath = 'assets/images/products/default.png';
    }
    this.formProducts = this.fb.group({
      id: [''],
      productTypeId: [''],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      image: [''],
      status: ['', Validators.required],

      /*userId: this.userData.id,*/ // Se debe de obtener al hacer patchValue()
    });
  }

  ngOnInit(): void {
    this.productService.getProductTypes().subscribe((productType: any)=>{
      console.log(productType)
      this.productType=productType
  });     
  this.toastr.success("Producto Creado");
  }

  // load(){
  //   this.getProductTypes();
  // }

  /** Guarda registro */
  save(): void {
    let data = this.formProducts.value;
    data.id = this.productService.unicID();
    console.log(data)
    if (this.formProducts.valid) {
      // Inserción en la base de datos
      this.productService.addProduct(data).then((product: any) => {
        console.log(product)
        this.toastr.success("Producto Creado.");
      });
      this.closeDialog();
    } else {
      this.toastr.error("Favor de llenar campos faltantes.");
    }
  }

/** Actualiza registro */
update(): void {
  this.formProducts.get('id').setValue(this.local_data.id)
  let data = this.formProducts.value;
  data.image = this.image;
  console.log(data)
  if (this.formProducts.valid) {
    // Inserción en la base de datos
    this.productService.updateProduct(data.id, data)
    this.uploadFile(data.image)
    this.closeDialog();
  } else {
    //this.toastr.error("Favor de llenar campos faltantes");
  }
}

/** Actualiza estatus del registro, de manera que pase a no estar activo */
updateStatus(): void {  
  let data = this.local_data;
  // Todos los datos quedan igual excepto el estatus, que cambia a false
  data.status = false;
  console.log(data) 
  // Aquí va la inserción en la base de datos
  this.productService.updateProduct(data.id, data)
  this.closeDialog();  
}

  /** Cerrar diálogo/modal */
  // closeDialog(response?): void {
  //   if (response != undefined) {
  //     if (response["success"]) {
  //       this.toastr.success(response["message"]);
  //     } else {
  //       this.toastr.error(response["message"]);
  //     }
  //     this.dialogRef.close(true);
  //   } else {
  //     this.dialogRef.close(false);
  //   }
  // }

  // addData(type: number) {
  //   switch (type) {
  //       case 3:
  //         /** Abre el dialogo de tipos de producto para añadir un nuevo registro */
  //         const dialogType = this.dialog.open(ProductTypeDialogComponent, {
  //           data: {
  //             type: 1,
  //             action: 'Nuevo'
  //           }
  //         }).afterClosed().subscribe((confirm: boolean) => {
  //           if (confirm) {
  //             this.getProductTypes();
  //           } else {
  //             this.toastr.error('Cancelado');
  //           }
  //         });
  //     default:
  //       break;
  //   }
  // }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
      this.dialogRef.close({ event: 'Cancelar.' });
      this.toastr.success("Producto Creado.");
  }

  setImage(event: any) {
    this.image = event.target.files[0];
  }

  uploadFile(event: any) {
    let data = this.local_data;
    let id = this.local_data.id;
    console.log(event.target.files[0])
    // this.imageUploadService
      // .uploadImage(event.target.files[0])
      
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
        // this.msg = 'You must select an image';
        return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        // this.msg = "Only images are supported";
        return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
        // tslint:disable-next-line - Disables all
        this.local_data.imagePath = reader.result;
    };
}

}
