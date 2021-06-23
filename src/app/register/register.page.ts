import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  dataUser = {
    nom: '',
    email: '',
    password: ''
  };

  public pp;

  constructor(
    public fst: AngularFirestore,
    public fstage: AngularFireStorage,
    public ngFireAuth: AngularFireAuth,
    public navCtl: NavController
    
  ) { 
     
  
  }

  ngOnInit() {
  }

  ppstore(e){
    var folder= e.srcElement.files[0];
    this.pp=folder
  }

  store(){
    
    this.ngFireAuth.createUserWithEmailAndPassword(this.dataUser.email, this.dataUser.password).then(result =>{
     const tokoss = `tokoss/${new Date().getSeconds()}`
     const chemin = this.fstage.ref(tokoss);
     chemin.put(this.pp).then(photo =>{
       this.fst.doc(`user/${result.user.uid}`).set({
          id: result.user.uid,
          nom: this.dataUser.nom,
          email: this.dataUser.email,
          password: this.dataUser.password,
          image: tokoss
       })
        
     })
   })
   this.navCtl.navigateForward('auth')
  }


}
