import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/shared/interfaces/product';
import { ProductsDialogComponent } from './products-dialog/products-dialog.component';

// export interface Employee {
//   id: number;
//   Name: string;
//   Position: string;
//   Email: string;
//   Mobile: number;
//   DateOfJoining: Date;
//   Salary: number;
//   Projects: number;
//   imagePath: string;
// }

// const employees = [
//   {
//       id: 1,
//       Name: 'Johnathan Deo',
//       Position: 'Seo Expert',
//       Email: 'r@gmail.com',
//       Mobile: 9786838,
//       DateOfJoining: new Date('01-2-2020'),
//       Salary: 12000,
//       Projects: 10,
//       imagePath: 'assets/images/users/2.jpg'
//   },
//   {
//       id: 2,
//       Name: 'Mark Zukerburg',
//       Position: 'Web Developer',
//       Email: 'mark@gmail.com',
//       Mobile: 8786838,
//       DateOfJoining: new Date('04-2-2020'),
//       Salary: 12000,
//       Projects: 10,
//       imagePath: 'assets/images/users/3.jpg'
//   },
//   {
//       id: 3,
//       Name: 'Sam smith',
//       Position: 'Web Designer',
//       Email: 'sam@gmail.com',
//       Mobile: 7788838,
//       DateOfJoining: new Date('02-2-2020'),
//       Salary: 12000,
//       Projects: 10,
//       imagePath: 'assets/images/users/4.jpg'
//   },
//   {
//       id: 4,
//       Name: 'John Deo',
//       Position: 'Tester',
//       Email: 'john@gmail.com',
//       Mobile: 8786838,
//       DateOfJoining: new Date('03-2-2020'),
//       Salary: 12000,
//       Projects: 11,
//       imagePath: 'assets/images/users/5.jpg'
//   },
//   {
//       id: 5,
//       Name: 'Genilia',
//       Position: 'Actor',
//       Email: 'genilia@gmail.com',
//       Mobile: 8786838,
//       DateOfJoining: new Date('05-2-2020'),
//       Salary: 12000,
//       Projects: 19,
//       imagePath: 'assets/images/users/6.jpg'
//   },
//   {
//       id: 6,
//       Name: 'Jack Sparrow',
//       Position: 'Content Writer',
//       Email: 'jac@gmail.com',
//       Mobile: 8786838,
//       DateOfJoining: new Date('05-21-2020'),
//       Salary: 12000,
//       Projects: 5,
//       imagePath: 'assets/images/users/7.jpg'
//   },
//   {
//       id: 7,
//       Name: 'Tom Cruise',
//       Position: 'Actor',
//       Email: 'tom@gmail.com',
//       Mobile: 8786838,
//       DateOfJoining: new Date('02-15-2019'),
//       Salary: 12000,
//       Projects: 9,
//       imagePath: 'assets/images/users/3.jpg'
//   },
//   {
//       id: 8,
//       Name: 'Hary Porter',
//       Position: 'Actor',
//       Email: 'hary@gmail.com',
//       Mobile: 8786838,
//       DateOfJoining: new Date('07-3-2019'),
//       Salary: 12000,
//       Projects: 7,
//       imagePath: 'assets/images/users/6.jpg'
//   },
//   {
//       id: 9,
//       Name: 'Kristen Ronaldo',
//       Position: 'Player',
//       Email: 'kristen@gmail.com',
//       Mobile: 8786838,
//       DateOfJoining: new Date('01-15-2019'),
//       Salary: 12000,
//       Projects: 1,
//       imagePath: 'assets/images/users/5.jpg'
//   }
// ];

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {

  public products: Product[];
  public firstFormGroup: FormGroup = Object.create(null);
  public dataSource: MatTableDataSource<Product>;
  public displayedColumns = ['position', 'productTypeId', 'description', 'quantity', 'image', 'status', 'action'];
  // public userData: User;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    // private toastr: ToastrService,
    public dialog: MatDialog,
    // private InsurerService: InsurerService,
    private _formBuilder: FormBuilder

  ) {

  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
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


  applyFilter(value) {
    this.dataSource.filter = value;
  }

  openDialog(data: string, obj: any): void {
    obj.action = data;
    obj.type = (data == "Nueva") ? 1 : 2;
    //!!! obj.userId = 4 // Obtener verdadero user

    this.dialog.open(ProductsDialogComponent, {
      data: obj,
      width: '40%'
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.ngAfterViewInit();
      } else {
        // this.toastr.error('Cancelado');
      }
    });
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
