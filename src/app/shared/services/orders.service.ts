import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import {
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import moment from 'moment';
import { Customer } from '../interfaces/customer';
import { from, Observable } from 'rxjs';
import { Order } from '../interfaces/order';
import { Sale } from '../interfaces/sale';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private db: AngularFirestore,private firestore: Firestore) { }

  // Función que permite obtener los documentos (registros) de la tabla de clientes en la base de datos
  getOrders() {
    return this.db
   .collection("tbl_orders",ref =>  ref.where('status', '!=', "false"))
   .valueChanges();
 }
 getCustumer(id:string){
  return this.db
  .collection("tbl_customers", ref =>  ref.where('status', '==', true)).doc(id)
  .valueChanges();
}
 getAddress(id:string, addId:string){
  return this.db
  .collection("tbl_customers").doc(id).collection("address",  ref => ref.where('status', '==', true)).doc(addId)
  .valueChanges();
}
   async addOrder(data: Order) {
    
    const id = this.unicID();

    const custRef: AngularFirestoreDocument<any> = this.db.doc(
      `tbl_orders/${id}`
    );

     const orderData : Order= {
      id: id,
    customerId: data.customerId,
    userId: data.userId,
    addressId: data.addressId,
    saleTypeId: data.saleTypeId,
    requestDate: data.requestDate,
    deliveryDate: data.deliveryDate,
    orderNotes: data.orderNotes,
    totalCost: data.totalCost,
    deliveryCost: data.deliveryCost,
    status: data.status
    }
    await custRef.set(orderData, {
      merge:true
    })
    
      data.orderDetails.forEach(async add => {
       let addId =this.unicID();
       console.log(id)
      await this.db.doc(`tbl_orders/${id}/orderDetails/${addId}`).set({
        id: addId,
    orderId: id,
    productId: add.productId,
    requestedQuantity: add.requestedQuantity,
    amount: add.amount,
    isCourtesy: add.isCourtesy,
    status: true
       })
  
     });
    
  }
//Funcion que elimina cliente
deleteOrder(id:any, data:any): Observable<void>{
    const ref = doc(this.firestore, `tbl_customers`, id)
     return from(updateDoc(ref, {id: id,
      name: data.name,
      paternalLastName: data.paternalLastName,
      maternalLastName: data.maternalLastName,    
      phone: data.phone,
      alternativePhone: data.alternativePhone,
      status:data.status}))
}

async updateStatus(id:any, data:any): Promise<Observable<void>>{

  const ref = doc(this.firestore, `tbl_orders`, id)
   return await from(updateDoc(ref, {
    status:data.status}))
}
getOrderDetail(id:string){
  return this.db
  .collection("tbl_orders").doc(id).collection("orderDetails", ref => ref.where('status', '==', true))
  .valueChanges();
}

async updateOrder(id: any, data: any) {
  const ref = doc(this.firestore, `tbl_orders`, id)
  from(updateDoc(ref, {id: id,
    totalCost: data.totalCost,
    deliveryCost: data.deliveryCost
  }))

   data.orderDetailsUp.forEach(async add => {
    console.log(add)
      let addId =add.id
      console.log(id.id)
  
  if(add.id == null){
      addId =this.unicID();
     console.log(addId)
    await  await this.db.doc(`tbl_orders/${id}/orderDetails/${addId}`).set({
      id: addId,
      orderId: id,
      productId: add.productId,
      requestedQuantity: add.requestedQuantity,
      amount: add.amount,
      isCourtesy: add.isCourtesy,
      status: true
    })

      }else{
        
        await this.db.doc(`tbl_orders/${id}/orderDetails/${addId}`).update({
          id: addId,
          orderId: id,
          productId: add.productId,
          requestedQuantity: add.requestedQuantity,
          amount: add.amount,
          isCourtesy: add.isCourtesy,
          status:add.status
      })
      }

     
    });
   
}
async addVentas(data: Order) {
  const id = this.unicID();


  const custRef: AngularFirestoreDocument<any> = this.db.doc(
    `tbl_sales/${id}`
  );
  const saleData : Sale= {
    id: id,
    orderId: data.id,
    saleDate: data.deliveryDate,
    saleTypeId: data.saleTypeId,    
    status: true,
    totalCost: data.totalCost,
    userId: data.userId
  }
  await custRef.set(saleData, {
    merge:true
  })
  //console.log(data.saleDetails)
  data.orderDetails.forEach(async add => {
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

   // Función que me da un id automático para los usuarios
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
