import { Component, OnInit } from '@angular/core';
import { CommandeModele } from '../modeles/commande.modele';
import { CommandesService } from '../services/commandes.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { ClientModele } from '../modeles/client.modele';
import { ModalClientPage } from '../modals/modal-client/modal-client.page';
import { ModalProduitPage } from '../modals/modal-produit/modal-produit.page';
import { ProduitModele } from '../modeles/produit.modele';
import { CommandeProduitModele } from '../modeles/commande-produit.modele';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-ajouter-commande',
  templateUrl: './ajouter-commande.page.html',
  styleUrls: ['./ajouter-commande.page.scss'],
})
export class AjouterCommandePage implements OnInit {
  public produits: Array<ProduitModele> = new Array<ProduitModele>();
  public commande: CommandeModele = new CommandeModele();
  public commandes: Array<CommandeModele> = new Array<CommandeModele>();
  public clients: Array<ClientModele> = new Array<ClientModele>();
  public client: ClientModele = new ClientModele();
  public commandeProduit: CommandeProduitModele = new CommandeProduitModele();
  public commandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public listeCommandesProduits: Array<CommandeProduitModele> = new Array<CommandeProduitModele>();
  public produit: ProduitModele = new ProduitModele();
  public total: number = 0.00;
  public totalTVA: number = 0.00;
  public estChange: boolean = false;
  public commandeChange: boolean = false;
  public typeCommandes: string = "Clients";
  constructor(
    private commandesService: CommandesService,
    public router: Router,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
  ) {
    this.activatedRoute.queryParams.subscribe(() => {
      this.commandeChange = this.router.getCurrentNavigation().extras.state.data
      if (!this.commandeChange) {
        this.typeCommandes = "Clients"
      } else {
        this.typeCommandes = "Fournisseurs"
      }
    });
  }
  public async ajoutCommande(commande: AjouterCommandePage) {
    const loading = await this.loadingController.create({
    });
    const alert = await this.alertController.create({
      header: 'Félicitation',
      message: 'La commande a bien été ajouté',
      buttons: ['OK']
    });
    const alertNom = await this.alertController.create({
      header: 'Attention',
      message: 'Nous avons besoin d\'un numéro de commande',
      buttons: ['OK']
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Cette commande existe déjà',
      buttons: ['OK']
    });
    var index = this.commandesService.numeroIndex(this.commande.numeroCommande);
    if (index === -1) {
      if (this.commande.numeroCommande == undefined) {
        await alertNom.present();
      } else {
        await loading.present();
        this.commande.keyClient = this.client.key
        this.commande.nomClient = this.client.nom,
          this.commande.pseudoClient = this.client.pseudo,
          this.commande.numeroTVAClient = this.client.numeroTVA,
          this.commandeProduit.produitNom = this.produit.nom,
          this.commandeProduit.keyProduit = this.produit.key
          var keyCommande = this.commandesService.createCommande(this.commande, this.typeCommandes)

          this.commandesProduits.forEach(commandeProduit => {
commandeProduit.keyCommande=keyCommande
            this.commandesService.createCommandeProduit(commandeProduit, this.typeCommandes)
          });
        // .then(ref => {F
        this.total = 0,
          this.totalTVA = 0,
          this.commande = new CommandeModele
        this.client = new ClientModele, this.produit = new ProduitModele, this.commandesProduits = new Array<CommandeProduitModele>(),
          this.commande.dateCommande = Date.now()
        this.commande.numeroCommande = this.commande.dateCommande
        // });
        this.commandesProduits.forEach(commandeProduit => {
          let produit: ProduitModele = new ProduitModele();
          produit.key = commandeProduit.keyProduit;
          if (!this.commandeChange) {
            produit.quantite = commandeProduit.quantite;
          } else {
            produit.quantiteCommandee = commandeProduit.quantite;
          }
          this.commandesService.updateProduit(produit)
        });
        await loading.dismiss();
        await alert.present();
      }
    } else {
      await articleExiste.present();
    }
  }
  public async choixClientModal() {
    var entreprise: string = this.typeCommandes
    const modal = await this.modalController.create({
      component: ModalClientPage,
      componentProps: { entreprise }
    });
    modal.onWillDismiss().then(dataReturned => {
      if (dataReturned.data) {
        this.client = dataReturned.data;
      }
    })
    return await modal.present()
  }
  public async choixProduitModal() {
    const modal = await this.modalController.create({
      component: ModalProduitPage,
    });
    modal.onWillDismiss().then(dataReturned => {
      if (dataReturned.data) {
        this.produit = dataReturned.data;
        let commandeProduit: CommandeProduitModele = new CommandeProduitModele();
        commandeProduit.produitNom = this.produit.nom
//        commandeProduit.keyCommande = this.commande.key,
        if (this.typeCommandes === "Clients") {
          commandeProduit.prix = this.produit.prixVente
        } else {
          commandeProduit.prix = this.produit.prixAchat
        }
        commandeProduit.keyProduit = this.produit.key,
          commandeProduit.TVAProduit = this.produit.TVA,
          commandeProduit.codeProduit = this.produit.codeProduit
        this.commandesProduits.push(commandeProduit)
      }
    })
    return await modal.present()
  }
  public calculPrix(commandeProduit: CommandeProduitModele) {
    this.total = 0;
    this.totalTVA = 0;
    this.commandesProduits.forEach(element => { this.total += ((element.prix * element.quantite - ((element.prix * element.quantite) * element.pourcentageProduit / 100)) - ((element.prix * element.quantite - (((element.prix * element.quantite) * element.pourcentageProduit / 100))) * this.commande.pourcentageTotal / 100)) });
    this.commandesProduits.forEach(element => { this.totalTVA += ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100) - ((((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) - ((element.prix * element.quantite) + (element.prix * element.quantite) * (element.TVAProduit / 100)) * element.pourcentageProduit / 100)) * this.commande.pourcentageTotal / 100) });
  }
  public deleteProduit(produit: any) {
    const index = this.commandesProduits.indexOf(produit, 0);
    if (index > -1) {
      this.commandesProduits.splice(index, 1);
    }
    this.calculPrix(produit)
  }
  public ngOnInit() {
    this.commande.dateCommande = Date.now()
    this.commande.numeroCommande = this.commande.dateCommande
    this.client.nom = ""
  }
}