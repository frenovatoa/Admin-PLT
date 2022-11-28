import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private db: AngularFirestore) { }

  // Función que permite obtener los documentos (registros) de la coelcción (tabla) de productos
  getOrders() {
    return this.db
      .collection("tbl_orders", ref => ref.where('status', '==', "pendiente"))
      .valueChanges();
  }
  getCustumer(id: string) {
    return this.db
      .collection("tbl_customers", ref => ref.where('status', '==', true)).doc(id)
      .valueChanges();
  }
  getAddress(id: string, addId: string) {
    return this.db
      .collection("tbl_customers").doc(id).collection("address", ref => ref.where('status', '==', true)).doc(addId)
      .valueChanges();
  }

}