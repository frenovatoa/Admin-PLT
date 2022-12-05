import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Customer } from 'src/app/shared/interfaces/customer';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Address } from '../../../../shared/interfaces/address';

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
  public customers: Customer[] = [];
  public formCustomer: FormGroup;
  public formAddress: FormGroup;
  public addressForm: FormArray;
  public addressData: Address[];
  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ClientsDialogComponent>,
    public fb: FormBuilder,
    public customerService: CustomerService,
    public toastr: ToastrService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Customer) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    // if (this.local_data.imagePath === undefined) {
    //     this.local_data.imagePath = 'assets/images/users/default.png';
    // }
    this.formCustomer = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚ ]+$')]],
      paternalLastName: [null, [Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚ ]+$')]],
      maternalLastName: [null, [Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚ ]+$')]],
      phone: [null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      alternativePhone: [null, [Validators.minLength(10), Validators.maxLength(10)]],
      status: [true],
      address: this.fb.array([])
    });
    this.addAddress();
  }


  async ngOnInit() {
    if (this.local_data.id != null) {
      await this.customerService.getAddress(this.local_data.id).subscribe((address: Address[]) => {
        this.addressData = address;
        for (let i = 1; i < address.length; i++) {
          this.addAddress();
        }
        this.address.patchValue(this.addressData)
      });
    }
    this.customerService.getCustomer().subscribe((customer: any) => {
      //console.log(user)
      this.customers = customer
    });
  }


  get address(): FormArray {
    return this.formCustomer.get("address") as FormArray
  }
  newAddress(): FormGroup {
    return this.fb.group({
      id: [null],
      customerId: [null],
      postCode: [null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(5), Validators.maxLength(5)]],
      street: [null, Validators.required],
      insideNumber: [null],
      outsideNumber: [null, Validators.required],
      neighborhood: [null, Validators.required],
      city: [null, Validators.required],
      status: [true],
    })
  }

  //?? Crea otro detalle de req en la alta 
  addAddress(): void {
    this.address.push(this.newAddress());
  }
  //?? Remueve el detalle de la req en la alta
  removeAddress(rowIndex: number): void {
    console.log(this.address.controls[rowIndex].valid)
    if (!this.address.controls[rowIndex].valid) {
      this.address.removeAt(rowIndex);
      console.log("borre")
    } else {
      // this.local_data.address.splice(rowIndex,1)
      // console.log(this.formCustomer.get(['address', 0]).value)
      this.address.controls[rowIndex].patchValue({ "status": "false" })
      //this.address.removeAt(rowIndex);
    }
  }


  onSubmit() {
    console.log(this.formCustomer.value);
  }
  /** Guarda registro de cliente */
  save(): void {
    let data = this.formCustomer.value;
    console.log(this.formCustomer.valid)

    // Al dar de alta un cliente, su estatus es true
    data.status = true;

    // Si los apellido o el teléfono 2 vienen sin información, ya que no son requeridas, los manda en null
    if (data.paternalLastName == undefined) {
      data.paternalLastName = null;
    }
    if (data.maternalLastName == undefined) {
      data.maternalLastName = null;
    }
    if (data.alternativePhone == undefined) {
      data.alternativePhone = null;
    }

    //  if (this.formCustomer.valid) {
    // Aquí va la inserción en la base de datos
    let customerFound = false;
    this.customers.forEach(cus => {
      if (data.phone == cus.phone) {
        customerFound = true;
        console.log("true")
      }
    })
    if (customerFound == false) {
      this.customerService.addClient(data).then((custom) => {
        this.toastr.success("Cliente Creado");
        this.closeDialog();
      })
    } else {
      this.toastr.error("El numero de telefono ingresado ya esta ligado con otro cliente");
    }
    //} else {
    //this.toastr.error("Favor de llenar campos faltantes");
    // }
  }
  //Actualiza
  update(): void {
    this.formCustomer.get("id").setValue(this.local_data.id)
    let data = this.formCustomer.value;
    console.log(data)
    let customerFound = false;

    // Al actualizar un tipo de producto, su estatus es true
    data.status = true;
    //obtiene el valor de la descripcion
    const phone = this.formCustomer.value.phone;
    //se traen todas las descripciones de la BD
    this.customers.forEach(data => {
      if (data.phone == phone) {
        if (this.formCustomer.get("id").value != data.id) {
          customerFound = true
        }
      }
    })
    if (customerFound == false) {
      // Aquí va la inserción en la base de datos
      this.customerService.updateCustomer(data.id, data)
      this.toastr.success("Cliente Actualizado");
      this.closeDialog();
    }
    else {
      this.toastr.error("El numero de telefono ingresado ya esta ligado con otro cliente");
    }
  }


  // ??????????????????????????????????
  /** Guarda registro de dirección de un cliente */
  saveAddress(): void {
    let data = this.formAddress.value;
    console.log(data)
    if (this.formAddress.valid) {
      // Aquí va la inserción en la base de datos
      this.customerService.addCustomer(data).then((customer: any) => {
        console.log(customer)
      });
    } else {
      //this.toastr.error("Favor de llenar campos faltantes");
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
    this.local_data.status = false;
    this.customerService.deleteCustomer(this.local_data.id, this.local_data).subscribe(res => {
      this.toastr.success('Cliente Eliminado')
    })
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
