import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';
import { UserService } from 'src/app/shared/services/user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/shared/auth/auth.service';


export interface User {
    uid?: string;
    userTypeId?: string;
    name: string;
    paternalLastName?: string;
    maternalLastName?: string; 
    email: string;
    password: string; 
    status?: number;
    image?: string;
 }

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UserComponent implements OnInit, AfterViewInit {
     
    // Inicializo un arreglo vacío de usuarios
    public user: User[]=[];
    public dataSource: MatTableDataSource<User>;
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
      
    searchText: any;
    local_data: any;
    // Columnas mostradas en la pantalla inicial de usuarios
    public displayedColumns: string[] = ['#', 'name','email', 'action']; 
    private started: boolean = false;
 
    constructor(public dialog: MatDialog, public datePipe: DatePipe, public fb: UserService, public _MatPaginatorIntl: MatPaginatorIntl) { 
        
    }


    ngOnInit(): void {
        // Obtener los documentos de la colección indicada en la función getUser()
        this.fb.getUser().subscribe((user: any)=>{
            console.log(user)
            this.user=user
            this.dataSource = new MatTableDataSource < User > (this.user);
            console.log(this.dataSource);
            this.dataSource.paginator =this.paginator;
            this.dataSource.sort = this.sort;
        });  
        // Cambio texto de la paginación en la parte inferior 
        this._MatPaginatorIntl.itemsPerPageLabel = 'Elementos por página';     
    }

    ngAfterViewInit(): void {
        
    }

    // Aplica filtro para búsqueda de usuarios
    // No toma en cuenta mayúsculas y minúsculas, solo el caracter
    applyFilter(value: string): void {
        this.dataSource.filter = value;
    }

    openDialog(action: string, obj: any): void {
        obj.action = action;
        const dialogRef = this.dialog.open(UsersDialogComponent, {
            data: obj
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.event === 'Nuevo Usuario') {
                this.addRowData(result.data);
            } else if (result.event === 'Actualizar') {
                this.updateRowData(result.data);
            } else if (result.event === 'Eliminar') {
                this.deleteRowData(result.data);
            }
        }); 
    }
  
    // tslint:disable-next-line - Disables all
    addRowData(row_obj: User): void {
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
    updateRowData(row_obj: User): boolean | any {
        this.dataSource.data = this.dataSource.data.filter((value: any) => {
            if (value.uid === row_obj.uid) {
                value.userTypeId = row_obj.userTypeId;
                value.name = row_obj.name;
                value.paternalLastName = row_obj.paternalLastName;
                value.maternalLastName = row_obj.maternalLastName;
                value.email = row_obj.email;
                value.password = row_obj.password;
                value.status = row_obj.status;
                value.image = row_obj.image;
            }
            return true;
        });
    }

    // tslint:disable-next-line - Disables all
    deleteRowData(row_obj: User): boolean | any {
        this.dataSource.data = this.dataSource.data.filter((value: any) => {
            return value.id !== row_obj.uid;
        });
    }
}