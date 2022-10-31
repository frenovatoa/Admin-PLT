import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import moment from 'moment';
import { Product } from '../interfaces/product';
import { AuthService } from '../auth/auth.service';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFirestore, private firestore: Firestore) { }

  // Función que permite obtener los documentos (registros) de la coelcción (tabla) de productos
  getProducts() {
    return this.db
   .collection("tbl_products", ref => ref.where('status', '==', true))
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
  // addProduct(data: any) {
  //   return this.db
  //   .collection("tbl_products")
  //   .add({...data})
  // }

  // Función que permite actualizar un documento (registro) en la coelcción (tabla) de productos
  // updateProduct(id: any, data: any) {
  //   this.db
  //   .doc(`tbl_products/${id}`)
  //   .update({...data})
  // }

  updateProduct(id: any, data: any) {
    this.db
    .doc(`tbl_products/${id}`)
    .update({
      id: data.id,
      productTypeId: data.productTypeId,
      description: data.description,
      quantity: data.quantity,
      status: data.status
    })
  }

  updateProductTest(product: Product): Observable<void> {
    const ref = doc(this.firestore, 'tbl_products', product.id);
    return from(updateDoc(ref, { ...product }));
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