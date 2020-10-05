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
  public typeCommandes: string = "Clients";
  public commandeChange: boolean = false;
  public archive: boolean = false;
  public typeArchive: string = "Commandes livrées";
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
  }
  public rechercheCommande(ev: any) {
    this.commandes = this.listeCommandes
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.commandes = this.commandes.filter((commande: any) => {
        return (String(commande.numeroCommande).toLowerCase().indexOf(val.toLowerCase()) > -1 || commande.nomClient.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  public versVueCommande(commande: CommandeModele) {
    this.router.navigate(["afficher-commande"], {
      state: {
        data: commande,
        typeCommandes: this.typeCommandes,
        archive: this.archive
      }
    });
  }
  public deconnexion() {
    this.connexionService.deconnexionUtilisateur();
  }
  public async choixCommandesModal(keyClient: string, pseudoClient: string) {
    const modal = await this.modalController.create({
      component: ModalCommandesPage,
      componentProps: { keyClient, pseudoClient }
    });
    modal.onWillDismiss().then(dataReturned => {
      var commande: CommandeModele;
      commande = dataReturned.data;
    })
    return await modal.present()
  }
  public changeCommandes() {
    this.archive = false
    this.typeArchive = "Commandes livrées"
    this.commandeChange = !this.commandeChange
    if (this.commandeChange) {
      this.commandes = new Array<CommandeModele>()
      this.typeCommandes = "Fournisseurs"
      this.recupererListeCommandes(0)
    } else {
      this.typeCommandes = "Clients"
      this.recupererListeCommandes(0)
    }
  }
  public recupererListeCommandes(archive: number) {
    this.commandes = new Array<CommandeModele>()
    this.commandesService.getCommandes(this.typeCommandes, archive).subscribe(commandes => {
      this.commandes = commandes;
      this.commandes.sort((a, b) => b.dateCommande - a.dateCommande);
      this.listeCommandes = this.commandes;
    });
  }
  public ajouterCommandes() {
    this.router.navigate(["ajouter-commande"], { state: { data: this.commandeChange } })
  }
  public archiverCommande(commande: CommandeModele, numeroArchive: number, commandeFacturee: string) {
    commande.commandeLivree = numeroArchive;
    commande.commandeFacturee = commandeFacturee;
    this.commandesService.updateCommandeLivree(commande, this.typeCommandes)
    if (!this.archive) {
      if (this.commandeChange) {
        this.commandesService.getCommandesProduits(commande.key, this.typeCommandes).subscribe(commandesProduits => {
          commandesProduits.forEach(produit => {
            this.commandesService.updateProduitsLivres(produit, 0)
          })
        });
      }
      this.recupererListeCommandes(0)
    } else {
      if (this.commandeChange) {
        this.commandesService.getCommandesProduits(commande.key, this.typeCommandes).subscribe(commandesProduits => {
          commandesProduits.forEach(produit => {
            this.commandesService.updateProduitsLivres(produit, 1)
          })
        });
      }
      this.recupererListeCommandes(1)
    }
  }
  versArchive() {
    this.archive = !this.archive
    if (this.archive) {
      this.typeArchive = "Commandes en cours"
      this.recupererListeCommandes(1)
    } else {
      this.typeArchive = "Commandes livrées"
      this.recupererListeCommandes(0)
    }
  }
  public ngOnInit() {
    this.recupererListeCommandes(0)
  }
}