import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ConnexionService } from '../../services/connexion.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  userId: string;
  mail: string;
  method: any;
  
  constructor(
    public afAuth: AngularFireAuth,
    public connexionService: ConnexionService
    
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        console.log('non connecté');
      } else {
        this.userId = auth.uid;
        this.mail = auth.email;
        this.method = auth.providerData[0].providerId;
      }
    });
  }
  deconnexion() {
    this.connexionService.deconnexionUtilisateur();
  }
  ngOnInit(){
  }
}