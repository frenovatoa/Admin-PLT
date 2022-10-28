import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import moment from 'moment';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFirestore) { }

  // Función que permite obtener los documentos (registros) de la coelcción (tabla) de productos
  getProducts() {
    return this.db
   .collection("tbl_products")
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros) en la coelcción (tabla) de productos
  addProduct(data: any) {
    const id = this.unicID();

    const product: AngularFirestoreDocument<any>= this.db.doc(
      `tbl_products/${id}`
    );

    const productRef : Product={
      id: id,
      productTypeId: data.productTypeId,
      description: data.description,
      quantity: data.quantity,
      image: data.image,
      status: data.status
    }

    return product.set(productRef,{
      merge: true
    })
  }

  // Función que permite actualizar un documento (registro) en la coelcción (tabla) de productos
  updateProduct(id: any, data: any) {
    this.db
    .doc(`tbl_product_types/${id}`)
    .update({...data})
  }

  // Función que permite obtener los documentos (registros) de la coelcción (tabla) de productos
  getProductTypes() {
    return this.db
    .collection("tbl_product_types")
    .valueChanges();
  }

  // Función que genera un id automático
  unicID(): string {
    const today = moment();
  
    return (
      today.day() +
      today.month() +
      today.year() +
      Math.random().toString(36).substring(2, 15)
    );
    }
 
}