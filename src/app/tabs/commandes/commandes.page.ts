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
  public typeCommandes: string ="Clients"
  public commandeChange: boolean = false 
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
    this.router.navigate(["afficher-commande"], { state: { data: commande,
    typeCommandes: this.typeCommandes
    } });
  }
  public deconnexion() {
    this.connexionService.deconnexionUtilisateur();
  }
  public async choixCommandesModal(keyClient: string, pseudoClient: string) {
      const modal = await this.modalController.create({
      component: ModalCommandesPage,
      componentProps:{keyClient, pseudoClient}
    });
    modal.onWillDismiss().then(dataReturned => {
      var commande: CommandeModele;
      commande = dataReturned.data;
      
      // if (commande.nomClient !== null) {
      //   this.versVueCommande(commande)

      // }
    })
    return await modal.present()
  }
  public changeCommandes(){
    //console.log(this.commandeChange)
    this.commandeChange=!this.commandeChange
    if(this.commandeChange){
      this.typeCommandes = "Fournisseurs"
      this.recupererListeCommandes()  
    } else {
      this.typeCommandes = "Clients"
      this.recupererListeCommandes()  
    }


  }
  public recupererListeCommandes(){
    //console.log(this.typeCommandes)
    this.commandesService.getCommandes(this.typeCommandes).subscribe(commandes => {
      this.commandes = commandes;
      this.commandes.sort((a,b) => b.dateCommande - a.dateCommande);
      this.listeCommandes = this.commandes;
    });
  }
  public ajouterCommandes(){
    this.router.navigate(["ajouter-commande"], { state: { data: this.commandeChange} })
  }
  public ngOnInit() {
    this.recupererListeCommandes()
  }
}