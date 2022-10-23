import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
//import { Customer } from '../../../shared/interfaces/customer';
import { ClientsDialogComponent } from './clients-dialog/clients-dialog.component';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog,) { }

  ngOnInit(): void {
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
        data: obj
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
