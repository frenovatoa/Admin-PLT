import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Customer } from 'src/app/shared/interfaces/customer';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-clients-dialog',
  templateUrl: './clients-dialog.component.html',
  styleUrls: ['./clients-dialog.component.scss']
})

export class ClientsDialogComponent {
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  public formCustomer: FormGroup;
  public formAddress: FormGroup;

  constructor(
      public datePipe: DatePipe,
      public dialogRef: MatDialogRef<ClientsDialogComponent>,
      public fb: FormBuilder,
      public customerService:CustomerService,
      // @Optional() is used to prevent error if no data is passed
      @Optional() @Inject(MAT_DIALOG_DATA) public data: Customer) {
      this.local_data = { ...data };
      this.action = this.local_data.action;
      // if (this.local_data.imagePath === undefined) {
      //     this.local_data.imagePath = 'assets/images/users/default.png';
      // }
    this.formCustomer = this.fb.group ({
      id: [''],
      name: ['', Validators.required],
      paternalLastName: ['', Validators.required],
      maternalLastName: ['', Validators.required],
      phone: ['', Validators.required],
      alternativePhone: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.formAddress = this.fb.group ({
      id: [''],
      customerId: ['', Validators.required],
      postCode: ['', Validators.required],
      street: ['', Validators.required],
      insideNumber: ['', Validators.required],
      outsideNumber: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      status: ['', Validators.required],
  });
  }

  ngOnInit() {
             
  }

/** Guarda registro de cliente */
save(): void {
    let data = this.formCustomer.value;
    console.log(data)
    if (this.formCustomer.valid) {
      // Aquí va la inserción en la base de datos
        this.customerService.addCustomer(data).then((customer: any)=>{
            console.log(customer)
         });
    } else {
      //this.toastr.error("Favor de llenar campos faltantes");
    }
  }

  // ??????????????????????????????????
/** Guarda registro de dirección de un cliente */
saveAddress(): void {
  let data = this.formAddress.value;
  console.log(data)
  if (this.formAddress.valid) {
    // Aquí va la inserción en la base de datos
      this.customerService.addCustomer(data).then((customer: any)=>{
          console.log(customer)
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
