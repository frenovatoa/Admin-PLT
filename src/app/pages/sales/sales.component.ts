import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit, Type, PipeTransform} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TilePosition } from '@angular/material/grid-list/tile-coordinator';
import {filter, map, timestamp} from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { query } from 'chartist';
import { collection } from 'firebase/firestore';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { SaleService } from 'src/app/shared/services/sale.service';
//import { SaleDetailService } from 'src/app/shared/services/saleDetail.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user';
import { Sale } from 'src/app/shared/interfaces/sale';
import { SaleType } from 'src/app/shared/interfaces/sale.type';
import { ProductType } from 'src/app/shared/interfaces/product.type';
import { ToastrService } from 'ngx-toastr';
import { CdkTableModule } from '@angular/cdk/table';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { ConstantPool } from '@angular/compiler';
import { Product } from 'src/app/shared/interfaces/product';
import { SaleDetail } from 'src/app/shared/interfaces/sale.detail';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  animations: [
    trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
],
})
export class SalesComponent implements OnInit, AfterViewInit {
  

  //Arreglos que se ocupan en la tabla.
  public sale: Sale[]=[];
  public user: User[]=[];
  public saleDetails: SaleDetail[]=[];
  public product: Product[]=[];
  public productType: ProductType[]=[];
  public saleType: SaleType[]=[]; 
  public dataSource: MatTableDataSource<Sale>;

  //Form de ventas.
  public formSale: FormGroup;
  public formSaleDetail: FormGroup;
  public saleDetailForm: FormArray;
  public saleDetailData: SaleDetail[];
  
  //Form de filtro de rango de fechas.
  filterForm = new FormGroup({
    StartDate: new FormControl(),
    EndDate: new FormControl(),
  });      

  saleDetailForms = new FormGroup({
    requestedQuantity: new FormControl(),
    amount: new FormControl(),
  });      

  //Obtencion de StartDate y EndDate de filterForm
  get StartDate() { return this.filterForm.get('StartDate').value; }
  get EndDate() { return this.filterForm.get('EndDate').value; }

  local_data: any;
  action: string;   
  searchText: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['#', 'saleDate', 'orderId', 'saleTypeId', 'totalCost', 'userId', 'action'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  private started: boolean = false;

  public id

  constructor(

     private fs: FormBuilder,
     public dialog: MatDialog, 
     public datePipe: DatePipe, 
     public fb: SaleService, 
     public us: UserService,
     public _MatPaginatorInt1: MatPaginatorIntl,
     //public dialogRef: MatDialogRef<SalesComponent>,
     public authService : AuthService,
     public toastr :ToastrService,
     @Optional() @Inject(MAT_DIALOG_DATA) public data: Sale) { 

     let email = this.authService.user

     this.fb.getUsers().subscribe((user: any) =>{
      user.forEach(data =>{
        if(data.email == email.email){
          this.id = data.uid
        }
      })
      console.log("1",this.id)
     })
    

     this.local_data = { ...data };
     this.action = this.local_data.action;
     this.filterForm = this.fs.group({
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
     })
     this.formSale = this.fs.group ({
      id: [null],
      orderId: ["Venta"],
      saleDate: [new Date()],
      saleTypeId: [null, Validators.required],
      userId: [null],
      totalCost: [null],
      status: [true, Validators.required],
      saleDetails: this.fs.array([])
     });
     this.addSaleDetail();
  }

  applyFilter() {
    this.dataSource.filter = ''+Math.random();
  }

  currentDate = new Date();

  public amount
  public priceSaleType
  public amount1
  precios(){
    if(this.saleDetail.controls[0].get('productId').value == null){
      console.log("no haga nada")
    }else{
      for(let i=0;i<this.saleDetail.length;i++){
        let saleType = this.formSale.get('saleTypeId').value
        if(saleType == 'yhl8Slx8goioNHV0OAGo'){
          //let amount = 15
          //this.saleDetail.controls[i].get('price').setValue(amount)
          //this.saleDetail.controls[i].get('amount').setValue(amount)
          for(let j=0;j<this.product.length;j++){
            let productId = this.product[j].id
            //console.log("product",productId)
            if(this.saleDetail.controls[i].get('productId').value == productId){
              //console.log("product1",productId)
              let retail1
              let amount_1
              this.productType.forEach((productType, index) =>{
                if(productType.id == this.product[j].productTypeId){
                  if(saleType == 'yhl8Slx8goioNHV0OAGo'){
                    this.amount1=productType.retailPrice
                    retail1 = productType.retailPrice
                    amount_1 = retail1
                  }
                }
              })
            this.saleDetail.controls[i].patchValue({"price":amount_1})
            this.saleDetail.controls[i].patchValue({"amount":amount_1})  
            }
          }
        }else{
          //let amount = 10
          //this.saleDetail.controls[i].get('price').setValue(amount)
          //this.saleDetail.controls[i].get('amount').setValue(amount)
          for(let j=0;j<this.product.length;j++){
            let productId = this.product[j].id
            //console.log("product",productId)
            if(this.saleDetail.controls[i].get('productId').value == productId){
              //console.log("product1",productId)
              let wholesale1
              let amount_1
              this.productType.forEach((productType, index) =>{
                if(productType.id == this.product[j].productTypeId){
                  if(saleType == 'ysOUKmrhHheCUJm20LHP'){
                    this.amount1=productType.wholesalePrice
                    wholesale1 = productType.wholesalePrice
                    amount_1 = wholesale1
                  }
                }
              })
            this.saleDetail.controls[i].patchValue({"price":amount_1})
            this.saleDetail.controls[i].patchValue({"amount":amount_1})  
            }
          }
        }

      }
    }
  }

  obtenerPrecios(index : number, product ?: Product)
  {  
    //console.log("valor",this.saleDetail.controls[0].get('productId').value)
    //if(this.saleDetail.controls[0].get('productId').value != null){
      let retail
      let wholesale
      let amount
      let id = this.formSale.get('saleTypeId').value
      console.log(product)
      if(product.productTypeId != undefined){
  
      this.productType.forEach((productType, index) =>{
          if(productType.id == product.productTypeId){
            if(id == 'ysOUKmrhHheCUJm20LHP'){
              this.amount=productType.wholesalePrice
              wholesale = productType.wholesalePrice
              amount = wholesale
            }else{
              this.amount=productType.retailPrice
              retail = productType.retailPrice
              amount = retail
            }
            //console.log(productType)
          }
      })
      }
      //console.log(product)
      this.saleDetail.controls[index].patchValue({"price":amount})
      this.saleDetail.controls[index].patchValue({"amount":amount})
    //}  
    //console.log("hola")
  }

  
  clear(): void {
    this.formSale.get('saleTypeId').setValue(null);
    this.formSale.get('totalCost').setValue(null);
    const stock = this.formSale.get('saleDetails') as FormArray;
    stock.controls.forEach(stock => stock.patchValue({ productId: null, requestedQuantity: null, price: null, amount: null})); 
  }

  restaTotal(index){
    this.saleDetail.controls[index].patchValue({"price":0})
    this.saleDetail.controls[index].patchValue({"amount":0})
  }

  async expandir(sale: any){
    this.expandedElement = sale
    this.local_data = sale
    //console.log("Sale:",sale)
    if(this.local_data.id != null){
      await this.fb.getSaleDetail(this.local_data.id).subscribe((saleDetail: SaleDetail[])=>{
        //console.log("p",saleDetail)
        this.saleDetailData= saleDetail;
        //console.log("saleData:",this.saleDetailData)
        for(let i=0; i< saleDetail.length; i++){
          //console.log("saleData(i):",this.saleDetailData[i]) 
        this.product.forEach(product =>{
          if(product.id == saleDetail[i].productId){
            saleDetail[i].productDescription = product.description
          }
        })
        this.productType.forEach(productType =>{
          if(productType.id == this.product[i].productTypeId){
            saleDetail[i].productTypeDescription = productType.description
          }
        })
        }
        //console.log("saleData",this.saleDetailData)
    });
    }
  }

    
  async ngOnInit() {

    this.formSale.valueChanges.subscribe((datas: any) => {
      var total = 0;
      var total2 = 0;
      let productG;
      //console.log(datas.totalCost)
      datas.saleDetails.forEach((data, index) => {
      if(data.isCourtesy== true){
       // const sub = data.requestedQuantity * data.price;
       //console.log("total antes de resta", datas.totalCost)
        total2 = datas.totalCost - data.amount;
        //console.log("importe", data.amount)
        //console.log("resta", total)
        this.formSale.get('totalCost').patchValue(total2, { emitEvent: false });
      }else{
        const sub = data.requestedQuantity * data.price;
        total = total + sub;
        //console.log("total normal",total)
        this.saleDetail.controls[index].get('amount').patchValue(sub, { emitEvent: false });
        this.formSale.get('totalCost').patchValue(total, { emitEvent: false });
      }
     });
    });


    

    //Form Sale
    //llamada de la BD de ventas
    this.fb.getSale().subscribe((sale: any)=>{     
      
      this.sale=sale  
      this.dataSource = new MatTableDataSource < Sale > (this.sale);
      this.dataSource.paginator =this.paginator;
      this.dataSource.sort = this.sort;
      

      this.datePipe = new DatePipe('en');
      this.dataSource.filterPredicate = (data, filter) =>{
        if (this.StartDate && this.EndDate) {
          //let date = data.saleDate.toDate();
          return data.saleDate.toDate() >= this.StartDate && data.saleDate.toDate() <= this.EndDate;
        }
        return true;
      }
    
    
      //llamada de la BD de usuarios para obtener el nombre y apellido mediante la UID.
      this.fb.getUsers().subscribe((user: any)=>{
        this.user=user
        let userName
        let userLastName
        this.sale.forEach((sale, index) => {
            this.user.forEach(user => {
                if(sale.userId == user.uid) {
                    userName = user.name
                    userLastName = user.paternalLastName
                }
            });
        this.sale[index].userName = userName
        this.sale[index].userLastName = userLastName
        })
        });
  
      //llamada de la BD de tipos de ventas para obtener la descripcion mediante la ID.
      this.fb.getSaleTypes().subscribe((saleType: any)=>{
        this.saleType=saleType
        let saleTypeDescription
        this.sale.forEach((sale, index) => {
            this.saleType.forEach(saleType => {
                if(sale.saleTypeId == saleType.id) {
                    saleTypeDescription = saleType.description
                }
            });
        this.sale[index].saleTypeDescription = saleTypeDescription
        })
      });

      //llamada de la BD de la coleccion de detalles de venta mediante la BD.
      this.fb.getSaleDetail(sale.id).subscribe((saleDetails: any)=>{
        this.saleDetails=saleDetails
      })

      //llamada de la BD de pSroductos para obtener la descripcion mediante la ID.
      this.fb.getProducts().subscribe((product: any)=>{
        this.product=product
        this.fb.getTypeOfProduct().subscribe((productType: any)=>{
            console.log(productType)
            this.productType=productType

            let typeDescription
            this.product.forEach((products, index) => {
                this.productType.forEach(productType => {
                    if(products.productTypeId == productType.id) {
                        typeDescription = productType.description
                    }
                });
                this.product[index].productTypeDescription = typeDescription
            })
          });
      });  
    });     
  }

  get saleDetail() : FormArray {
    return this.formSale.get("saleDetails") as FormArray
  }

  newSaleDetail(): FormGroup {
    return this.fs.group({
      id: [null],
      saleId: [null],
      productId: [null, Validators.required],
      requestedQuantity: ["", [Validators.required, Validators.pattern('^[0-9]+$')]],
      price: [""],
      amount: [""],
      isCourtesy: [""],
      status: [true],
    }
    )
  //this.formSale.get(['saleDetails'])
  } 
  //?? Crea otro detalle de req en la alta 
  addSaleDetail(): void {
    //this.sumaTotal()
    this.saleDetail.push(this.newSaleDetail());    
  }
  //?? Remueve el detalle de la req en la alta
  removeSaleDetail(rowIndex: number): void {
  this.restaTotal(rowIndex)  
  console.log(this.saleDetail.controls[rowIndex].valid)
  if(!this.saleDetail.controls[rowIndex].valid){
    this.saleDetail.removeAt(rowIndex);
    console.log("borre")
  }else{
  // this.local_data.address.splice(rowIndex,1)
  // console.log(this.formCustomer.get(['address', 0]).value)
  this.saleDetail.controls[rowIndex].patchValue({"status":"false"})
  //this.address.removeAt(rowIndex);
  }
  }

  onSubmit() {
    console.log(this.formSale.value);
  }  

//Actualiza la cantidad de productos
  updateQuantity(): void {
    let data = this.formSale.value;
    //Variable de control en caso de que la cantidad solicitada no este disponible.
    let valid1 = true;

    for(let i = 0; i < this.saleDetail.length;i++){
      this.product.forEach(product =>{
        //compara la id del los productos y la variable de control sea siempre true;
        //en caso de ser false,dejara de buscar.
        //en este ciclo buscador no hay tanto problema, ya que hay otro ciclo antes en save() que 
        //valida si las cantidades solicitadas esten disponibles en  la tabla productos.
        if(product.id == this.saleDetail.controls[i].get('productId').value && valid1 == true){
          //obtiene la cantidad de la tabla productos y resta la cantidad solicitada de ventas.
          let cantidadSobrante = product.quantity - this.saleDetail.controls[i].get('requestedQuantity').value
          //compara que sea mayor u igual a 0, en caso de que al restar la cantidad solicitada quede en 0 la cantidad disponible en productos.
          if(cantidadSobrante >= 0){
            //asigna la resta de la cantidad sobrante a data.quantity
            data.quantity = cantidadSobrante
            //asigna a id, la id del producto actual del array en saleDetail
            let id = this.saleDetail.controls[i].get('productId').value
            //mantiene en true la variable de control.
            valid1 = true
            //llama a la funcion del servicio para actualizar la cantidad en productos.
            if(this.saleDetail.controls[i].get('isCourtesy').value != true){
            this.fb.updateProduct(id, data).then((custom)=>{
            })
            }
          } 
        }
      })
    }  

  }


  save(): void {
    let data = this.formSale.value;
    data.userId = this.id
    console.log(this.formSale.valid)
    //primer ciclo que valida si hay stock disponible de un producto en especifico.
    //Variable de control en true.
    let valid = true
    for(let i = 0; i < this.saleDetail.length;i++){
      //console.log(this.saleDetail.controls[i].get('productId').value)
      //let id = this.saleDetail.controls[i].get('productId').value
      this.product.forEach(product =>{
        if(product.id == this.saleDetail.controls[i].get('productId').value && valid == true){
          //console.log(i, product.quantity)
          //if(this.saleDetail.controls[i].get('isCourtesy').value == false){
            console.log("cortesia",this.saleDetail.controls[i].get('isCourtesy').value)
            let cantidadSobrante = product.quantity - this.saleDetail.controls[i].get('requestedQuantity').value
            if(cantidadSobrante >= 0 ){
              valid = true            
              console.log(i,cantidadSobrante)
            }
          //}
        else{
            //en caso de que algun producto de la venta no tenga stock disponible en productos la variable de control cambia a false,
            // y termina la condicional del ciclo.
            valid = false            
            console.log("falta cantidad en producto.")
        }
        }
      })
    }

      if (this.formSale.valid) {
        //Aquí va la inserción en la base de datos
        //antes de crear la venta verificar que la variable de control sea true, en caso de que todos los productos seleccioandos de la venta tengan stock disponible
        // en productos, la variable de control quedara en true, permitiendo que pase la condicional y se guarde la venta, en caso de que un producto no tenga stock, no
        // hara la venta y arrojara un mensaje indicando que falta stock del producto.
        if(valid == true){
          this.updateQuantity()
          this.fb.addVentas(data).then((custom)=>{
          this.toastr.success("Venta creada exitosamente");
          //this.closeDialog();
          this.clear();
          })
        }else{
          this.toastr.error("No hay en stock para satisfacer la cantidad.");
        }
      } else {
        this.toastr.error("Favor de llenar campos faltantes");
      }
  } 

  /** Guarda registro de dirección de un cliente */
  saveSaleDetail(): void {
  let data = this.formSaleDetail.value;
  console.log(data)
  if (this.formSaleDetail.valid) {
    // Aquí va la inserción en la base de datos
      this.fb.addSale(data).then((sale: any)=>{
          console.log(sale)
       });
  } else {
    //this.toastr.error("Favor de llenar campos faltantes");
  }
}  

  doAction(): void {
    //this.dialogRef.close({ event: this.action, data: this.local_data });
    //this.local_data.status = false;
/*     this.fb.deleteCustomer(this.local_data.id, this.local_data).subscribe(res =>{
    this.toastr.success('Cliente eliminado correctamente')
  })   */
  }


  closeDialog(): void {
    //this.dialogRef.close({ event: 'Cancelar' });
  }

  ngAfterViewInit(): void {        
  }

openDialog(action: string, obj: any): void {
  obj.action = action;
  const dialogRef = this.dialog.open(SalesComponent, {
      data: obj
  });
  dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Nueva Venta') {
          this.addRowData(result.data);
      } else if (result.event === 'Actualizar') {
          this.updateRowData(result.data);
      } else if (result.event === 'Eliminar') {
          this.deleteRowData(result.data);
      }
  }); 
}

    // tslint:disable-next-line - Disables all
    addRowData(row_obj: Sale): void {

  }

    // tslint:disable-next-line - Disables all
    updateRowData(row_obj: Sale): boolean | any {
/*       this.dataSource.data = this.dataSource.data.filter((value: any) => {
          if (value.id === row_obj.id) {
              value.description = row_obj.description;
              value.retailPrice = row_obj.retailPrice;
              value.wholesalePrice = row_obj.wholesalePrice;
              value.status = row_obj.status;
          }
          return true;
      }); */
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Sale): boolean | any {
/*       this.dataSource.data = this.dataSource.data.filter((value: any) => {
          return value.id !== row_obj.id;
      });
  }
 */
}
}