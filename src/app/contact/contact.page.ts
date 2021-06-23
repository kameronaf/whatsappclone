import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router, RouterModule } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  tabDisc = [];
  TabUserDiscuss = [];
  nbrContact =0;  
  id=localStorage.getItem("contact")
  constructor(
    public fst: AngularFirestore,
    public fstage: AngularFireStorage,
    public navCtl: NavController,
    public route: Router
  ) { 
    this.fst.collection('user/').get().subscribe(images => {
      this.tabDisc=[]
      images.docs.forEach((doc)=>{
        this.TabUserDiscuss.push(doc.data());
      })
      this.TabUserDiscuss.map((element)=>{
        const refImage = this.fstage.ref(element.image)
        refImage.getDownloadURL().subscribe(imgUrl => {
            if(element.id!=localStorage.getItem("contact")){
              const contact={
                nom: element.nom,
                email: element.email,
                id: element.id,
                image:imgUrl,
              }
            this.nbrContact++;
            this.tabDisc.push(contact)
          }
        });
      })
      console.log(this.tabDisc)
    });
  }

  ngOnInit() {
  }

  selectChat(datas){
   console.log(datas);
  
  this.fst.collection(`Conversation/`).doc(`tchatId`).collection(`tchatId`)
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
        this.fst.collection(`Conversation/`).doc(`tchatId`).collection(`tchatId`).add({
          id: datas.id+""+localStorage.getItem('contact')
        })
      }
      
    });
    localStorage.setItem("monContactId",datas.id)

  const link=["messages", datas];
  this.route.navigate(link);

}


}
