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
import { Customer } from '../interfaces/customer';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private db: AngularFirestore,private firestore: Firestore) { }

  // Función que permite obtener los documentos (registros) de la tabla de clientes en la base de datos
  getCustomer() {
    return this.db
   .collection("tbl_customers", ref => ref.where('status', '==', true))
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros) en la tabla de clientes en la base de datos
  addCustomer(data: any) {
    return this.db
    .collection("tbl_customers")
    .add({...data})
  }
getAddress(id:string){
  return this.db
  .collection("tbl_customers").doc(id).collection("address",  ref => ref.where('status', '==', true))
  .valueChanges();
}
  // Función que permite actualizar un documento (registro) en la tabla de clientes en la base de datos
  async updateCustomer(id: any, data: any) {
    const ref = doc(this.firestore, `tbl_customers`, id)
    from(updateDoc(ref, {id: id,
      name: data.name,
      paternalLastName: data.paternalLastName,
      maternalLastName: data.maternalLastName,    
      phone: data.phone,
      alternativePhone: data.alternativePhone,
      status:data.status}))

     data.address.forEach(async add => {
      console.log(add)
        let addId =add.id
        console.log(id.id)
        if(add.id == null){
        addId =this.unicID();
       console.log(addId)
      await  await this.db.doc(`tbl_customers/${id}/address/${addId}`).set({
        id: addId,
        customerId: id,
        postCode: add.postCode,
        street: add.street,
        insideNumber:add.insideNumber, 
        outsideNumber: add.outsideNumber,
        neighborhood: add.neighborhood,
        city:add.city,
        status: add.status
      })
 
        }else{
          
          await this.db.doc(`tbl_customers/${id}/address/${addId}`).update({
          id: addId,
          customerId: id,
          postCode: add.postCode,
          street: add.street,
          insideNumber:add.insideNumber, 
          outsideNumber: add.outsideNumber,
          neighborhood: add.neighborhood,
          city:add.city,
          status: add.status
        })
        }

       
      });
     
  }

   async addClient(data: Customer) {
    
    const id = this.unicID();

    const custRef: AngularFirestoreDocument<any> = this.db.doc(
      `tbl_customers/${id}`
    );

     const customerData : Customer= {
      id: id,
      name: data.name,
      paternalLastName: data.paternalLastName,
      maternalLastName: data.maternalLastName,    
      phone: data.phone,
      alternativePhone: data.alternativePhone,
      status:data.status
    }
    await custRef.set(customerData, {
      merge:true
    })
     
console.log(data.address)
      data.address.forEach(async add => {
       let addId =this.unicID();
       console.log(id)
      await this.db.doc(`tbl_customers/${id}/address/${addId}`).set({
         id: addId,
         customerId: id,
         postCode: add.postCode,
         street: add.street,
         insideNumber:add.insideNumber, 
         outsideNumber: add.outsideNumber,
         neighborhood: add.neighborhood,
         city:add.city,
         status: add.status
       })
  
     });
    
  }
//Funcion que elimina cliente
deleteCustomer(id:any, data:any): Observable<void>{
    const ref = doc(this.firestore, `tbl_customers`, id)
     return from(updateDoc(ref, {id: id,
      name: data.name,
      paternalLastName: data.paternalLastName,
      maternalLastName: data.maternalLastName,    
      phone: data.phone,
      alternativePhone: data.alternativePhone,
      status:data.status}))
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