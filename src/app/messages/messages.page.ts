import { Component, OnInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import {IonInfiniteScroll} from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  connected = false;
  messageText: any;
  messages= [];
  idTchat=''

   MesDiscussion=[]
  sendSms:any;
  idConvExist=false
  IdConversation=localStorage.getItem('monContactId')+""+localStorage.getItem('contact')
  TabStatut=[]
  Moncontact
  public userId=localStorage.getItem('monContactId')

  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;

  lastKey: string= "";

  samples = [];

  isFinished = false;
  

  constructor(
    public afDB : AngularFireDatabase,
    public afAuth : AngularFireAuth,
    public afstore: AngularFirestore,
    public afsstorage: AngularFireStorage,
    public activ: ActivatedRoute
  ) { 
    this.afAuth.authState.subscribe( auth => {
      if(!auth){
        console.log('Offline');
      } else {
        console.log ('user online' + auth.email);
        this.connected = true;
        this.userId = auth.email;
       // this.getMessages();
      }
    } )
  console.log(this.userId)
  
  
  
  }

  ngOnInit() {
    this.activ.params.subscribe(res => {
      console.log(res);
      this.Moncontact=res
    })
    this.existe(localStorage.getItem('monContactId')+""+localStorage.getItem('contact'))
    this.getSamples();
  }

  getSamples(){
   // firebase. database(). ref("samples")
  }

  sendMessage() {
    this.sendSms=this.messageText
    const infosMessage  ={
      uidSend:this.userId,
      contentMessage: this.sendSms,
      date: new Date(),
      heure: `${new Date().getHours()}:${new Date().getMinutes()}`,
      assets: "",
    };
    this.messages.push(infosMessage);
    this.messageText=''

      this.afstore.collection(`Conversation/`).doc(this.IdConversation).collection(`message`).add({
        uidSend:this.userId,
        contentMessage: this.sendSms,
        date: new Date(),
        heure: `${new Date().getHours()}:${new Date().getMinutes()}`,
        assets: '',
      })
      
  }
  existe(id) {
    this.afstore.collection(`Conversation/`).doc(`tchatId`).collection(`tchatId`)
    .snapshotChanges(['added'])
    .subscribe(actions => {
      var trouve=false
      actions.forEach(action => {
          if((id).localeCompare(action.payload.doc.get('id'))==0){
            trouve = true
          }
        })
        if(trouve==false) this.IdConversation=localStorage.getItem('contact')+""+localStorage.getItem('monContactId');
        else{
          this.IdConversation=localStorage.getItem('monContactId')+""+localStorage.getItem('contact')
          
    
        } 
        this.getMessage(this.IdConversation)
    });
    localStorage.setItem("tchatId",this.IdConversation)
  }

  getMessage(id) {
    localStorage.setItem("tchatId",id)
    this.afstore.doc(`Conversation/${id}`).collection(`message/`,ref =>ref.orderBy('date'))
    .snapshotChanges(['added'])
    .subscribe(actions => {
      
      this.messages = [];
      actions.forEach(action => {
        console.log(action.payload.doc.get('uidSend'))
            this.messages.push({
              uidSend:action.payload.doc.get('uidSend'),
              nomSend: action.payload.doc.get('nomSend'),
              contentMessage: action.payload.doc.get('contentMessage'),
              date: action.payload.doc.get('date'),
              heure: action.payload.doc.get('heure'),
              assets: action.payload.doc.get('assets'),
          })
      });
      
    });
  }

  /*sendMessage() {
    console.log('messageText: ' + this.messageText);
    this.afStore.collection('Tchat').doc(this.idTchat).collection('Messages/').add({
      userId: this.userId,
      text: this.messageText,
      date: new Date().toISOString()
    });
    this.messageText= '';
  }*/
 /* getMessages(){
    this.afStore.collection('Tchat').doc(this.idTchat).collection('Messages/').snapshotChanges(['added']).subscribe(actions =>{

      this.messages = [];
      actions.forEach(action =>{
        console.log('MessageText' + action.payload.doc());
        this.messages.push({
          text: action.payload.exportVal().text,
          userId: action.payload.exportVal().userId,
          date: action.payload.exportVal().date,
        })
      })
    } )
  } */

}
