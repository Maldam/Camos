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
  public commandesService: CommandesService,
    public route: Router,
    public network: Network,
    public dialogs: Dialogs,
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public listeCommandes: Array<CommandeModele> = new Array<CommandeModele>();
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
        return (commande.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  public versVueCommande(commande: CommandeModele) {
    this.route.navigate(["afficher-commande"], { state: { data: commande } });
  }
  public deconnexion() {
    this.connexionService.deconnexionUtilisateur();
  }
  public ngOnInit() {
    this.commandesService.getCommandes().subscribe(commandes => {
      this.commandes = commandes;
      this.listeCommandes = this.commandes;
    });
  }
}