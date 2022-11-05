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

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
  
})
export class SalesComponent implements OnInit, AfterViewInit {
  

  //Arreglos que se ocupan en la tabla.
  public sale: Sale[]=[];
  public user: User[]=[];
  public saleDetails: SaleDetail[]=[];
  public product: Product[]=[];
  public productType: ProductType[]=[];
  public saleType: SaleType[]=[];
  public 
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
  //Obtencion de StartDate y EndDate de filterForm
  get StartDate() { return this.filterForm.get('StartDate').value; }
  get EndDate() { return this.filterForm.get('EndDate').value; }

  local_data: any;
  action: string;   
  searchText: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = ['#', 'saleDate', 'orderId', 'saleTypeId', 'totalCost', 'userId', 'action'];
  private started: boolean = false;

  constructor(
    private fs: FormBuilder,
     public dialog: MatDialog, 
     public datePipe: DatePipe, 
     public fb: SaleService, 
     public _MatPaginatorInt1: MatPaginatorIntl,
     //public dialogRef: MatDialogRef<SalesComponent>,
     public authService : AuthService,
     public toastr :ToastrService,
     @Optional() @Inject(MAT_DIALOG_DATA) public data: Sale) { 
     this.local_data = { ...data };
     this.action = this.local_data.action;
     this.filterForm = this.fs.group({
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
     })
     this.formSale = this.fs.group ({
      id: [null],
      orderId: [null],
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

  calculateResultForm()
  {
    //this.formSaleDetail.get('amount').setValue(+this.formSaleDetail.value.requestedQuantity*(+this.formSaleDetail.value.saleDetailRetailPrice))
  }
  

  async ngOnInit() {
    //console.log(this.currentDate)
    if(this.local_data.id != null){
      await this.fb.getSaleDetail(this.local_data.id).subscribe((saleDetail: SaleDetail[])=>{
        this.saleDetailData= saleDetail;
        for(let i=1; i< saleDetail.length; i++){
          this.addSaleDetail();
        }
      this.saleDetail.patchValue(this.saleDetailData)
    });
    }

    this.calculateResultForm()

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

      //llamada de la BD de la coleccion de tipo de productos mediante la BD.
      this.fb.getTypeOfProduct().subscribe((productType: any)=>{
        this.productType=productType
      })

      //llamada de la BD de productos para obtener la descripcion mediante la ID.
      this.fb.getProducts().subscribe((product: any)=>{
        this.product=product
        let productDescription 
        let productTypeRetailPrice
        let productTypeWholesalePrice
        this.saleDetails.forEach((saleDetails, index) =>{
          this.product.forEach(product =>{
            if(saleDetails.productId == product.id){ 
              productDescription = product.description
              
              this.productType.forEach((productType, index) =>{
                this.product.forEach(product =>{
                  if(productType.id = product.productTypeId){
                    productTypeRetailPrice = productType.retailPrice
                    productTypeWholesalePrice = productType.wholesalePrice
                  }
                })
              })
            }
          });
        this.saleDetails[index].productDescription = productDescription  
        this.saleDetails[index].productRetailPrice = productTypeRetailPrice
        this.saleDetails[index].productWholesalePrice = productTypeWholesalePrice
        })
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
      requestedQuantity: [null,[Validators.required, Validators.pattern('^[0-9]+?$')] ],
      amount: [null],
      isCourtesy: [null],
      status: [true],
    })
  } 
  //?? Crea otro detalle de req en la alta 
  addSaleDetail(): void {
    this.saleDetail.push(this.newSaleDetail());
  }
  //?? Remueve el detalle de la req en la alta
  removeSaleDetail(rowIndex: number): void {
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

  save(): void {
    let data = this.formSale.value;
    console.log(this.formSale.valid)
    if (this.formSale.valid) {
      //Aquí va la inserción en la base de datos
      this.fb.addVentas(data).then((custom)=>{
      this.toastr.success("Venta creada exitosamente");
      this.closeDialog();
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