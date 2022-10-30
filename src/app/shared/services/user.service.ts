import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore,private firestore: Firestore, private authService: AuthService) { }

  // Función que permite obtener los documentos (registros) de la tabla de usuarios en la base de datos
  // Solo me trae los usuarios con estatus true, es decir, que si están activos
  getUser() {
    return this.db
   .collection("tbl_users", ref => ref.where('status', '==', true))
   .valueChanges();
 }

  // Función que permite dar de alta documentos (registros) en la tabla de usuarios en la base de datos
  addUser(data: any) {
    return this.db
    .collection("tbl_users")
    .add({...data})
  }

  // Función que permite actualizar un documento (registro) en la tabla de usuarios en la base de datos
  updateUser(uid: any, data: any) {
    this.db
    .doc(`tbl_users/${uid}`)
    .update({uid: data.uid,
      userTypeId: data.userTypeId,
      name: data.name,
      paternalLastName: data.paternalLastName,
      maternalLastName: data.maternalLastName,
      email: data.email,
      password: data.password,
      status: data.status})
  }

  updateUserTest(user: User): Observable<void> {
    const ref = doc(this.firestore, 'tbl_users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }


  // Función que permite obtener los registros de la tabla de tipos de usuarios en la base de datos, para utilizarlo en usuarios
  getUserTypes() {
    return this.db
   .collection("tbl_user_types")
   .valueChanges();
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


  // get currentUserProfile$(): Observable<User | null> {
  //   return this.authService.currentUser$.pipe(
  //     switchMap((user) => {
  //       if (!user?.uid) {
  //         return of(null);
  //       }

  //       const ref = doc(this.firestore, 'users', user?.uid);
  //       return docData(ref) as Observable<User>;
  //     })
  //   );
  // }
}