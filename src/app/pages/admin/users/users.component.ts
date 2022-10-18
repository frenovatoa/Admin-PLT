import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AddComponent } from './add/add.component';
import { MatCardModule } from '@angular/material/card';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';

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

// Aquí se van a ir insertando los empleados
const user = [
    {
        uid: 1,
        userTypeId: 1,
        name: 'Kaiser',
        paternalLastName: 'Hdz',
        maternalLastName: 'Flores',
        email: 'k@gmail.com',
        password: 123,
        status: 1,
        image: 'assets/images/users/2.jpg'
    },
 ];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UserComponent implements OnInit, AfterViewInit {


    @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
    searchText: any;
    displayedColumns: string[] = ['#', 'name', 'email', 'action'];
    dataSource = new MatTableDataSource(user);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
    //mat-card
    constructor(public dialog: MatDialog, public datePipe: DatePipe) { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
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
            if (value.id === row_obj.uid) {
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