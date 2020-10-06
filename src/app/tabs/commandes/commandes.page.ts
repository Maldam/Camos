import { Component, OnInit } from '@angular/core';
import { ConnexionService } from '../../services/connexion.service';
import { CommandesService } from 'src/app/services/commandes.service';
import { Router } from '@angular/router';
import { CommandeModele } from 'src/app/modeles/commande.modele';
import { ModalController } from '@ionic/angular';
import { ModalCommandesPage } from 'src/app/modals/modal-commandes/modal-commandes.page';
@Component({
  selector: 'app-commandes',
  templateUrl: 'commandes.page.html',
  styleUrls: ['commandes.page.scss']
})
export class CommandesPage implements OnInit {
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public listeCommandes: Array<CommandeModele> = new Array<CommandeModele>();
  public typeCommandes: string = "Clients";
  public dossierCommandes: string = "CommandesClients";
  public fournisseurs: boolean = false;
  public livraisons: boolean = false;
  public typeLivraisons: string = "Commandes livrées";
  constructor(
    public connexionService: ConnexionService,
    public commandesService: CommandesService,
    public router: Router,
    private modalController: ModalController,
  ) {
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
        livraisons: this.livraisons
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
    this.livraisons = false
    this.typeLivraisons = "Commandes livrées"
    this.fournisseurs = !this.fournisseurs
    if (this.fournisseurs) {
      this.commandes = new Array<CommandeModele>()
      this.typeCommandes = "Fournisseurs"
      this.recupererListeCommandes(0)
    } else {
      this.typeCommandes = "Clients"
      this.recupererListeCommandes(0)
    }
  }
  public recupererListeCommandes(livraisons: number) {
    //
    //this.listeCommandes  = new Array<CommandeModele>()
    this.commandesService.getCommandes(this.dossierCommandes).subscribe(commandes => {
      this.commandes = commandes;
      this.commandes.sort((a, b) => b.dateCommande - a.dateCommande);
      this.listeCommandes = this.commandes;
    });
  }
  public ajouterCommandes() {
    this.router.navigate(["ajouter-commande"], { state: { fournisseurs: this.fournisseurs } })
  }
  public livrerCommande(commande: CommandeModele) {
    commande.commandeLivree = 1;
    var livraison = {...commande}
    var numeroLivraison = Date.now()
    livraison.keyCommande = commande.key
    livraison.numeroCommande = numeroLivraison
    livraison.commandeFacturee = "warning";    
    this.commandesService.updateCommande(commande, this.dossierCommandes)
    this.commandesService.createCommande(livraison, 'LivraisonsClients')
    //this.recupererListeCommandes(0)

  }
  public delivrerCommande(livraison: CommandeModele){
    var commande = {...livraison}
    commande.commandeLivree = 0;
    commande.commandeFacturee = "";    
    commande.key = livraison.keyCommande
    this.commandesService.updateCommande(commande, 'CommandesClients')
    this.commandesService.deleteCommande(livraison,this.dossierCommandes)
   // this.recupererListeCommandes(1)

  }
  versLivraisons() {
    this.commandes = new Array<CommandeModele>()
    this.livraisons = !this.livraisons
    if (this.livraisons) {
      this.typeLivraisons = "Commandes en cours"
      this.dossierCommandes = "LivraisonsClients"
      this.recupererListeCommandes(1)
    } else {
      this.typeLivraisons = "Commandes livrées"
      this.dossierCommandes = "CommandesClients"
      this.recupererListeCommandes(0)
    }
  }
  public ngOnInit() {
    this.recupererListeCommandes(0)
  }
}

// if (this.fournisseurs) {
//   this.commandesService.getCommandesProduits(commande.key, this.typeCommandes).subscribe(commandesProduits => {
//     commandesProduits.forEach(produit => {
//       this.commandesService.updateProduitsLivres(produit, 0)
//     })
//   });
// }


// else {
//   if (this.fournisseurs) {
//     this.commandesService.getCommandesProduits(commande.key, this.typeCommandes).subscribe(commandesProduits => {
//       commandesProduits.forEach(produit => {
//         this.commandesService.updateProduitsLivres(produit, 1)
//       })
//     });
//   }
//   this.recupererListeCommandes(1)
// }