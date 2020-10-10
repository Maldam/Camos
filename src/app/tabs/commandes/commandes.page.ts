import { Component, OnInit } from '@angular/core';
import { ConnexionService } from '../../services/connexion.service';
import { CommandesService } from 'src/app/services/commandes.service';
import { Router } from '@angular/router';
import { CommandeModele } from 'src/app/modeles/commande.modele';
import { ModalController } from '@ionic/angular';
import { ModalCommandesPage } from 'src/app/modals/modal-commandes/modal-commandes.page';
import { CoordonneesModele } from 'src/app/modeles/coordonnees.modele';
import { CommandeProduitModele } from 'src/app/modeles/commande-produit.modele';
@Component({
  selector: 'app-commandes',
  templateUrl: 'commandes.page.html',
  styleUrls: ['commandes.page.scss']
})
export class CommandesPage implements OnInit {
  private livree: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public listeCommandes: Array<CommandeModele> = new Array<CommandeModele>();
  public listeLivraisons: Array<CommandeModele> = new Array<CommandeModele>();
  public listeLivraisonRecherche: Array<CommandeModele> = new Array<CommandeModele>();
  //public commandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public typeCommandes: string = "Clients";
  public dossierCommandes: string = "CommandesClients";
  public fournisseurs: boolean = false;
  public livraisons: boolean = false;
  public typeLivraisons: string = "Commandes livrées";
  public subsciption
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
    this.commandes = new Array<CommandeModele>()
 this.commandesService.getCommandes(this.dossierCommandes, livraisons).subscribe(commandes => {
      this.commandes = commandes;
      this.commandes.sort((a, b) => b.dateCommande - a.dateCommande);
      this.listeCommandes = this.commandes;
    });
  }
  public recupererListeLivraisons(livraisons: number) {
    this.listeLivraisons = new Array<CommandeModele>()
    this.commandesService.getCommandes(this.dossierCommandes, livraisons).subscribe(commandes => {
      this.listeLivraisons = commandes;
      this.listeLivraisons.sort((a, b) => b.dateCommande - a.dateCommande);
      this.listeLivraisonRecherche = this.listeLivraisons;
    });
  }
  public ajouterCommandes() {
    this.router.navigate(["ajouter-commande"], { state: { fournisseurs: this.fournisseurs } })
  }
  public livrerCommande(commande: CommandeModele) {
    if(this.subsciption){
      this.subsciption.unsubscribe()
    }
    commande.commandeLivree = 1;
    var livraison = {...commande}
    var numeroLivraison = Date.now()
    livraison.keyCommande = commande.key
    livraison.numeroCommande = numeroLivraison
    livraison.commandeFacturee = "warning";
    this.commandesService.updateCommande(commande, this.dossierCommandes)
    var keyLivraison= this.commandesService.createCommande(livraison, 'LivraisonsClients')
    this.subsciption = this.commandesService.getCommandesProduits(commande.key, this.typeCommandes, 'CommandesProduits').subscribe(commandesProduits => {    
      commandesProduits.forEach(commandeProduit => {
        commandeProduit.livree=1
        var commandePr={...commandeProduit}
        this.commandesService.updateCommandeProduit(commandeProduit, this.typeCommandes)
        commandePr.keyCommandeProduit = commandeProduit.key;
        commandePr.keyCommandelivree=commandeProduit.keyCommande;
        commandePr.keyCommande=keyLivraison;
        commandePr.keyCommandeProduit=commandeProduit.key;
        this.commandesService.createCommandeProduit(commandePr,this.typeCommandes,'LivraisonsProduits');
      });
      this.subsciption.unsubscribe()
    });
    this.recupererListeCommandes(0)
  }
  public delivrerCommande(livraison: CommandeModele){
    var commande = {...livraison};
    commande.commandeLivree = 0;
    commande.commandeFacturee = "";    
    commande.key = livraison.keyCommande;
    this.commandesService.updateCommande(commande,'CommandesClients');
    this.commandesService.deleteCommande(livraison,'LivraisonsClients');
  this.subsciption =this.commandesService.getCommandesProduits(livraison.key, this.typeCommandes, 'LivraisonsProduits')
    .subscribe(commandesProduits => {   
       commandesProduits.forEach(commandeProduit => {
         var commandePr = {...commandeProduit};
         commandePr.keyCommande=commandePr.keyCommandelivree;
         commandePr.key = commandePr.keyCommandeProduit;
         commandePr.livree = 0;
         this.livree.push(commandePr);
         this.commandesService.deleteLivraisonProduit(commandeProduit, this.typeCommandes)
         this.commandesService.updateCommandeProduit(commandePr, this.typeCommandes)
  });   
  this.subsciption.unsubscribe()
});
    this.recupererListeLivraisons(1);
  }
  versLivraisons() {
    this.livraisons = !this.livraisons
    if (this.livraisons) {
      this.typeLivraisons = "Commandes en cours"
      this.dossierCommandes = "LivraisonsClients"
      this.recupererListeLivraisons(1)
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