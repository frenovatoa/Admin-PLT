import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFirestore) {}

  getData() {
    return this.db
   .collection("tbl_tipos_usuarios")
   .valueChanges();
 }
}
