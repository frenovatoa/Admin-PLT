import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { User } from '../../shared/interfaces/user';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { timeStamp } from 'console';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public form: FormGroup = Object.create(null);
  constructor(private fb: FormBuilder, private router: Router, public authService: AuthService, public afAuth: AngularFireAuth,) { }
 /* public user:User={
    userTypeId: '1',
    name: 'Administracion',
    paternalLastName: 'Admin', 
    maternalLastName: 'Admom', 
    email: 'admin@plt.com',
    password: 'Admin123',
    status: 1, 
    image: ''
  }*/
  ngOnInit(): void {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  //  this.authService.SignUp(this.user);
  }

  onSubmit(): void {
    //this.router.navigate(['/dashboard'])
  }

  login(){
    this.authService.SignIn(this.form.controls.uname.value, this.form.controls.password.value)
  }

  // Restablecer contraseña
  ForgotPassword() {
    this.authService.ForgotPassword(this.form.controls.uname.value);
  }
}
