import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit, Type, PipeTransform} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TilePosition } from '@angular/material/grid-list/tile-coordinator';
import {filter, map, timestamp} from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { query } from 'chartist';
import { collection } from 'firebase/firestore';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { SaleService } from 'src/app/shared/services/sale.service';
//import { SaleDetailService } from 'src/app/shared/services/saleDetail.service';
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
import { Customer } from 'src/app/shared/interfaces/customer';
import { CustomerService } from '../../../shared/services/customer.service';
import { Address } from '../../../shared/interfaces/address';
import { OrdersService } from '../../../shared/services/orders.service';
import { Order } from '../../../shared/interfaces/order';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OrderDetail } from 'src/app/shared/interfaces/order.detail';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-orders',
  templateUrl: './create-orders.component.html',
  styleUrls: ['./create-orders.component.scss'],
  animations: [
    trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
],
})
export class CreateOrdersComponent implements OnInit {


  //Arreglos que se ocupan en la tabla.
  public order: Order[]=[];
  public user: User[]=[];
  public saleDetails: SaleDetail[]=[];
  public product: Product[]=[];
  public productType: ProductType[]=[];
  public saleType: SaleType[]=[];
  public customers : Customer []=[];
  public dataSource: MatTableDataSource<Order>;
  public address: Address[]=[{street:'No hay registros'}];
  //Form de ventas.
  public formOrder: FormGroup;
  public formSaleDetail: FormGroup;
  public saleDetailForm: FormArray;
  public orderDetailData: OrderDetail[];
  public updateFormDetail: FormGroup;
  public statusCorrecto: boolean = false;
  public valid1:boolean=false;
  //Form de filtro de rango de fechas.
  filterForm = new FormGroup({
    StartDate: new FormControl(),
    EndDate: new FormControl(),
  });      
  //Obtencion de StartDate y EndDate de filterForm
  get StartDate() { return this.filterForm.get('StartDate').value; }
  get EndDate() { return this.filterForm.get('EndDate').value; }

  local_data: any;
  action: string;   
  searchText: any;
  public notShow = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['#', 'reqDate', 'delDate', 'customer', 'address', 'totalCost', 'saleType', 'status', 'actions'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  public amount_1;
  public amount
  public userLogged:User;
  public userDone:User;
public userOrderDetail:User;

  constructor(
    private fs: FormBuilder,
     public dialog: MatDialog, 
     public datePipe: DatePipe, 
     public fb: SaleService, 
     public _MatPaginatorInt1: MatPaginatorIntl,
     public ordService:OrdersService,
     //public dialogRef: MatDialogRef<SalesComponent>,
     public custService: CustomerService,
     public authService : AuthService,
     public toastr :ToastrService,
     public fa: UserService,
     private router: Router,
     @Optional() @Inject(MAT_DIALOG_DATA) public data: Sale) { 
      this.userLogged = this.authService.user;
     this.local_data = { ...data };
     this.action = this.local_data.action;
     this.filterForm = this.fs.group({
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
     })

     this.formOrder = this.fs.group ({
      id: [null],
      addressId: [null],
      requestDate: [new Date()],
      customerId: [null, Validators.required],
      deliveryDate: [null, Validators.required],
      orderNotes :[null, Validators.required],
      saleTypeId:[null, Validators.required],
      userId: [null],
      totalCost: [0],
      status: ['pendiente', Validators.required],
      deliveryCost:[0, Validators.required],
      orderDetails: this.fs.array([])
     });
     this.addOrderDetail();
     this.updateFormDetail = this.fs.group ({
      id: [null],
      addressId: [null],
      requestDate: [new Date()],
      customerId: [null, Validators.required],
      deliveryDate: [null, Validators.required],
      orderNotes :[null, Validators.required],
      saleTypeId:[null, Validators.required],
      userId: [null],
      totalCost: [0],
      status: ['pendiente', Validators.required],
      deliveryCost:[0, Validators.required],
      orderDetailsUp: this.fs.array([])
     });

     this.updateFormDetail.reset();
  }

  applyFilter() {
    this.dataSource.filter = ''+Math.random();
  }

  currentDate = new Date();

  async expandir(order: any){
    this.userOrderDetail =null;
    console.log(order) 
    if(order.status == 'entregado' || order.status == 'cancelado'){
      this.statusCorrecto = false;
    }else{
      this.statusCorrecto= true;
    }
    this.fa.getUser().subscribe((user: any)=>{
      console.log(user)
      user.forEach(user => {
       // console.log(order.userId)
          if(order.userId == user.uid){
            console.log(user)
            this.userOrderDetail = user;  
            console.log(this.userOrderDetail)  
          }
      });
  });  
    
    this.updateOrderDetail.clear();
  // console.log(order)
   this.updateFormDetail.patchValue(order)
   this.updateFormDetail.get('totalCost').setValue(0)
    this.expandedElement = order

    //this.local_data = orde
    //console.log("Sale:",sale)
   
      await this.ordService.getOrderDetail(order.id).subscribe((orderDetail: OrderDetail[])=>{

      //  console.log("p",orderDetail)
        this.orderDetailData= orderDetail;
        //console.log("saleData:",this.saleDetailData)
        for(let i=0; i< orderDetail.length; i++){
          //console.log("saleData(i):",this.saleDetailData[i]) 
          this.updateAddOrderDetail()
        this.product.forEach(product =>{
          if(product.id == orderDetail[i].productId){
            orderDetail[i].productDescription = product.description
            this.productType.forEach(productType =>{
              if(productType.id == product.productTypeId){
              //  console.log('tipo de producto', productType.description)
                orderDetail[i].productTypeDescription = productType.description
                if(this.updateFormDetail.get('saleTypeId').value == 'ysOUKmrhHheCUJm20LHP'){
              //    console.log("entro en menudeo",productType.id)
                  orderDetail[i].price=productType.wholesalePrice
                }else{
                //  console.log("entro en menudeo",productType.id)
                  orderDetail[i].price=productType.retailPrice
                }
              }
            })
          }
        })
       
      }
      this.updateOrderDetail.patchValue(this.orderDetailData)
    });
  
  }

  async ngOnInit() {
    this.fa.getUser().subscribe((user: any)=>{
      user.forEach(user => {
          if(user.email == this.userLogged.email){
            this.userDone = user;
            if(user.userTypeId=='oqHSeK8FRTbWtObf7FdD'){
              this.router.navigate(['/dashboard'])
            }
              this.userLogged = user;
            
          }
      });
  });  

    this.formOrder.valueChanges.subscribe((datas: any) => {
      var total = 0;
      var total2 = 0;
      let productG;
     // console.log(datas.totalCost)
      datas.orderDetails.forEach((data, index) => {
      if(data.isCourtesy== true){
       // const sub = data.requestedQuantity * data.price;
     //  console.log("total antes de resta", datas.totalCost)
        total2 = datas.totalCost - data.amount;
      //  console.log("importe", data.amount)
       // console.log("resta", total)
       
        this.formOrder.get('totalCost').patchValue(total2, { emitEvent: false });
      }else{

        const sub = data.requestedQuantity * data.price;
        total = total + sub;
      //  console.log("total normal",total)
        this.orderDetail.controls[index].get('amount').patchValue(sub, { emitEvent: false });
      }
      });
      total = total + datas.deliveryCost;
      this.formOrder.get('totalCost').patchValue(total, { emitEvent: false });
    });
    this.updateFormDetail.valueChanges.subscribe((datas: any) => {
      var total = 0;
      var total2 = 0;
      let productG;
     // this.updateFormDetail.get('totalCost').patchValue(0, { emitEvent: false });
     datas.orderDetailsUp.forEach((data, index) => {
      if(data.isCourtesy== true){
       // const sub = data.requestedQuantity * data.price;
      // console.log("total antes de resta", datas.totalCost)
        total2 = datas.totalCost - data.amount;
       // console.log("importe", data.amount)
       // console.log("resta", total)
      
        this.updateFormDetail.get('totalCost').patchValue(total2, { emitEvent: false });
      }else{
        const sub = data.requestedQuantity * data.price;
        total = total + sub;
      //  console.log("total normal",total)
        this.updateOrderDetail.controls[index].get('amount').patchValue(sub, { emitEvent: false });
       
      }
      });
      total = total + datas.deliveryCost;
      this.updateFormDetail.get('totalCost').patchValue(total, { emitEvent: false });

    });

    setTimeout(() => {
     this.notShow = false;
     // console.log("Delayed for 1 second.");
    }, 2000)

    this.ordService.getOrders().subscribe(async (order: any)=>{     
      this.order=order  
      await this.order.forEach( async (order, index)=>{
      await this.ordService.getCustumer(order.customerId).subscribe(async (customer: any)=>{ 
        this.order[index].customer=customer;
        await this.ordService.getAddress(order.customerId, order.addressId).subscribe((address: any)=>{ 
          this.order[index].address = address;
          this.dataSource = new MatTableDataSource < Order > (this.order);
      this.dataSource.paginator =this.paginator;
      this.dataSource.sort = this.sort;
      //console.log(this.order)
      this.datePipe = new DatePipe('en');
    this.dataSource.filterPredicate = (data, filter) =>{
      if (this.StartDate && this.EndDate) {
        return data.deliveryDate.toDate() >= this.StartDate && data.deliveryDate.toDate() <= this.EndDate;
      }
      return true;
    }
        });
      });
    })

    this.fb.getSaleTypes().subscribe((saleType: any)=>{
      this.saleType=saleType
      let saleTypeDescription
      this.order.forEach((order, index) => {
          this.saleType.forEach(saleType => {
              if(order.saleTypeId == saleType.id) {
                  saleTypeDescription = saleType.description
              }
          });
      this.order[index].orderTypeDescription = saleTypeDescription
      })
    });
    
    }); 
    
    

    this.custService.getCustomer().subscribe((custumer: any)=>{
      this.customers=custumer
      this.customers.forEach((cust)=>{
        this.custService.getAddress(cust.id).subscribe((address: Address[])=>{
          cust.address = address;
      });
      })
      
     // console.log(this.customers)
  });  
  


       
  
        //llamada de la BD de la coleccion de tipo de productos mediante la BD.
        this.fb.getTypeOfProduct().subscribe((productType: any)=>{
          this.productType=productType
        })
  
        //llamada de la BD de productos para obtener la descripcion mediante la ID.
        this.fb.getProducts().subscribe((product: any)=>{
          this.product=product
          this.fb.getTypeOfProduct().subscribe((productType: any)=>{
             // console.log(productType)
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
  }

  changeTypes(e){
   // console.log(e)
  }
  public amount1
  precios(){
    if(this.orderDetail.controls[0].get('productId').value == null){
    //  console.log("no haga nada")
    }else{
      for(let i=0;i<this.orderDetail.length;i++){
        let saleType = this.formOrder.get('saleTypeId').value
        if(saleType == 'yhl8Slx8goioNHV0OAGo'){
          //let amount = 15
          //this.saleDetail.controls[i].get('price').setValue(amount)
          //this.saleDetail.controls[i].get('amount').setValue(amount)
          for(let j=0;j<this.product.length;j++){
            let productId = this.product[j].id
            //console.log("product",productId)
            if(this.orderDetail.controls[i].get('productId').value == productId){
            //  console.log("product1",productId)
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
            this.orderDetail.controls[i].patchValue({"price":amount_1})
            this.orderDetail.controls[i].patchValue({"amount":amount_1})  
            }
          }
        }else{
          //let amount = 10
          //this.saleDetail.controls[i].get('price').setValue(amount)
          //this.saleDetail.controls[i].get('amount').setValue(amount)
          for(let j=0;j<this.product.length;j++){
            let productId = this.product[j].id
           // console.log("product",productId)
            if(this.orderDetail.controls[i].get('productId').value == productId){
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
            this.orderDetail.controls[i].patchValue({"price":amount_1})
            this.orderDetail.controls[i].patchValue({"amount":amount_1})  
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
      let id = this.formOrder.get('saleTypeId').value
      //console.log(product)
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
      this.orderDetail.controls[index].patchValue({"price":amount})
      this.orderDetail.controls[index].patchValue({"amount":amount})
    //}  
    //console.log("hola")
  }


  precios2(){
    if(this.updateOrderDetail.controls[0].get('productId').value == null){
    //  console.log("no haga nada")
    }else{
      for(let i=0;i<this.orderDetail.length;i++){
        let saleType = this.updateFormDetail.get('saleTypeId').value
        if(saleType == 'yhl8Slx8goioNHV0OAGo'){
          //let amount = 15
          //this.saleDetail.controls[i].get('price').setValue(amount)
          //this.saleDetail.controls[i].get('amount').setValue(amount)
          for(let j=0;j<this.product.length;j++){
            let productId = this.product[j].id
            //console.log("product",productId)
            if(this.updateOrderDetail.controls[i].get('productId').value == productId){
             // console.log("product1",productId)
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
            this.updateOrderDetail.controls[i].patchValue({"price":amount_1})
            this.updateOrderDetail.controls[i].patchValue({"amount":amount_1})  
            }
          }
        }else{
          //let amount = 10
          //this.saleDetail.controls[i].get('price').setValue(amount)
          //this.saleDetail.controls[i].get('amount').setValue(amount)
          for(let j=0;j<this.product.length;j++){
            let productId = this.product[j].id
          //  console.log("product",productId)
            if(this.updateOrderDetail.controls[i].get('productId').value == productId){
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
            this.updateOrderDetail.controls[i].patchValue({"price":amount_1})
            this.updateOrderDetail.controls[i].patchValue({"amount":amount_1})  
            }
          }
        }

      }
    }
  }
  obtenerPrecios2(index : number, product ?: Product)
  {  
    //console.log("valor",this.saleDetail.controls[0].get('productId').value)
    //if(this.saleDetail.controls[0].get('productId').value != null){
      let retail
      let wholesale
      let amount
      let id = this.updateFormDetail.get('saleTypeId').value
     // console.log(product)
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
      this.updateOrderDetail.controls[index].patchValue({"price":amount})
      this.updateOrderDetail.controls[index].patchValue({"amount":amount})
    //}  
    //console.log("hola")
  }

  getAddress(addres:Address[]){
    this.address = addres;
  }

  get orderDetail() : FormArray {
    return this.formOrder.get("orderDetails") as FormArray
  }

  get updateOrderDetail(){
    return this.updateFormDetail.get("orderDetailsUp") as FormArray
  }
  clear(): void {
/*     this.formOrder.reset();
    this.addOrderDetail() */
    this.formOrder.get('saleTypeId').setValue(null);
    this.formOrder.get('customerId').setValue(null);
    this.formOrder.get('addressId').setValue(null);
    this.formOrder.get('deliveryDate').setValue(null);
    this.formOrder.get('orderNotes').setValue(null);
    this.formOrder.get('deliveryCost').setValue(null);
    this.formOrder.get('totalCost').setValue(null);
    this.orderDetail.clear();
    this.addOrderDetail();
  }

  nullAmount(e, i:number){
  }

  updateOrder(){
    this.updateFormDetail = this.fs.group ({
      id: [null],
      addressId: [null],
      requestDate: [new Date()],
      customerId: [null, Validators.required],
      deliveryDate: [null, Validators.required],
      orderNotes :[null, Validators.required],
      saleTypeId:[null, Validators.required],
      userId: [null],
      totalCost: [0],
      status: ['pendiente', Validators.required],
      deliveryCost:[0, Validators.required],
      orderDetails: this.fs.array([])
     });
  }

  newOrderDetail(): FormGroup {
    return this.fs.group({
      id: [null],
      saleId: [null],
      productId: [null, Validators.required],
      requestedQuantity: [1, Validators.required],
      price: [""],
      amount: [""],
      isCourtesy: [""],
      status: [true],
    })
  } 

  updateOrderDetailForm(): FormGroup {
    return this.fs.group({
      id: [null],
      saleId: [null],
      productId: [null, Validators.required],
      requestedQuantity: [1, Validators.required],
      price: [""],
      amount: [""],
      isCourtesy: [""],
      status: [true],
    })
  } 

 //?? Crea otro detalle de req en la alta 
 updateAddOrderDetail(): void {
  this.updateOrderDetail.push(this.updateOrderDetailForm());
}
//?? Remueve el detalle de la req en la alta
updateRemoveOrderDetail(rowIndex: number): void {
this.restaTotalUp(rowIndex);
this.updateOrderDetail.controls[rowIndex].patchValue({"status":false});

}

restaTotalUp(index){
  this.updateOrderDetail.controls[index].patchValue({"price":0})
  this.updateOrderDetail.controls[index].patchValue({"amount":0})
}

  //?? Crea otro detalle de req en la alta 
  addOrderDetail(): void {
    this.orderDetail.push(this.newOrderDetail());
  }
  //?? Remueve el detalle de la req en la alta
  removeOrderDetail(rowIndex: number): void {
    this.restaTotal(rowIndex)  
 
    this.orderDetail.removeAt(rowIndex);
   
  }
  restaTotal(index){
    this.orderDetail.controls[index].patchValue({"price":0})
    this.orderDetail.controls[index].patchValue({"amount":0})
  }
  onSubmit() {
   
  }  

  save(): void {
    let data = this.formOrder.value;
    data.userId= this.userDone.uid;
    console.log(data)
    if (this.formOrder.valid) {
      //Aquí va la inserción en la base de datos
     this.ordService.addOrder(data).then((custom)=>{
     //console.log(custom)
     this.toastr.success("Pedido Creado");
     //this.formSaleDetail.reset();
     this.clear()
     //formDirective.resetForm();
      })
    } else {
      this.toastr.error("Favor de llenar campos faltantes");
    }
  } 

  updateStatus(): void {
    let data = this.formOrder.value;
   // console.log(this.formOrder.valid)
    if (this.formOrder.valid) {
      //Aquí va la inserción en la base de datos
      this.ordService.updateStatus(data.id, data).then((custom)=>{
    // console.log(custom)
     this.toastr.success("Pedido creado");
     this.formSaleDetail.reset();
     
      })
    } else {
      this.toastr.error("Favor de llenar campos faltantes");
    }
  } 


  update(): void {
    let data = this.updateFormDetail.value;
  //  console.log(data)
    if (this.updateFormDetail.valid) {
      //Aquí va la inserción en la base de datos
     this.ordService.updateOrder(data.id, data).then((custom)=>{
     //console.log(custom)
     this.toastr.success("Pedido actualizado");
     this.expandedElement = undefined
     //this.formSaleDetail.reset();
     //this.clear()
     //formDirective.resetForm();
     })
   } else {
      this.toastr.error("Favor de llenar campos faltantes");
    }
  } 


  /** Guarda registro de dirección de un cliente */
  saveSaleDetail(): void {
  let data = this.formSaleDetail.value;
  //console.log(data)
  if (this.formSaleDetail.valid) {
    // Aquí va la inserción en la base de datos
      this.fb.addSale(data).then((sale: any)=>{
          //console.log(sale)
          this.toastr.success("Pedido creado");
         // this.formSaleDetail.reset();
       });
  } else {
    this.toastr.error("Ocurrio un Error");
  }
}  

  doAction(): void {
    //this.dialogRef.close({ event: this.action, data: this.local_data });
    //this.local_data.status = false;
/*     this.fb.deleteCustomer(this.local_data.id, this.local_data).subscribe(res =>{
    this.toastr.success('Cliente eliminado correctamente')
  })   */
  }

  delete(order:Order){
    const data = {
      message: 'Eliminar pedido',
      name: 'El pedido: ' + order.id,
      btnName:'Si',
      btnName2:'No'
    }
    this.dialog.open(ConfirmDialogComponent, {
      data: data,
      width: '40%'
    }).afterClosed().subscribe((type: number) => {
      if (type == 1 || type == 2) {
        if (type == 1) {
          order.status = "false";
        } else if (type == 2) {
          this.toastr.warning('Cancelado');
        this.ngOnInit();
        }
        this.ordService.updateStatus(order.id, order).then((custom)=>{
          //console.log(custom)
          this.toastr.success("Pedido Actualizado");
          this.formSaleDetail.reset();
           })
      } else {
        this.toastr.warning('Cancelado');
        this.ngOnInit();
      }
    });

  }


deliverCancel(order: Order) {
//console.log(order)
    const data = {
      message: 'Estatus del pedido',
      name: 'La orden de compra: ' + order.id,
      btnName:'Entregado',
      btnName2:'Cancelado'
    }
    this.dialog.open(ConfirmDialogComponent, {
      data: data,
      width: '40%'
    }).afterClosed().subscribe((type: number) => {
      if (type == 1 || type == 2) {
        if (type == 1) {
          //order.status = "entregado";
          this.saveSale(order)     
        } else if (type == 2) {
          const data = {
            message: '¿Estas seguro que deseas cancelar el pedido?',
            name: 'El pedido: ' + order.id,
            btnName:'Si',
            btnName2:'No'
          }
          this.dialog.open(ConfirmDialogComponent, {
            data: data,
            width: '40%'
          }).afterClosed().subscribe((type: number) => {
            if (type == 1 || type == 2) {
              if (type == 1) {
                order.status = "cancelado";
              } else if (type == 2) {
                this.toastr.warning('Cancelado');
              this.ngOnInit();
              }
              this.ordService.updateStatus(order.id, order).then((custom)=>{
                //console.log(custom)
                this.toastr.success("Pedido Actualizado");
                this.formSaleDetail.reset();
                 })
            } else {
              this.toastr.warning('Cancelado');
              this.ngOnInit();
            }
          });
        }     
      } else {
        this.toastr.warning('Cancelado');
        this.ngOnInit();

      }
    });
  }

async saveSale(order:Order){
 // this.updateQuantity(order)
 await this.ordService.getOrderDetail(order.id).subscribe((orderDetail: OrderDetail[])=>{
  //console.log("p",orderDetail)
  order.orderDetails= orderDetail;
 /// console.log("order wt Details", order)
  this.updateQuantity(order)
});

}
async updateQuantity(order:Order) {
  let data = order;
  let upProduct : Product [] = [];
  //Variable de control en caso de que la cantidad solicitada no este disponible.
  
//console.log("Asignacion", order)
  for(let i = 0; i < order.orderDetails.length;i++){

    this.product.forEach(product =>{
      if(product.id == order.orderDetails[i].productId){
       // console.log('Producto', product.description)
      //  console.log('Cantidad Actual', product.quantity)
        let cantidadSobrante = product.quantity - order.orderDetails[i].requestedQuantity
       // console.log('Cantidad Restante', cantidadSobrante)
        if(cantidadSobrante <= 0){
          this.toastr.error(`No hay cantidad suficiente de ${product.description} para satisfacer`);
          this.valid1= false;
        } else{
          this.valid1= true;         
          product.quantity = cantidadSobrante;
          upProduct.push(product)
        }
      }
    })
   // console.log(upProduct)
  }  
 // console.log(upProduct)
if(this.valid1 == true){
 // console.log('Actualiza')
upProduct.forEach(producto =>{
  this.fb.updateProduct(producto.id, producto).then((custom)=>{
  })
})
this.ordService.addVentas(order).then((custom)=>{
  this.toastr.success("Venta creada exitosamente");
  //this.closeDialog();
 })
 order.status = "entregado";
          
 this.ordService.updateStatus(order.id, order).then((custom)=>{
//console.log(custom)
this.toastr.success("Pedido Actualizado");
this.formSaleDetail.reset();
 })
}
}

}