import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { orderBy } from 'firebase/firestore';
import moment from 'moment';
import { ProductType } from '../interfaces/product.type';

@Injectable({
  providedIn: 'root'
})
export class TypeOfProductService {

  constructor(private db: AngularFirestore) { }

  // Función que permite obtener los documentos (registros)
  getTypeOfProduct() {
    return this.db
   .collection("tbl_product_types", ref => ref.where('status', '==', true))
   //.collection("tbl_product_types", ref => ref.orderBy('description', 'asc'))
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros)
  addTypeOfProduct(data: any) {
    const id = this.unicID();
    const typeref: AngularFirestoreDocument<any> = this.db.doc(
      `tbl_product_types/${id}`
    );
    const typeOfProduct: ProductType = {
      id: id,
      description: data.description,
      retailPrice: data.retailPrice,
      wholesalePrice: data.wholesalePrice,
      status: data.status
    }
    return typeref.set(typeOfProduct,{
      merge:true
    })
  }

  // Función que permite actualizar un documento (registro)
  updateTypeOfProduct(id: any, data: any) {
    this.db
    .doc(`tbl_product_types/${id}`)
    .update({...data})
  }


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