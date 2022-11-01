import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { orderBy } from 'firebase/firestore';
import moment from 'moment';
import { SaleDetail } from '../interfaces/sale.detail';

@Injectable({
  providedIn: 'root'
})
export class SaleDetailService {

  constructor(private db: AngularFirestore) { }

  // Función que permite obtener los documentos (registros)
  getSaleDetails() {
    return this.db
   .collection("tbl_sale_details")
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros)
  addSaleDetail(data: any) {
    const id = this.unicID();
    const saleDetailRef: AngularFirestoreDocument<any> = this.db.doc(
      `tbl_sale_details/${id}`
    );
    const saleDetail: SaleDetail = {
      id: id,
      saleId: data.saleId,
      productId: data.prorductId,
      requestedQuantity: data.requestedQuantity,
      amount: data.amount,
      isCourtesy: data.isCourtesy
    }
    return saleDetailRef.set(saleDetail,{
      merge:true
    })
  }

  getSaleTypes() {
    return this.db
   .collection("tbl_sale_types")
   .valueChanges();
 }

 getProducts() {
  return this.db
 .collection("tbl_products")
 .valueChanges();
}

  // Función que permite actualizar un documento (registro)
  updateSaleDetail(id: any, data: any) {
    this.db
    .doc(`tbl_sale_details/${id}`)
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