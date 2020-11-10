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
  public listeLivraisons: Array<CommandeModele> = new Array<CommandeModele>();
  public listeLivraisonRecherche: Array<CommandeModele> = new Array<CommandeModele>();
  public typeCommandes: string = "Clients";
  public dossierCommandes: string = "CommandesClients";
  public dossierLivraisons: string = "LivraisonsClients";
  public fournisseurs: boolean = false;
  public livraisons: boolean = false;
  public typeLivraisons: string = "Commandes livrées";
  public subsciption: any;
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
    var typeCommandes =this.typeCommandes
    const modal = await this.modalController.create({
      component: ModalCommandesPage,
      componentProps: { keyClient, pseudoClient, typeCommandes }
    });
    modal.onWillDismiss().then(dataReturned => {
      var commande: CommandeModele;
      commande = dataReturned.data;
    })
    return await modal.present()
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
    this.commandesService.getCommandes(this.dossierLivraisons, livraisons).subscribe(commandes => {
      this.listeLivraisons = commandes;
      this.listeLivraisons.sort((a, b) => b.dateCommande - a.dateCommande);
      this.listeLivraisonRecherche = this.listeLivraisons;
    });
  }
  public ajouterCommandes() {
    this.router.navigate(["ajouter-commande"], { state: { fournisseurs: this.fournisseurs } })
  }
  public livrerCommande(commande: CommandeModele) {
    commande.commandeLivree = 1;
    var livraison = { ...commande }
    var numeroLivraison = Date.now()
    livraison.keyCommande = commande.key
    livraison.numeroCommande = numeroLivraison
    this.commandesService.updateCommande(commande, this.dossierCommandes)
    if (this.fournisseurs) {
      var keyLivraison = this.commandesService.createCommande(livraison, this.dossierLivraisons)
      this.subsciption = this.commandesService.getCommandesProduits(commande.key, this.typeCommandes, 'CommandesProduits').subscribe(commandesProduits => {
        commandesProduits.forEach(commandeProduit => {
          if(commandeProduit.livree===0){
            commandeProduit.livree = 1
          var commandePr = { ...commandeProduit }
          this.commandesService.updateCommandeProduit(commandeProduit, this.typeCommandes)
          commandePr.keyCommandeProduit = commandeProduit.key;
          commandePr.keyCommandelivree = commandeProduit.keyCommande;
          commandePr.keyCommande = keyLivraison;
          this.commandesService.createCommandeProduit(commandePr, this.typeCommandes, 'LivraisonsProduits');
          this.commandesService.updateProduitsLivres(commandeProduit, 0)
          }
        })
        this.subsciption.unsubscribe()
      });
    } else {
      livraison.commandeFacturee = "warning";
      var keyLivraison = this.commandesService.createCommande(livraison, this.dossierLivraisons)
      this.subsciption = this.commandesService.getCommandesProduits(commande.key, this.typeCommandes, 'CommandesProduits').subscribe(commandesProduits => {
        commandesProduits.forEach(commandeProduit => {
          if(commandeProduit.livree===0){
          commandeProduit.livree = 1
          var commandePr = { ...commandeProduit }
          this.commandesService.updateCommandeProduit(commandeProduit, this.typeCommandes)
          commandePr.keyCommandeProduit = commandeProduit.key;
          commandePr.keyCommandelivree = commandeProduit.keyCommande;
          commandePr.keyCommande = keyLivraison;
          commandePr.keyCommandeProduit = commandeProduit.key;
          this.commandesService.createCommandeProduit(commandePr, this.typeCommandes, 'LivraisonsProduits');
          }
        });
        this.subsciption.unsubscribe()
      });
    }
  }
  public delivrerCommande(livraison: CommandeModele) {
    var commande = { ...livraison };
    commande.commandeLivree = 0;
    //commande.commandeFacturee = "";
    commande.key = livraison.keyCommande;
    //this.commandesService.updateCommande(commande, this.dossierCommandes);
    this.commandesService.deleteCommande(livraison, this.dossierLivraisons);
    if (this.fournisseurs) {
      this.subsciption = this.commandesService.getCommandesProduits(livraison.key, this.typeCommandes, 'LivraisonsProduits').subscribe(commandesProduits => {
        commandesProduits.forEach(commandeProduit => {
          var commandePr = { ...commandeProduit };
          commandePr.keyCommande = commandePr.keyCommandelivree;
          commandePr.key = commandePr.keyCommandeProduit;
          commandePr.livree = 0;
          this.commandesService.updateCommandeProduit(commandePr, this.typeCommandes)
          this.commandesService.deleteLivraisonProduit(commandeProduit, this.typeCommandes)
          this.commandesService.updateProduitsLivres(commandeProduit, 1)
        });
        this.subsciption.unsubscribe()
      });
    } else {
      this.subsciption = this.commandesService.getCommandesProduits(livraison.key, this.typeCommandes, 'LivraisonsProduits').subscribe(commandesProduits => {
        commandesProduits.forEach(commandeProduit => {
          var commandePr = { ...commandeProduit };
          commandePr.keyCommande = commandePr.keyCommandelivree;
          commandePr.key = commandePr.keyCommandeProduit;
          commandePr.livree = 0;
          this.commandesService.deleteLivraisonProduit(commandeProduit, this.typeCommandes)
          this.commandesService.updateCommandeProduit(commandePr, this.typeCommandes)
        });
        this.subsciption.unsubscribe()
      });
    }
    var verificationCommandeLivree: boolean = true
    console.log(commande.key)
    var livree = 0
    var subsciption = this.commandesService.getCommandesProduits(commande.key, this.typeCommandes, 'CommandesProduits').subscribe(commandesProduits => {
      commandesProduits.forEach(produit => {
        
        if (produit.livree === 1) {
          livree += produit.livree
          verificationCommandeLivree = false
        }
      })
      subsciption.unsubscribe()
      if (livree >= 1) {
          commande.commandeFacturee = "";
        } else {
          commande.commandeFacturee = "medium"
        }
        this.commandesService.updateCommande(commande, this.dossierCommandes);
    });
  }
public versLivraisons() {
    this.livraisons = !this.livraisons
    if (this.livraisons) {
      if (this.fournisseurs) {
        this.typeLivraisons = "Commandes en cours"
        this.recupererListeLivraisons(1)
      } else {
        this.typeLivraisons = "Commandes en cours"
        this.recupererListeLivraisons(1)
      }
    } else {
      this.typeLivraisons = "Commandes livrées"
    }
  }
  public versFournisseurs() {
    this.livraisons = false
    this.typeLivraisons = "Commandes livrées"
    this.fournisseurs = !this.fournisseurs
    if (this.fournisseurs) {
      this.typeCommandes = "Fournisseurs"
      this.dossierLivraisons = "LivraisonsFournisseurs"
      this.dossierCommandes = "CommandesFournisseurs"
      this.recupererListeCommandes(0)
    } else {
      this.dossierCommandes = "CommandesClients"
      this.dossierLivraisons = "LivraisonsClients"
      this.typeCommandes = "Clients"
      this.recupererListeCommandes(0)
    }
  }
  public ngOnInit() {
    this.recupererListeCommandes(0)
  }
}