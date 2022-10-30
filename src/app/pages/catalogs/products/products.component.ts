import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// import { Product } from 'src/app/shared/interfaces/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { ProductsDialogComponent } from './products-dialog/products-dialog.component';

export interface Product {
  id: string;
  productTypeId: string;
  description: string;
  quantity: number;
  image: string;
  status: number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public products: Product[];
  // public firstFormGroup: FormGroup = Object.create(null);
  public dataSource: MatTableDataSource<Product>;
  public displayedColumns: string[] = ['#', 'description', 'productType', 'quantity', 'status', 'action'];
  // public userData: User;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, public datePipe: DatePipe, public fb: ProductService) { 

  }

  ngOnInit(): void {
      // Obtener los documentos de la colección indicada en la función getUser()
      this.fb.getProducts().subscribe((product: any)=>{
        console.log(product)
        this.products=product
        this.dataSource = new MatTableDataSource < Product > (this.products);
        console.log(this.dataSource);
        this.dataSource.paginator =this.paginator;
        this.dataSource.sort = this.sort;
    });        
  }

  // Aplica filtro a la lista de productos
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(ProductsDialogComponent, {
        data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result.event === 'Nuevo Producto') {
            this.addRowData(result.data);
        } else if (result.event === 'Actualizar') {
            this.updateRowData(result.data);
        } else if (result.event === 'Eliminar') {
            this.deleteRowData(result.data);
        }
    }); 
}

/** Llama api para eliminar un registro */
//   delete(local_data): void {
//     local_data.type = 3;
//     local_data.uId = AuthService.getUser().id;

//     this.movementTypeService.crudMovementType(element).subscribe(response => {
//       if (response['success']) {
//         this.toastr.success(response['message']);
//         this.ngOnInit();
//       } else {
//         this.toastr.error(response['message']);
//       }
//     });
//   }

// tslint:disable-next-line - Disables all
addRowData(row_obj: Product): void {
    //this.dataSource.data.push({
        //uid: user.length + 1,
        //userTypeId: row_obj.userTypeId,
        //name: row_obj.name,
        //paternalLastName: row_obj.paternalLastName,
        //maternalLastName: row_obj.maternalLastName,
        //email: row_obj.email
        //password: row_obj.password,
        //status: row_obj.status,
        //image: row_obj.image
    //});
    //this.dialog.open(AddComponent);
    //this.table.renderRows();
}

// tslint:disable-next-line - Disables all
updateRowData(row_obj: Product): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
        if (value.id === row_obj.id) {
            value.productTypeId = row_obj.productTypeId;
            value.description = row_obj.description;
            value.quantity = row_obj.quantity;
            value.status = row_obj.status;
            value.image = row_obj.image;
        }
        return true;
    });
}

// tslint:disable-next-line - Disables all
deleteRowData(row_obj: Product): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
        return value.id !== row_obj.id;
    });
}

}
