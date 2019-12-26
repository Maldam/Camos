import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userId: string;
  mail: string;
  method: any;
  
  constructor(
    public afAuth: AngularFireAuth
    
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
      } else {
        console.log('connecté: ' + auth.uid);
        this.userId = auth.uid;
        this.mail = auth.email;
        this.method = auth.providerData[0].providerId;
      }
    });
    
  }
  

}

