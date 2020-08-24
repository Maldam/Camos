import { Component, OnInit } from '@angular/core';
import { CommandeModele } from '../modeles/commande.modele';
import { CommandesService } from '../services/commandes.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { ClientModele } from '../modeles/client.modele';
import { ModalClientPage } from '../modals/modal-client/modal-client.page';
import { ModalProduitPage } from '../modals/modal-produit/modal-produit.page';
import { ProduitModele } from '../modeles/produit.modele';
import { CommandeProduitModele } from '../modeles/commande-produit.modele';
import { Router } from '@angular/router';

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
  public total: number = null;
  
  constructor(
    private commandesService: CommandesService,
    public route: Router,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private modalController: ModalController,
  ) {
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
      message: 'Nous avons besoin d\'un numéro de facture',
      buttons: ['OK']
    });
    const articleExiste = await this.alertController.create({
      header: 'Attention',
      message: 'Cette commande existe déjà',
      buttons: ['OK']
    });
    var index = this.commandesService.numeroIndex(this.commande.numeroFacture);
    if (index === -1) {
      if (this.commande.numeroFacture == undefined) {
        await alertNom.present();
      } else {
        await loading.present();
        this.commande.nomClient = this.client.nom,
          this.commande.prenomClient = this.client.prenom,
          this.commande.paysClient = this.client.pays,
          this.commande.provinceClient = this.client.province,
          this.commande.codePostalClient = this.client.codePostal,
          this.commande.localiteClient = this.client.localite,
          this.commande.rueClient = this.client.rue,
          this.commande.numeroClient = this.client.numero,
          this.commande.boiteClient = this.client.boite,
          this.commande.numeroTVAClient = this.client.numeroTVA,
          this.commande.numeroTelephoneClient = this.client.numeroTelephone,
          this.commande.numeroGSMClient = this.client.numeroGSM,
          this.commande.numeroFaxClient = this.client.numeroFax,
          this.commande.emailClient = this.client.email,
          this.commandeProduit.produitNom = this.produit.nom,
          this.commandeProduit.produitKey = this.produit.key,


          this.commandesProduits.forEach(commandeProduit => {
            this.commandesService.createCommandeProduit(commandeProduit).then(x => {})
          });

        this.commandesService.createCommande(this.commande).then(ref => {
          this.total = null,
          this.commande = new CommandeModele
          this.client = new ClientModele, this.produit = new ProduitModele, this.commandesProduits = new Array<CommandeProduitModele>(),
            this.commande.numeroFacture = String(Date.now())
        });
        this.commandesProduits.forEach(commandeProduit => {
          let produit: ProduitModele = new ProduitModele();
          produit.key = commandeProduit.produitKey;
          produit.quantite = commandeProduit.quantite;
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
    const modal = await this.modalController.create({
      component: ModalClientPage,
      componentProps: {
      }
    });
    modal.onWillDismiss().then(dataReturned => {
      this.client = dataReturned.data;
    })
    return await modal.present().then(_ => {
    });
  }
  public async choixProduitModal() {
    const modal = await this.modalController.create({
      component: ModalProduitPage,
      componentProps: {

      }
    });
    modal.onWillDismiss().then(dataReturned => {
      this.produit = dataReturned.data;
      let commandeProduit: CommandeProduitModele = new CommandeProduitModele();
      commandeProduit.produitNom = this.produit.nom,
        commandeProduit.numeroFacture = this.commande.numeroFacture,
        commandeProduit.prix = this.produit.prix,
        commandeProduit.produitKey = this.produit.key,
      this.commandesProduits.push(commandeProduit)

    })
    return await modal.present().then(_ => {
    });
  }
  public quantiteEstChange(commandeProduit: CommandeProduitModele) {
    //this.commandeProduit.prix = commandeProduit.prix
    this.calculPrix()
  }
  public prixEstChange(commandeProduit: CommandeProduitModele) {
    //this.commandeProduit.prix = commandeProduit.prix
    this.calculPrix()
  }
  public calculPrix(){
    this.total=null;
    this.commandesProduits.forEach(element => { this.total += element.quantite*element.prix});
  }
  public ngOnInit() {
    this.commande.numeroFacture = String(Date.now())
  }
}