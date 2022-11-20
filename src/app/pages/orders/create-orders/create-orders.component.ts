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

  public amount

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
     @Optional() @Inject(MAT_DIALOG_DATA) public data: Sale) { 
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
      orderDetails: this.fs.array([])
     });
     this.addOrderDetail();
  }

  applyFilter() {
    this.dataSource.filter = ''+Math.random();
  }

  currentDate = new Date();

  async expandir(sale: any){
    this.expandedElement = sale
    this.local_data = sale
    //console.log("Sale:",sale)
    if(this.local_data.id != null){
      await this.ordService.getOrderDetail(this.local_data.id).subscribe((orderDetail: OrderDetail[])=>{
        console.log("p",orderDetail)
        this.orderDetailData= orderDetail;
        //console.log("saleData:",this.saleDetailData)
        for(let i=0; i< orderDetail.length; i++){
          //console.log("saleData(i):",this.saleDetailData[i]) 
        this.product.forEach(product =>{
          if(product.id == orderDetail[i].productId){
            orderDetail[i].productDescription = product.description
          }
        })
        this.productType.forEach(productType =>{
          if(productType.id == this.product[i].productTypeId){
            orderDetail[i].productTypeDescription = productType.description
          }
        })
        }
        console.log("saleData",this.orderDetailData)
    });
    }
  }

  async ngOnInit() {

    this.orderDetail.valueChanges.subscribe((datas: Array<any>) => {
      var total = 0;
      datas.forEach((data, index) => {
        const sub = data.requestedQuantity * data.price;
        total = total + sub;
        this.orderDetail.controls[index].get('amount').patchValue(sub, { emitEvent: false });
      });
      this.formOrder.get('totalCost').patchValue(total);
    });

    setTimeout(() => {
     this.notShow = false;
      console.log("Delayed for 1 second.");
    }, 2000)

    this.ordService.getOrders().subscribe(async (order: any)=>{     
      this.order=order  
      this.dataSource = new MatTableDataSource < Order > (this.order);
      this.dataSource.paginator =this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.order)
      this.datePipe = new DatePipe('en');
    this.dataSource.filterPredicate = (data, filter) =>{
      if (this.StartDate && this.EndDate) {
        //let date = data.saleDate.toDate();
        return data.deliveryDate.toDate() >= this.StartDate && data.deliveryDate.toDate() <= this.EndDate;
      }
      return true;
    }
      await this.order.forEach( async (order, index)=>{
      await this.ordService.getCustumer(order.customerId).subscribe(async (customer: any)=>{ 
        this.order[index].customer=customer;
        await this.ordService.getAddress(order.customerId, order.addressId).subscribe((address: any)=>{ 
          this.order[index].address = address;
        });
      });
    })
    }); 
    
    

    this.custService.getCustomer().subscribe((custumer: any)=>{
      this.customers=custumer
      this.customers.forEach((cust)=>{
        this.custService.getAddress(cust.id).subscribe((address: Address[])=>{
          cust.address = address;
      });
      })
      
      console.log(this.customers)
  });  
  
  this.fb.getSaleTypes().subscribe((saleType: any)=>{
    this.saleType=saleType
    let saleTypeDescription
    this.order.forEach((sale, index) => {
        this.saleType.forEach(saleType => {
            if(sale.saleTypeId == saleType.id) {
                saleTypeDescription = saleType.description
            }
        });
    this.order[index].saleTypeDescription = saleTypeDescription
    })
  });

       
  
        //llamada de la BD de la coleccion de tipo de productos mediante la BD.
        this.fb.getTypeOfProduct().subscribe((productType: any)=>{
          this.productType=productType
        })
  
        //llamada de la BD de productos para obtener la descripcion mediante la ID.
        this.fb.getProducts().subscribe((product: any)=>{
          this.product=product
      });    
  }
  obtenerPrecios(index : number, product ?: Product)
  {  
    console.log(product)
    let retail
    let wholesale
    let amount
    let id = this.formOrder.get('saleTypeId').value
    if(product.productTypeId != undefined){

    this.productType.forEach((productType, index) =>{
        if(productType.id == product.productTypeId){
          if(id == 'yhl8Slx8goioNHV0OAGo'){
            this.amount=productType.retailPrice
            retail = productType.retailPrice
            amount = retail
          }else{
            this.amount=productType.wholesalePrice
            wholesale = productType.wholesalePrice
            amount = wholesale
          }
          console.log(productType)
        }
    })
    }
    console.log(product)
    this.orderDetail.controls[index].patchValue({"price":amount})
    this.orderDetail.controls[index].patchValue({"amount":amount})

  }
  getAddress(addres:Address[]){
    this.address = addres;
  }

  get orderDetail() : FormArray {
    return this.formOrder.get("orderDetails") as FormArray
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
  //?? Crea otro detalle de req en la alta 
  addOrderDetail(): void {
    this.orderDetail.push(this.newOrderDetail());
  }
  //?? Remueve el detalle de la req en la alta
  removeOrderDetail(rowIndex: number): void {
    this.restaTotal(rowIndex)  
  console.log(this.orderDetail.controls[rowIndex].valid)
  if(!this.orderDetail.controls[rowIndex].valid){
    this.orderDetail.removeAt(rowIndex);
    console.log("borre")
  }else{
  // this.local_data.address.splice(rowIndex,1)
  // console.log(this.formCustomer.get(['address', 0]).value)
  this.orderDetail.controls[rowIndex].patchValue({"status":"false"})
  //this.address.removeAt(rowIndex);
  }
  }
  restaTotal(index){
    
   // this.formOrder.get('totalCost').setValue(10);
    this.orderDetail.controls[index].patchValue({"price":0})
    this.orderDetail.controls[index].patchValue({"amount":0})
    // for(let i=0;i < this.orderDetail.length;i++){
    //   if(i == index){
    //     console.log(index)
    //     var resta = this.orderDetail.controls[index].get('amount').value
    //     console.log("resta",resta)
    //     var totalCost = this.formOrder.get('totalCost').value
    //     console.log("totalCost",totalCost)
    //     totalCost = totalCost - resta
    //     console.log("resultado",totalCost)
    //     //VALOR SE RESTA PERO NO SE ASIGNA
    //   }
    //}

  }
  onSubmit() {
    console.log(this.formOrder.value);
  }  

  save(): void {
    let data = this.formOrder.value;
    console.log(this.formOrder.valid)
    if (this.formOrder.valid) {
      //Aquí va la inserción en la base de datos
      this.ordService.addOrder(data).then((custom)=>{
     console.log(custom)
     this.toastr.success("");
     this.formSaleDetail.reset();
      })
    } else {
      this.toastr.error("Favor de llenar campos faltantes");
    }
  } 

  updateStatus(): void {
    let data = this.formOrder.value;
    console.log(this.formOrder.valid)
    if (this.formOrder.valid) {
      //Aquí va la inserción en la base de datos
      this.ordService.updateStatus(data.id, data).then((custom)=>{
     console.log(custom)
     this.toastr.success("Pedido creado");
     this.formSaleDetail.reset();
      })
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
          this.toastr.success("Pedido creado");
          this.formSaleDetail.reset();
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
  deliverCancel(order: Order) {

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
          order.status = "entregado";
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
                console.log(custom)
                this.toastr.success("Pedido Actualizado");
                this.formSaleDetail.reset();
                 })
            } else {
              this.toastr.warning('Cancelado');
              this.ngOnInit();
            }
          });
        }
        this.ordService.updateStatus(order.id, order).then((custom)=>{
          console.log(custom)
          this.toastr.success("Pedido Actualizado");
          this.formSaleDetail.reset();
           })
      } else {
        this.toastr.warning('Cancelado');
        this.ngOnInit();

      }
    });
  }

  closeDialog(): void {
    //this.dialogRef.close({ event: 'Cancelar' });
  }

  ngAfterViewInit(): void {        
  }

openDialog(action: string, obj: any): void {
  obj.action = action;
  const dialogRef = this.dialog.open(CreateOrdersComponent, {
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

}
}