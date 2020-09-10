import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ConnexionService } from '../../services/connexion.service';
import { CommandesService } from 'src/app/services/commandes.service';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { CommandeModele } from 'src/app/modeles/commande.modele';
import { ModalController } from '@ionic/angular';
import { ModalCommandesPage } from 'src/app/modals/modal-commandes/modal-commandes.page';

@Component({
  selector: 'app-commandes',
  templateUrl: 'commandes.page.html',
  styleUrls: ['commandes.page.scss']
})
export class CommandesPage implements OnInit {
  public userId: string;
  public mail: string;
  public method: any;
  
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public listeCommandes: Array<CommandeModele> = new Array<CommandeModele>();
  constructor(
    public afAuth: AngularFireAuth,
    public connexionService: ConnexionService,
    public commandesService: CommandesService,
    public router: Router,
    public network: Network,
    public dialogs: Dialogs,
    private modalController: ModalController,

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
    
    this.network.onDisconnect().subscribe(()=>
    {
      this.dialogs.alert("pas de connexion à internet")
    });
    this.network.onConnect().subscribe(()=>
    {
      setTimeout(()=>{
      },2000);
    });  
  }
  public rechercheCommande(ev: any){    
    this.commandes = this.listeCommandes
    const val = ev.target.value;
    if (val && val.trim() !== ''){
      this.commandes = this.commandes.filter((commande: any) => {
        return (String(commande.numeroCommande).toLowerCase().indexOf(val.toLowerCase()) > -1 || commande.nomClient.toLowerCase().indexOf(val.toLowerCase()) > -1 );
      })
    }
  }
  public versVueCommande(commande: CommandeModele) {
    //console.log(commande)
    this.router.navigate(["afficher-commande"], { state: { data: commande} });
  }
  public deconnexion() {
    this.connexionService.deconnexionUtilisateur();
  }
  public async choixCommandesModal(commande: CommandeModele) {
    const modal = await this.modalController.create({
      component: ModalCommandesPage,
      componentProps:{commande}
    });
    modal.onWillDismiss().then(dataReturned => {
      var commande: CommandeModele;
      commande = dataReturned.data;
      
      if (commande.nomClient !== null) {
        this.versVueCommande(commande)

      }
    })
    return await modal.present()
  }
  public ngOnInit() {
    this.commandesService.getCommandes().subscribe(commandes => {
      this.commandes = commandes;
      this.commandes.sort((a,b) => b.numeroCommande - a.numeroCommande);
      this.listeCommandes = this.commandes;
    });
  }
}