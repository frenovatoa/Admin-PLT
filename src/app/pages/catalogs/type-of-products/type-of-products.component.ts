import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit, Type} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { TypeOfProductsDialogComponent } from './type-of-products-dialog/type-of-products-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { TilePosition } from '@angular/material/grid-list/tile-coordinator';
import {map} from 'rxjs/operators';
import { TypeOfProductService } from 'src/app/shared/services/typeOfProduct.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { query } from 'chartist';
import { collection } from 'firebase/firestore';
import { ifStmt } from '@angular/compiler/src/output/output_ast';



export interface TypeOfProduct{
  id?: string;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  status: number;
}


@Component({
  selector: 'app-type-of-products',
  templateUrl: './type-of-products.component.html',
  styleUrls: ['./type-of-products.component.scss']

})

export class TypeOfProductsComponent implements OnInit, AfterViewInit {

  public typeOfProduct: TypeOfProduct[]=[];
  public dataSource: MatTableDataSource<TypeOfProduct>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    
  searchText: any;
  public displayedColumns: string[] = ['#', 'description', 'retailPrice', 'wholesalePrice', 'action'];
  private started: boolean = false;

  constructor(public dialog: MatDialog, public datePipe: DatePipe, public fb: TypeOfProductService, public _MatPaginatorIntl: MatPaginatorIntl) { 

  }


  ngOnInit(): void {
     this.fb.getTypeOfProduct().subscribe((typeOfProduct: any)=>{      
        this.typeOfProduct=typeOfProduct
        this.dataSource = new MatTableDataSource < TypeOfProduct > (this.typeOfProduct);
        this.dataSource.paginator =this.paginator;
        this.dataSource.sort = this.sort;
    });   
    // Cambio texto de la paginación en la parte inferior 
    this._MatPaginatorIntl.itemsPerPageLabel = 'Elementos por página';     
}

ngAfterViewInit(): void {
        
}


  applyFilter(value: string): void {
    this.dataSource.filter = value;
}
  
openDialog(action: string, obj: any): void {
  obj.action = action;
  const dialogRef = this.dialog.open(TypeOfProductsDialogComponent, {
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
    addRowData(row_obj: TypeOfProduct): void {

  }

    // tslint:disable-next-line - Disables all
    updateRowData(row_obj: TypeOfProduct): boolean | any {
      this.dataSource.data = this.dataSource.data.filter((value: any) => {
          if (value.id === row_obj.id) {
              value.description = row_obj.description;
              value.retailPrice = row_obj.retailPrice;
              value.wholesalePrice = row_obj.wholesalePrice;
              value.status = row_obj.status;
          }
          return true;
      });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: TypeOfProduct): boolean | any {
      this.dataSource.data = this.dataSource.data.filter((value: any) => {
          return value.id !== row_obj.id;
      });
  }

}
