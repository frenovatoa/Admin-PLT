import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { orderBy } from 'firebase/firestore';
import moment from 'moment';
import { Sale } from '../interfaces/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private db: AngularFirestore) { }

  // Función que permite obtener los documentos (registros)
  getSale() {
    return this.db
   .collection("tbl_sales")
   .valueChanges();
 }



  // Función que permite dar de alta documentos (registros)
  addSale(data: any) {
    const id = this.unicID();
    const saleRef: AngularFirestoreDocument<any> = this.db.doc(
      `tbl_sales/${id}`
    );
    const sale: Sale = {
      id: id,
      orderId: data.orderBy,
      userId: data.userId,
      saleTypeId: data.saleTypeId,
      saleDate: data.saleDate,
      totalCost: data.totalCost,
      status: data.status
    }
    return saleRef.set(sale,{
      merge:true
    })
  }

  getUsers() {
    return this.db
   .collection("tbl_users")
   .valueChanges();
 }

  getSaleTypes() {
    return this.db
   .collection("tbl_sale_types")
   .valueChanges();
 }

/*  getProducts() {
  return this.db
 .collection("tbl_products")
 .valueChanges();
} */

getCustomers() {
    return this.db
   .collection("tbl_customers")
   .valueChanges();
  }

  // Función que permite actualizar un documento (registro)
  updateSale(id: any, data: any) {
    this.db
    .doc(`tbl_sales/${id}`)
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