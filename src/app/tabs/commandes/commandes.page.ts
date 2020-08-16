import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ConnexionService } from '../../services/connexion.service';

@Component({
  selector: 'app-commandes',
  templateUrl: 'commandes.page.html',
  styleUrls: ['commandes.page.scss']
})
export class CommandesPage implements OnInit {
  public userId: string;
  public mail: string;
  public method: any;
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
  public deconnexion() {
    this.connexionService.deconnexionUtilisateur();
  }
  public ngOnInit() {
  }
}