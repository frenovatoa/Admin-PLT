import { Component, OnInit, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { User } from 'src/app/shared/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserType } from 'src/app/shared/interfaces/user.type';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ImageUploadService } from 'src/app/shared/services/image-upload.service';
import { user } from '@angular/fire/auth';
//import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss']
})

export class UsersDialogComponent {
  
  public dataSource: MatTableDataSource<UserType>;    
  searchText: any;

  private started: boolean = false;

  // Inicializo un arreglo vacío de tipos de usuarios
  public userType: UserType[]=[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  action: string;
  local_data: any;
  selectedImage: any = '';

  // Inicializo el formulario de usuarios
  public formUsers: FormGroup;  

  // Para la imagen
  public image: any;
  public showImage:any;
  // Un observable?
  //user$ = this.userService.currentUserProfile$;
  url: string;

  constructor(
      public datePipe: DatePipe,
      public dialogRef: MatDialogRef<UsersDialogComponent>,
      public fb: FormBuilder,
      public userService: UserService,
      public authService : AuthService,
      public toastr :ToastrService,
      // IMAGENES
      private storage: AngularFireStorage,
      private imageUploadService: ImageUploadService,
      //private toast: HotToastService,
      // @Optional() is used to prevent error if no data is passed
      @Optional() @Inject(MAT_DIALOG_DATA) public data: User) {
      this.local_data = { ...data };

      // Definimos una imagen por default, en caso que no se seleccione ninguna *****
      this.action = this.local_data.action;
      if (this.local_data.image === undefined) {
          this.local_data.image = 'assets/images/users/default.png';
      }
      console.log(this.local_data)
      // Formulario del diálogo, para insertar un nuevo registro
      // Se valida que todos los campos estén llenados antes de permitir guardar
      this.formUsers = this.fb.group ({
        uid: [''],
        userTypeId: [''],
        // Valida que el nombre y apellidos solo contengan letras y/o espacios
        //name: ['', Validators.required, Validators.pattern('[a-zA-Z ]*')],
        name: ['', Validators.required],
        paternalLastName: ['', Validators.required],
        maternalLastName: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
        status: ['', Validators.required],
        // La imagen no es requerida *****
        image: ['']
    });
  }

  ngOnInit() {
    // Traigo los tipos de usuarios de mi base de datos
    this.userService.getUserTypes().subscribe((userType: any)=>{
      console.log(userType)
      this.userType=userType
    });   
    if(this.local_data.uid != null){
      // Una vez que se inserta un usuario, no puede cambiar su correo
      //this.formUsers.get('email').disable()
      // La contraseña tampoco se puede modificar ??????????????????????????????????
      //this.formUsers.get('password').disable()
      // Ni el estatus no ??????????????????????????????????
      //this.formUsers.get('status').disable()
    }
  }

/** Guarda registro */
save(): void {
  let data = this.formUsers.value;
  data.uid = this.userService.unicID();
  
  // Obtengo el valor del email
  const email = this.formUsers.value.email;
  
  console.log(this)

  data.image = this.url;

  console.log(this.url) 
  if (email != 'claudiafl2002@outlook.com'){
    //console.log(this.data.email)
    if (this.formUsers.valid) {
      // Aquí va la inserción en la base de datos
        this.authService.SignUp(data).then((user: any)=>{
            this.toastr.success("Usuario Creado");
         });
         
      //this.uploadFile(data.image, data.uid)
    
         this.closeDialog();
    } else {
      this.toastr.error("Favor de llenar campos faltantes");
    }
  } else {
  this.toastr.error("Ya existe un usuario registrado con ese correo");
  }
}

  /** Actualiza registro */
update(): void {
  this.formUsers.get('uid').setValue(this.local_data.uid)
  let data = this.formUsers.value;
  console.log(data)
  if(this.image != undefined){
    data.image = this.image;
  }else{
    data.image = this.local_data.image
  }
  
  console.log(data.image)
  if (this.formUsers.valid) {
    // Aquí va la inserción en la base de datos
    this.userService.updateUser(data.uid, data);
    this.toastr.success("Usuario Actualizado");
    if(this.local_data.image !== data.image){
      this.uploadFile(data.image, this.local_data.uid)
    }    
    this.closeDialog();
  } else {
    //this.toastr.error("Favor de llenar campos faltantes");
  }
}

/** Actualiza estatus del registro, de manera que pase a no estar activo */
updateStatus(): void {  
  let data = this.local_data;
  // Todos los datos quedan igual excepto el estatus, que cambia a false
  data.status = false;
  console.log(data) 
  // Aquí va la inserción en la base de datos
  this.userService.updateUser(data.uid, data)
  this.toastr.success("Usuario Eliminado");
  this.closeDialog();  
}

  doAction(): void {
      this.dialogRef.close({ event: this.action, data: this.local_data });      
  }

  closeDialog(): void {
      this.dialogRef.close({ event: 'Cancelar' });
      //this.toastr.success("Usuario Creado");
  }

  setImage(event: any){
    console.log(event.target.files[0])
    this.image = event.target.files[0];
    this.showImage = event.target.files[0].type;

    // Vista previa de la imagen en el dialog
    const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
          this.local_data.image = reader.result;
      };
  }

  saveFile(event: any, uid:string) {
    let data = this.local_data;
    
    console.log(event)
    this.imageUploadService
      .uploadImage(event, `users/${uid}`)
      .pipe(
        // this.toast.observe({
        //   loading: 'Uploading profile image...',
        //   success: 'Image uploaded successfully',
        //   error: 'There was an error in uploading the image',
        // }),
        switchMap((image) =>
        this.url = image   
        )
      )
      .subscribe();
  }

  uploadFile(event: any, uid:string) {
    let data = this.local_data;
    
    console.log(uid)
    this.imageUploadService
      .uploadImage(event, `users/${uid}`)
      .pipe(
        // this.toast.observe({
        //   loading: 'Uploading profile image...',
        //   success: 'Image uploaded successfully',
        //   error: 'There was an error in uploading the image',
        // }),
        switchMap((image) =>
         this.userService.updateUserTest({
          uid,
          image,
        }       
      )
        )
      )
      .subscribe();
      console.log(this.url)
  }

  // selectFile(event: any): void {
  //     if (!event.target.files[0] || event.target.files[0].length === 0) {
  //         // this.msg = 'You must select an image';
  //         return;
  //     }
  //     const mimeType = event.target.files[0].type;
  //     if (mimeType.match(/image\/*/) == null) {
  //         //this.msg = "Only images are supported";
  //         return;
  //     }
  //     // tslint:disable-next-line - Disables all
  //     const reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     // tslint:disable-next-line - Disables all
  //     reader.onload = (_event) => {
  //         // tslint:disable-next-line - Disables all
  //         this.local_data.image = reader.result;
  //     };
  // } 
 
  // Función para mostrar y ocultar el campo de contraseña
  mostrar: boolean = false;
  mostrarContrasena() {
    this.mostrar = !this.mostrar;
}
} 