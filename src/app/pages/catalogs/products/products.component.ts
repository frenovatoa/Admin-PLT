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
export class ProductsComponent implements OnInit, AfterViewInit {

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
      this.fb.getProducts().subscribe((user: any)=>{
        console.log(user)
        this.products=user
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
    //obj.type = action == 'Nuevo' ? 1 : 2;
    //obj.uId = AuthService.getUser().id;
    const dialogRef = this.dialog.open(ProductsDialogComponent, {
        data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result.event === 'Nuevo Producto') {
            // this.addRowData(result.data);
        } else if (result.event === 'Actualizar') {
            // this.updateRowData(result.data);
        } else if (result.event === 'Eliminar') {
            // this.deleteRowData(result.data);
        }
    }); 
}

  ngAfterViewInit(): void {
    // this.insurerService.getInsurer().subscribe(response => {
    //   if (!response['success'] == true) {
    //     this.toastr.success(response['message']);
    //   } else {
    //     this.toastr.error(response['message']);
    //   }
    //   this.insurers = response['data'];
    //   let i = 1;
    //   this.insurers.forEach(element => {
    //     element.position = i++;
    //   });
    //   this.dataSource = new MatTableDataSource<Insurer>(this.insurers);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
    // Mandar llamar el servicio para rellenar el arreglo de productos (productos a mostrar)
  }

  confirmDialog(element) {
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: {
    //     message: '¿Estas seguro que deseas eliminarlo?',
    //     name: element.description,
    //   }
    // })
    //   .afterClosed()
    //   .subscribe((confirm: Boolean) => {
    //     if (confirm) {
    //       this.delete(element);
    //     } else {
    //       this.toastr.error('Cancelado');
    //     }
    //   });
    this.delete(element);
  }

  delete(data) {
    // data.type = 3;
    // data.userId = this.userData.id;
    // this.insurerService.crudInsurer(data).subscribe(response => {
    //   if (response.success == true) {
    //     this.toastr.warning(response.message);
    //     this.ngAfterViewInit();
    //   } else {
    //     this.toastr.error(response.message);
    //   }
    // });
  }

}
