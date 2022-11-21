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
        //console.log("saleData",this.saleDetailData)
    });
    }
  }
  
  clear(): void {
    const stock = this.formProduction.get('productionDetails') as FormArray;
    stock.controls.forEach(stock => stock.patchValue({ producedQuantity: ''})); 
    //RESETEAN COSTO TOTAL DE LA TABLA.
    //this.formSale.get('saleTypeId').patchValue({saleTypeId: ''});
    //this.formSale.get('totalCost').patchValue({totalCost: ''});
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
  if(this.productionDetail.controls[rowIndex].valid){
    this.productionDetail.removeAt(rowIndex);
    console.log("borre")
  }else{
  this.productionDetail.controls[rowIndex].patchValue({"status":"false"})
  }
  }

  onSubmit() {
    console.log(this.formProduction.value);
  }  

  //Actualiza la cantidad de productos
  updateQuantity(): void {
    let data = this.formProduction.value;
    //Variable de control en caso de que la cantidad solicitada no este disponible.
    //let valid1 = true;

    for(let i = 0; i < this.productionDetail.length;i++){
      this.product.forEach(product =>{
        //compara la id del los productos y la variable de control sea siempre true;
        //en caso de ser false,dejara de buscar.
        //en este ciclo buscador no hay tanto problema, ya que hay otro ciclo antes en save() que 
        //valida si las cantidades solicitadas esten disponibles en  la tabla productos.
        if(product.id == this.productionDetail.controls[i].get('productId').value){
          //obtiene la cantidad de la tabla productos y suma la cantidad producida.
          let cantidadTotal = product.quantity + this.productionDetail.controls[i].get('producedQuantity').value
          //compara que sea mayor u igual a 0, en caso de que al restar la cantidad solicitada quede en 0 la cantidad disponible en productos.
          //if(cantidadTotal >= 0){
            //asigna la resta de la cantidad sobrante a data.quantity
            data.quantity = cantidadTotal
            //asigna a id, la id del producto actual del array en saleDetail
            let id = this.productionDetail.controls[i].get('productId').value
            //mantiene en true la variable de control.
            //valid1 = true
            //llama a la funcion del servicio para actualizar la cantidad en productos.
            this.fb.updateProduct(id, data).then((custom)=>{
            })
          } 
        //}
      })
    }  

  }


  save(): void {
    let data = this.formProduction.value;
    data.userId = this.id
    console.log(this.formProduction.valid)
    //primer ciclo que valida si hay stock disponible de un producto en especifico.
    //Variable de control en true.
    //let valid = true
    for(let i = 0; i < this.productionDetail.length;i++){
      this.product.forEach(product =>{
        if(product.id == this.productionDetail.controls[i].get('productId').value){
          //console.log(i, product.quantity)
          let cantidadTotal = product.quantity + this.productionDetail.controls[i].get('producedQuantity').value
        //   if(cantidadTotal >= 0){
        //     //valid = true            
        //     console.log(i,cantidadTotal)
        //   }
        //   else{
        //     //en caso de que algun producto de la venta no tenga stock disponible en productos la variable de control cambia a false,
        //     // y termina la condicional del ciclo.
        //     //valid = false            
        //     console.log("falta cantidad en producto.")
        //   }
         }
      })
    }

      if (this.formProduction.valid) {
        //Aquí va la inserción en la base de datos
        //antes de crear la venta verificar que la variable de control sea true, en caso de que todos los productos seleccioandos de la venta tengan stock disponible
        // en productos, la variable de control quedara en true, permitiendo que pase la condicional y se guarde la venta, en caso de que un producto no tenga stock, no
        // hara la venta y arrojara un mensaje indicando que falta stock del producto.
        //if(valid == true){
          this.updateQuantity()
          this.fb.addProduccion(data).then((custom)=>{
          this.toastr.success("Producción creada exitosamente");
          this.closeDialog();
          })
        // }else{
        //   this.toastr.error("No hay en stock para satisfacer la cantidad.");
        // }
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
  

