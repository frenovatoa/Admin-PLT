import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { Product } from 'src/app/shared/interfaces/product';
import { ProductType } from 'src/app/shared/interfaces/product.type';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
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
  public description: string;
  private started: boolean = false;

  // Inicializar un arreglo vacío de tipos de productos
  public productType: ProductType[]=[];

  // Inicializar un arreglo vacío de usuarios
  public product: Product[]=[];
  public dataSourceP: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  // Para la imagen
  public formProducts: FormGroup;
  image: any;
  showImage: any;
  url: string;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ProductsDialogComponent>,
    public fb: FormBuilder,
    public productService: ProductService,
    public authService : AuthService,
    public toastr :ToastrService,
    // Imagenes
    private storage: AngularFireStorage,
    private imageUploadService: ImageUploadService,
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
    if(this.local_data.id != null) {
      this.formProducts.get('quantity').disable()
    }  
    // this.toastr.success("Producto Creado");
    this.productService.getProducts().subscribe((product: any)=>{
      console.log(product)
      this.product=product
    }); 
  }

  // load(){
  //   this.getProductTypes();
  // }

  /** Guardar registro */
  // save(): void {
  //   let data = this.formProducts.value;
  //   data.id = this.productService.unicID();
  //   console.log(data)
  //   if (this.formProducts.valid) {
  //     // Inserción en la base de datos
  //     this.productService.addProduct(data).then((product: any) => {
  //       console.log(product)
  //       this.toastr.success("Producto Creado.");
  //     });
  //     this.closeDialog();
  //   } else {
  //     this.toastr.error("Favor de llenar campos faltantes.");
  //   }
  // }
  save(): void {
    let data = this.formProducts.value;
    data.id = this.productService.unicID();
    console.log(data)
    var productoExistente = false
    var tipoExistente = false

    // Obtener valor de la descripción y el tipo del producto
    const description = this.formProducts.value.description;
    const productTypeId = this.formProducts.value.productTypeId;

    // Traer todos los productos de la base de datos
    this.product.forEach(data => {
      if(data.description == description && data.productTypeId == productTypeId){
        // Si hay un producto igual al colocado en el dialog, es un producto existente y lo marca como true
        productoExistente = true
        tipoExistente = true
      }
    })


    // Si el producto no existe
    if (productoExistente == false && tipoExistente == false){
      if(this.image != undefined){
        data.image = this.image;
      } else {
        data.image = this.local_data.image
      }
      if (this.formProducts.valid) {
        // Aquí va la inserción en la base de datos
          // this.authService.SignUp(data).then((user: any)=>{
          //     this.toastr.success("Usuario Creado");
          //  });
          this.saveFile(data.image, data)
          //this.uploadFile(data.image, data.id)
          this.toastr.success("Producto creado.");
          this.closeDialog();
      } else {
        this.toastr.error("Favor de llenar campos faltantes.");
      }
    }else{
      this.toastr.error("Ya hay un producto registrado con ese tipo y descripción.");
    }
  }

/** Actualiza registro */
// update(): void {
//   this.formProducts.get('id').setValue(this.local_data.id)
//   let data = this.formProducts.value;
//   data.image = this.image;
//   console.log(data)
//   if (this.formProducts.valid) {
//     // Inserción en la base de datos
//     this.productService.updateProduct(data.id, data)
//     this.uploadFile(data.image)
//     this.closeDialog();
//   } else {
//     //this.toastr.error("Favor de llenar campos faltantes");
//   }
// }

update(): void {
  // var productoExistente = false
  // var tipoExistente = false

  // Obtener valor de la descripción y el tipo del producto
  // const description = this.formProducts.value.description;
  // const productTypeId = this.formProducts.value.productTypeId;

  // Traer todos los productos de la base de datos
  // this.product.forEach(data => {
  //   if(data.description == description && data.productTypeId == productTypeId){
  //     // Si hay un producto igual al colocado en el dialog, es un producto existente y lo marca como true
  //     productoExistente = true
  //     tipoExistente = true
  //   }
  // })

  this.formProducts.get('id').setValue(this.local_data.id)
  let data = this.formProducts.getRawValue();
  console.log(data)
  if(this.image != undefined){
    data.image = this.image;
  }else{
    data.image = this.local_data.image
  }
  
  console.log(data.image)
  if (this.formProducts.valid) {
    this.productService.updateProduct(data.id, data)
    if(this.local_data.image !== data.image){
      this.uploadFile(data.image, this.local_data.id)
    }    
    this.closeDialog();
    this.toastr.success("Producto Actualizado");
  } else {
  this.toastr.error("Favor de llenar campos faltantes");
  }

  // Si el producto no existe
  // if (productoExistente == false && tipoExistente == false){
  //   this.formProducts.get('id').setValue(this.local_data.id)
  //   let data = this.formProducts.getRawValue();
  //   console.log(data)
  //   if(this.image != undefined){
  //     data.image = this.image;
  //   }else{
  //     data.image = this.local_data.image
  //   }
    
  //   console.log(data.image)
  //   if (this.formProducts.valid) {
  //     this.productService.updateProduct(data.id, data)
  //     if(this.local_data.image !== data.image){
  //       this.uploadFile(data.image, this.local_data.id)
  //     }    
  //     this.closeDialog();
  //     this.toastr.success("Producto Actualizado");
  //   } else {
  //   this.toastr.error("Favor de llenar campos faltantes");
  //   }
  // }else{
  //   this.toastr.error("Ya hay un producto registrado con ese tipo y descripción.");
  // }
}

/** Actualiza estatus del registro, de manera que pase a no estar activo */
updateStatus(): void {  
  let data = this.local_data;
  // Todos los datos quedan igual excepto el estatus, que cambia a false
  data.status = false;
  console.log(data) 
  // Aquí va la inserción en la base de datos
  this.productService.updateProduct(data.id, data)
  this.toastr.success("Producto Eliminado");
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
  }

  setImage(event: any){
    console.log(event.target.files[0])
    this.image = event.target.files[0];
    this.showImage = event.target.files[0].type;

    // Vista previa de la imagen en el dialog
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.local_data.image = reader.result;
    };
  }

  saveFile(event: any, data: Product) {    
    console.log(data.id)
    this.imageUploadService
      .uploadImage(event, `products/${data.id}`)
      .pipe(
        // this.toast.observe({
        //   loading: 'Uploading profile image...',
        //   success: 'Image uploaded successfully',
        //   error: 'There was an error in uploading the image',
        // }),
        switchMap((image) =>
          this.productService.addProduct({
            id: data.id,
            productTypeId: data.productTypeId,
            description: data.description,
            quantity: data.quantity,
            // image: data.image,
            image,
            status: data.status,
        }
        )
        )
      )
      .subscribe();
      console.log(this.url)
  }

  uploadFile(event: any, id: string) {
    let data = this.local_data;
    
    console.log(id)
    this.imageUploadService
      .uploadImage(event, `products/${id}`)
      .pipe(
        switchMap((image) =>
          this.productService.updateProductTest({
            id,
            image,
            productTypeId: data.productTypeId,
            description: data.description,
            quantity: data.quantity,
            status: data.status
          }
      )
      )
      )
      .subscribe();
      
      console.log(this.url)
  }

//   selectFile(event: any): void {
//     if (!event.target.files[0] || event.target.files[0].length === 0) {
//         // this.msg = 'You must select an image';
//         return;
//     }
//     const mimeType = event.target.files[0].type;
//     if (mimeType.match(/image\/*/) == null) {
//         // this.msg = "Only images are supported";
//         return;
//     }
//     // tslint:disable-next-line - Disables all
//     const reader = new FileReader();
//     reader.readAsDataURL(event.target.files[0]);
//     // tslint:disable-next-line - Disables all
//     reader.onload = (_event) => {
//         // tslint:disable-next-line - Disables all
//         this.local_data.imagePath = reader.result;
//     };
// }

}
