import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})



export class AuthPage implements OnInit {
  dataUser = {
    id: '',
    email: '',
    password: ''
  };
  
  constructor(
     private navCtrl: NavController,
     public ngFireAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
  }


  async login(){
    const user = await this.ngFireAuth.signInWithEmailAndPassword(this.dataUser.email, this.dataUser.password);
  localStorage.setItem("contact",user.user.uid)

    if (user.user.email){
    //   if (user.user.emailVerified){
      this.navCtrl.navigateForward('/home/chats'); //}
   //  else {
      alert(' Confirmer votre E-mail' + this.dataUser.email);
    // }
    }
     else {
      alert('Login Failed');
    }
  }

  async inscription(){
    const user = await this.ngFireAuth.createUserWithEmailAndPassword(this.dataUser.email, this.dataUser.password);
    console.log(user);

    if (user.user.email){
      alert('Consulter votre boite E-mail pour confirmer');
      await user.user.sendEmailVerification();
      alert('Vous avez été ajouté');
      
    } else {
      alert('Registration Failed');
    }
  }


  loggin(){
   this.navCtrl.navigateForward('register')
 }
}
