import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  constructor(private db: AngularFirestore) { }

  // Función que permite obtener los documentos (registros) de la coelcción (tabla) de productos
  getProductTypes() {
    return this.db
   .collection("tbl_product_types")
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros) en la coelcción (tabla) de productos
  addProductType(data: any) {
    return this.db
    .collection("tbl_product_types")
    .add({...data})
  }

  // Función que permite actualizar un documento (registro) en la coelcción (tabla) de productos
  updateProductType(id: any, data: any) {
    this.db
    .doc(`tbl_product_types/${id}`)
    .update({...data})
  }
 
}