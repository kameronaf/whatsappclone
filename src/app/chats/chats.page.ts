import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

   Disc = [];
    register = [];
    i =0;  
    id=localStorage.getItem("contact")
  constructor(
    public fst: AngularFirestore,
    public fstage: AngularFireStorage,
    public navCtl: NavController,
    public route: Router
  ) { 
    this.fst.collection('user/').get().subscribe(images => {
      this.Disc=[]
      images.docs.forEach((doc)=>{
        this.register.push(doc.data());
      })
      this.register.map((element)=>{
        const information = this.fstage.ref(element.image)
        information.getDownloadURL().subscribe(imgUrl => {
            if(element.id!=localStorage.getItem("contact")){
              const contact={
                nom: element.nom,
                email: element.email,
                id: element.id,
                image:imgUrl,
              }
            this.i++;
            this.Disc.push(contact)
          }
        });
      })
      console.log(this.Disc)
    });
  }

  ngOnInit() {
  }

  selectChat(datas){
   console.log(datas);
  
  this.fst.collection(`Talking/`).doc(`chatId`).collection(`chatId`)
  .get()
  .subscribe(actions => {
    var trouve=false
    var tab=[]
    actions.docs.forEach(action => {
      tab.push(action.data())
    })
    tab.map(element=>{
      if((this.id+""+datas.id).localeCompare(element.id)==0 || 
        ((element.id)).localeCompare(datas.id+""+this.id)==0){
          trouve = true
        }
    })
        
      if(trouve==false){
        this.fst.collection(`Talking/`).doc(`tchatId`).collection(`tchatId`).add({
          id: datas.id+""+localStorage.getItem('contact')
        })
      }
      
    });
    localStorage.setItem("monContactId",datas.id)

  const link=["messages", datas];
  this.route.navigate(link);

}  

 goto(){
   console.log("select");
   this.navCtl.navigateForward('contact')
 }

}
