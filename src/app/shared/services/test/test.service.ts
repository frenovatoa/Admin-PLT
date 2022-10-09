import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private db: AngularFirestore) { }

  // Función que permite obtener los documentos (registros) de la coelcción (tabla) indicada
  getData() {
    return this.db
   .collection("tbl_tipos_usuarios")
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros) en una determinada colleción (tabla)
  addData(data: any) {
    return this.db
    .collection("tbl_tipos_usuarios")
    .add({...data})
  }

  // Función que permite actualizar un documento (registro) en una determinada colleción (tabla)
  updateData(id: any, data: any) {
    this.db
    .doc(`tbl_tipos_usuarios/${id}`)
    .update({...data})
  }
 
}