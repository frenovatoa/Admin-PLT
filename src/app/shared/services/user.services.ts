import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore) { }

  // Función que permite obtener los documentos (registros) de la tabla de usuarios en la base de datos
  getUser() {
    return this.db
   .collection("tbl_users")
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros) en la tabla de usuarios en la base de datos
  addUser(data: any) {
    return this.db
    .collection("tbl_users")
    .add({...data})
  }

  // Función que permite actualizar un documento (registro) en la tabla de usuarios en la base de datos
  updateUser(uid: any, data: any) {
    this.db
    .doc(`tbl_users/${uid}`)
    .update({...data})
  }

  // Función que permite obtener los registros de la tabla de tipos de usuarios en la base de datos, para utilizarlo en usuarios
  getUserTypes() {
    return this.db
   .collection("tbl_user_types")
   .valueChanges();
 }
 
}