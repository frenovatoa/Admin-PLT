import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import * as moment from 'moment';
import { initializeApp } from '@angular/fire/app';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
//import { ToastrService } from 'ngx-toastr';
import { deleteUser, getAuth } from '@angular/fire/auth';
import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
  updateProfile,
  UserInfo,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = authState(this.auth);

  userData: any; // Save logged in user data
  loggedIn: boolean = false;
  config = {apiKey: "AIzaSyBg_QokV6yWF_I-kkoknODljZEjrWxDmZk",
  authDomain: "admin-plt.firebaseapp.com",
  databaseURL: "https://admin-plt-default-rtdb.firebaseio.com/"};
  secondaryApp:any;
  
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    public toastr: ToastrService,// NgZone service to remove outside scope warning
    // IMAGEN
    private auth: Auth
    
  ) {
    
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
        this.loggedIn = true;
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
        this.loggedIn = false;
      }
    });
    
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result)
        //this.SetUserData(result.user);
        console.log(result.user)
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            console.log(user.email)
           // this.getUserByEmail(user.email).subscribe((data:any)=>{
             // console.log(data)
              if(user){
                this.router.navigate(['dashboard']);
                this.loggedIn = true;
              }else{
                this.loggedIn = false;
                //this.toastr.error('Usuario o contraseña inválido');
              }
            //})
          }
          else{
            this.loggedIn = false;
           // this.toastr.error('Usuario o contraseña inválido');
          }
        });
      })
      .catch((error) => {
       this.toastr.error('Usuario o contraseña inválido');
      });
  }
  // Sign up with email/password
  SignUp(data:User) {
   this.secondaryApp = firebase.initializeApp(this.config, "Secondary");
  //this.setUserData(data);
  this.SetUserData(data);
   return this.secondaryApp.auth().createUserWithEmailAndPassword(data.email, data.password).then(function(firebaseUser) {    
    console.log("User " + data.name + " created successfully!");
        //I don't know if the next statement is necessary 
        this.toastr.success("Usuario Creado");
       
        this.secondaryApp.auth().signOut();
      })
      .catch((error) => {
        //this.toastr.success("Usuario Creado");
      });
      
  }
  updateEmail(data:any, oldEmail:any){
    this.secondaryApp = firebase.initializeApp(this.config, "Secondary");

   return this.secondaryApp.auth().signInWithEmailAndPassword(oldEmail, data.password).then(function(firebaseUser) {    
        firebaseUser.user.updateEmail(data.email);
        this.secondaryApp.auth().signOut();
      })
      .catch((error) => {
        console.log(error)
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.toastr.warning('El correo electrónico de restablecimiento de contraseña fue enviado, verifique su bandeja de entrada.');
      })
      .catch((error) => {
      this.toastr.error('Ocurrio un error verificar correo');
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    console.log(user)
    return (user !== null) ? true : false;
  }
get user(): User{
return JSON.parse(localStorage.getItem('user')!);
}

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['dashboard']);
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['dashboard']);
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const id = unicID();
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `tbl_users/${id}`
    );
    const userData: User = {
      uid: id,
      userTypeId: user.userTypeId,
      name: user.name,
      paternalLastName: user.paternalLastName,
      maternalLastName: user.maternalLastName,
      email: user.email,
      password: user.password,
      status: user.status,
      image: user.image
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/authentication/login']);
    });
  }

  getUserByEmail(email:string){
    return this.afs
    .collection("tbl_users", ref => ref.where('email', '==', email))
    .valueChanges();
  }
deleteUser(data){  
  this.secondaryApp = firebase.initializeApp(this.config, "Secondary");
   return this.secondaryApp.auth().signInWithEmailAndPassword(data.email, data.password).then(function(firebaseUser) {    
    console.log("User " + data.name + " created successfully!");
        //I don't know if the next statement is necessary 
        console.log(firebaseUser)
       deleteUser(firebaseUser.user).then(()=>{
    this.toastr.success("Usuario eliminado correctamente");
  })
        this.secondaryApp.auth().signOut();
      })
      .catch((error) => {
        //this.toastr.success("Usuario Creado");
      });
  // deleteUser(user).then(()=>{
  //   this.toastr.success("Usuario eliminado correctamente");
  // })
}
}


function unicID(): string {
  const today = moment();

  return (
    today.day() +
    today.month() +
    today.year() +
    Math.random().toString(36).substring(2, 15)
  );
}