import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
//import { AddComponent } from './add/add.component';
import { MatCardModule } from '@angular/material/card';
import { User } from 'src/app/shared/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.services';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserType } from 'src/app/shared/interfaces/user.type';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss']
})

export class UsersDialogComponent {

  // Inicializo un arreglo vacío de tipos de usuarios
  public userType: UserType[]=[];

  public dataSource!: MatTableDataSource<UserType>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort

  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  public formUsers: FormGroup;

  // SOLO EJEMPLO
  lista:string[]=["hola","que","tal", "estas"];

  constructor(
      public datePipe: DatePipe,
      public dialogRef: MatDialogRef<UsersDialogComponent>,
      public fb: FormBuilder,
      public userService: UserService,
      // @Optional() is used to prevent error if no data is passed
      @Optional() @Inject(MAT_DIALOG_DATA) public data: User) {
      this.local_data = { ...data };
      this.action = this.local_data.action;
      if (this.local_data.imagePath === undefined) {
          this.local_data.imagePath = 'assets/images/users/default.png';
      }
      this.formUsers = this.fb.group ({
        userTypeId: [''],
        name: ['', Validators.required],
        paternalLastName: ['', Validators.required],
        maternalLastName: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
        status: ['', Validators.required],
        image: ['', Validators.required]
    });
  }

  ngOnInit() {
        this.userService.getUserTypes().subscribe((userType: any)=>{
          console.log(userType)
          this.userType=userType
          this.dataSource = new MatTableDataSource < UserType > (this.userType);
          console.log(this.dataSource);
          this.dataSource.paginator =this.paginator;
          this.dataSource.sort = this.sort;
      });      
  }

/** Guarda registro */
save(): void {
    let data = this.formUsers.value;
    console.log(data)
    if (this.formUsers.valid) {
      // Aquí va la inserción en la base de datos
        this.userService.addUser(data).then((user: any)=>{
            console.log(user)
         });
    } else {
      //this.toastr.error("Favor de llenar campos faltantes");
    }
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