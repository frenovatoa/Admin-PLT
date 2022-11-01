import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit, Type, PipeTransform} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TilePosition } from '@angular/material/grid-list/tile-coordinator';
import {filter, map} from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { query } from 'chartist';
import { collection } from 'firebase/firestore';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { SaleService } from 'src/app/shared/services/sale.service';
import { SaleDetailService } from 'src/app/shared/services/saleDetail.service';
import { User } from 'src/app/shared/interfaces/user';
/* import { filterPipe } from './filter.pipe'; */
import { Sale } from 'src/app/shared/interfaces/sale';
import { SaleType } from 'src/app/shared/interfaces/sale.type';
import { CdkTableModule } from '@angular/cdk/table';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { ConstantPool } from '@angular/compiler';

export interface SaleDetail {
  id: string;
  saleId: string;
  productId: string;
  requestedQuantity: number;
  amount: number;
  isCourtesy: number;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit, AfterViewInit {

  public sale: Sale[]=[];
  public user: User[]=[];
  public saleType: SaleType[]=[];
  public dataSource: MatTableDataSource<Sale>;

  public formSale: FormGroup;

filterForm = new FormGroup({
  StartDate: new FormControl(),
  EndDate: new FormControl(),
})


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  local_data: any;
    
  searchText: any;
  public displayedColumns: string[] = ['saleDate', 'orderId', 'saleTypeId', 'totalCost', 'userId', 'action'];
  private started: boolean = false;

  get StartDate() { return this.filterForm.get('StartDate').value; }
  get EndDate() { return this.filterForm.get('EndDate').value; }

  
  constructor(private fs: FormBuilder, public dialog: MatDialog, public datePipe: DatePipe, public fb: SaleService, public _MatPaginatorInt1: MatPaginatorIntl) { 
    this.formSale = this.fs.group({
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
    })

  }

/*   applyDateFilter() {
    console.log("hola");
    if (this.formSale.valid) {
      this.dataSource.data = this.dataSource.data.filter(e=>e.saleDate >= this.formSale.value.StartDate && e.saleDate <= this.formSale.value.EndDate);
    }
  } */

  applyFilter(value: string): void {
    if (this.formSale.controls.StartDate.valid && this.formSale.controls.EndDate.valid && this.formSale.value.StartDate != null && this.formSale.value.EndDate) {
    console.log("Rango de fechas: ", this.formSale.value)
    //this.dataSource.filter = value;
    }else{
      console.log("error")
    }
  }


  ngOnInit(): void {
    this.fb.getSale().subscribe((sale: any)=>{     
      this.sale=sale
      this.dataSource = new MatTableDataSource < Sale > (this.sale);
      this.dataSource.paginator =this.paginator;
      this.dataSource.sort = this.sort;
    
      this.fb.getUsers().subscribe((user: any)=>{
        //console.log(user)
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
            //console.log(userName)
            this.sale[index].userName = userName
            this.sale[index].userLastName = userLastName
          })
        });

        this.fb.getSaleTypes().subscribe((saleType: any)=>{
          //console.log(user)
          this.saleType=saleType
  
          let saleTypeDescription
          this.sale.forEach((sale, index) => {
              this.saleType.forEach(saleType => {
                   if(sale.saleTypeId == saleType.id) {
                      saleTypeDescription = saleType.description
                  }
              });
               //console.log(saleTypeDescription)
               this.sale[index].saleTypeDescription = saleTypeDescription
             })
          });
    });      
  }



  ngAfterViewInit(): void {
        
  }

openDialog(action: string, obj: any): void {
  obj.action = action;
  const dialogRef = this.dialog.open(SalesComponent, {
      data: obj
  });
  dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Nuevo Tipo De Producto') {
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