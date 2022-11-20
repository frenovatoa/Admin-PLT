import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import moment from 'moment';
import { Sale } from '../interfaces/sale';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private db: AngularFirestore, private firestore: Firestore) { }

  // Función que permite obtener los documentos (registros) de la tabla de ventas en la base de datos.
  getSale() {
    return this.db
   .collection("tbl_sales", ref => ref.where('status', '==', true))
   .valueChanges();
  }

  // Función que permite dar de alta documentos (registros) en la tabla de clientes en la base de datos.
  addSale(data: any) {
    return this.db
    .collection("tbl_sales")
    .add({...data})
  }
  
  // Funcion que permite obtener los documentos (registros) de la coleccion de una venta en la base de datos.
  getSaleDetail(id:string){
    return this.db
    .collection("tbl_sales").doc(id).collection("saleDetails")
    .valueChanges();
  }
  
  //Actualizar cantidad de los productos
  async updateProduct(id: any, data: any) {
    const ref = doc(this.firestore, `tbl_products`, id)
    from(updateDoc(ref, {id: id,
      quantity: data.quantity}))
  }


  // Función que permite dar de alta documentos (registros)
/*   addSale(data: any) {
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
  } */

  // Función que permite actualizar un documento (registro) en la tabla de ventas en la base de datos.
  async updateSale(id: any, data: any) {
    const ref = doc(this.firestore, `tbl_sales`, id)
    from(updateDoc(ref, {
      id: id,
      orderId: data.orderId,
      saleDate: data.saleDate,
      saleTypeId: data.saleTypeId,    
      status: data.status,
      totalCost: data.totalCost,
      userId: data.userId
    }))

     data.saleDetails.forEach(async add => {
      console.log(add)
      let addId =add.id
      console.log(id.id)
      if(add.id == null){
        addId =this.unicID();
        console.log(addId)
        await  await this.db.doc(`tbl_sales/${id}/saleDetails/${addId}`).set({
          id: addId,
          saleId: id,
          productId: add.productId,
          requestedQuantity: add.requestedQuantity,
          amount: add.amount,
          isCourtesy: add.isCourtesy,
          status: data.status
        })
      }else{        
          await this.db.doc(`tbl_sales/${id}/saleDetails/${addId}`).update({
          id: addId,
          saleId: id,
          productId: add.productId,
          requestedQuantity: add.requestedQuantity,
          amount: add.amount,
          isCourtesy: add.isCourtesy,
          status: data.status
        })
      }
    });   
  }  

  // Función que permite dar de alta un documento (registro) en la tabla de ventas en la base de datos.
  async addVentas(data: Sale) {
    const id = this.unicID();
    const custRef: AngularFirestoreDocument<any> = this.db.doc(
      `tbl_sales/${id}`
    );
    const saleData : Sale= {
      id: id,
      orderId: data.orderId,
      saleDate: data.saleDate,
      saleTypeId: data.saleTypeId,    
      status: data.status,
      totalCost: data.totalCost,
      userId: data.userId
    }
    await custRef.set(saleData, {
      merge:true
    })
    //console.log(data.saleDetails)
    data.saleDetails.forEach(async add => {
    let addId =this.unicID();
    console.log(id)
    await this.db.doc(`tbl_sales/${id}/saleDetails/${addId}`).set({
      id: addId,
      saleId: id,
      productId: add.productId,
      requestedQuantity: add.requestedQuantity,
      amount: add.amount,
      isCourtesy: add.isCourtesy,
      status: data.status
    })
    });
  }

  //Funcion que obtiene los datos de usuarios de la base de datos.
  getUsers() {
  return this.db
  .collection("tbl_users")
  .valueChanges();
  }

  //Funcion que obtiene los datos de tipos de venta de la base de datos.  
  getSaleTypes() {
  return this.db
  .collection("tbl_sale_types")
  .valueChanges();
  }

  //Funcion que obtiene los datos de productos de la base de datos.  
  getProducts() {
  return this.db
  .collection("tbl_products", ref => ref.orderBy('description', 'asc'))
  .valueChanges();
  }

  //Funcion que obtiene los datos de clientes de la base de datos.  
  getCustomers() {
  return this.db
  .collection("tbl_customers")
  .valueChanges();
  }

  //Funcion que obtiene los datos de tipos de productos de la base de datos.
  getTypeOfProduct() {
    return this.db
   .collection("tbl_product_types", ref => ref.where('status', '==', true))
   //.collection("tbl_product_types", ref => ref.orderBy('description', 'asc'))
   .valueChanges();
 }


  // Función que permite actualizar un documento (registro)
/*   updateSale(id: any, data: any) {
    this.db
    .doc(`tbl_sales/${id}`)
    .update({...data})
  }
 */

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