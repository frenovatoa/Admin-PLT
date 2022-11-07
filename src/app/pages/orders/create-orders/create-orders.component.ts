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

@Component({
  selector: 'app-create-orders',
  templateUrl: './create-orders.component.html',
  styleUrls: ['./create-orders.component.scss']
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
  public saleDetailData: SaleDetail[];
  
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['#', 'solDate', 'deliveryDate', 'customer', 'address', 'note', 'total', 'saleType', 'status', 'action'];


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
      totalCost: [null],
      status: [true, Validators.required],
      orderDetails: this.fs.array([])
     });
     this.addOrderDetail();
  }

  applyFilter() {
    this.dataSource.filter = ''+Math.random();
  }

  currentDate = new Date();

  

  async ngOnInit() {
    this.ordService.getOrders().subscribe(async (order: any)=>{     

      await order.forEach( async (order)=>{
      await this.ordService.getCustumer(order.customerId).subscribe(async (customer: any)=>{ 
        order.customer=customer;
        await this.ordService.getAddress(order.customerId, order.addressId).subscribe((address: any)=>{ 
        order.address = address;
        });
      });
    })
    console.log(this.order)
    this.order=order  
    this.dataSource = new MatTableDataSource < Order > (this.order);
    this.dataSource.paginator =this.paginator;
    this.dataSource.sort = this.sort;
    

    this.datePipe = new DatePipe('en');
    this.dataSource.filterPredicate = (data, filter) =>{
      if (this.StartDate && this.EndDate) {
        //let date = data.saleDate.toDate();
        return data.deliveryDate.toDate() >= this.StartDate && data.deliveryDate.toDate() <= this.EndDate;
      }
      return true;
    }
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

  getAddress(addres:Address[]){
    this.address = addres;
  }

  get orderDetail() : FormArray {
    return this.formOrder.get("orderDetails") as FormArray
  }

  newOrderDetail(): FormGroup {
    return this.fs.group({
      id: [null],
      orderId: [null],
      productId: [null, Validators.required],
      requestedQuantity: [null,[Validators.required, Validators.pattern('^[0-9]+?$')] ],
      amount: [null],
      isCourtesy: [null],
      status: [true],
    })
  } 
  //?? Crea otro detalle de req en la alta 
  addOrderDetail(): void {
    this.orderDetail.push(this.newOrderDetail());
  }
  //?? Remueve el detalle de la req en la alta
  removeOrderDetail(rowIndex: number): void {
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
/*       this.dataSource.data = this.dataSource.data.filter((value: any) => {
          return value.id !== row_obj.id;
      });
  }
 */
}
}