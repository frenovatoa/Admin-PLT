import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//import { Customer } from '../../../shared/interfaces/customer';
import { ClientsDialogComponent } from './clients-dialog/clients-dialog.component';
import { CustomerService } from '../../../shared/services/customer.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/shared/auth/auth.service';

export interface Customer{
  id: string;
  name: string;
  paternalLastName: string;
  maternalLastName: string;    
  phone: string;
  alternativePhone: string;
  status:number;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  public customers: Customer[];
  public dataSource: MatTableDataSource<Customer>;
  public displayedColumns = ['#', 'name', 'phone', 'action'];
  public userLogged:User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog,
              public customerService:CustomerService,
              public _MatPaginatorIntl: MatPaginatorIntl,
              public fb: UserService,
              private router: Router,
              public authService:AuthService) {
                this.userLogged = this.authService.user;
               }

  ngOnInit(): void {
    this.fb.getUser().subscribe((user: any)=>{
      user.forEach(user => {
          if(user.email == this.userLogged.email){
            if(user.userTypeId=='oqHSeK8FRTbWtObf7FdD'){
              this.router.navigate(['/dashboard'])
            }
              this.userLogged = user;
            
          }
      });
  });  

    this.customerService.getCustomer().subscribe((user: any)=>{
      console.log(user)
      this.customers=user
      this.dataSource = new MatTableDataSource < Customer > (this.customers);
      console.log(this.dataSource);
      this.dataSource.paginator =this.paginator;
      this.dataSource.sort = this.sort;
  });   
  // Cambio texto de la paginación en la parte inferior 
  this._MatPaginatorIntl.itemsPerPageLabel = 'Elementos por página';    
  }

  // Aplica filtro a la lista de clientes
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    //obj.type = action == 'Nuevo' ? 1 : 2;
    //obj.uId = AuthService.getUser().id;
    const dialogRef = this.dialog.open(ClientsDialogComponent, {
        data: obj,
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result.event === 'Nuevo Cliente') {
            //this.addRowData(result.data);
        } else if (result.event === 'Actualizar') {
            //this.updateRowData(result.data);
        } else if (result.event === 'Eliminar') {
            //this.deleteRowData(result.data);
        }
    }); 
}

}
