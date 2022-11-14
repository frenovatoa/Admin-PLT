import { AfterViewInit, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { User } from 'src/app/shared/interfaces/user';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserType } from 'src/app/shared/interfaces/user.type';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { user } from '@angular/fire/auth';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Production } from 'src/app/shared/interfaces/production';
import { ProductionDetail } from 'src/app/shared/interfaces/production.detail';
import { Product } from 'src/app/shared/interfaces/product';
import { ProductType } from 'src/app/shared/interfaces/product.type';
import { ProductionService } from 'src/app/shared/services/production.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],
  animations: [
    trigger('detailExpand', [
        state('collapsed', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
],
})
export class ProductionComponent implements OnInit, AfterViewInit {

  //Arreglos que se ocupan en la tabla.
  public production: Production[]=[];
  public user: User[]=[];
  public productionDetails: ProductionDetail[]=[];
  public product: Product[]=[];
  public productType: ProductType[]=[];
  //public saleType: SaleType[]=[]; 
  public dataSource: MatTableDataSource<Production>;

  //Form de ventas.
  public formProduction: FormGroup;
  public formProductionDetail: FormGroup;
  public productionDetailForm: FormArray;
  public productionDetailData: ProductionDetail[];
  
  //Form de filtro de rango de fechas.
  filterForm = new FormGroup({
    StartDate: new FormControl(),
    EndDate: new FormControl(),
  });      

  productionDetailForms = new FormGroup({
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
  public displayedColumns: string[] = ['#', 'productionDate', 'productionNotes', 'userId', 'action'];
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  private started: boolean = false;

  public id

  constructor(

    private dateAdapter: DateAdapter<Date>,
    public _MatPaginatorIntl: MatPaginatorIntl,
     private fs: FormBuilder,
     public dialog: MatDialog, 
     public datePipe: DatePipe, 
     public fb: ProductionService, 
     public us: UserService,
     public _MatPaginatorInt1: MatPaginatorIntl,
     //public dialogRef: MatDialogRef<SalesComponent>,
     public authService : AuthService,
     public toastr :ToastrService,
     @Optional() @Inject(MAT_DIALOG_DATA) public data: Production) { 

      this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
      
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
     this.formProduction = this.fs.group ({
      id: [null],
      productionDate: [new Date()],
      userId: [null],
      productionNotes: [null],
      productionDetails: this.fs.array([])
     });
     this.addProductionDetail();
  }

  applyFilter() {
    this.dataSource.filter = ''+Math.random();
  }

  currentDate = new Date();

  //public amount
  // obtenerPrecios(index : number, product ?: Product)
  // {  
  //   console.log(product)
  //   let retail
  //   let wholesale
  //   let amount
  //   let id = this.formProduction.get('saleTypeId').value
  //   if(product.productTypeId != undefined){

  //   this.productType.forEach((productType, index) =>{
  //       if(productType.id == product.productTypeId){
  //         if(id == 'yhl8Slx8goioNHV0OAGo'){
  //           this.amount=productType.retailPrice
  //           retail = productType.retailPrice
  //           amount = retail
  //         }else{
  //           this.amount=productType.wholesalePrice
  //           wholesale = productType.wholesalePrice
  //           amount = wholesale
  //         }
  //         console.log(productType)
  //       }
  //   })
  //   }
  //   console.log(product)
  //   this.saleDetail.controls[index].patchValue({"price":amount})
  //   this.saleDetail.controls[index].patchValue({"amount":amount})

  // }


  nullAmount(index){
    //console.log("opcion", this.saleDetail.controls[index].get('isCourtesy').value)
    //console.log("index", index)
  }
  
  clear(): void {
    const stock = this.formProduction.get('productionDetails') as FormArray;
    stock.controls.forEach(stock => stock.patchValue({ producedQuantity: ''})); 
    //RESETEAN COSTO TOTAL DE LA TABLA.
    //this.formSale.get('saleTypeId').patchValue({saleTypeId: ''});
    //this.formSale.get('totalCost').patchValue({totalCost: ''});
  }

  // restaTotal(index){
  //   for(let i=0;i < this.productionDetail.length;i++){
  //     if(i == index){
  //       console.log(index)
  //       var resta = this.productionDetail.controls[index].get('amount').value
  //       console.log("resta",resta)
  //       var totalCost = this.formProduction.get('totalCost').value
  //       console.log("totalCost",totalCost)
  //       totalCost = totalCost - resta
  //       console.log("resultado",totalCost)
  //       //VALOR SE RESTA PERO NO SE ASIGNA
  //       this.formProduction.get('totalCost').patchValue(totalCost);
  //     }
  //   }
  // }

  async expandir(production: any){
    this.expandedElement = production
    this.local_data = production
    //console.log("Sale:",sale)
    if(this.local_data.id != null){
      await this.fb.getProductionDetail(this.local_data.id).subscribe((productionDetail: ProductionDetail[])=>{
        //console.log("p",saleDetail)
        this.productionDetailData= productionDetail;
        //console.log("saleData:",this.saleDetailData)
        for(let i=0; i< productionDetail.length; i++){
          //console.log("saleData(i):",this.saleDetailData[i]) 
        this.product.forEach(product =>{
          if(product.id == productionDetail[i].productId){
            productionDetail[i].productDescription = product.description
          }
        })
         this.productType.forEach(productType =>{
           if(productType.id == this.product[i].productTypeId){
             productionDetail[i].productTypeDescription = productType.description
           }
         })
        }
        //console.log('HOLI')
    });
    }
  }

    
  async ngOnInit() {

     this.productionDetail.valueChanges.subscribe((datas: Array<any>) => {
       var total = 0;
    //   datas.forEach((data, index) => {
    //     const sub = data.requestedQuantity * data.price;
    //     total = total + sub;
    //     this.productionDetail.controls[index].get('amount').patchValue(sub, { emitEvent: false });
    //   });
    //   this.formProduction.get('totalCost').patchValue(total);
     });


    //Form Sale
    //llamada de la BD de ventas
    this.fb.getProduction().subscribe((production: any)=>{     
      
      this.production=production  
      this.dataSource = new MatTableDataSource < Production > (this.production);
      this.dataSource.paginator =this.paginator;
      this.dataSource.sort = this.sort;      

      // Cambio texto de la paginación en la parte inferior 
      this._MatPaginatorIntl.itemsPerPageLabel = 'Elementos por página';  

      this.datePipe = new DatePipe('en');
      this.dataSource.filterPredicate = (data, filter) =>{
        if (this.StartDate && this.EndDate) {
          //let date = data.saleDate.toDate();
          return data.productionDate.toDate() >= this.StartDate && data.productionDate.toDate() <= this.EndDate;
        }
        return true;
      }
    
    
      //llamada de la BD de usuarios para obtener el nombre y apellido mediante la UID.
      this.fb.getUsers().subscribe((user: any)=>{
        this.user=user
        let userName
        let userLastName
        this.production.forEach((sale, index) => {
            this.user.forEach(user => {
                if(sale.userId == user.uid) {
                    userName = user.name
                    userLastName = user.paternalLastName
                }
            });
        this.production[index].userName = userName
        this.production[index].userLastName = userLastName
        })
        });
  
      // //llamada de la BD de tipos de ventas para obtener la descripcion mediante la ID.
      // this.fb.getSaleTypes().subscribe((saleType: any)=>{
      //   this.saleType=saleType
      //   let saleTypeDescription
      //   this.production.forEach((production, index) => {
      //       this.saleType.forEach(saleType => {
      //           if(sale.saleTypeId == saleType.id) {
      //               saleTypeDescription = saleType.description
      //           }
      //       });
      //   this.production[index].saleTypeDescription = saleTypeDescription
      //   })
      // });

      //llamada de la BD de la coleccion de detalles de venta mediante la BD.
      this.fb.getProductionDetail(production.id).subscribe((productionDetails: any)=>{
        this.productionDetails=productionDetails
      })

      //llamada de la BD de la coleccion de tipo de productos mediante la BD. ProcutionDetailData
      this.fb.getTypeOfProduct().subscribe((productType: any)=>{
        this.productType=productType
      })

      //llamada de la BD de productos para obtener la descripcion mediante la ID. 
      this.fb.getProducts().subscribe((product: any)=>{
        this.product=product
        let productDescription
        let productTypeDescription
        let productTypeRetailPrice
        let productTypeWholesalePrice
        this.productionDetails.forEach((productionDetails, index) =>{
          this.product.forEach(product =>{
            if(productionDetails.productId == product.id){ 
              productDescription = product.description
              
              this.productType.forEach((productType, index) =>{
                this.product.forEach(product =>{
                  if(productType.id == product.productTypeId){
                    //productTypeRetailPrice = productType.retailPrice
                    //productTypeWholesalePrice = productType.wholesalePrice
                  }
                })
              })
            }
          });
        this.productionDetails[index].productDescription = productDescription  
        //this.productionDetails[index].productRetailPrice = productTypeRetailPrice
        //this.productionDetails[index].productWholesalePrice = productTypeWholesalePrice
        })
        this.productType.forEach((productType, index) =>{
          this.product.forEach(product =>{
            if(productType.id == product.productTypeId){
              productTypeDescription = productType.description
            }
          })
        this.product[index].productTypeDescription = productTypeDescription   
        })
      });     
    });     
  }

  get productionDetail() : FormArray {
    return this.formProduction.get("productionDetails") as FormArray
  }

  newProductionDetail(): FormGroup {
    return this.fs.group({
      id: [null],
      productionId: [null],
      productId: [null, Validators.required],
      producedQuantity: [1, Validators.required],
      status: [true],
    }
    )
  //this.formSale.get(['saleDetails'])
  } 
  //?? Crea otro detalle de req en la alta 
  addProductionDetail(): void {
    //this.sumaTotal()
    this.productionDetail.push(this.newProductionDetail());    
  }
  //?? Remueve el detalle de la req en la alta
  removeProductionDetail(rowIndex: number): void {
  //this.restaTotal(rowIndex)  
  console.log(this.productionDetail.controls[rowIndex].valid)
  if(!this.productionDetail.controls[rowIndex].valid){
    this.productionDetail.removeAt(rowIndex);
    console.log("borre")
  }else{
  this.productionDetail.controls[rowIndex].patchValue({"status":"false"})
  }
  }

  onSubmit() {
    console.log(this.formProduction.value);
  }  

  save(): void {
    let data = this.formProduction.value;
    data.userId = this.id
    console.log(this.formProduction.valid)
    if (this.formProduction.valid) {
      //Aquí va la inserción en la base de datos
      this.fb.addProduccion(data).then((custom)=>{
      this.toastr.success("Producción creada exitosamente");
      this.closeDialog();
      })
    } else {
      this.toastr.error("Favor de llenar campos faltantes");
    }
  } 

  /** Guarda registro de dirección de un cliente */
  saveProductionDetail(): void {
  let data = this.formProductionDetail.value;
  console.log(data)
  if (this.formProductionDetail.valid) {
    // Aquí va la inserción en la base de datos
      this.fb.addProduction(data).then((sale: any)=>{
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
  const dialogRef = this.dialog.open(ProductionComponent, {
      data: obj
  });
  dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Nueva Produccion') {
          this.addRowData(result.data);
      } else if (result.event === 'Actualizar') {
          this.updateRowData(result.data);
      } else if (result.event === 'Eliminar') {
          this.deleteRowData(result.data);
      }
  }); 
}

    // tslint:disable-next-line - Disables all
    addRowData(row_obj: Production): void { 

  }

    // tslint:disable-next-line - Disables all
    updateRowData(row_obj: Production): boolean | any {
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
  deleteRowData(row_obj: Production): boolean | any {
/*       this.dataSource.data = this.dataSource.data.filter((value: any) => {
          return value.id !== row_obj.id;
      });
  }
 */
}

getDateFormatString(): string {
      return 'YYYY/MM/DD';
  }
}
  

