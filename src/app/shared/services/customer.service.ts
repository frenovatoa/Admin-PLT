import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private db: AngularFirestore) { }

  // Función que permite obtener los documentos (registros) de la tabla de clientes en la base de datos
  getCustomer() {
    return this.db
   .collection("tbl_customers")
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros) en la tabla de clientes en la base de datos
  addCustomer(data: any) {
    return this.db
    .collection("tbl_customers")
    .add({...data})
  }

  // Función que permite actualizar un documento (registro) en la tabla de clientes en la base de datos
  updateCustomer(id: any, data: any) {
    this.db
    .doc(`tbl_customers/${id}`)
    .update({...data})
  }

 
}