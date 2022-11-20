import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import moment from 'moment';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';
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
import { Production } from '../interfaces/production';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  constructor(private db: AngularFirestore,private firestore: Firestore, private authService: AuthService) { }

  // Función que permite obtener los documentos (registros) de la tabla de usuarios en la base de datos
  // Solo me trae los usuarios con estatus true, es decir, que si están activos
  getProduction() {
    return this.db
   .collection("tbl_productions")
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros) en la tabla de usuarios en la base de datos
  addProduction(data: any) {
    return this.db
    .collection("tbl_users")
    .add({...data})
  }

  // Funcion que permite obtener los documentos (registros) de la coleccion de una producción en la base de datos.
  getProductionDetail(id:string){
    return this.db
    .collection("tbl_productions").doc(id).collection("productionDetails")
    .valueChanges();
  }

  // Función que permite actualizar un documento (registro) en la tabla de usuarios en la base de datos
  // updateProduction(uid: any, data: any) {
  //   this.db
  //   .doc(`tbl_users/${uid}`)
  //   .update({uid: data.uid,
  //     userTypeId: data.userTypeId,
  //     name: data.name,
  //     paternalLastName: data.paternalLastName,
  //     maternalLastName: data.maternalLastName,
  //     email: data.email,
  //     password: data.password,
  //     status: data.status})
  // }

  updateProductionTest(user: User): Observable<void> {
    const ref = doc(this.firestore, 'tbl_users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }


  // Función que permite actualizar un documento (registro) en la tabla de ventas en la base de datos.
  async updateProduction(id: any, data: any) {
    const ref = doc(this.firestore, `tbl_productions`, id)
    from(updateDoc(ref, {
      id: id,
      productionDate: data.productionDate,
      productionNotes: data.productionNotes,    
      userId: data.userId
    }))

     data.productionDetails.forEach(async add => {
      console.log(add)
      let addId =add.id
      console.log(id.id)
      if(add.id == null){
        addId =this.unicID();
        console.log(addId)
        await  await this.db.doc(`tbl_productions/${id}/productionDetails/${addId}`).set({
          id: addId,
          productionId: id,
          productId: add.productId,
          producedQuantity: add.producedQuantity,
          status: data.status,
        })
      }else{        
          await this.db.doc(`tbl_productions/${id}/productionDetails/${addId}`).update({
          id: addId,
          productionId: id,
          productId: add.productId,
          producedQuantity: add.producedQuantity,
          status: data.status,
        })
      }
    });   
  }  

  // Función que permite dar de alta un documento (registro) en la tabla de ventas en la base de datos.
  async addProduccion(data: Production) {
    const id = this.unicID();
    const custRef: AngularFirestoreDocument<any> = this.db.doc(
      `tbl_productions/${id}`
    );
    const saleData : Production= {
      id: id,
      productionDate: data.productionDate,
      productionNotes: data.productionNotes,    
      userId: data.userId
    }
    await custRef.set(saleData, {
      merge:true
    })
    console.log(data.productionDetails)
    data.productionDetails.forEach(async add => {
    let addId =this.unicID();
    console.log(id)
    await this.db.doc(`tbl_productions/${id}/productionDetails/${addId}`).set({
      id: addId,
      productionId: id,
      productId: add.productId,
      producedQuantity: add.producedQuantity,
      //status: data.status,
    })
    });
  }

  //Funcion que obtiene los datos de usuarios de la base de datos.
  getUsers() {
  return this.db
  .collection("tbl_users")
  .valueChanges();
  }

  //Funcion que obtiene los datos de productos de la base de datos.  
  getProducts() {
  return this.db
  .collection("tbl_products", ref => ref.where('status', '==', true))
  .valueChanges();
  }

  //Funcion que obtiene los datos de tipos de productos de la base de datos.
  getTypeOfProduct() {
    return this.db
   .collection("tbl_product_types", ref => ref.where('status', '==', true))
   //.collection("tbl_product_types", ref => ref.orderBy('description', 'asc'))
   .valueChanges();
 }

 //Actualizar cantidad de los productos
 async updateProduct(id: any, data: any) {
  const ref = doc(this.firestore, `tbl_products`, id)
  from(updateDoc(ref, {id: id,
    quantity: data.quantity}))
}

 // Función que me da un id automático para las producciones
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