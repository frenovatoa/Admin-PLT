import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
//import { AddComponent } from './add/add.component';
import { MatCardModule } from '@angular/material/card';

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
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss']
})

export class UsersDialogComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  // SOLO EJEMPLO
  lista:string[]=["hola","que","tal", "estas"];

  constructor(
      public datePipe: DatePipe,
      public dialogRef: MatDialogRef<UsersDialogComponent>,
      // @Optional() is used to prevent error if no data is passed
      @Optional() @Inject(MAT_DIALOG_DATA) public data: User) {
      this.local_data = { ...data };
      this.action = this.local_data.action;
      if (this.local_data.imagePath === undefined) {
          this.local_data.imagePath = 'assets/images/users/default.png';
      }
  }

  ngOnInit() {
  }

  doAction(): void {
      this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
      this.dialogRef.close({ event: 'Cancelar' });
  }

  selectFile(event: any): void {
      if (!event.target.files[0] || event.target.files[0].length === 0) {
          // this.msg = 'You must select an image';
          return;
      }
      const mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
          // this.msg = "Only images are supported";
          return;
      }
      // tslint:disable-next-line - Disables all
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      // tslint:disable-next-line - Disables all
      reader.onload = (_event) => {
          // tslint:disable-next-line - Disables all
          this.local_data.imagePath = reader.result;
      };
  }

} 